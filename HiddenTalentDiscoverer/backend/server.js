const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// --- 2. DATABASE CONNECTION ---
const uri = "mongodb+srv://areebaakhtar444_db_user:Hu8tXYH1GIFPJzX3@cluster0.ibssaj5.mongodb.net/HiddenTalentDB?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => {
        console.log("🔥 Neural Server: All 13+ Tables Synchronized | Mode: FYP Ultra");
        syncLeaderboard(); 
    })
    .catch(err => console.error("❌ DB Connection Error:", err.message));

// --- 3. MODELS (All 13 Tables) ---

// 1. User & Progress
const User = mongoose.model('User', new mongoose.Schema({ 
    username: { type: String, required: true }, 
    email: { type: String, unique: true, required: true }, 
    password: { type: String, required: true },
    contact: String, dob: String, district: String,
    quizPrediction: { type: String, default: "Not Attempted" },
    totalPoints: { type: Number, default: 0 },
    overallTotal: { type: Number, default: 0 },
    currentLevel: { type: String, default: "Beginner" },
    unlockedFeatures: { type: [String], default: ['BasicQuiz', 'BasicGames'] }
}));

// 2. Career Reports (As per MongoDB Screenshot)
const CareerReport = mongoose.model('CareerReport', new mongoose.Schema({
    email: String, username: String, predictedJob: String,
    scores: Object, date: { type: Date, default: Date.now }
}));

// 3. Game Scores
const GameScore = mongoose.model('GameScore', new mongoose.Schema({
    email: String, gameName: String, score: Number, accuracy: Number, playedAt: { type: Date, default: Date.now }
}));

// 4. Badges
const Badge = mongoose.model('Badge', new mongoose.Schema({
    email: String,
    badgeName: String,
    badgeIcon: String,
    description: String,
    date: { type: Date, default: Date.now }
}), 'badges');



// 6. Quiz Attempts
const QuizAttempt = mongoose.model('QuizAttempt', new mongoose.Schema({
    email: String, sessionNumber: Number, answers: Array, date: { type: Date, default: Date.now }
}));

// 7. Support Chat
const SupportChat = mongoose.model('SupportChat', new mongoose.Schema({
    sender: String, receiver: String, message: String, timestamp: { type: Date, default: Date.now }
}));

// 8. AI Chat Logs
const AIChatLog = mongoose.model('AIChatLog', new mongoose.Schema({
    email: String, query: String, response: String, date: { type: Date, default: Date.now }
}));

// 9. Career Pathways (Roadmap)
const CareerPathway = mongoose.model('CareerPathway', new mongoose.Schema({
    careerName: String, roadmapSteps: [String], marketDemand: String, skillsRequired: [String]
}));

// 10. Leaderboard Table
const Leaderboard = mongoose.model('Leaderboard', new mongoose.Schema({
    rank: Number, username: String, email: { type: String, unique: true }, overallTotal: Number, level: String, lastUpdated: { type: Date, default: Date.now }
}));

// 11. Skill Resources
const SkillResource = mongoose.model('SkillResource', new mongoose.Schema({
    category: String, title: String, link: String
}));

// 12. Feedback
const Feedback = mongoose.model('Feedback', new mongoose.Schema({
    username: String, email: String, rating: Number, message: String, date: { type: Date, default: Date.now }
}));

// 13. Notifications
const Notification = mongoose.model('Notification', new mongoose.Schema({
    email: { type: String, required: true },
    userName: { type: String, default: 'User' }, // Naya field: User ka naam save karne ke liye
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['info', 'badge', 'unlock', 'alert'], // Is se ghalti ke chances kam ho jate hain
        default: 'info' 
    },
    isRead: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}), 'notifications');

// --- 4. CORE FUNCTIONS ---

async function syncLeaderboard() {
    try {
        const topPerformers = await User.find({}, 'username email overallTotal currentLevel')
            .sort({ overallTotal: -1 }).limit(50);
        await Leaderboard.deleteMany({});
        const entries = topPerformers.map((user, index) => ({
            rank: index + 1, username: user.username, email: user.email,
            overallTotal: user.overallTotal || 0, level: user.currentLevel || "Beginner"
        }));
        await Leaderboard.insertMany(entries);
        console.log("🏆 Leaderboard Table Synchronized!");
    } catch (err) { console.error("Sync Error:", err); }
}

// --- 5. ROUTES ---
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
// server.js forget password
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        // User ko database mein check karein
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "Email not found in our database!" });
        }

        // Testing ke liye hum screen par message bhej rahe hain
        // Real app mein yahan Nodemailer use hota hai
        res.json({ success: true, message: "Reset instructions sent to your email!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server error, please try again." });
    }
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
// 🚀 ULTRA DASHBOARD STATS API
app.get('/api/dashboard-stats/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email }).lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        // Latest Report & Game Scores
        const report = await CareerReport.findOne({ email }).sort({ date: -1 }).lean();
        const games = await GameScore.find({ email }).sort({ playedAt: -1 }).limit(10).lean();

        // Roadmap Logic
        const jobTitle = report ? report.predictedJob : "General";
        const pathway = await CareerPathway.findOne({ 
            careerName: { $regex: new RegExp(jobTitle, "i") } 
        }).lean();

        const defaultRoadmap = ["Take Technical Quiz", "Identify Strong Traits", "Explore Recommended Jobs"];

        res.json({
            user: { username: user.username, overallTotal: user.overallTotal || 0, level: user.currentLevel },
            prediction: jobTitle,
            gameHistory: games || [],
            roadmap: (pathway && pathway.roadmapSteps.length > 0) ? pathway.roadmapSteps : defaultRoadmap,
            chartData: {
                labels: games.length > 0 ? games.map(g => g.gameName).reverse() : ["Start"],
                scores: games.length > 0 ? games.map(g => g.score).reverse() : [0]
            }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update Progress with Badge Logic
app.post('/api/update-progress', async (req, res) => {
    try {
        const { email, gameName, score, accuracy } = req.body;
        
        // 1. Game Score save karein
        await new GameScore({ email, gameName, score, accuracy }).save();
        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // 2. Points update karein
        user.totalPoints += Math.floor(score / 5);
        user.overallTotal += score; 

        let badgeAwarded = false;

        // 3. BADGE LOGIC: Agar score 500 ya us se zyada hai
        if (score >= 500) {
            const existingBadge = await Badge.findOne({ email, badgeName: "Gaming Pro" });
            if (!existingBadge) {
                const newBadge = new Badge({
                    email: email,
                    badgeName: "Gaming Pro",
                    badgeIcon: "🎮",
                    description: "High Achiever! Scored 500+ in a mini-game."
                });
                await newBadge.save();
                badgeAwarded = true;
                
                // Sath hi notification bhi save kar dein
                await new Notification({ email, message: "🏅 New Badge Unlocked: Gaming Pro!" }).save();
            }
        }

        // 4. Roadmap Unlock Logic (Pehle wala)
        if (user.totalPoints >= 500 && !user.unlockedFeatures.includes('Roadmap')) {
            user.unlockedFeatures.push('Roadmap');
            await new Notification({ email, message: "🎉 Career Roadmap Unlocked!" }).save();
        }

        await user.save();
        await syncLeaderboard(); 

        // Response mein badge ki info bhi bhej rahe hain taake frontend alert dikha sake
        res.json({ 
            success: true, 
            overallTotal: user.overallTotal,
            badgeAwarded: badgeAwarded,
            badgeName: "Gaming Pro"
        });

    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: err.message }); 
    }
});

// Auth & Profiles
app.get('/api/user-profile/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    const scores = await GameScore.find({ email: req.params.email });
    const badges = await Badge.find({ email: req.params.email });
    res.json({ user, scores, badges });
});

// Chat & Support
app.post('/api/log-ai-chat', async (req, res) => { await new AIChatLog(req.body).save(); res.json({ success: true }); });
app.post('/api/send-message', async (req, res) => { await new SupportChat(req.body).save(); res.json({ success: true }); });
app.get('/api/get-messages/:userEmail', async (req, res) => {
    const chats = await SupportChat.find({ $or: [{ sender: req.params.userEmail }, { receiver: req.params.userEmail }] }).sort({ timestamp: 1 });
    res.json(chats);
});
// server.js mein ye code check karein
app.get('/api/user-stats/:email', async (req, res) => {
    try {
        const email = req.params.email;
        // User ka data dhundna careerreports collection se
        const user = await User.findOne({ email: email }); 
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sirf zaroori data bhejna
        res.json({
            overallTotal: user.overallTotal,
            scores: user.scores,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Feedback submit karne ka rasta
app.post('/api/submit-feedback', async (req, res) => {
    try {
        const { username, email, rating, message } = req.body;

        // Naya feedback create karna
        const newFeedback = new Feedback({
            username,
            email,
            rating,
            message
        });

        // MongoDB mein save karna
        await newFeedback.save();

        console.log(`✅ Feedback received from ${username}`);
        res.status(200).json({ success: true, message: "Feedback saved successfully!" });
    } catch (err) {
        console.error("❌ Feedback Error:", err);
        res.status(500).json({ success: false, message: "Server error while saving feedback" });
    }
});

// Ye hai wo route jo aapko chahiye
app.post('/api/save-full-report', async (req, res) => {
    try {
        console.log("📥 Received data from Frontend:", req.body);

        const { username, email, predictedJob, scores } = req.body;

        // Naya record create karein
        const newReport = new CareerReport({
            username,
            email,
            predictedJob,
            scores,
            date: new Date()
        });
        //notification
// Optimized Notifications Get Route
app.get('/api/notifications/:email', async (req, res) => {
    try {
        const userEmail = req.params.email;

        // Validation: Check karein email aya hai ya nahi
        if (!userEmail) {
            return res.status(400).json({ error: "Email parameter is required" });
        }

        // Database se notifications dhoondo
        const notifications = await Notification.find({ email: userEmail })
            .sort({ date: -1 }) // Nayi notifications sabse upar (-1 means Descending)
            .limit(10);         // 5 ki jagah 10 kar diya hai taake list thodi bhari nazar aaye

        res.status(200).json(notifications);
        
    } catch (err) {
        console.error("❌ Notification Fetch Error:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
});
        // MongoDB mein save karein
        const savedData = await newReport.save();
        console.log("✅ Data successfully saved in careerreports!");

        res.status(200).json({ 
            success: true, 
            message: "Report saved successfully!",
            data: savedData 
        });
    } catch (err) {
        console.error("❌ MongoDB Save Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Failed to save data", 
            error: err.message 
        });
    }
    // Pehle check karein kya user ko ye badge pehle mil chuka hai?
const existingBadge = await Badge.findOne({ email, badgeName: "Quiz Explorer" });

if (!existingBadge) {
    const newBadge = new Badge({
        email: email,
        badgeName: "Quiz Explorer",
        badgeIcon: "📝",
        description: "Completed your first career assessment quiz!"
    });
    await newBadge.save();
    console.log("🏅 Badge Awarded: Quiz Explorer");
}
});
// Global APIs
app.get('/api/global-leaderboard', async (req, res) => res.json(await Leaderboard.find().sort({ rank: 1 })));
app.get('/api/questions', async (req, res) => res.json(await Question.find()));
app.get('/api/notifications/:email', async (req, res) => res.json(await Notification.find({ email: req.params.email, isRead: false })));
app.get('/api/resources/:cat', async (req, res) => res.json(await SkillResource.find({ category: req.params.cat })));

// --- 6. SERVER START ---
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Master Server Live on Port ${PORT}`));