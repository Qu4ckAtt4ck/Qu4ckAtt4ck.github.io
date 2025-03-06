class Game {
    constructor() {
        this.chickens = 0;
        this.premiumChickens = 0;
        this.clickPower = 1;
        this.autoClickers = 0;
        this.offlineEarningsMultiplier = 1;
        this.autoClickerCost = 10;
        this.clickUpgradeCost = 50;
        this.prestigeCost = 100;
        this.rebirthCost = 500;
        this.rebirthCount = 0;
        this.prestigeCount = 0;
        this.offlineEarningsUpgradeCost = 200;
    }

    updateUI() {
        document.getElementById("chickens").textContent = `Chickens: ${this.chickens}`;
        document.getElementById("premiumChickens").textContent = `Premium Chickens: ${this.premiumChickens}`;
        document.getElementById("clickPower").textContent = `Click Power: ${this.clickPower}`;
        document.getElementById("autoClickers").textContent = `Auto Clickers: ${this.autoClickers}`;
        document.getElementById("offlineEarningsMultiplier").textContent = `Offline Earnings Multiplier: ${this.offlineEarningsMultiplier}`;
        
        // Update the costs
        document.getElementById("autoClickerCost").textContent = `Auto Clicker Cost: ${this.autoClickerCost}`;
        document.getElementById("clickUpgradeCost").textContent = `Click Upgrade Cost: ${this.clickUpgradeCost}`;
        document.getElementById("prestigeCost").textContent = `Prestige Cost: ${this.prestigeCost}`;
        document.getElementById("rebirthCost").textContent = `Rebirth Cost: ${this.rebirthCost}`;
        document.getElementById("offlineEarningsUpgradeCost").textContent = `Offline Earnings Upgrade Cost: ${this.offlineEarningsUpgradeCost}`;
    }

    // Offline Earnings Upgrade
    buyOfflineEarningsUpgrade() {
        if (this.chickens >= this.offlineEarningsUpgradeCost) {
            this.chickens -= this.offlineEarningsUpgradeCost;
            this.offlineEarningsMultiplier *= 1.5; // Increase offline earnings by 50%
            this.offlineEarningsUpgradeCost = Math.floor(this.offlineEarningsUpgradeCost * 1.2); // Increase the cost for next upgrade
            this.updateUI();
        }
    }

    buyAutoClicker() {
        if (this.chickens >= this.autoClickerCost) {
            this.chickens -= this.autoClickerCost;
            this.autoClickers++;
            this.autoClickerCost = Math.floor(this.autoClickerCost * 1.1); // Increase cost for next auto clicker
            this.updateUI();
        }
    }

    buyClickUpgrade() {
        if (this.chickens >= this.clickUpgradeCost) {
            this.chickens -= this.clickUpgradeCost;
            this.clickPower++;
            this.clickUpgradeCost = Math.floor(this.clickUpgradeCost * 1.2); // Increase cost for next upgrade
            this.updateUI();
        }
    }

    prestige() {
        if (this.chickens >= this.prestigeCost) {
            this.chickens = 0;
            this.premiumChickens++;
            this.prestigeCount++;
            this.prestigeCost = Math.floor(this.prestigeCost * 1.5); // Increase prestige cost
            this.updateUI();
        }
    }

    rebirth() {
        if (this.chickens >= this.rebirthCost) {
            this.chickens = 0;
            this.rebirthCount++;
            this.rebirthCost = Math.floor(this.rebirthCost * 2); // Increase rebirth cost
            this.updateUI();
        }
    }

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

const game = new Game();
game.loadGame();

// Button Click Handlers
document.getElementById("buyAutoClicker").onclick = () => game.buyAutoClicker();
document.getElementById("buyClickUpgrade").onclick = () => game.buyClickUpgrade();
document.getElementById("prestige").onclick = () => game.prestige();
document.getElementById("rebirth").onclick = () => game.rebirth();
document.getElementById("buyOfflineEarningsUpgrade").onclick = () => game.buyOfflineEarningsUpgrade();

// Settings Modal
document.getElementById("settingsButton").onclick = () => {
    document.getElementById("settingsModal").style.display = "block";
};
document.getElementById("closeSettings").onclick = () => {
    document.getElementById("settingsModal").style.display = "none";
};

// Shop Modal
document.getElementById("shopButton").onclick = () => {
    document.getElementById("shopModal").style.display = "block";
};
document.getElementById("closeShop").onclick = () => {
    document.getElementById("shopModal").style.display = "none";
};
