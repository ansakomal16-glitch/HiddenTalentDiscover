let score = 0;
let timeLeft = 3;
let timerInterval;

const questionBox = document.getElementById("questionBox");
const optA = document.getElementById("optA");
const optB = document.getElementById("optB");
const timer = document.getElementById("timer");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

const questions = [
    { q: "Your company got 2 offers. Choose profit?", a: "High Profit", b: "Low Risk", correct: "High Profit" },
    { q: "Market crash coming. What now?", a: "Invest", b: "Save Cash", correct: "Save Cash" },
    { q: "You need more speed. Choose:", a: "Hire People", b: "Automate", correct: "Automate" },
    { q: "Your new product is trending!", a: "Expand Fast", b: "Hold Slowly", correct: "Expand Fast" },
    { q: "Costs rising…", a: "Cut Expenses", b: "Increase Price", correct: "Cut Expenses" }
];

let currentIndex = 0;

function newQuestion() {
    let q = questions[currentIndex];

    questionBox.textContent = q.q;
    optA.textContent = q.a;
    optB.textContent = q.b;

    // box animation
    questionBox.style.opacity = "0";
    questionBox.style.transform = "scale(0.9)";

    setTimeout(() => {
        questionBox.style.opacity = "1";
        questionBox.style.transform = "scale(1)";
    }, 150);
}

startBtn.addEventListener("click", () => {
    score = 0;
    currentIndex = 0;
    timeLeft = 3;

    result.textContent = "";
    newQuestion();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            finishGame();
        }
    }, 1000);
});

function checkAnswer(choice) {
    let correctOption = questions[currentIndex].correct;

    if (choice === correctOption) {
        score++;
    }

    currentIndex++;

    if (currentIndex >= questions.length) {
        finishGame();
        return;
    }

    newQuestion();
}

optA.addEventListener("click", () => checkAnswer(optA.textContent));
optB.addEventListener("click", () => checkAnswer(optB.textContent));

function finishGame() {
    clearInterval(timerInterval);
    result.textContent = `🏆 Business IQ Score: ${score}`;
}
