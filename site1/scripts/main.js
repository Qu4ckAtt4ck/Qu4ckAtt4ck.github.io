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
        document.getElementById("chickens").textContent = `Chickens: ${this.chickens}`;
        document.getElementById("premiumChickens").textContent = `Premium Chickens: ${this.premiumChickens}`;
        document.getElementById("clickPower").textContent = `Click Power: ${this.clickPower}`;
        document.getElementById("autoClickers").textContent = `Auto Clickers: ${this.autoClickers}`;
        document.getElementById("offlineEarningsMultiplier").textContent = `Offline Earnings Multiplier: ${this.offlineEarningsMultiplier}`;
        
        // Dynamically update the cost labels
        this.updateCostText();
    }

    // Function to dynamically update cost labels for upgrades
    updateCostText() {
        document.getElementById("autoClickerCost").textContent = `Auto Clicker Cost: ${this.autoClickerCost} chickens`;
        document.getElementById("clickUpgradeCost").textContent = `Click Upgrade Cost: ${this.clickUpgradeCost} chickens`;
        document.getElementById("prestigeCost").textContent = `Prestige Cost: ${this.prestigeCost} chickens`;
        document.getElementById("rebirthCost").textContent = `Rebirth Cost: ${this.rebirthCost} Prestiges`;
        document.getElementById("offlineEarningsUpgradeCost").textContent = `Offline Earnings Upgrade Cost: ${this.offlineEarningsUpgradeCost} chickens`;
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
        }
    }
}

// Instantiate the game and load saved data
const game = new Game();
game.loadGame();

// Button Click Handlers
document.getElementById("buyAutoClicker").onclick = () => game.buyAutoClicker();
document.getElementById("buyClickUpgrade").onclick = () => game.buyClickUpgrade();
document.getElementById("prestige").onclick = () => game.prestige();
document.getElementById("rebirth").onclick = () => game.rebirth();
document.getElementById("buyOfflineEarningsUpgrade").onclick = () => game.buyOfflineEarningsUpgrade();
document.getElementById("clickChicken").onclick = () => game.clickChicken(); // Add this line for the clickChicken button

// Settings Modal Handling
document.getElementById("settingsButton").onclick = () => {
    document.getElementById("settingsModal").style.display = "block";
};
document.getElementById("closeSettings").onclick = () => {
    document.getElementById("settingsModal").style.display = "none";
};

// Shop Modal Handling
document.getElementById("shopButton").onclick = () => {
    document.getElementById("shopModal").style.display = "block";
};
document.getElementById("closeShop").onclick = () => {
    document.getElementById("shopModal").style.display = "none";
};

// Periodically save game data every 10 seconds (to prevent data loss)
setInterval(() => {
    game.saveGame();
}, 10000); // Save every 10 seconds
