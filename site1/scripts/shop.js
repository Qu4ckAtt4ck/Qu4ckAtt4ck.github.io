function setupShop(getChickens, spendChickens) {
    const shop = document.getElementById("shop");

    const items = [
        {
            name: "Auto Clicker", 
            cost: 10, 
            effect: () => setInterval(() => increaseChickens(1), 1000)
        },
        {
            name: "Bigger Chickens", 
            cost: 50, 
            effect: () => alert("Your chickens are now bigger!")
        }
    ];

    items.forEach(item => {
        const button = document.createElement("button");
        button.textContent = `${item.name} - ${item.cost} Chickens`;
        button.addEventListener("click", () => {
            if (spendChickens(item.cost)) {
                item.effect();
            } else {
                alert("Not enough chickens!");
            }
        });
        shop.appendChild(button);
    });

    function increaseChickens(amount) {
        getChickens.value += amount;
        document.getElementById("chickenCount").textContent = getChickens.value;
    }
}
