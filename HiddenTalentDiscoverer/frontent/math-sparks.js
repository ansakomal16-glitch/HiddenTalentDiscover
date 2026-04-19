let score = 0;
let timeLeft = 10;
let timerInterval;

let currentQuestion = 0;
let totalQuestions = 1;
let gameEnded = false;

const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const answer = document.getElementById("answer");
const timer = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");


// =====================
// NEW QUESTION
// =====================
function newQuestion() {
    if (gameEnded) return;

    // Isay check karein taake 5 se upar sawal na jayein
    if (currentQuestion >= totalQuestions) {
        finishGame();
        return;
    }

    let a = Math.floor(Math.random() * 20);
    let b = Math.floor(Math.random() * 20);

    num1.textContent = a;
    num2.textContent = b;

    answer.value = "";
    currentQuestion++; // Question count yahan barhay ga
}


// =====================
// TIMERs
// =====================
function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 10;
    timer.textContent = timeLeft;

    timerInterval = setInterval(() => {

        if (gameEnded) {
            clearInterval(timerInterval);
            return;
        }

        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {

            if (currentQuestion >= totalQuestions) {
                finishGame();
            } else {
                newQuestion();
                startTimer();
            }
        }

    }, 1000);
}


// =====================
// START GAME
// =====================
startBtn.addEventListener("click", () => {

    score = 0;
    currentQuestion = 0;
    gameEnded = false;

    newQuestion();
    startTimer();
});


// =====================
// ANSWER CHECK
answer.addEventListener("keyup", () => {
    if (gameEnded) return;
    if (answer.value === "") return;

    let correct = parseInt(num1.textContent) + parseInt(num2.textContent);

    if (parseInt(answer.value) === correct) {
        score++;
        answer.value = "";

        // Check karein ke kya target (1 question) poora ho gaya
        if (currentQuestion >= totalQuestions) {
            finishGame(); 
        } else {
            newQuestion();
            startTimer();
        }
    }
});


// =====================
// FINISH GAME
// =====================
function finishGame() {

    if (gameEnded) return;

    gameEnded = true;
    clearInterval(timerInterval);

    fetch("http://127.0.0.1:5000/game-result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            score: score,
            questions: totalQuestions
        })
    })
    .then(res => res.json())
    .then(data => {

        localStorage.setItem("gameResult", JSON.stringify({
            career: data.career,
            accuracy: data.accuracy,
            score: score,
            speed: Math.random() * 100,
            logic: Math.random() * 100
        }));

        window.location.href = "game-result.html";
    });
}