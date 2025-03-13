// Shop functionality for cosmetic items
class Shop {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.setupShopItems();
    }
    
    setupShopItems() {
        // Red Chicken
        document.getElementById("buyRedChicken").addEventListener("click", () => {
            this.buySkin("red", 100);
        });
        
        // Golden Chicken
        document.getElementById("buyGoldenChicken").addEventListener("click", () => {
            this.buySkin("golden", 1000);
        });
        
        // Rainbow Background
        document.getElementById("buyRainbowBackground").addEventListener("click", () => {
            this.buyBackground("rainbow", 500);
        });
    }
    
    buySkin(skinName, cost) {
        // If already owned
        if (this.game.unlockedSkins.includes(skinName)) {
            this.game.currentChickenSkin = skinName;
            this.game.applySkins();
            alert(`${skinName.charAt(0).toUpperCase() + skinName.slice(1)} chicken skin applied!`);
            return;
        }
        
        // If can afford
        if (this.game.chickens >= cost) {
            this.game.chickens -= cost;
            this.game.unlockedSkins.push(skinName);
            this.game.currentChickenSkin = skinName;
            this.game.applySkins();
            this.game.updateUI();
            alert(`You bought the ${skinName} chicken skin!`);
        } else {
            alert(`Not enough chickens! You need ${cost} chickens.`);
        }
    }
    
    buyBackground(bgName, cost) {
        // If already owned
        if (this.game.unlockedBackgrounds.includes(bgName)) {
            this.game.currentBackground = bgName;
            this.game.applySkins();
            alert(`${bgName.charAt(0).toUpperCase() + bgName.slice(1)} background applied!`);
            return;
        }
        
        // If can afford
        if (this.game.chickens >= cost) {
            this.game.chickens -= cost;
            this.game.unlockedBackgrounds.push(bgName);
            this.game.currentBackground = bgName;
            this.game.applySkins();
            this.game.updateUI();
            alert(`You bought the ${bgName} background!`);
        } else {
            alert(`Not enough chickens! You need ${cost} chickens.`);
        }
    }
}

// Initialize shop when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Create shop instance with the game object
    window.gameShop = new Shop(game);
});
