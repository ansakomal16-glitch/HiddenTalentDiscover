// Global variables
let correctBox = null;
let level = 1;
const totalLevels = 5;
let gameStarted = false;
let canClick = false;
let score = 0; 

// Start Game
startBtn.onclick = () => {
    startBtn.classList.add("hide");
    resetBtn.classList.remove("hide");
    
    level = 1;
    score = 0; // Score reset
    gameStarted = true;
    console.log("Game Started, Score reset to 0");
    
    startLevel();
};

function startLevel() {
    correctBox = null;
    canClick = false;
    message.textContent = "Level " + level;
    
    highlightPattern();
}

function highlightPattern() {
    let boxes = Array.from(document.querySelectorAll(".box"));
    boxes.forEach(b => b.classList.remove("glow"));

    // Logic for random boxes
    let a = Math.floor(Math.random() * 9);
    let b = (a + level) % 9;
    boxes[a].classList.add("glow");
    boxes[b].classList.add("glow");

    correctBox = (a + level * 2) % 9;

    setTimeout(() => {
        boxes[a].classList.remove("glow");
        boxes[b].classList.remove("glow");
        message.textContent = "Pick correct block";
        canClick = true;
        console.log("Correct box index is: " + correctBox);
    }, 1200);
}

function handleClick(i) {
    if (!gameStarted || !canClick || correctBox === null) return;

    canClick = false;

    if (i === correctBox) {
        // ✅ Sahi jawab: Score barhao
        score++; 
        message.textContent = "✔ Correct!";
        console.log("Sahi! Score: " + score);
    } else {
        // ❌ Galat jawab: Score nahi barhega, par game chalti rahegi
        message.textContent = "❌ Wrong!";
        console.log("Galat! Score wahi hai: " + score);
    }

    // Har soorat mein aglay level par jao 600ms baad
    setTimeout(() => {
        level++;

        if (level > totalLevels) {
            // Jab 5 levels poore ho jayein tab result dikhao
            endGame();
        } else {
            startLevel();
        }
    }, 600);
}

// Function to handle ending to avoid code repetition
function endGame() {
    gameStarted = false;
    
    // ✅ Accuracy ko sirf NUMBER rakhein (e.g., 80, 100)
    // Formula: (Score / Total Levels) * 100
    let accuracyValue = Math.round((score / totalLevels) * 100);

    const resultData = {
        logic: score,
        total: totalLevels,
        accuracy: accuracyValue, // <--- Yahan % mat lagayein
        career: "Logic Thinker"
    };

    // Data save karein
    localStorage.setItem("gameResult", JSON.stringify(resultData));
    
    // Agar speed increase ho rahi hai toh usey bhi update rakhein
    // localStorage.setItem("speed", currentSpeedVariable); 

    console.log("Result Saved Successfully:", resultData);

    setTimeout(() => {
        window.location.href = "game-result.html";
    }, 500);
}
// Grid Build
function buildGrid() {
    grid.innerHTML = ''; // Ensure grid clears before building
    for (let i = 0; i < 9; i++) {
        let div = document.createElement("div");
        div.classList.add("box");
        div.onclick = () => handleClick(i);
        grid.appendChild(div);
    }
}

window.onload = () => buildGrid();