const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");

const questions = document.querySelectorAll(".question-box");
let current = 0;
let score = 0;

// Start quiz
startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
});

// Option select
document.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", function () {
        score += parseInt(this.dataset.score);

        // Disable options
        this.parentElement.querySelectorAll(".option").forEach(o => {
            o.disabled = true;
        });

        // Show next button
        this.parentElement.querySelector(".next-btn").classList.remove("hidden");
    });
});

// Next buttons
document.querySelectorAll(".next-btn").forEach((next, index) => {
    next.addEventListener("click", () => {

        questions[current].classList.add("hidden");
        current++;

        if (current < questions.length) {
            questions[current].classList.remove("hidden");
        } else {
            quizScreen.classList.add("hidden");
            resultScreen.classList.remove("hidden");

            // Scoring
            let percent = Math.round((score / (20 * 3)) * 100);

            if (percent >= 75) {
                resultText.textContent = "🔥 Excellent! Perfect for Network Security!";
            } else if (percent >= 50) {
                resultText.textContent = "⚡ Good! You have strong potential.";
            } else {
                resultText.textContent = "🙂 Basic level. Keep learning!";
            }
        }
    });
});
