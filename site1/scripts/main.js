// Export game data as a file
    exportGame() {
        const gameData = {
            chickens: this.chickens,
            premiumChickens: this.premiumChickens,
            clickPower: this.clickPower,
            autoClickers: this.autoClickers,
            offlineEarningsMultiplier: this.offlineEarningsMultiplier,
            autoClickerCost: this.autoClickerCost,
            clickUpgradeCost: this.clickUpgradeCost,
            prestigeCost: this.prestigeCost,
            rebirthCost: this.rebirthCost,
            rebirthCount: this.rebirthCount,
            prestigeCount: this.prestigeCount,
            offlineEarningsUpgradeCost: this.offlineEarningsUpgradeCost,
            lastSaveTime: Date.now(),
            currentChickenSkin: this.currentChickenSkin,
            currentBackground: this.currentBackground,
            unlockedSkins: this.unlockedSkins,
            unlockedBackgrounds: this.unlockedBackgrounds
        };
        
        const dataStr = JSON.stringify(gameData);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileName = 'chicken_clicker_save_' + new Date().toISOString().slice(0, 10) + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
    }
    
    // Import game from a file
    importGame(fileContent) {
        try {
            const gameData = JSON.parse(fileContent);
            
            // Validate that this is actually game data
            if (gameData.chickens === undefined || gameData.clickPower === undefined) {
                throw new Error("Invalid save file");
            }
            
            // Load the data
            this.chickens = gameData.chickens || 0;
            this.premiumChickens = gameData.premiumChickens || 0;
            this.clickPower = gameData.clickPower || 1;
            this.autoClickers = gameData.autoClickers || 0;
            this.offlineEarningsMultiplier = gameData.offlineEarningsMultiplier || 1;
            this.autoClickerCost = gameData.autoClickerCost || 10;
            this.clickUpgradeCost = gameData.clickUpgradeCost || 50;
            this.prestigeCost = gameData.prestigeCost || 1000;
            this.rebirthCost = gameData.rebirthCost || 10;
            this.rebirthCount = gameData.rebirthCount || 0;
            this.prestigeCount = gameData.prestigeCount || 0;
            this.offlineEarningsUpgradeCost = gameData.offlineEarningsUpgradeCost || 100;
            this.lastSaveTime = Date.now(); // Always use current time to prevent offline earnings abuse
            this.currentChickenSkin = gameData.currentChickenSkin || "default";
            this.currentBackground = gameData.currentBackground || "default";
            this.unlockedSkins = gameData.unlockedSkins || ["default"];
            this.unlockedBackgrounds = gameData.unlockedBackgrounds || ["default"];
            
            this.updateUI();
            this.applySkins();
            alert("Game imported successfully!");
            return true;
        } catch (e) {
            console.error("Failed to import game:", e);
            alert("Failed to import game: " + e.message);
            return false;
        }
    }
    
    // Apply visual customizations
    applySkins() {
        const chickenImage = document.getElementById("chickenImage");
        
        // Apply chicken skin
        switch(this.currentChickenSkin) {
            case "red":
                chickenImage.style.filter = "hue-rotate(330deg)";
                break;
            case "golden":
                chickenImage.style.filter = "sepia(100%) hue-rotate(10deg) saturate(1000%)";
                break;
            default:
                chickenImage.style.filter = "none";
        }
        
        // Apply background
        switch(this.currentBackground) {
            case "rainbow":
                document.body.style.background = "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)";
                break;
            default:
                document.body.style.background = "#2f2f2f";
        }
    }
    
    // For auto clickers to work
    autoClickerTick() {
        if (this.autoClickers > 0) {
            this.chickens += this.autoClickers;
            this.updateUI();
        }
    }
}

// Instantiate the game and load saved data
const game = new Game();
game.loadGame();

// Set up the auto clicker interval
setInterval(() => {
    game.autoClickerTick();
}, 1000);

// Chicken clicking
document.getElementById("chickenImage").addEventListener("click", () => game.clickChicken());

// Button Click Handlers with Event Listeners
document.getElementById("buyAutoClicker").addEventListener("click", () => game.buyAutoClicker());
document.getElementById("buyClickUpgrade").addEventListener("click", () => game.buyClickUpgrade());
document.getElementById("prestige").addEventListener("click", () => game.prestige());
document.getElementById("rebirth").addEventListener("click", () => game.rebirth());
document.getElementById("buyOfflineEarningsUpgrade").addEventListener("click", () => game.buyOfflineEarningsUpgrade());

// Settings Modal
document.getElementById("settingsButton").addEventListener("click", () => {
    document.getElementById("settingsModal").style.display = "block";
});
document.getElementById("closeSettings").addEventListener("click", () => {
    document.getElementById("settingsModal").style.display = "none";
});

// Shop Modal
document.getElementById("shopButton").addEventListener("click", () => {
    document.getElementById("shopModal").style.display = "block";
});
document.getElementById("closeShop").addEventListener("click", () => {
    document.getElementById("shopModal").style.display = "none";
});

// Update Modal
document.getElementById("closeUpdateModal").addEventListener("click", () => {
    document.getElementById("updateModal").style.display = "none";
});

// Settings buttons
document.getElementById("saveGameBtn").addEventListener("click", () => {
    if (game.saveGame()) {
        alert("Game saved successfully!");
    } else {
        alert("Failed to save game. Local storage may be disabled or full.");
    }
});

document.getElementById("resetGameBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset your game? All progress will be lost!")) {
        game.resetGame();
        localStorage.removeItem('chickenClickerSave');
        alert("Game reset successfully!");
    }
});

document.getElementById("exportGameBtn").addEventListener("click", () => {
    game.exportGame();
});

document.getElementById("importGameBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("loadGameFile");
    if (fileInput.files.length === 0) {
        alert("Please select a save file first.");
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        game.importGame(event.target.result);
    };
    
    reader.readAsText(file);
});

// Periodically save game data every 30 seconds
setInterval(() => {
    game.saveGame();
}, 30000);
