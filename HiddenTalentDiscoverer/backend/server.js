const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// --- DATABASE CONNECTION ---
const uri = "mongodb+srv://areebaakhtar444_db_user:Hu8tXYH1GIFPJzX3@cluster0.ibssaj5.mongodb.net/HiddenTalentDB?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log("🔥 Neural Server: Connected | Mode: Clean & Professional"))
    .catch(err => console.error("❌ DB Connection Error:", err.message));

// --- 1. MODELS (Database Tables) ---

// User Registration Table
const User = mongoose.model('User', new mongoose.Schema({ 
    username: { type: String, required: true }, 
    email: { type: String, unique: true, required: true }, 
    password: { type: String, required: true },
    contact: String,
    dob: String,
    district: String 
}));

// Career Report Table
const CareerReport = mongoose.model('CareerReport', new mongoose.Schema({
    username: String,
    email: { type: String, required: true },
    predictedJob: String,
    scores: {
        O_score: Number, C_score: Number, E_score: Number, A_score: Number, N_score: Number,
        Numerical: Number, Spatial: Number, Perceptual: Number, Abstract: Number, Verbal: Number
    },
    date: { type: Date, default: Date.now }
}));

// Feedback Table
const Feedback = mongoose.model('Feedback', new mongoose.Schema({
    username: String,
    email: String,
    rating: { type: Number, required: true }, 
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
}));

// --- 2. ROUTES (API Endpoints) ---

// SIGNUP: Naya account banane ke liye
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, contact, dob, district } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, error: "Email already registered." });

        const newUser = new User({ username, email, password, contact, dob, district });
        await newUser.save();
        res.json({ success: true, message: "Account Created Successfully!" });
    } catch (err) { res.status(500).json({ success: false, error: "Signup Failed" }); }
});

// LOGIN: User verify karne ke liye
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

// SAVE REPORT: Quiz results save karne ke liye
app.post('/api/save-full-report', async (req, res) => {
    try {
        const newReport = new CareerReport(req.body);
        await newReport.save();
        res.json({ success: true, message: "Analysis saved to database!" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET PROFILE: Dashboard ke liye data mangwane ke liye
app.get('/api/user-profile/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }, { password: 0 });
        const report = await CareerReport.findOne({ email: req.params.email }).sort({ date: -1 });
        res.json({ user, latestReport: report });
    } catch (err) { res.status(500).json({ error: "Profile Load Error" }); }
});

// SUBMIT FEEDBACK: User ka feedback save karne ke liye
app.post('/api/submit-feedback', async (req, res) => {
    try {
        const { username, email, rating, message } = req.body;
        const newFeedback = new Feedback({ username, email, rating, message });
        await newFeedback.save();
        res.json({ success: true, message: "Thank you! Your feedback has been saved." });
    } catch (err) {
        res.status(500).json({ success: false, error: "Feedback submission failed" });
    }
});

// GET ALL FEEDBACKS: Tamam feedbacks dekhne ke liye
app.get('/api/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch feedbacks" });
    }
});

// --- 3. SERVER START ---
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});