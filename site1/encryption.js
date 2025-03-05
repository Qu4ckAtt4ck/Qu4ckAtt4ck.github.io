function saveGame() {
    let data = JSON.stringify({ score: game.score, rebirths: game.rebirths, prestiges: game.prestiges });
    let encryptedData = btoa(data); // Basic encryption (can be improved)
    localStorage.setItem('gameSave', encryptedData);
}

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

document.getElementById('save-btn').addEventListener('click', saveGame);
document.getElementById('load-btn').addEventListener('click', loadGame);
