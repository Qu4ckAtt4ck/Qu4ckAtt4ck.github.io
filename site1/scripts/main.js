document.addEventListener("DOMContentLoaded", () => {
    let chickenCount = 0;
    const chickenDisplay = document.getElementById("chickenCount");
    const chickenButton = document.getElementById("chickenButton");

    chickenButton.addEventListener("click", () => {
        chickenCount++;
        chickenDisplay.textContent = chickenCount;
    });

    // Initialize shop
    if (typeof setupShop === "function") {
        setupShop(chickenCount, (cost) => {
            if (chickenCount >= cost) {
                chickenCount -= cost;
                chickenDisplay.textContent = chickenCount;
                return true;
            }
            return false;
        });
    }
});
