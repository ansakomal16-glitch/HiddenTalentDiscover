const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- 1. MIDDLEWARES ---
app.use(express.json());

// CORS configuration (No errors, smooth connection)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));

// --- 2. MONGODB CONNECTION ---
const uri = "mongodb+srv://areebaakhtar444_db_user:Hu8tXYH1GIFPJzX3@cluster0.ibssaj5.mongodb.net/HiddenTalentDB?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log("🔥 Neural Server: MongoDB Connected Successfully!"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });

// --- 3. DATA MODELS ---

// User Model
const User = mongoose.model('User', new mongoose.Schema({ 
    username: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true } 
}));

// Result Model
const resultSchema = new mongoose.Schema({
    username: { type: String, default: "Explorer" },
    email: { type: String, required: true },
    score: { type: Number, required: true },
    category: { type: String, default: "General Quiz" },
    date: { type: Date, default: Date.now }
});

const Result = mongoose.model('Result', resultSchema);

// --- 4. ROUTES ---

app.get('/', (req, res) => res.send("🚀 Neural Server is LIVE!"));

// Signup
app.post('/api/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ success: true, message: "Agent Created!" });
    } catch (err) {
        res.status(400).json({ success: false, error: "Email already exists" });
    }
});

// Login Route - FIXED
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. User ko dhoondo
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(400).json({ success: false, message: "User nahi mila!" });
        }

        // 2. Password match (Case sensitive check)
        if (user.password !== password) { 
            return res.status(400).json({ success: false, message: "Password galat hai!" });
        }

        // 3. SUCCESS: Data wapis bhejo (Correct Field Names ke sath)
        res.json({
            success: true,
            user: {
                name: user.username, // FIXED: Aapke model mein 'username' hai, 'name' nahi
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
// Save Result
app.post('/api/save-result', async (req, res) => {
    try {
        const newResult = new Result(req.body);
        await newResult.save();
        res.json({ success: true, message: "Result Saved!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save" });
    }
});

// [🔥 UNIQUE LEADERBOARD LOGIC - FIXES DUPLICATES]
app.get('/api/global-leaderboard', async (req, res) => {
    try {
        const leaderboard = await Result.aggregate([
            // Stage 1: Sabse pehle scores ko high to low sort karo
            { $sort: { score: -1 } },

            // Stage 2: Email ke mutabiq GROUP karo taake har bnde ka sirf ek record bache
            {
                $group: {
                    _id: "$email", // Har unique email ka ek group banega
                    username: { $first: "$username" }, // Us group ka pehla (highest) naam
                    score: { $first: "$score" },    // Us group ka pehla (highest) score
                    category: { $first: "$category" }
                }
            },

            // Stage 3: Grouping ke baad ranking ke liye dubara sort karo
            { $sort: { score: -1 } },

            // Stage 4: Top 15 Unique bnde uthao
            { $limit: 15 }
        ]);

        res.json(leaderboard);
    } catch (err) {
        console.error("Leaderboard Aggregation Error:", err);
        res.status(500).json({ error: "Leaderboard update failed" });
    }
});

// User Stats for Dashboard
app.get('/api/user-stats/:email', async (req, res) => {
    try {
        const results = await Result.find({ email: req.params.email }).sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Fetch Error" });
    }
});

// --- 5. SERVER START ---
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================`);
    console.log(`🚀 NEURAL SERVER RUNNING ON PORT: ${PORT}`);
    console.log(`🔗 ACCESS LOCAL: http://localhost:${PORT}`);
    console.log(`======================================\n`);
});