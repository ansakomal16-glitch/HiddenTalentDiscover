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

    scoreText.innerHTML = percent + "% Match for Social Media Marketing";

    animateCircle(percent);
    generateChart(percent);
    generateSMMRecommendation(percent);
}

// Animate Circle %
function animateCircle(p) {
    let value = 0;
    let interval = setInterval(() => {
        if (value >= p) clearInterval(interval);
        percentValue.innerHTML = value + "%";
        value++;
    }, 20);
}

// Generate Graph
function generateChart(percent) {
    new Chart(document.getElementById("resultChart"), {
        type: "bar",
        data: {
            labels: ["Content Creation", "Management", "Branding"],
            datasets: [{
                label: "Field Fitness %",
                data: [percent, percent - 10, percent - 5]
            }]
        }
    });
}

// Career Recommendation Logic
function generateSMMRecommendation(p) {

    if (p >= 75) {
        careerTitle.innerHTML = "🔥 Perfect Match: Social Media Manager / Content Creator!";
        careerMessage.innerHTML = "You are highly suitable for Social Media Marketing 🚀";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Practice daily video editing</li>
                <li>Follow trends weekly</li>
                <li>Learn content strategy</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#">Meta Social Media Marketing Course</a></li>
            <li><a href="#">Canva Design Masterclass</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#">📌 Social Media Manager Jobs – LinkedIn</a></li>
            <li><a href="#">📌 Content Creator – Indeed</a></li>
        `;
    }

    else if (p >= 50) {
        careerTitle.innerHTML = "✨ Good Potential: SMM Assistant / Content Editor!";
        careerMessage.innerHTML = "You have good social media potential. Keep improving 💡";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Learn basic analytics</li>
                <li>Practice creative posting</li>
                <li>Build a content portfolio</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#">Instagram Growth Course</a></li>
            <li><a href="#">TikTok Content Strategy</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#">📊 SMM Assistant – Indeed</a></li>
            <li><a href="#">📊 Content Editor – LinkedIn</a></li>
        `;
    }

    else {
        careerTitle.innerHTML = "🙂 Start with Basic Content Skills";
        careerMessage.innerHTML = "You're not fully ready for SMM yet — but you can learn fast! 💪";

        improveBox.innerHTML = `
            <h4>📌 To Improve:</h4>
            <ul>
                <li>Learn Canva basics</li>
                <li>Understand trends</li>
                <li>Practice simple content posts</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#">Beginner Social Media Course</a></li>
            <li><a href="#">Canva Basics</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#">🗂 Social Media Intern</a></li>
        `;
    }
}
