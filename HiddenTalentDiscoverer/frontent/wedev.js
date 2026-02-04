let currentQuestion = 0;
let score = 0;

// ELEMENTS
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultBox = document.getElementById("result-box");
const nextBtn = document.getElementById("nextBtn");

const percentValue = document.getElementById("percentValue");
const scoreText = document.getElementById("scoreText");

// 20 QUESTIONS DATA
const questions = [
    { q: "What is the full form of HTML?", a: ["Hyper Text Markup Language", "High Tech Multi Language", "Home Text Machine Language"], s: [5, 1, 0] },
    { q: "CSS is used for?", a: ["Styling", "Database", "Hosting"], s: [5, 1, 0] },
    { q: "What is the role of JavaScript?", a: ["Interaction", "Photos", "Only Styling"], s: [5, 0, 1] },
    { q: "What is included in Frontend?", a: ["HTML CSS JS", "Python", "SQL"], s: [5, 1, 0] },
    { q: "Which one is a backend language?", a: ["Node.js", "Photoshop", "Figma"], s: [5, 0, 1] },
    { q: "Responsive design is created using?", a: ["Media Queries", "Cookies", "Hosting"], s: [5, 0, 1] },
    { q: "Which one is a database?", a: ["MongoDB", "CSS", "Bootstrap"], s: [5, 0, 1] },
    { q: "Git is used for?", a: ["Version Control", "Hosting", "Designing"], s: [5, 1, 0] },
    { q: "Where do we purchase a domain?", a: ["Namecheap", "Figma", "React"], s: [5, 0, 1] },
    { q: "React is a framework of?", a: ["JavaScript", "CSS", "PHP"], s: [5, 1, 0] },
    { q: "API is used for?", a: ["Data Exchange", "Design", "Storage"], s: [5, 0, 1] },
    { q: "Bootstrap is a?", a: ["UI Framework", "Database", "Backend"], s: [5, 0, 1] },
    { q: "Which one is a hosting service?", a: ["Netlify", "Photoshop", "After Effects"], s: [5, 0, 1] },
    { q: "Full Stack means?", a: ["Frontend + Backend", "Only Design", "Only Server"], s: [5, 0, 1] },
    { q: "Which one is a JS library?", a: ["React", "HTML", "SQL"], s: [5, 0, 1] },
    { q: "CSS Flexbox is used for?", a: ["Layout", "Hosting", "Database"], s: [5, 0, 1] },
    { q: "Backend framework?", a: ["Express.js", "Figma", "Canva"], s: [5, 0, 1] },
    { q: "Frontend framework?", a: ["React", "MongoDB", "Node"], s: [5, 0, 1] },
    { q: "Which symbol represents an array in JS?", a: ["[]", "{}", "()"], s: [5, 0, 1] },
    { q: "A good developer must have?", a: ["Problem Solving", "Singing", "Dancing"], s: [5, 0, 0] },
];

// CREATE QUESTIONS ON SCREEN
function loadQuestions() {
    const container = document.getElementById("questions-container");
    let html = "";

    questions.forEach((q, i) => {
        html += `
        <div class="question-box hidden" id="q${i}">
            <h3>${i + 1}. ${q.q}</h3>
            ${q.a.map((o, j) => `<div class="option" data-score="${q.s[j]}">${o}</div>`).join("")}
        </div>`;
    });

    container.innerHTML = html;
}
loadQuestions();

// START QUIZ
document.getElementById("startBtn").onclick = () => {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    showQuestion(0);
};

// SHOW QUESTION
function showQuestion(i) {
    document.querySelectorAll(".question-box").forEach(q => q.classList.add("hidden"));
    document.getElementById(`q${i}`).classList.remove("hidden");
    nextBtn.classList.add("hidden");

    document.querySelectorAll(`#q${i} .option`).forEach(opt => {
        opt.onclick = () => {
            score += parseInt(opt.dataset.score);
            nextBtn.classList.remove("hidden");
        };
    });
}

// NEXT BUTTON
nextBtn.onclick = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        showResult();
    }
};

// RESULT
function showResult() {
    quizScreen.classList.add("hidden");
    resultBox.classList.remove("hidden");

    let percent = Math.round((score / (20 * 5)) * 100);

    percentValue.innerHTML = percent + "%";
    scoreText.innerHTML = `You Scored: ${percent}%`;

    generateChart(percent);
    generateRecommendation(percent);
}

// CHART
function generateChart(p) {
    new Chart(document.getElementById("resultChart"), {
        type: "bar",
        data: {
            labels: ["Frontend", "Backend", "Full Stack"],
            datasets: [{
                label: "Potential %",
                data: [p, p - 10, p - 5]
            }]
        }
    });
}

// RECOMMENDATION
function generateRecommendation(p) {
    document.getElementById("careerTitle").innerHTML =
        p >= 75 ? "🔥 Full Stack Developer" :
        p >= 50 ? "✨ Frontend Developer" :
                  "🙂 Beginner Level";

    document.getElementById("careerMessage").innerHTML =
        p >= 75 ? "You are perfect for Full Stack Development!" :
        p >= 50 ? "You have good potential for Frontend!" :
                  "Start from basics — you will improve easily.";
}
