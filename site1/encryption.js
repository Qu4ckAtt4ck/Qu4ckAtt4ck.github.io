// encryption.js

// AES Encryption and Decryption Key
const secretKey = "mySecretKey";

// Encrypt the game data
function encryptData(data) {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return encryptedData;
}

// Decrypt the game data
function decryptData(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

// Function to save the encrypted game data as a .txt file
function saveGame() {
  const encryptedGameData = encryptData(gameData);
  const blob = new Blob([encryptedGameData], { type: 'text/plain' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'saveFile.txt';
  downloadLink.click();
}

// Function to import and decrypt the save file
function importSaveFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const encryptedData = e.target.result;
    const decryptedData = decryptData(encryptedData);
    console.log("Decrypted Game Data:", decryptedData);
    gameData = decryptedData; // Update the game state with the imported data
    alert("Game Imported Successfully!");
  };

  reader.readAsText(file);
}
