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

// --- 1. MODELS (Updated for High-Class Features) ---

const userSchema = new mongoose.Schema({ 
    username: { type: String, required: true }, 
    email: { type: String, unique: true, required: true }, 
    password: { type: String, required: true },
    contact: String,   // Naya field
    dob: String,       // Naya field
    district: String   // Naya field
});
const User = mongoose.model('User', userSchema);

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
    level: { type: Number, default: 1 }, // Added for Dashboard compatibility
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

// AUTH: Signup (Updated with all new fields)
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, contact, dob, district } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email already registered." });
        }

        // 2. Create User with high-class details
        const newUser = new User({ username, email, password, contact, dob, district });
        await newUser.save();
        
        // 3. Initialize Leaderboard to prevent dashboard crashes
        const initialLeaderboard = new Leaderboard({ 
            username, 
            email,
            totalQuizScore: 0,
            totalGameScore: 0,
            overallTotal: 0,
            level: 1 
        });
        await initialLeaderboard.save();
        
        res.json({ 
            success: true, 
            message: "Identity Initialized Successfully",
            user: { name: username, email: email } 
        });

    } catch (err) { 
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, error: "Neural Link Failed: System Error" }); 
    }
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

// GET USER PROFILE
app.get('/api/user-profile/:email', async (req, res) => {
    try {
        const email = req.params.email;
        let stats = await Leaderboard.findOne({ email: email });
        
        if (!stats) {
            stats = { totalQuizScore: 0, totalGameScore: 0, overallTotal: 0, level: 1 };
        }

        const quizHistory = await QuizResult.find({ email }).sort({ date: -1 }).limit(5);
        const gameHistory = await GameResult.find({ email }).sort({ date: -1 }).limit(5);
        
        res.json({ stats, quizHistory, gameHistory });
    } catch (err) { 
        res.status(500).json({ error: "Profile Load Error" }); 
    }
});

// GLOBAL LEADERBOARD
app.get('/api/global-leaderboard', async (req, res) => {
    try {
        const data = await Leaderboard.find().sort({ overallTotal: -1 }).limit(10);
        res.json(data);
    } catch (err) { res.status(500).json({ error: "Ranking Load Error" }); }
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