let currentQuestion = 0;
let totalScore = 0;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-box");

const questions = document.querySelectorAll(".question-box");

document.getElementById("startBtn").addEventListener("click", () => {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
});

document.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", () => {
        totalScore += Number(btn.dataset.score);

        questions[currentQuestion].classList.add("hidden");
        currentQuestion++;

        if (currentQuestion < questions.length) {
            questions[currentQuestion].classList.remove("hidden");
        } else {
            showResult();
        }
    });
});

function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const percent = Math.round((totalScore / 60) * 100);
    document.getElementById("percentValue").innerText = percent + "%";
    document.getElementById("scoreText").innerText = `You scored ${percent}% match with UI/UX Design`;

    let title = "";
    let message = "";

    if (percent >= 75) {
        title = "Perfect Fit!";
        message = "You are highly suitable for UI/UX Design!";
    } else if (percent >= 50) {
        title = "Good Fit!";
        message = "You can succeed in UI/UX Design with more practice.";
    } else {
        title = "Low Fit";
        message = "UI/UX Design may not match your current strengths.";
    }

    document.getElementById("careerTitle").innerText = title;
    document.getElementById("careerMessage").innerText = message;

    document.getElementById("courseList").innerHTML = `
        <li><a target="_blank" href="https://www.coursera.org/specializations/ux-design">Google UX Design</a></li>
        <li><a target="_blank" href="https://www.udemy.com/course/figma-ux-ui-design/">Figma UI/UX Course</a></li>
        <li><a target="_blank" href="https://www.interaction-design.org/">Interaction Design Foundation</a></li>
        <li><a target="_blank" href="https://www.youtube.com/playlist?list=PLSzsOkUDsvdtl3Pw48C5G0HGVFj9rWw5x">UI/UX Basics (Free)</a></li>
    `;

    document.getElementById("jobList").innerHTML = `
        <li><a target="_blank" href="https://www.linkedin.com/jobs/ui-ux-designer-jobs/">UI/UX Designer Jobs</a></li>
        <li><a target="_blank" href="https://www.indeed.com/q-UI-UX-Designer-jobs.html">Indeed UI/UX Jobs</a></li>
        <li><a target="_blank" href="https://dribbble.com/jobs">Dribbble Design Jobs</a></li>
    `;

    new Chart(document.getElementById("resultChart"), {
        type: "bar",
        data: {
            labels: ["Result"],
            datasets: [{
                label: "Score %",
                data: [percent]
            }]
        }
    });
}
