let score = 0;
let timeLeft = 10;
let timerInterval;

const shapes = ["⬤", "▲", "■", "★", "◆", "⬟", "⬢", "✦", "✸", "✧"];

const timer = document.getElementById("timer");
const shapeBox = document.getElementById("shapeBox");
const input = document.getElementById("creativeInput");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

// === SHAPE WITH TRANSITION ===
function newShape() {

    // old shape exit animation
    shapeBox.classList.add("shape-animate");

    setTimeout(() => {
        let s = shapes[Math.floor(Math.random() * shapes.length)];
        shapeBox.textContent = s;

        // reset and apply new shape entrance animation
        shapeBox.classList.remove("shape-animate");
        shapeBox.classList.add("shape-animate-new");

        setTimeout(() => {
            shapeBox.classList.remove("shape-animate-new");
        }, 250);

    }, 250);
}

// === GAME START ===
startBtn.addEventListener("click", () => {
    score = 0;
    timeLeft = 10;
    timer.textContent = timeLeft;
    result.textContent = "";
    result.classList.remove("show");
    input.value = "";
    input.focus();

    newShape();

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

// === ENTER PRESS TO SCORE ===
input.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
        score++;
        input.value = "";
        newShape();
    }
});

// === GAME END ===
function finishGame() {
    result.textContent = `🌟 Creativity Score: ${score}`;
    result.classList.add("show");
}
