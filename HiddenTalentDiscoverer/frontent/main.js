// ------------------ USER AUTH (LOCALSTORAGE) ------------------

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

// Save current user
function saveCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

// Get all users
function getAllUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Save all users
function saveAllUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// ------------------ SIGNUP ------------------
function signupUser(name, email, password) {
    const users = getAllUsers();

    if (users.some(u => u.email === email)) {
        return { success: false, message: "User already exists ❌" };
    }

    const newUser = { name, email, password, interests: "", skills: "" };
    users.push(newUser);
    saveAllUsers(users);

    return { success: true, message: "Signup successful! 🎉" };
}

// ------------------ LOGIN ------------------
function loginUserLocal(email, password) {
    const users = getAllUsers();
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
        return { success: false, message: "Invalid email or password ❌" };
    }

    saveCurrentUser(found);
    return { success: true, message: "Login successful! ✅" };
}

// ------------------ PROFILE ------------------
function getProfileData() {
    return getCurrentUser();
}

function updateProfileData(name, interests, skills) {
    let users = getAllUsers();
    let user = getCurrentUser();

    const updated = {
        ...user,
        name,
        interests,
        skills
    };

    users = users.map(u => u.email === user.email ? updated : u);

    saveAllUsers(users);
    saveCurrentUser(updated);

    return { success: true, message: "Profile updated successfully! ✅" };
}

// ------------------ QUIZ STORAGE ------------------
function saveQuizResult(score, total, field) {
    localStorage.setItem("lastQuizResult", `Score: ${score}/${total}`);
    localStorage.setItem("talentArea", field.toUpperCase());

    let badges = JSON.parse(localStorage.getItem("badges")) || [];
    if (!badges.includes(field)) badges.push(field);
    localStorage.setItem("badges", JSON.stringify(badges));
}

// ------------------ GET DASHBOARD DATA ------------------
function getDashboardData() {
    return {
        user: getProfileData(),
        lastResult: localStorage.getItem("lastQuizResult") || "No quiz taken yet.",
        talentArea: localStorage.getItem("talentArea") || "Not detected yet.",
        badges: JSON.parse(localStorage.getItem("badges")) || []
    };
}

// ------------------ RECOMMENDATIONS ------------------
function getRecommendations() {
    const field = localStorage.getItem("talentArea");

    const data = {
        CS: [
            { title: "Learn JavaScript", description: "Start with basics." },
            { title: "Practice DSA", description: "Sharpen logic." }
        ],
        AI: [
            { title: "Learn Python", description: "Base for ML." },
            { title: "ML Basics", description: "Linear regression, trees etc." }
        ],
        PHYSICS: [
            { title: "Read Stephen Hawking", description: "Boost concepts." },
            { title: "Practice Mechanics", description: "Strengthen basics." }
        ],
        MATH: [
            { title: "Solve Puzzles", description: "Improve logic." },
            { title: "Learn Algebra", description: "Build foundation." }
        ]
    };

    return data[field] || [];
}

// ------------------ LEADERBOARD ------------------
function generateLeaderboard() {
    const user = getCurrentUser();
    const result = localStorage.getItem("lastQuizResult");
    let score = 0;

    if (result) score = parseInt(result.split("Score: ")[1]);

    let board = [
        { name: "Ayesha", score: 9 },
        { name: "Hamza", score: 8 },
        { name: "Zara", score: 7 },
        { name: "Ali", score: 6 },
        { name: user?.name || "You", score }
    ];

    board.sort((a, b) => b.score - a.score);
    return board;
}