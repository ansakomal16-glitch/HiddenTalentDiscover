let currentQuestion = 0;
let score = 0;

// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultBox = document.getElementById("result-box");

// Buttons
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");

// Result Elements
const scoreText = document.getElementById("scoreText");
const percentValue = document.getElementById("percentValue");
const careerTitle = document.getElementById("careerTitle");
const careerMessage = document.getElementById("careerMessage");
const improveBox = document.getElementById("improveBox");
const courseList = document.getElementById("courseList");
const jobList = document.getElementById("jobList");

// Start Quiz
startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    showQuestion(0);
});

// Show Question
function showQuestion(i) {
    let questions = document.querySelectorAll(".question-box");

    questions.forEach(q => q.classList.add("hidden"));
    questions[i].classList.remove("hidden");

    nextBtn.classList.add("hidden");

    let options = questions[i].querySelectorAll(".option");
    options.forEach(opt => {
        opt.onclick = () => {
            score += parseInt(opt.dataset.score);
            nextBtn.classList.remove("hidden");
        };
    });
}

// Next Button
nextBtn.addEventListener("click", () => {
    let questions = document.querySelectorAll(".question-box");
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion(currentQuestion);
    } else {
        showResult();
    }
});

// Show Result
function showResult() {
    quizScreen.classList.add("hidden");
    resultBox.classList.remove("hidden");

    let percent = Math.round((score / (20 * 3)) * 100);

    scoreText.innerHTML = percent + "% Match for Information Security Field";

    animateCircle(percent);
    generateChart(percent);
    generateRecommendation(percent);
}

// Animate Circle %
function animateCircle(p) {
    let value = 0;
    let interval = setInterval(() => {
        if (value >= p) clearInterval(interval);
        percentValue.innerText = value + "%";
        value++;
    }, 20);
}

function generateChart(percent) {
    new Chart(document.getElementById("resultChart"), {
        type: "bar",
        data: {
            labels: ["Cyber Security", "Ethical Hacking", "Network Security"],
            datasets: [{
                label: "Field Fit %",
                data: [percent, percent - 5, percent - 10],
            }]
        }
    });
}

// Recommendation Logic
function generateRecommendation(p) {
    if (p >= 75) {
        careerTitle.innerHTML = "🔥 Perfect Match: Cyber Security Analyst!";
        careerMessage.innerHTML =
            "You have strong potential for Information Security. Excellent skills!";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Learn Ethical Hacking</li>
                <li>Practice Network Security Labs</li>
                <li>Study malware analysis basics</li>
        `;

        courseList.innerHTML = `
            <li><a target="_blank">CEH Ethical Hacking</a></li>
            <li><a target="_blank">Cyber Security Specialization</a></li>
        `;

        jobList.innerHTML = `
            <li><a target="_blank">Cyber Security Analyst Jobs</a></li>
            <li><a target="_blank">Penetration Tester Internships</a></li>
        `;
    }

    else if (p >= 50) {
        careerTitle.innerHTML = "✨ Good Fit: IT Security Support / Junior Analyst";
        careerMessage.innerHTML =
            "You have good security awareness. With training, you can become an expert.";

        improveBox.innerHTML = `
            <h4>📌 Work On:</h4>
            <ul>
                <li>Learn network security</li>
                <li>Practice strong password & encryption concepts</li>
                <li>Identify phishing & threats daily</li>
        `;

        courseList.innerHTML = `
            <li><a target="_blank">Network Security Basics</a></li>
            <li><a target="_blank">Intro to Cyber Security</a></li>
        `;

        jobList.innerHTML = `
            <li><a target="_blank">IT Security Assistant</a></li>
            <li><a target="_blank">SOC Internship</a></li>
        `;
    }

    else {
        careerTitle.innerHTML = "🙂 Beginner Level: Start With IT Basics";
        careerMessage.innerHTML =
            "Aapko basics strong krne ki need hai, phir aap InfoSec continue kr skti ho 💪";

        improveBox.innerHTML = `
            <h4>📌 Start With:</h4>
            <ul>
                <li>IT Fundamentals</li>
                <li>Learn basic cyber safety</li>
                <li>Practice logic & pattern skills</li>
        `;

        courseList.innerHTML = `
            <li><a target="_blank">Basic IT Course</a></li>
            <li><a target="_blank">Cyber Safety Training</a></li>
        `;

        jobList.innerHTML = `
            <li><a target="_blank">IT Support Intern</a></li>
            <li><a target="_blank">Help Desk Intern</a></li>
        `;
    }
}
