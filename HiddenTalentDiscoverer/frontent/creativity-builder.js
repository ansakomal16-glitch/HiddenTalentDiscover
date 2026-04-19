let totalRounds = 5;
let currentRound = 0;

let correctAnswers = 0;
let totalTimeTaken = 0;

let shapeBox = document.getElementById("shapeBox");
let startBtn = document.getElementById("startBtn");
let input = document.getElementById("creativeInput");
let timerDisplay = document.getElementById("timer");

let timer = null;
let timeLeft = 10;


// Symbols aur unke naam ki mapping
const shapeMapping = {
    "▲": ["triangle", "tri", "nok"],
    "■": ["square", "box", "char kon"],
    "●": ["circle", "round", "gool"],
    "★": ["star", "sitara"],
    "⬟": ["pentagon"],
    "◆": ["diamond"],
    "⬛": ["square", "box"],
    "⬤": ["circle", "round"]
};

// Sirf symbols ki keys nikalne ke liye
const shapes = Object.keys(shapeMapping);

// =====================
// INIT STATE
// =====================
shapeBox.style.display = "none";
input.style.display = "none";
timerDisplay.style.display = "none";

// =====================
// START GAME
// =====================
startBtn.addEventListener("click", () => {

    currentRound = 0;
    correctAnswers = 0;
    totalTimeTaken = 0;

    shapeBox.style.display = "block";
    input.style.display = "block";
    timerDisplay.style.display = "block";

    startBtn.style.display = "none";

    startRound();
});

// =====================
// START ROUND
// =====================
function startRound() {

    if (currentRound >= totalRounds) {
        endGame();
        return;
    }

    clearInterval(timer);

    input.value = "";
    input.disabled = false;

    shapeBox.innerText = shapes[Math.floor(Math.random() * shapes.length)];

    timeLeft = 10;
    timerDisplay.innerText = timeLeft;

    let roundStartTime = Date.now();

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            evaluateAnswer(roundStartTime);
        }
    }, 1000);
}

// =====================
// CHECK ANSWER
// =====================
// =====================
// CHECK ANSWER (Optimized)
// =====================
function evaluateAnswer(roundStartTime) {
    clearInterval(timer);
    input.disabled = true;

    let userAnswer = input.value.trim().toLowerCase(); // Chote letters mein convert kiya
    let currentSymbol = shapeBox.innerText.trim();     // Jo symbol screen par hai
    
    // Us symbol ke sahi names ki list uthayi
    let validNames = shapeMapping[currentSymbol] || [];

    console.log("User Input:", userAnswer, "Valid Names:", validNames);

    // ✅ CHECK: Kya user ka likha hua word sahi names mein shamil hai?
    if (validNames.includes(userAnswer)) {
        correctAnswers++;
        console.log("Correct! Score now:", correctAnswers);
    } else {
        console.log("Wrong answer!");
    }

    let timeUsed = (Date.now() - roundStartTime) / 1000;
    totalTimeTaken += Math.min(timeUsed, 10);

    currentRound++;

    setTimeout(() => {
        startRound();
    }, 500);
}

// ✅ Enter Key Support (Taaki foran answer submit ho sake)
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !input.disabled) {
        evaluateAnswer(Date.now() - (10 - timeLeft) * 1000); 
    }
});

// =====================
// END GAME
// =====================
function endGame() {
    clearInterval(timer);

    let accuracy = Math.round((correctAnswers / totalRounds) * 100);
    let avgTime = totalTimeTaken / totalRounds;
    let speedScore = Math.max(0, Math.round(100 - (avgTime * 5)));

    // ✅ Pehle wala localStorage clear karke naya set karein
    localStorage.removeItem("gameResult");
    
    const finalData = {
        accuracy: accuracy, // e.g. 80
        speed: speedScore,  // e.g. 90
        career: "Creative Designer" // Ya jo bhi aap likhna chahen
    };

    localStorage.setItem("gameResult", JSON.stringify(finalData));
    localStorage.setItem("speed", speedScore); // Speed alag se bhi save karein

    console.log("Final Saving:", finalData);

    setTimeout(() => {
        window.location.href = "game-result.html";
    }, 500);
}