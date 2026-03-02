const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

const uri = "mongodb+srv://areebaakhtar444_db_user:Hu8tXYH1GIFPJzX3@cluster0.ibssaj5.mongodb.net/HiddenTalentDB?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log("🔥 Neural Server: Connected & Ready!"))
    .catch(err => console.error("❌ DB Connection Error:", err.message));

// --- 1. MODELS ---
const User = mongoose.model('User', new mongoose.Schema({ 
    username: String, email: { type: String, unique: true }, password: String,
    contact: String, dob: String, district: String 
}));

const QuizPrediction = mongoose.model('QuizPrediction', new mongoose.Schema({
    username: String, email: String, contact: String, district: String,
    prediction: String, score: Number, category: String, date: { type: Date, default: Date.now }
}));

const GamePrediction = mongoose.model('GamePrediction', new mongoose.Schema({
    username: String, email: String, contact: String, district: String,
    prediction: String, score: Number, gameName: String, date: { type: Date, default: Date.now }
}));

// --- 2. ROUTES ---

app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, contact, dob, district } = req.body;
        const newUser = new User({ username, email, password, contact, dob, district });
        await newUser.save();
        res.json({ success: true, message: "Signed Up!" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) res.json({ success: true, user: { name: user.username, email: user.email } });
        else res.status(401).json({ success: false, message: "Invalid" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- UPDATED QUIZ SAVE ROUTE ---
app.post('/api/quiz-save', async (req, res) => {
    console.log("📥 Quiz Data Received:", req.body); 
    try {
        const { email, score, category, prediction } = req.body;
        
        // Pehle User ki details nikalne ki koshish karein
        const userData = await User.findOne({ email });

        const result = new QuizPrediction({
            username: userData ? userData.username : "Guest User",
            email: email,
            contact: userData ? userData.contact : "N/A",
            district: userData ? userData.district : "N/A",
            score: score,
            category: category,
            prediction: prediction
        });

        await result.save();
        console.log("✅ Data saved in QuizPrediction table!");
        res.json({ success: true, message: "Quiz Saved Successfully!" });
        
    } catch (err) { 
        console.error("❌ Save Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

app.post('/api/save-game-prediction', async (req, res) => {
    try {
        const { email, score, gameName, prediction } = req.body;
        const userData = await User.findOne({ email });

        const result = new GamePrediction({
            username: userData ? userData.username : "Guest User",
            email: email,
            contact: userData ? userData.contact : "N/A",
            district: userData ? userData.district : "N/A",
            score: score,
            gameName: gameName,
            prediction: prediction
        });

        await result.save();
        res.json({ success: true, message: "Saved to GamePrediction Table!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NEURAL SERVER LIVE ON PORT: ${PORT}`);
});