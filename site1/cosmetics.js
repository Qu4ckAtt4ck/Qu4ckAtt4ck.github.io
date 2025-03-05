// cosmetics.js

let purchasedCosmetics = [];

// Function to load the cosmetics inventory
function loadCosmetics() {
  // Load all purchased cosmetics (this can be extended to fetch from a server)
  console.log("Loading cosmetics inventory...");
  console.log(purchasedCosmetics);
}

// Function to purchase a new cosmetic
function purchaseCosmetic(cosmeticName) {
  if (!purchasedCosmetics.includes(cosmeticName)) {
    purchasedCosmetics.push(cosmeticName);
    console.log(`Cosmetic Purchased: ${cosmeticName}`);
    updateCosmeticsMenu();
  }
}

// Function to update the cosmetics menu
function updateCosmeticsMenu() {
  const cosmeticsMenu = document.getElementById('cosmeticsMenu');
  cosmeticsMenu.innerHTML = ''; // Clear current items
  purchasedCosmetics.forEach(cosmetic => {
    const cosmeticItem = document.createElement('div');
    cosmeticItem.classList.add('cosmeticItem');
    cosmeticItem.innerHTML = `<img src="images/${cosmetic}.png" alt="${cosmetic}">`;
    cosmeticsMenu.appendChild(cosmeticItem);
  });
}

// Initialize the cosmetics menu when the page loads
loadCosmetics();
