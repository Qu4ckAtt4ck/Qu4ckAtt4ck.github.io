// settings.js

// Open the settings menu
function openSettingsMenu() {
  document.getElementById('settingsMenu').style.display = 'block';
}

// Close the settings menu
function closeSettingsMenu() {
  document.getElementById('settingsMenu').style.display = 'none';
}

// Initialize the settings menu actions
function initializeSettings() {
  const saveButton = document.getElementById('saveGameButton');
  const fileInput = document.getElementById('fileInput');

  saveButton.addEventListener('click', saveGame);
  fileInput.addEventListener('change', importSaveFile);
}

// Initialize the settings when the page loads
initializeSettings();
