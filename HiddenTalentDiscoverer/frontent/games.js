// ==== GAME CARD SMOOTH ENTRANCE ANIMATION ====

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".game-card");

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 200); // each card after 0.2 sec
    });
});
