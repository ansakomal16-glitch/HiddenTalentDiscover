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
     showQuestionWithTyping(currentQuestion);


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

    scoreText.innerHTML = percent + "% Match for AI Field";

    animateCircle(percent);
    generateChart(percent);
    generateAIRecommendation(percent);
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
function typeEffect(element, speed = 40) {
    const text = element.innerText;
    element.innerText = "";
    let i = 0;

    function typing() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

function showQuestionWithTyping(index) {
    const allQuestions = document.querySelectorAll(".question-box");
    allQuestions.forEach(q => q.classList.add("hidden"));

    const current = allQuestions[index];
    current.classList.remove("hidden");

    const h2 = current.querySelector("h2");
    h2.classList.add("typewriter");

    typeEffect(h2);
}

// Generate Graph
function generateChart(percent) {
    new Chart(document.getElementById("resultChart"), {
        type: "bar",
        data: {
            labels: ["AI", "Machine Learning", "Data Science"],
            datasets: [{
                label: "Field Fitness %",
                data: [percent, percent - 10, percent - 5]
            }]
        }
    });
}

// Career Recommendation Logic
function generateAIRecommendation(p) {

    // HIGH SCORE (75%+)
    if (p >= 75) {
        careerTitle.innerHTML = "🔥 Perfect Match: AI / Machine Learning Engineer!";
        careerMessage.innerHTML = "You are highly suitable for the AI field! 🚀";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Learn Deep Learning</li>
                <li>Practice Python + TensorFlow</li>
                <li>Build projects on Kaggle</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="https://www.coursera.org/learn/machine-learning" target="_blank">Machine Learning Course</a></li>
            <li><a href="https://www.coursera.org/specializations/deep-learning" target="_blank">Deep Learning Specialization</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="https://pk.indeed.com/jobs?q=ai+engineer" target="_blank">🔥 AI Engineer Jobs – Indeed</a></li>
            <li><a href="https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning" target="_blank">🤖 ML Jobs – LinkedIn</a></li>
        `;
    }

    // MEDIUM SCORE (50–74%)
    else if (p >= 50) {
        careerTitle.innerHTML = "✨ Good Potential: Data Science / AI Support!";
        careerMessage.innerHTML = "You have good potential — with some practice you can become an expert 💡";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Learn basic Statistics</li>
                <li>Practice SQL</li>
                <li>Understand basic ML models</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="https://www.coursera.org/learn/intro-to-data-science" target="_blank">Intro to Data Science</a></li>
            <li><a href="https://www.udemy.com/course/python-for-data-science-and-ml" target="_blank">Python for Data Science</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="https://pk.indeed.com/jobs?q=data+analyst" target="_blank">📊 Data Analyst Intern</a></li>
            <li><a href="https://www.linkedin.com/jobs/search/?keywords=AI%20Assistant" target="_blank">🤖 AI Support Assistant</a></li>
        `;
    }

    // LOW SCORE (Below 50%)
    else {
        careerTitle.innerHTML = "🙂 Start with Basic IT / Creative Fields";
        careerMessage.innerHTML = "You are not fully ready for AI yet — but with practice you will get there! 💪";

        improveBox.innerHTML = `
            <h4>📌 To Improve:</h4>
            <ul>
                <li>Start a Basic Computer Course</li>
                <li>Solve logical puzzles daily</li>
                <li>Practice basic Math</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="https://www.coursera.org/learn/computer-fundamentals" target="_blank">Basic IT Course</a></li>
            <li><a href="https://www.udemy.com/course/ai-for-beginners" target="_blank">AI for Beginners</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="https://pk.indeed.com/jobs?q=office+assistant" target="_blank">🗂 Office Assistant Jobs</a></li>
            <li><a href="https://www.rozee.pk/search/jobs?query=IT+Support" target="_blank">💻 IT Support Internships</a></li>
        `;
    }
}
