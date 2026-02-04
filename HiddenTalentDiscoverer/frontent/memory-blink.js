const grid = document.getElementById("grid");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const result = document.getElementById("result");

let pattern = [];
let userClicks = [];
let level = 1;

startBtn.onclick = () => {
    startBtn.classList.add("hide");
    resetBtn.classList.remove("hide");
    startLevel();
};

resetBtn.onclick = () => {
    location.reload();
};

function startLevel() {
    result.textContent = "Level " + level;
    pattern = generatePattern(level + 2); 
    userClicks = [];

    blinkPattern(pattern);
}

function generatePattern(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 9)); // 0–8 grid boxes
    }
    return arr;
}

function blinkPattern(arr) {
    let boxes = document.querySelectorAll(".box");

    arr.forEach((num, i) => {
        setTimeout(() => {
            boxes[num].classList.add("blink");
            setTimeout(() => boxes[num].classList.remove("blink"), 300);
        }, 500 * i);
    });
}

// Build grid 3×3
function createGrid() {
    for (let i = 0; i < 9; i++) {
        let div = document.createElement("div");
        div.classList.add("box");
        div.onclick = () => handleClick(i);
        grid.appendChild(div);
    }
}

function handleClick(i) {
    userClicks.push(i);

    if (userClicks[userClicks.length - 1] !== pattern[userClicks.length - 1]) {
        result.textContent = "❌ Wrong! Game Over";
        startBtn.classList.remove("hide");
        return;
    }

    if (userClicks.length === pattern.length) {
        result.textContent = "✔ Level Up!";
        level++;
        setTimeout(startLevel, 1000);
    }
}

createGrid();
