// ==== GAME CARD SMOOTH ENTRANCE ANIMATION ====
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".game-card");

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 200);
    });
});


// ==== MATH GAME LOGIC (Ye wala code yahan se start hoga) ====

let score = 0;
let timeLeft = 10;
let currentQuestion = 0;
let totalQuestions = 5;
let timerInterval;

const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const answer = document.getElementById("answer");
const timer = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

function newQuestion() {
    if (currentQuestion >= totalQuestions) {
        finishGame();
        return;
    }

    let a = Math.floor(Math.random() * 20);
    let b = Math.floor(Math.random() * 20);

    num1.textContent = a;
    num2.textContent = b;

    currentQuestion++;
}

answer.addEventListener("keyup", () => {
    let correct = parseInt(num1.textContent) + parseInt(num2.textContent);

    if (parseInt(answer.value) === correct) {
        score++;
        answer.value = "";
        newQuestion();
    }
});

startBtn.addEventListener("click", () => {
    score = 0;
    timeLeft = 10;
    currentQuestion = 0;

    answer.value = "";
    answer.focus();
    timer.textContent = timeLeft;

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

function finishGame() {
    clearInterval(timerInterval);

    fetch("http://127.0.0.1:5000/game-result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            game: "math",
            score: score
        })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("game_final_result", JSON.stringify(data));
        window.location.href = "./game-result.html";
    });
}
fetch("http://127.0.0.1:5001/game-ai-predict", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        score: score,
        time_taken: timeLeft
    })
})
.then(res => res.json())
.then(data => {
    localStorage.setItem("game_final_result", JSON.stringify(data));
    window.location.href = "game-result.html";
});