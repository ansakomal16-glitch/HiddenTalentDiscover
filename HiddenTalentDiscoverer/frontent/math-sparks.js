let score = 0;
let timeLeft = 10;
let timerInterval;

const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const answer = document.getElementById("answer");
const timer = document.getElementById("timer");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

// Generate Random Question
function newQuestion() {
    let a = Math.floor(Math.random() * 20);
    let b = Math.floor(Math.random() * 20);

    num1.textContent = a;
    num2.textContent = b;
}

answer.addEventListener("keyup", () => {
    let correct = parseInt(num1.textContent) + parseInt(num2.textContent);

    if (parseInt(answer.value) === correct) {
        score++;
        answer.value = "";
        newQuestion();
    }
});

// Start Game
startBtn.addEventListener("click", () => {
    score = 0;
    timeLeft = 10;
    timer.textContent = timeLeft;
    result.textContent = "";
    answer.value = "";
    answer.focus();

    newQuestion();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishGame();
        }
    }, 1000);
});

// Game End
function finishGame() {
    result.textContent = `⭐ Your Score: ${score}`;
}
const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.add("move-effect");

        setTimeout(() => {
            btn.classList.remove("move-effect");
        }, 400);
    });
});
