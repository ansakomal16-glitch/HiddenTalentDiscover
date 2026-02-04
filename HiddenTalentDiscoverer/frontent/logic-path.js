const grid = document.getElementById("grid");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

let correctBox = null;
let level = 1;

startBtn.onclick = () => {
    startBtn.classList.add("hide");
    resetBtn.classList.remove("hide");
    startLevel();
};

resetBtn.onclick = () => location.reload();

function startLevel() {
    message.textContent = "Level " + level;
    highlightPattern();
}

function highlightPattern() {
    let boxes = document.querySelectorAll(".box");

    // remove old glow
    boxes.forEach(b => b.classList.remove("glow"));

    // logic: each level → highlight 2 boxes by pattern rule
    let a = Math.floor(Math.random() * 9);
    let b = (a + level) % 9;

    boxes[a].classList.add("glow");
    boxes[b].classList.add("glow");

    // Correct box is the next logical step (a + level*2)
    correctBox = (a + level * 2) % 9;

    setTimeout(() => {
        boxes[a].classList.remove("glow");
        boxes[b].classList.remove("glow");

        message.textContent = "Pick the next correct block";
    }, 1200);
}

function buildGrid() {
    for (let i = 0; i < 9; i++) {
        let div = document.createElement("div");
        div.classList.add("box");
        div.onclick = () => handleClick(i);
        grid.appendChild(div);
    }
}

function handleClick(i) {
    if (i === correctBox) {
        message.textContent = "✔ Correct! Level Up!";
        level++;
        setTimeout(startLevel, 1000);
    } else {
        message.textContent = "❌ Wrong! Game Over";
        startBtn.classList.remove("hide");
    }
}

buildGrid();
