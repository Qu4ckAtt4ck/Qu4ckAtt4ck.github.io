/* General Styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

#game-container {
    position: relative;
}

canvas {
    border: 2px solid #000;
}

/* Top-right buttons */
#top-right-buttons {
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
}

button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #45a049;
}

/* Popup Menus */
.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: none;
    z-index: 10;
    width: 300px;
    border-radius: 10px;
    text-align: center;
}

.popup h2 {
    margin-bottom: 20px;
}

.close-button {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
}

.close-button:hover {
    background-color: #cc0000;
}

/* Inventory and other cosmetic elements */
#inventory {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}
