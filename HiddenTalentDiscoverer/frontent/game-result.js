document.addEventListener("DOMContentLoaded", () => {

    // SAFE LOAD (NO CRASH)
    let data = JSON.parse(localStorage.getItem("gameResult")) || {};

    let accuracy = Number(data.accuracy) || 0;
    let speed = Number(localStorage.getItem("speed")) || 0;
    let career = data.career || "N/A";

    // UI UPDATE
    document.getElementById("career").innerText = "Career: " + career;
    document.getElementById("accuracy").innerText = "Accuracy: " + accuracy + "%";

    // Canvas check
    const canvas = document.getElementById("chart");

    if (!canvas) {
        console.log("Chart canvas missing");
        return;
    }

    const ctx = canvas.getContext("2d");

    // CLEAN CHART (NO DUPLICATE LOGIC)
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Accuracy", "Speed"],
            datasets: [{
                label: "Performance Score",
                data: [accuracy, speed],
                backgroundColor: ["#4CAF50", "#2196F3"]
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1200
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
        
    });

});