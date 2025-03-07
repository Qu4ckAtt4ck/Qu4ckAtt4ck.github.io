class Game {
    constructor() {
        // Initialize game variables
        this.chickens = 0;
        this.premiumChickens = 0;
        this.clickPower = 1;
        this.autoClickers = 0;
        this.offlineEarningsMultiplier = 1;
        this.autoClickerCost = 10;
        this.clickUpgradeCost = 50;
        this.prestigeCost = 1000;
        this.rebirthCost = 10;
        this.rebirthCount = 0;
        this.prestigeCount = 0;
        this.offlineEarningsUpgradeCost = 100;
    }

    // Function to update the UI with current game data
    updateUI() {
        const chickensElem = document.getElementById("chickens");
        if (chickensElem) chickensElem.textContent = `Chickens: ${this.chickens}`;

        const premiumElem = document.getElementById("premiumChickens");
        if (premiumElem) premiumElem.textContent = `Premium Chickens: ${this.premiumChickens}`;

        const clickPowerElem = document.getElementById("clickPower");
        if (clickPowerElem) clickPowerElem.textContent = `Click Power: ${this.clickPower}`;

        const autoClickersElem = document.getElementById("autoClickers");
        if (autoClickersElem) autoClickersElem.textContent = `Auto Clickers: ${this.autoClickers}`;

        const offlineMultElem = document.getElementById("offlineEarningsMultiplier");
        if (offlineMultElem) offlineMultElem.textContent = `Offline Earnings Multiplier: ${this.offlineEarningsMultiplier}`;

        // Update cost labels if they exist
        this.updateCostText();
    }

    // Function to dynamically update cost labels for upgrades
    updateCostText() {
        const autoClickerCostElem = document.getElementById("autoClickerCost");
        if (autoClickerCostElem) autoClickerCostElem.textContent = `Auto Clicker Cost: ${this.autoClickerCost} chickens`;

        const clickUpgradeCostElem = document.getElementById("clickUpgradeCost");
        if (clickUpgradeCostElem) clickUpgradeCostElem.textContent = `Click Upgrade Cost: ${this.clickUpgradeCost} chickens`;

        const prestigeCostElem = document.getElementById("prestigeCost");
        if (prestigeCostElem) prestigeCostElem.textContent = `Prestige Cost: ${this.prestigeCost} chickens`;

        const rebirthCostElem = document.getElementById("rebirthCost");
        if (rebirthCostElem) rebirthCostElem.textContent = `Rebirth Cost: ${this.rebirthCost} Prestiges`;

        const offlineEarningsUpgradeCostElem = document.getElementById("offlineEarningsUpgradeCost");
        if (offlineEarningsUpgradeCostElem) offlineEarningsUpgradeCostElem.textContent = `Offline Earnings Upgrade Cost: ${this.offlineEarningsUpgradeCost} chickens`;
    }

    // Function to "click" and add chickens
    clickChicken() {
        this.chickens += this.clickPower;
        this.updateUI();
    }

    // Buy offline earnings upgrade
    buyOfflineEarningsUpgrade() {
        if (this.chickens >= this.offlineEarningsUpgradeCost) {
            this.chickens -= this.offlineEarningsUpgradeCost;
            this.offlineEarningsMultiplier *= 1.5; // Increase offline earnings by 50%
            this.offlineEarningsUpgradeCost = Math.floor(this.offlineEarningsUpgradeCost * 1.2); // Increase next upgrade cost
            this.updateUI();
        }
    }

    // Buy an auto-clicker
    buyAutoClicker() {
        if (this.chickens >= this.autoClickerCost) {
            this.chickens -= this.autoClickerCost;
            this.autoClickers++;
            this.autoClickerCost = Math.floor(this.autoClickerCost * 1.1); // Increase next auto-clicker cost
            this.updateUI();
        }
    }

    // Buy a click upgrade
    buyClickUpgrade() {
        if (this.chickens >= this.clickUpgradeCost) {
            this.chickens -= this.clickUpgradeCost;
            this.clickPower++;
            this.clickUpgradeCost = Math.floor(this.clickUpgradeCost * 1.2); // Increase next click upgrade cost
            this.updateUI();
        }
    }

    // Prestige function
    prestige() {
        if (this.chickens >= this.prestigeCost) {
            this.chickens = 0; // Reset chickens count
            this.premiumChickens++; // Increment premium chickens
            this.prestigeCount++;
            this.prestigeCost = Math.floor(this.prestigeCost * 1.5); // Increase next prestige cost
            this.updateUI();
        }
    }

    // Rebirth function
    rebirth() {
        if (this.prestigeCount >= this.rebirthCost) {
            this.chickens = 0; // Reset chickens count
            this.rebirthCount++;
            this.rebirthCost = Math.floor(this.rebirthCost * 2); // Increase next rebirth cost
            this.updateUI();
        }
    }

    // Save the current game state to localStorage
    saveGame() {
        const gameData = {
            chickens: this.chickens,
            premiumChickens: this.premiumChickens,
            clickPower: this.clickPower,
            autoClickers: this.autoClickers,
            offlineEarningsMultiplier: this.offlineEarningsMultiplier,
            autoClickerCost: this.autoClickerCost,
            clickUpgradeCost: this.clickUpgradeCost,
            prestigeCost: this.prestigeCost,
            rebirthCount: this.rebirthCount,
            prestigeCount: this.prestigeCount,
            offlineEarningsUpgradeCost: this.offlineEarningsUpgradeCost,
        };
        localStorage.setItem('chickenClickerSave', JSON.stringify(gameData));
    }

    // Load the saved game state from localStorage
    loadGame() {
        const savedGame = localStorage.getItem('chickenClickerSave');
        if (savedGame) {
            try {
                const gameData = JSON.parse(savedGame);
                this.chickens = gameData.chickens;
                this.premiumChickens = gameData.premiumChickens;
                this.clickPower = gameData.clickPower;
                this.autoClickers = gameData.autoClickers;
                this.offlineEarningsMultiplier = gameData.offlineEarningsMultiplier;
                this.autoClickerCost = gameData.autoClickerCost;
                this.clickUpgradeCost = gameData.clickUpgradeCost;
                this.prestigeCost = gameData.prestigeCost;
                this.rebirthCount = gameData.rebirthCount;
                this.prestigeCount = gameData.prestigeCount;
                this.offlineEarningsUpgradeCost = gameData.offlineEarningsUpgradeCost;
                this.updateUI();
            } catch (e) {
                console.error("Failed to load saved game:", e);
                this.resetGame();
            }
        } else {
            this.resetGame();
        }
    }

    // Reset the game to its initial state
    resetGame() {
        this.chickens = 0;
        this.premiumChickens = 0;
        this.clickPower = 1;
        this.autoClickers = 0;
        this.offlineEarningsMultiplier = 1;
        this.autoClickerCost = 10;
        this.clickUpgradeCost = 50;
        this.prestigeCost = 1000;
        this.rebirthCost = 10;
        this.rebirthCount = 0;
        this.prestigeCount = 0;
        this.offlineEarningsUpgradeCost = 100;
        this.updateUI();
    }
}

// Instantiate the game and load saved data
const game = new Game();
game.loadGame();

// Button Click Handlers with Event Listeners
document.getElementById("buyAutoClicker").addEventListener("click", () => game.buyAutoClicker());
document.getElementById("buyClickUpgrade").addEventListener("click", () => game.buyClickUpgrade());
document.getElementById("prestige").addEventListener("click", () => game.prestige());
document.getElementById("rebirth").addEventListener("click", () => game.rebirth());
document.getElementById("buyOfflineEarningsUpgrade").addEventListener("click", () => game.buyOfflineEarningsUpgrade());
document.getElementById("clickChicken").addEventListener("click", () => game.clickChicken());

// Modal Handling
document.getElementById("settingsButton").addEventListener("click", () => {
    document.getElementById("settingsModal").style.display = "block";
});
document.getElementById("closeSettings").addEventListener("click", () => {
    document.getElementById("settingsModal").style.display = "none";
});
document.getElementById("shopButton").addEventListener("click", () => {
    document.getElementById("shopModal").style.display = "block";
});
document.getElementById("closeShop").addEventListener("click", () => {
    document.getElementById("shopModal").style.display = "none";
});

// Periodically save game data every 10 seconds (to prevent data loss)
setInterval(() => {
    game.saveGame();
}, 10000);
