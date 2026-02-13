const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS Fix for all browsers
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

const uri = "mongodb+srv://areebaakhtar444_db_user:Hu8tXYH1GIFPJzX3@cluster0.ibssaj5.mongodb.net/HiddenTalentDB?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log("🔥 Neural Server: Connected & Ready!"))
    .catch(err => console.error("❌ DB Connection Error:", err.message));

// --- 1. MODELS ---

const User = mongoose.model('User', new mongoose.Schema({ 
    username: String, 
    email: { type: String, unique: true }, 
    password: String 
}));

const QuizResult = mongoose.model('QuizResult', new mongoose.Schema({
    username: String, email: String, score: Number, category: String, date: { type: Date, default: Date.now }
}));

const GameResult = mongoose.model('GameResult', new mongoose.Schema({
    username: String, email: String, score: Number, gameName: String, date: { type: Date, default: Date.now }
}));

const Leaderboard = mongoose.model('Leaderboard', new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    totalQuizScore: { type: Number, default: 0 },
    totalGameScore: { type: Number, default: 0 },
    overallTotal: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}));

// --- 2. THE BRAIN: SYNC FUNCTION ---
async function syncLeaderboard(email, username, score, type) {
    let update = {};
    if (type === 'quiz') {
        update = { $inc: { totalQuizScore: score, overallTotal: score } };
    } else {
        update = { $inc: { totalGameScore: score, overallTotal: score } };
    }

    return await Leaderboard.findOneAndUpdate(
        { email: email },
        { ...update, username: username, lastUpdated: new Date() },
        { upsert: true, new: true }
    );
}

// --- 3. ROUTES ---

// SAVE QUIZ
app.post('/api/save-quiz', async (req, res) => {
    try {
        const { email, username, score, category } = req.body;
        const result = new QuizResult({ email, username, score, category });
        await result.save();
        await syncLeaderboard(email, username, score, 'quiz');
        res.json({ success: true, message: "Quiz Synced!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// SAVE GAME
app.post('/api/save-game', async (req, res) => {
    try {
        const { email, username, score, gameName } = req.body;
        const result = new GameResult({ email, username, score, gameName });
        await result.save();
        await syncLeaderboard(email, username, score, 'game');
        res.json({ success: true, message: "Game Synced!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET USER PROFILE (For Dashboard)
app.get('/api/user-profile/:email', async (req, res) => {
    try {
        const email = req.params.email;
        // Pehle Leaderboard se stats nikalein
        let stats = await Leaderboard.findOne({ email: email });
        
        // Agar naya user hai jisne abhi kuch nahi khela, toh default stats bhejein
        if (!stats) {
            stats = { totalQuizScore: 0, totalGameScore: 0, overallTotal: 0 };
        }

        const quizHistory = await QuizResult.find({ email }).sort({ date: -1 }).limit(5);
        const gameHistory = await GameResult.find({ email }).sort({ date: -1 }).limit(5);
        
        res.json({ stats, quizHistory, gameHistory });
    } catch (err) { 
        res.status(500).json({ error: "Profile Load Error" }); 
    }
});

// GET GLOBAL LEADERBOARD
app.get('/api/global-leaderboard', async (req, res) => {
    try {
        const data = await Leaderboard.find().sort({ overallTotal: -1 }).limit(10);
        res.json(data);
    } catch (err) { res.status(500).json({ error: "Ranking Load Error" }); }
});

// AUTH: Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, user: { name: user.username, email: user.email } });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// AUTH: Signup
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        
        // Signup ke waqt hi leaderboard entry bana den taake dashboard crash na ho
        const initialLeaderboard = new Leaderboard({ username, email });
        await initialLeaderboard.save();
        
        res.json({ success: true });
    } catch (err) { res.status(400).json({ error: "Email already exists" }); }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    =========================================
    🚀 NEURAL SERVER LIVE ON PORT: ${PORT}
    📡 CONNECTION: http://localhost:${PORT}
    =========================================
    `);
});