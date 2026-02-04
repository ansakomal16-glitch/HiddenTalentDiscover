// Elements
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");

const questions = document.querySelectorAll(".question-box");
let current = 0;
let score = 0;

// Start Quiz
startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
});

// Option Click
document.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", function () {

        score += parseInt(this.dataset.score);

        questions[current].classList.add("hidden");

        current++;

        if (current < questions.length) {
            questions[current].classList.remove("hidden");
        } else {
            quizScreen.classList.add("hidden");
            resultScreen.classList.remove("hidden");

            if (score >= 45) {
                resultText.textContent = "🔥 Cyber Security Pro Level!";
            } else if (score >= 30) {
                resultText.textContent = "⚡ Good Knowledge! Keep learning.";
            } else {
                resultText.textContent = "🙂 Basic level. Practice more hacking skills!";
            }
        }
    });
});
