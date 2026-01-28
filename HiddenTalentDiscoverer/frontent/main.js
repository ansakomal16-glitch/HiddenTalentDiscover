// ---------------- CONFIG ----------------
const API_URL = "http://localhost:5000"; // Backend URL
let token = localStorage.getItem("token") || "";

// ------------------- AUTH -------------------
// Save token
function saveToken(t){
    token = t;
    localStorage.setItem("token", t);
}

// Logout
function logoutUser(){
    token = "";
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// ------------------- API HELPERS -------------------
async function apiFetch(endpoint, method="GET", body=null){
    const headers = { "Content-Type":"application/json" };
    if(token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    return res.json();
}

// ------------------- AUTH FUNCTIONS -------------------
async function signup(name,email,password){
    return await apiFetch("/signup","POST",{name,email,password});
}

async function login(email,password){
    const data = await apiFetch("/login","POST",{email,password});
    if(data.token) saveToken(data.token);
    return data;
}

// ------------------- PROFILE FUNCTIONS -------------------
async function getProfile(){
    return await apiFetch("/profile","GET");
}

async function updateProfile(name,interests,skills){
    return await apiFetch("/profile","PUT",{name,interests,skills});
}

// ------------------- QUIZ FUNCTIONS -------------------
async function getQuizQuestions(){
    return await apiFetch("/quiz","GET");
}

async function submitQuiz(answers){
    return await apiFetch("/quiz","POST",{answers});
}

// ------------------- DASHBOARD -------------------
async function getQuizResults(){
    return await apiFetch("/quiz/results"); // backend endpoint for past quiz scores
}

// ------------------- LEADERBOARD -------------------
async function getLeaderboard(){
    return await apiFetch("/leaderboard"); // backend endpoint
}

// ------------------- BADGES -------------------
async function getBadges(){
    return await apiFetch("/badges"); // backend endpoint
}

// ------------------- RECOMMENDATIONS -------------------
async function getRecommendations(){
    return await apiFetch("/recommendations"); // backend endpoint
}

// ------------------- BLOG -------------------
async function getBlogPosts(){
    return await apiFetch("/blog"); // backend endpoint
}

// ------------------- PASSWORD CHANGE -------------------
async function changePassword(oldPassword,newPassword){
    return await apiFetch("/change-password","PUT",{oldPassword,newPassword});
}

// ------------------- INITIAL CHECK -------------------
function requireLogin(redirectPage="index.html"){
    if(!token){
        alert("Please login first! 🔒");
        window.location.href = redirectPage;
        return false;
    }
    return true;
}
