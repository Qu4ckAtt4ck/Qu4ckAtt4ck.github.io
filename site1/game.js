class ClickerGame {
    constructor() {
        this.score = 0;
        this.rebirths = 0;
        this.prestiges = 0;
    }
    
    click() {
        this.score++;
        this.updateUI();
    }
    
    rebirth() {
        let cost = Math.pow(10, this.rebirths + 1);
        if (this.score >= cost) {
            this.score = 0;
            this.rebirths++;
            this.updateUI();
        }
    }
    
    prestige() {
        let cost = Math.pow(10, this.prestiges + 1);
        if (this.rebirths >= cost) {
            this.rebirths = 0;
            this.prestiges++;
            this.updateUI();
        }
    }
    
    updateUI() {
        document.getElementById('score').innerText = this.score;
        document.getElementById('rebirths').innerText = this.rebirths;
        document.getElementById('prestiges').innerText = this.prestiges;
    }
}

const game = new ClickerGame();

document.getElementById('click-btn').addEventListener('click', () => game.click());
