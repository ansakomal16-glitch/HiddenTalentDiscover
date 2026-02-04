let currentQuestion = 0;
let totalScore = 0;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-box");

const questions = document.querySelectorAll(".question-box");
const nextBtn = document.getElementById("nextBtn");

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
    document.getElementById("scoreText").innerText = `You scored ${percent}% match with Software Engineering`;

    // TEXT RESULT
    let title = "";
    let message = "";

    if (percent >= 75) {
        title = "Perfect Fit!";
        message = "You are highly suitable for Software Engineering!";
    } else if (percent >= 50) {
        title = "Good Fit!";
        message = "You can do well in Software Engineering with some improvement.";
    } else {
        title = "Low Fit";
        message = "Software Engineering might not fully match your strengths.";
    }

    document.getElementById("careerTitle").innerText = title;
    document.getElementById("careerMessage").innerText = message;

    // COURSES
    document.getElementById("courseList").innerHTML = `
        <li><a target="_blank" href="https://www.udemy.com/course/the-complete-web-development-bootcamp/">Complete Web Dev Bootcamp</a></li>
        <li><a target="_blank" href="https://www.udacity.com/course/software-development-process--ud805">Software Development Process</a></li>
        <li><a target="_blank" href="https://www.coursera.org/specializations/software-design-architecture">Software Design & Architecture</a></li>
        <li><a target="_blank" href="https://www.edx.org/learn/java">Java Programming</a></li>
    `;

    // JOBS
    document.getElementById("jobList").innerHTML = `
        <li><a target="_blank" href="https://www.linkedin.com/jobs/software-engineer-jobs/">Software Engineer Jobs</a></li>
        <li><a target="_blank" href="https://www.indeed.com/q-Software-Developer-jobs.html">Software Developer Jobs</a></li>
        <li><a target="_blank" href="https://www.glassdoor.com/Job/software-engineer-jobs-SRCH_KO0,17.htm">Software Engineering Opportunities</a></li>
    `;

    // GRAPH
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
