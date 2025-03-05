// game.js
class ClickerGame {
    constructor() {
        this.score = 0;
        this.rebirths = 0;
        this.prestiges = 0;
        
        // Initialize the canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;  // Adjust width as necessary
        this.canvas.height = 600; // Adjust height as necessary
        
        // Start the game loop
        this.gameLoop();
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
    
    // Add a basic game loop to render something on the canvas
    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas

        // Draw something on the canvas (e.g., the score)
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('Score: ' + this.score, 10, 50);

        // Call gameLoop again for the next frame
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the game when the page loads
const game = new ClickerGame();

// Event listeners for buttons
document.getElementById('click-btn').addEventListener('click', () => game.click());
document.getElementById('rebirth-btn').addEventListener('click', () => game.rebirth());
document.getElementById('prestige-btn').addEventListener('click', () => game.prestige());
