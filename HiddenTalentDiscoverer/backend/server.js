
// ------------------------- IMPORTS -------------------------
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------------- DATABASE CONNECTION -------------------------
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hidden_talent_db',
    port: process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) console.log("Database connection failed ❌", err);
    else console.log("Database connected successfully ✅");
});

// ------------------------- SIGNUP API -------------------------
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send("Please provide all fields ❌");

    // Password hash
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Save to database
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") return res.status(400).send("Email already exists ❌");
            return res.status(500).send("Database error ❌");
        }
        res.send({ message: "Signup successful ✅", userId: result.insertId });
    });
});

// ------------------------- LOGIN API -------------------------
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Please provide email and password ❌");

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).send("Database error ❌");
        if (results.length === 0) return res.status(404).send("User not found ❌");

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(401).send("Invalid password ❌");

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "mysecretkey", { expiresIn: "1h" });

        res.send({ message: "Login successful ✅", token });
    });
});

// ------------------------- PROFILE API -------------------------
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || "mysecretkey", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get("/profile", authenticateToken, (req, res) => {
    const query = "SELECT id, name, email, interests, skills FROM users WHERE id = ?";
    db.query(query, [req.user.userId], (err, results) => {
        if (err) return res.status(500).send("Database error ❌");
        if (results.length === 0) return res.status(404).send("User not found ❌");
        res.send(results[0]);
    });
});

app.put("/profile", authenticateToken, (req, res) => {
    const { name, interests, skills } = req.body;
    const query = "UPDATE users SET name = ?, interests = ?, skills = ? WHERE id = ?";
    db.query(query, [name, interests, skills, req.user.userId], (err) => {
        if (err) return res.status(500).send("Database error ❌");
        res.send({ message: "Profile updated successfully ✅" });
    });
});

// ------------------------- START SERVER -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT} ✅`));
// ------------------------- QUIZ QUESTIONS -------------------------
const quizQuestions = [
    { id: 1, question: "Which skill do you enjoy the most?", options: ["Coding", "Design", "Writing", "Speaking"], answer: "Coding" },
    { id: 2, question: "Do you prefer working alone or in a team?", options: ["Alone", "Team"], answer: "Team" },
    { id: 3, question: "Which activity excites you?", options: ["Problem solving", "Drawing", "Storytelling", "Sports"], answer: "Problem solving" }
];

// ------------------------- SUBMIT QUIZ API -------------------------
app.post("/quiz", authenticateToken, (req, res) => {
    const { answers } = req.body; // [{id:1, answer:"Coding"}, ...]
    if (!answers || !Array.isArray(answers)) return res.status(400).send("Invalid quiz data ❌");

    let totalScore = 0;
    const results = [];

    answers.forEach(item => {
        const question = quizQuestions.find(q => q.id === item.id);
        if (!question) return;
        const correct = item.answer === question.answer;
        const score = correct ? 1 : 0;
        totalScore += score;

        // Save to database
        const query = "INSERT INTO quiz_answers (user_id, question, answer, correct, score) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [req.user.userId, question.question, item.answer, correct, score], (err) => {
            if (err) console.log("DB error:", err);
        });

        results.push({ question: question.question, yourAnswer: item.answer, correct, score });
    });

    res.send({ message: "Quiz submitted ✅", totalScore, results });
});

// ------------------------- GET QUIZ QUESTIONS -------------------------
app.get("/quiz", authenticateToken, (req, res) => {
    res.send(quizQuestions);
});
