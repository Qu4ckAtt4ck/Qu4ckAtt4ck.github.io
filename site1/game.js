// game.js

let gameData = {
  playerName: "Player1",
  level: 5,
  score: 1200,
  cosmetics: [] // Track purchased cosmetics
};

// This function initializes the game with the default values.
function initializeGame() {
  loadGame();
}

// Example of loading the game
function loadGame() {
  // This would normally retrieve data from a server or local storage
  console.log("Loading game...", gameData);
}

// A function to simulate the player gaining score or leveling up
function updateGameData(newLevel, newScore) {
  gameData.level = newLevel;
  gameData.score = newScore;
  console.log("Game Data Updated: ", gameData);
}

// Call the initializeGame function on page load
initializeGame();
