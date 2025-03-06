document.addEventListener("DOMContentLoaded", () => {
    let chickenCount = 0;
    const chickenDisplay = document.getElementById("chickenCount");
    const chickenButton = document.getElementById("chickenButton");

    // Update the display with the current chicken count
    const updateChickenDisplay = () => {
        chickenDisplay.textContent = chickenCount;
    };

    // Increase the chicken count when the chicken button is clicked
    chickenButton.addEventListener("click", () => {
        chickenCount++;
        updateChickenDisplay();
    });

    // Initial call to set the chicken count
    updateChickenDisplay();
});
