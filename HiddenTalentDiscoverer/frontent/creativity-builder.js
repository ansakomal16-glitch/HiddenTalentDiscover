let score = 0;
let timeLeft = 10;
let timerInterval;
let signsGuessed = 0; 

const shapes = ["⬤", "▲", "■", "★", "◆", "⬟", "⬢", "✦", "✸", "✧"];

const timer = document.getElementById("timer");
const shapeBox = document.getElementById("shapeBox");
const input = document.getElementById("creativeInput");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

// === SHAPE WITH TRANSITION ===
function newShape() {
    shapeBox.classList.add("shape-animate");

    setTimeout(() => {
        let s = shapes[Math.floor(Math.random() * shapes.length)];
        shapeBox.textContent = s;

        shapeBox.classList.remove("shape-animate");
        shapeBox.classList.add("shape-animate-new");

        setTimeout(() => {
            shapeBox.classList.remove("shape-animate-new");
        }, 250);
    }, 250);
}

// === GAME START ===
startBtn.addEventListener("click", () => {
    // Sab kuch shuru se reset karein
    score = 0;
    signsGuessed = 0; 
    timeLeft = 10;
    
    timer.textContent = timeLeft;
    result.textContent = "";
    result.classList.remove("show");
    
    input.value = "";
    input.disabled = false; // Dubara khelne ke liye enable
    input.style.opacity = "1";
    input.focus();

    newShape();

    // Pehle se chalne wala timer khatam karein
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            stopGame("Time's Up!");
        }
    }, 1000);
});

// === KEY LISTENER (THE CORE FIX) ===
input.addEventListener("keyup", (e) => {
    // Agar 5 bar ho chuka hai to mazeed kuch na karo
    if (signsGuessed >= 5) return;

    if (e.key === "Enter" && input.value.trim() !== "") {
        score++;
        signsGuessed++; 
        input.value = "";

        // FORAN CHECK: Kya 5 symbols poore ho gaye?
        if (signsGuessed === 5) {
            stopGame("Level Complete!");
        } else {
            newShape();
        }
    }
});

// === STOP GAME FUNCTION ===
function stopGame(msg) {
    clearInterval(timerInterval); // Timer ko har hal mein roko
    input.disabled = true; // Typing lock
    input.style.opacity = "0.5"; // Visual feedback ke game khatam
    
    // Result show karein
    result.innerHTML = `
        <div style="margin-top: 10px;">
            <p style="font-size: 16px; color: #64748b;">${msg}</p>
            <p style="font-size: 28px;">🏆 Score: ${score}/5</p>
            <button onclick="location.reload()" style="margin-top:15px; font-size:14px; padding: 8px 15px;">Restart Game</button>
        </div>
    `;
    result.classList.add("show");
    shapeBox.textContent = "⌛"; // Game over ka sign
}
 function closeGame() {
            clearInterval(gameInterval);
            document.getElementById('game-overlay').classList.add('hidden');
        }
  function buildScoresFromGame() {
            // Normalize raw score into 0–1
            const normalizedScore = Math.max(0, Math.min(currentScore, 100)) / 100;

            // Start from a 1–5 space for trait shaping
            const base5 = 2 + normalizedScore * 3;

            const scores5 = {
                O_score: base5,
                C_score: base5,
                E_score: base5,
                A_score: base5,
                N_score: 5 - base5 + 2,
                Numerical: base5,
                Spatial: base5,
                Perceptual: base5,
                Abstract: base5,
                Verbal: base5
            };

            // Game-to-trait mapper (8-game battery friendly) in 1–5 space
            if (gameType.includes("Math") || gameType.includes("Rapid")) {
                // Rapid Math → Numerical ability
                scores5.Numerical = Math.min(5, base5 + 0.8);
            } else if (gameType.includes("Reflex") || gameType.includes("Reaction") || gameType.includes("Focus")) {
                // Reaction/Focus → Conscientiousness & Perceptual
                scores5.Perceptual = Math.min(5, base5 + 0.8);
                scores5.C_score = Math.min(5, base5 + 0.6);
            } else if (gameType.includes("Memory") || gameType.includes("Matrix")) {
                // Memory Matrix → Planning / Conscientiousness
                scores5.C_score = Math.min(5, base5 + 0.8);
            } else if (gameType.includes("Pattern") || gameType.includes("Logic")) {
                // Pattern Match → Abstract reasoning
                scores5.Abstract = Math.min(5, base5 + 0.8);
            } else if (gameType.includes("Verbal")) {
                // Verbal Flow → Extraversion & Verbal
                scores5.E_score = Math.min(5, base5 + 0.8);
                scores5.Verbal = Math.min(5, base5 + 0.8);
            } else if (gameType.includes("Spatial")) {
                // Spatial Rotation → Spatial ability & Openness
                scores5.Spatial = Math.min(5, base5 + 0.8);
                scores5.O_score = Math.min(5, base5 + 0.6);
            } else if (gameType.includes("Color")) {
                // Color Focus → Perceptual / creativity
                scores5.Perceptual = Math.min(5, base5 + 0.7);
            } else if (gameType.includes("Emotional") || gameType.includes("Pulse")) {
                // Emotional Pulse → Agreeableness / Neuroticism
                scores5.A_score = Math.min(5, base5 + 0.8);
                scores5.N_score = Math.max(1, 5 - base5 + 1);
            }

            // Clamp to 1–5 then scale into 1–10 for the model
            const scores10 = {};
            Object.keys(scores5).forEach(k => {
                const clamped5 = Math.max(1, Math.min(5, Math.round(scores5[k])));
                scores10[k] = Math.max(1, Math.min(10, clamped5 * 2));
            });

            return scores10;
        }

        function getDisplayName() {
            return userName || "Neural Explorer";
        }

        function getUserEmailSafe() {
            return userEmail || "";
        }

        function resolvePredictions() {
            if (currentGameResults && Array.isArray(currentGameResults.predictions) && currentGameResults.predictions.length) {
                return currentGameResults.predictions;
            }
            if (!currentGameResults || !currentGameResults.user_traits) return [];
            const traits = currentGameResults.user_traits;
            return Object.keys(traits)
                .map(key => ({ career: key + " Specialist", match: Math.round(traits[key] * 20), market_demand: "High" }));
        }

        function renderRadar() {
            const canvas = document.getElementById('traitRadarCanvas');
            if (!canvas || !currentGameResults || !currentGameResults.user_traits) return;

            const traits = currentGameResults.user_traits;
            const labels = Object.keys(traits);
            const values = labels.map(k => traits[k]);

            if (radarChart) radarChart.destroy();

            radarChart = new Chart(canvas, {
                type: 'radar',
                data: {
                    labels,
                    datasets: [{
                        data: values,
                        backgroundColor: "rgba(30, 64, 175, 0.25)",
                        borderColor: "rgba(30, 64, 175, 0.95)",
                        borderWidth: 2,
                        pointBackgroundColor: "#1d4ed8",
                        pointRadius: 2.5,
                        pointHoverRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        r: {
                            suggestedMin: 0,
                            suggestedMax: 5,
                            grid: { color: "rgba(15,23,42,0.22)" },
                            angleLines: { color: "rgba(15,23,42,0.22)" },
                            ticks: { display: false },
                            pointLabels: {
                                font: { family: "Plus Jakarta Sans", size: 11, weight: "500" },
                                color: "#0f172a"
                            }
                        }
                    }
                }
            });
        }

        function renderSalary() {
            const canvas = document.getElementById('salaryChartCanvas');
            if (!canvas) return;

            const predictions = resolvePredictions();
            const top = predictions[0];

            let base = 60;
            let peak = 140;

            if (top) {
                if (typeof top.salary_entry === "number" && typeof top.salary_expert === "number") {
                    base = top.salary_entry;
                    peak = top.salary_expert;
                } else if (typeof top.match === "number") {
                    const factor = top.match / 100;
                    base = Math.round(50 + 40 * factor);
                    peak = Math.round(110 + 60 * factor);
                }

                const subtitleEl = document.getElementById('salarySubtitle');
                if (subtitleEl) {
                    const label = top.career ? " for " + top.career : "";
                    subtitleEl.textContent = "Indicative 5‑year compensation trajectory" + label + " (relative index).";
                }
            }

            const labels = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
            const step = (peak - base) / (labels.length - 1 || 1);
            const values = labels.map((_, idx) => Math.round(base + step * idx));

            if (salaryChart) salaryChart.destroy();

            salaryChart = new Chart(canvas, {
                type: "line",
                data: {
                    labels,
                    datasets: [{
                        data: values,
                        tension: 0.35,
                        borderColor: "rgba(79,70,229,0.9)",
                        backgroundColor: "rgba(79,70,229,0.12)",
                        fill: true,
                        pointRadius: 3,
                        pointBackgroundColor: "#4F46E5"
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: "#0f172a", font: { family: "Plus Jakarta Sans", size: 11 } }
                        },
                        y: {
                            grid: { color: "rgba(148,163,184,0.15)" },
                            ticks: { display: false }
                        }
                    }
                }
            });
        }

        function renderMarket() {
            const predictions = resolvePredictions();
            const top = predictions[0];
            const badge = document.getElementById('marketDemandBadge');
            const bar = document.getElementById('marketDemandBar');
            const text = document.getElementById('marketDemandText');
            if (!badge || !bar || !text) return;

            const level = (top && top.market_demand ? String(top.market_demand) : "High").toLowerCase();
            let label = "Balanced demand";
            let width = "60%";
            let description = "Steady hiring activity expected over the next cycle.";

            if (level.includes("high")) {
                label = "High demand";
                width = "85%";
                description = "Elevated demand across major markets in 2026.";
            } else if (level.includes("low")) {
                label = "Emerging demand";
                width = "40%";
                description = "Niche but growing opportunities for specialists.";
            }

            badge.textContent = label;
            bar.style.width = width;
            text.textContent = description;
        }

        function renderRoadmap() {
            const list = document.getElementById('skillRoadmap');
            if (!list) return;
            list.innerHTML = "";

            const predictions = resolvePredictions();
            const top = predictions[0] || {};
            const skills = Array.isArray(top.skills) && top.skills.length > 0
                ? top.skills.slice(0, 3)
                : [
                    "Solidify core problem‑solving and quantitative skills",
                    "Build a portfolio of projects in this domain",
                    "Target senior roles with mentorship and leadership exposure"
                ];

            skills.forEach(function (skill, index) {
                const li = document.createElement("li");
                li.className = "flex items-center gap-3 flex-1";

                const badge = document.createElement("span");
                badge.className =
                    "inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-600 text-[11px] font-semibold text-white";
                badge.textContent = String(index + 1);

                const label = document.createElement("p");
                label.className = "text-sm sm:text-base text-slate-700";
                label.textContent = skill;

                li.appendChild(badge);
                li.appendChild(label);
                list.appendChild(li);
            });
        }

        function renderCareers() {
            const container = document.getElementById('careerCards');
            if (!container) return;
            container.innerHTML = "";
            const predictions = resolvePredictions();

            predictions.forEach(function (prediction, index) {
                const card = document.createElement("article");
                card.className = "border-b border-slate-100 pb-4 last:border-b-0 last:pb-0";

                const title = document.createElement("h3");
                title.className = "text-base sm:text-lg font-semibold tracking-tight text-slate-900";
                title.textContent = prediction.career;

                const subtitle = document.createElement("p");
                subtitle.className = "mt-1 text-xs text-slate-400";
                subtitle.textContent =
                    "Alignment level · " + (index === 0 ? "Primary" : index === 1 ? "Secondary" : "Supporting");

                const header = document.createElement("div");
                header.appendChild(title);
                header.appendChild(subtitle);

                const matchWrapper = document.createElement("div");
                matchWrapper.className = "flex items-baseline gap-2 text-slate-700 mt-2";

                const matchValue = document.createElement("span");
                matchValue.className = "text-lg font-semibold";
                matchValue.textContent = (prediction.match || 90) + "%";

                const matchLabel = document.createElement("span");
                matchLabel.className = "text-xs text-slate-400";
                matchLabel.textContent = "match strength";

                matchWrapper.appendChild(matchValue);
                matchWrapper.appendChild(matchLabel);

                const actions = document.createElement("div");
                actions.className = "flex gap-2 mt-2";

                const linkedinLink = document.createElement("a");
                linkedinLink.href = "https://www.linkedin.com/jobs/search/?keywords=" +
                    encodeURIComponent(prediction.career + " remote");
                linkedinLink.target = "_blank";
                linkedinLink.rel = "noopener noreferrer";
                linkedinLink.className =
                    "px-4 py-2 rounded-2xl bg-white border border-slate-200 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors";
                linkedinLink.textContent = "View LinkedIn Jobs";

                const fiverrLink = document.createElement("a");
                fiverrLink.href = "https://www.fiverr.com/search/gigs?query=" +
                    encodeURIComponent(prediction.career);
                fiverrLink.target = "_blank";
                fiverrLink.rel = "noopener noreferrer";
                fiverrLink.className =
                    "px-4 py-2 rounded-2xl bg-white border border-slate-200 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors";
                fiverrLink.textContent = "Explore Fiverr Gigs";

                actions.appendChild(linkedinLink);
                actions.appendChild(fiverrLink);

                card.appendChild(header);
                card.appendChild(matchWrapper);
                card.appendChild(actions);

                container.appendChild(card);
            });
        }

        function showDashboard() {
            const overlay = document.getElementById('game-overlay');
            const section = document.getElementById('career-dashboard');
            if (overlay) overlay.classList.add('hidden');
            if (section) section.classList.remove('hidden');

            const nameEl = document.getElementById('dashboardName');
            const emailEl = document.getElementById('dashboardEmail');
            if (nameEl) nameEl.textContent = getDisplayName();
            if (emailEl) emailEl.textContent = getUserEmailSafe();

            renderRadar();
            renderSalary();
            renderMarket();
            renderRoadmap();
            renderCareers();

            const analysisEl = document.getElementById('gamingAnalysisText');
            if (analysisEl && currentGameResults && currentGameResults.scores) {
                const s = currentGameResults.scores;
                const strengths = [];
                if (s.Numerical >= 4) strengths.push("numerical reasoning");
                if (s.Abstract >= 4) strengths.push("abstract pattern recognition");
                if (s.Perceptual >= 4) strengths.push("perceptual speed");
                if (s.C_score >= 4) strengths.push("focus and follow‑through");

                const strengthText = strengths.length
                    ? "Your strongest signals in this run were " + strengths.join(", ") + "."
                    : "Your signals in this run were evenly distributed across traits.";

                analysisEl.textContent =
                    strengthText +
                    " This gaming signature feeds directly into your neural career prediction, weighting fast, accurate decisions more heavily than random clicks.";
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        async function endGame() {
            clearInterval(gameInterval);
            document.getElementById('game-canvas').innerHTML = `
                <div class="text-center">
                    <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check text-indigo-600 text-2xl"></i>
                    </div>
                    <h2 class="text-3xl font-black text-slate-900 mb-2">SESSION COMPLETE</h2>
                    <p class="text-slate-400 uppercase tracking-widest text-xs font-bold">Synchronizing with Neural Cloud...</p>
                </div>`;

            const scores = buildScoresFromGame();
            currentGameResults.scores = scores;

            const payload = { email: userEmail, username: userName, score: currentScore, gameName: gameType, source: "game", traits: scores };

            try {
                await fetch('http://localhost:5000/api/save-game', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                // ignore save errors
            }

            try {
                const res = await fetch('http://127.0.0.1:5001/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scores })
                });
                const data = await res.json();
                currentGameResults.user_traits = data.user_traits || {};
                currentGameResults.predictions = data.predictions || [];

                // Persist game prediction summary to Node backend
                try {
                    const emailFromStorage = window.localStorage ? window.localStorage.getItem('userEmail') : null;
                    if (!emailFromStorage) {
                        alert("Error: User Email not found in LocalStorage!");
                    }

                    const email = userEmail || emailFromStorage || null;
                    const top = (currentGameResults.predictions && currentGameResults.predictions[0]) || null;
                    const predictionCareer = top && top.career ? top.career : null;

                    const dataToSend = {
                        email: email,
                        datetime: new Date().toISOString(),
                        gameName: gameType || null,
                        prediction: predictionCareer
                    };

                    console.log("1. Fetch started for email:", emailFromStorage);
                    console.log("2. Data being sent:", JSON.stringify(dataToSend));

                    (async function () {
                        try {
                            const response = await fetch('http://localhost:5000/api/save-game-prediction', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(dataToSend)
                            });

                            const respJson = await response.json().catch(function () { return null; });
                            console.log("3. Server Response:", respJson);
                        } catch (err) {
                            console.error('Error saving game prediction:', err);
                        }
                    })();
                } catch (persistErr) {
                    console.error('Persistence error (game prediction):', persistErr);
                }

                showDashboard();
            } catch (err) {
                alert("Could not reach career prediction service. Please ensure the Flask API is running on 127.0.0.1:5001.");
            }
        }

        // --- GAME LOGICS (Updated Colors for White Theme) ---

        function startMathChallenge() {
            const canvas = document.getElementById('game-canvas');
            const n1 = Math.floor(Math.random() * 50) + 10;
            const n2 = Math.floor(Math.random() * 50) + 10;
            const sum = n1 + n2;
            canvas.innerHTML = `
                <div class="text-center">
                    <h1 class="text-8xl font-black mb-6 text-slate-900 tracking-tighter">${n1}+${n2}</h1>
                    <input type="number" id="ans" class="game-input text-6xl p-4" autofocus>
                </div>`;
            const input = document.getElementById('ans');
            input.focus();
            input.oninput = () => {
                if(input.value == sum) {
                    currentScore += 5;
                    document.getElementById('live-score').innerText = currentScore;
                    startMathChallenge();
                }
            };
        }

