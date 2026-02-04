// ------------------------- GLOBAL VARIABLES -------------------------
let token = ""; // JWT token for authentication
const API_URL = "http://localhost:5000"; // Backend URL

// ------------------------- UTILITY FUNCTIONS -------------------------

// Show alert messages
function showAlert(msg, type = "info") {
    const alertBox = document.createElement("div");
    alertBox.textContent = msg;
    alertBox.style.position = "fixed";
    alertBox.style.top = "20px";
    alertBox.style.right = "20px";
    alertBox.style.backgroundColor = type === "error" ? "#ff4d4d" : "#4CAF50";
    alertBox.style.color = "#fff";
    alertBox.style.padding = "12px 20px";
    alertBox.style.borderRadius = "8px";
    alertBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    alertBox.style.zIndex = "9999";
    document.body.appendChild(alertBox);
    setTimeout(() => document.body.removeChild(alertBox), 3000);
}

// ------------------------- SIGNUP FUNCTION -------------------------
async function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        showAlert("Please fill all fields ❌", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            showAlert(data.message, "success");
            toggleSections("login"); // show login after signup
        } else {
            showAlert(data || "Signup failed ❌", "error");
        }
    } catch (err) {
        console.error(err);
        showAlert("Server error ❌", "error");
    }
}

// ------------------------- LOGIN FUNCTION -------------------------
async function login() {
    const email = document.getElementById("emailLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();

    if (!email || !password) {
        showAlert("Please enter email and password ❌", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.token) {
            token = data.token;
            showAlert(data.message, "success");
            toggleSections("profile");
            await fetchProfile();
        } else {
            showAlert(data || "Login failed ❌", "error");
        }
    } catch (err) {
        console.error(err);
        showAlert("Server error ❌", "error");
    }
}

// ------------------------- FETCH PROFILE -------------------------
async function fetchProfile() {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await response.json();
        if (response.id) {
            document.getElementById("profileName").value = data.name || "";
            document.getElementById("profileInterests").value = data.interests || "";
            document.getElementById("profileSkills").value = data.skills || "";
        } else {
            showAlert("Profile not found ❌", "error");
        }
    } catch (err) {
        console.error(err);
        showAlert("Failed to fetch profile ❌", "error");
    }
}

// ------------------------- UPDATE PROFILE -------------------------
async function updateProfile() {
    const name = document.getElementById("profileName").value.trim();
    const interests = document.getElementById("profileInterests").value.trim();
    const skills = document.getElementById("profileSkills").value.trim();

    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ name, interests, skills })
        });
        const data = await response.json();
        showAlert(data.message || "Profile updated ✅", "success");
    } catch (err) {
        console.error(err);
        showAlert("Failed to update profile ❌", "error");
    }
}

// ------------------------- TOGGLE SECTIONS -------------------------
function toggleSections(section) {
    const signupSection = document.getElementById("signupSection");
    const loginSection = document.getElementById("loginSection");
    const profileSection = document.getElementById("profileSection");

    if (section === "signup") {
        signupSection.style.display = "block";
        loginSection.style.display = "none";
        profileSection.style.display = "none";
    } else if (section === "login") {
        signupSection.style.display = "none";
        loginSection.style.display = "block";
        profileSection.style.display = "none";
    } else if (section === "profile") {
        signupSection.style.display = "none";
        loginSection.style.display = "none";
        profileSection.style.display = "block";
    }
}

// ------------------------- INIT -------------------------
window.onload = () => {
    toggleSections("signup"); // Show signup by default
};
// ------------------------- FETCH QUIZ -------------------------
async function loadQuiz() {
    try {
        const response = await fetch(`${API_URL}/quiz`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });
        const questions = await response.json();
        const quizForm = document.getElementById("quizForm");
        quizForm.innerHTML = "";

        questions.forEach(q => {
            const qDiv = document.createElement("div");
            qDiv.style.marginBottom = "15px";
            qDiv.innerHTML = `<p><strong>${q.question}</strong></p>`;
            q.options.forEach(opt => {
                qDiv.innerHTML += `<label><input type="radio" name="q${q.id}" value="${opt}"> ${opt}</label><br>`;
            });
            quizForm.appendChild(qDiv);
        });
    } catch (err) {
        console.error(err);
        showAlert("Failed to load quiz ❌", "error");
    }
}

// ------------------------- SUBMIT QUIZ -------------------------
async function submitQuiz() {
    const form = document.getElementById("quizForm");
    const answers = [];
    quizQuestions.forEach(q => {
        const selected = form[`q${q.id}`].value;
        if (selected) answers.push({ id: q.id, answer: selected });
    });

    if (answers.length === 0) {
        showAlert("Please answer at least one question ❌", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/quiz`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ answers })
        });
        const data = await response.json();
        let resultHTML = `<h3>Total Score: ${data.totalScore}</h3>`;
        data.results.forEach(r => {
            resultHTML += `<p>${r.question} <br> Your Answer: ${r.yourAnswer} | Correct: ${r.correct} | Score: ${r.score}</p>`;
        });
        document.getElementById("quizResult").innerHTML = resultHTML;
    } catch (err) {
        console.error(err);
        showAlert("Failed to submit quiz ❌", "error");
    }
}

// ------------------------- SHOW QUIZ -------------------------
function showQuizSection() {
    toggleSections("quiz");
    loadQuiz();
}
