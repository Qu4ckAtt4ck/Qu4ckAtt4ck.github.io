// Save the game state to localStorage with encryption
function saveGame() {
    let data = JSON.stringify({
        score: game.score,
        rebirths: game.rebirths,
        prestiges: game.prestiges
    });
    let encryptedData = btoa(data); // Basic encryption (can be improved)
    localStorage.setItem('gameSave', encryptedData);
}

// Load the game state from localStorage with decryption
function loadGame() {
    let encryptedData = localStorage.getItem('gameSave');
    if (encryptedData) {
        let data = JSON.parse(atob(encryptedData));
        game.score = data.score;
        game.rebirths = data.rebirths;
        game.prestiges = data.prestiges;
        game.updateUI();
    }
}

// Event listeners for save and load buttons
document.getElementById('save-game').addEventListener('click', saveGame);
document.getElementById('import-save').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
});

// Handle file import for game save
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                let data = JSON.parse(atob(e.target.result));
                game.score = data.score;
                game.rebirths = data.rebirths;
                game.prestiges = data.prestiges;
                game.updateUI();
            } catch (error) {
                alert('Invalid save file');
            }
        };
        reader.readAsText(file);
    }
});
