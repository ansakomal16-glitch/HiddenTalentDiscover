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

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
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

    scoreText.innerHTML = percent + "% Match for SEO Field";

    animateCircle(percent);
    generateChart(percent);
    generateSEORecommendation(percent);
}

// Animate Percentage Circle
function animateCircle(p) {
    let value = 0;
    let interval = setInterval(() => {
        if (value >= p) clearInterval(interval);
        percentValue.innerHTML = value + "%";
        value++;
    }, 20);
}

// Chart
function generateChart(percent) {
    new Chart(document.getElementById("resultChart"), {
        type: "bar",
        data: {
            labels: ["SEO", "Technical SEO", "Content SEO"],
            datasets: [{
                label: "Field Fit %",
                data: [percent, percent - 10, percent - 5]
            }]
        }
    });
}

// Recommendation Logic
function generateSEORecommendation(p) {

    if (p >= 75) {
        careerTitle.innerHTML = "🔥 Perfect Match: SEO Specialist / Technical SEO!";
        careerMessage.innerHTML = "You have strong analytical skills and perfect SEO mindset.";

        improveBox.innerHTML = `
            <ul>
                <li>Master Technical SEO</li>
                <li>Use Google Search Console & Analytics</li>
                <li>Improve backlink building</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#">Complete SEO Bootcamp</a></li>
            <li><a href="#">Technical SEO Course</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#">SEO Specialist Jobs</a></li>
            <li><a href="#">Technical SEO Analyst Jobs</a></li>
        `;
    }

    else if (p >= 50) {
        careerTitle.innerHTML = "✨ Good Fit: Content SEO / Local SEO!";
        careerMessage.innerHTML = "You have potential — a little training will make you great.";

        improveBox.innerHTML = `
            <ul>
                <li>Learn keyword research</li>
                <li>Practice content optimization</li>
                <li>Understand local SEO basics</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#">Content SEO Training</a></li>
            <li><a href="#">Local SEO Course</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#">Content SEO Intern</a></li>
            <li><a href="#">SEO Assistant</a></li>
        `;
    }

    else {
        careerTitle.innerHTML = "🙂 Beginner Level: Start With Simple SEO!";
        careerMessage.innerHTML = "You can start learning SEO step by step.";

        improveBox.innerHTML = `
            <ul>
                <li>Understand basic SEO rules</li>
                <li>Practice writing content</li>
                <li>Learn simple ranking factors</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#">SEO for Beginners</a></li>
            <li><a href="#">Basic Website Optimization</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#">Junior SEO Internship</a></li>
        `;
    }
}
