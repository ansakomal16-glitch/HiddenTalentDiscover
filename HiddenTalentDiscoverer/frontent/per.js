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

    scoreText.innerHTML = percent + "% Match for Performance Marketing";

    animateCircle(percent);
    generateChart(percent);
    generatePerformanceRecommendation(percent);
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
            labels: ["Performance Marketing", "Ads Management", "Analytics"],
            datasets: [{
                label: "Field Fitness %",
                data: [percent, percent - 8, percent - 5]
            }]
        }
    });
}

// PERFORMANCE MARKETING RESULT LOGIC
function generatePerformanceRecommendation(p) {

    // HIGH SCORE (75%+)
    if (p >= 75) {
        careerTitle.innerHTML = "🔥 Perfect Match: Performance Marketing Specialist!";
        careerMessage.innerHTML = "You are highly suitable for Performance Marketing — ROI, ads, analytics sab aap ke liye perfect! 🚀";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Master Google Ads + Meta Ads</li>
                <li>A/B Testing regularly perform karo</li>
                <li>Google Analytics & Tag Manager expert bano</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="https://www.coursera.org/learn/google-ads" target="_blank">Google Ads Certification</a></li>
            <li><a href="https://www.coursera.org/learn/marketing-analytics" target="_blank">Marketing Analytics Course</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="https://pk.indeed.com/jobs?q=performance+marketing" target="_blank">🔥 Performance Marketer Jobs (Indeed)</a></li>
            <li><a href="https://www.linkedin.com/jobs/search/?keywords=Performance%20Marketing" target="_blank">🚀 LinkedIn Jobs</a></li>
        `;
    }

    // MEDIUM SCORE (50–74%)
    else if (p >= 50) {
        careerTitle.innerHTML = "✨ Good Fit: Ads Manager / Analytics Assistant!";
        careerMessage.innerHTML = "You have really good potential! Thodi aur practice se top performance marketer ban sakte ho 💡";

        improveBox.innerHTML = `
            <h4>📌 Improvement Plan:</h4>
            <ul>
                <li>Facebook Ads ka structure seekho</li>
                <li>Google Analytics basics complete karo</li>
                <li>Beginner A/B testing try karo</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="https://www.udemy.com/course/facebook-ads-course" target="_blank">Facebook Ads Beginner Course</a></li>
            <li><a href="https://www.coursera.org/learn/intro-to-data-analysis" target="_blank">Intro to Analytics</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="https://pk.indeed.com/jobs?q=ads+manager" target="_blank">📊 Ads Manager Intern</a></li>
            <li><a href="https://www.linkedin.com/jobs/search/?keywords=Marketing%20Assistant" target="_blank">📈 Marketing Assistant Jobs</a></li>
        `;
    }

    // LOW SCORE (<50%)
    else {
        careerTitle.innerHTML = "🙂 Start with Basic Digital Marketing";
        careerMessage.innerHTML = "Aap ko abhi base strong karne ki zarurat hai — fir performance marketing aap easily master kar loge! 💪";

        improveBox.innerHTML = `
            <h4>📌 To Improve:</h4>
            <ul>
                <li>Digital marketing basics seekho</li>
                <li>Simple ad campaigns study karo</li>
                <li>Analytics ka basic dashboard samjho</li>
            </ul>
        `;

        courseList.innerHTML = `
            <li><a href="https://www.coursera.org/learn/digital-marketing" target="_blank">Digital Marketing Basics</a></li>
            <li><a href="https://www.udemy.com/course/google-analytics-for-beginners" target="_blank">Google Analytics Beginner</a></li>
        `;

        jobList.innerHTML = `
            <li><a href="https://pk.indeed.com/jobs?q=marketing+intern" target="_blank">📝 Marketing Intern Jobs</a></li>
            <li><a href="https://www.rozee.pk/search/jobs?query=digital+marketing" target="_blank">💼 Digital Marketing Openings</a></li>
        `;
    }
}
