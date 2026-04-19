const grid = document.getElementById("grid");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const result = document.getElementById("result");

let pattern = [];
let userClicks = [];
let level = 0;
let score = 0;

const totalLevels = 5;

// =====================
// INIT
// =====================
startBtn.innerText = "NEXT";

// =====================
// NEXT BUTTON
// =====================
startBtn.onclick = () => {

    if (level >= totalLevels) return;

    level++;

    startLevel();

    result.textContent = "Level " + level;
    localStorage.setItem("memoryResult", JSON.stringify({
    score: score,
    total: pattern.length + score
}));

    if (level === totalLevels) {

        setTimeout(() => {

            localStorage.setItem("memoryResult", JSON.stringify({
                score: score
            }));

            window.location.href = "game-result.html";

        }, 800);
    }
};

// =====================
// RESET
// =====================
resetBtn.onclick = () => location.reload();

// =====================
// LEVEL START (IMPORTANT FIX)
// =====================
function startLevel() {

    pattern = [];
    userClicks = [];

    let count = level + 2;

    for (let i = 0; i < count; i++) {
        pattern.push(Math.floor(Math.random() * 9));
    }

    showPattern();   // ⭐⭐⭐ THIS WAS MISSING (MAIN BUG FIX)
}

// =====================
// SHOW BLINK PATTERN
// =====================
function showPattern() {

    let boxes = document.querySelectorAll(".box");

    pattern.forEach((num, i) => {

        setTimeout(() => {

            boxes[num].classList.add("blink");

            setTimeout(() => {
                boxes[num].classList.remove("blink");
            }, 300);

        }, 500 * i);
    });
}

// =====================
// CLICK CHECK
// =====================
function handleClick(i) {

    userClicks.push(i);

    let index = userClicks.length - 1;

    if (userClicks[index] !== pattern[index]) {
        result.textContent = "❌ Wrong!";
        return;
    }

    score++;
}

// =====================
// GRID CREATE
// =====================
function createGrid() {

    for (let i = 0; i < 9; i++) {

        let div = document.createElement("div");
        div.classList.add("box");

        div.onclick = () => handleClick(i);

        grid.appendChild(div);
    }
}


createGrid()