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

    let percent = Math.round((score / (10 * 3)) * 100);

    scoreText.innerHTML = percent + "% Match for E-Commerce Business";

    animateCircle(percent);
    generateChart(percent);
    generateRecommendation(percent);
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

// Graph
function generateChart(percent) {
    new Chart(document.getElementById("resultChart"), {
        type: "bar",
        data: {
            labels: ["Marketing", "Product Research", "Store Management"],
            datasets: [{
                label: "Skill Match %",
                data: [percent, percent - 12, percent - 5]
            }]
        }
    });
}

// Recommendations
function generateRecommendation(p) {

    if (p >= 75) {
        careerTitle.innerHTML = "🔥 Excellent Choice: Start Your E-Commerce Brand!";
        careerMessage.innerHTML = "You have strong skills for running a successful online business.";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Master Facebook & TikTok Ads</li>
                <li>Learn product research tools</li>
                <li>Build a Shopify store</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#" target="_blank">Shopify Masterclass</a></li>
            <li><a href="#" target="_blank">Facebook Ads for E-Commerce</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#" target="_blank">E-Commerce Manager Jobs</a></li>
            <li><a href="#" target="_blank">Online Store Specialist</a></li>
        `;
    }

    else if (p >= 50) {
        careerTitle.innerHTML = "✨ Good Potential: Grow Your E-Commerce Skills!";
        careerMessage.innerHTML = "You can definitely build an online store with some more practice.";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Learn basic SEO</li>
                <li>Improve product listing skills</li>
                <li>Understand customer psychology</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#" target="_blank">Digital Marketing Basics</a></li>
            <li><a href="#" target="_blank">Product Listing Mastery</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#" target="_blank">Product Lister</a></li>
            <li><a href="#" target="_blank">E-Commerce Virtual Assistant</a></li>
        `;
    }

    else {
        careerTitle.innerHTML = "🙂 Start with Basic E-Commerce Knowledge";
        careerMessage.innerHTML = "You need more practice but you can grow step-by-step.";

        improveBox.innerHTML = `
            <h4>📌 To Improve:</h4>
            <ul>
                <li>Learn basics of online business</li>
                <li>Understand customers & products</li>
                <li>Start with small online selling</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="#" target="_blank">E-Commerce for Beginners</a></li>
            <li><a href="#" target="_blank">Social Media Basics</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="#" target="_blank">Store Helper</a></li>
            <li><a href="#" target="_blank">Customer Support Intern</a></li>
        `;
    }
}
