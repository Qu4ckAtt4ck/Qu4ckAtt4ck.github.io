// Define the files to be checked for changes
const filesToCheck = [
    'index.html',
    'scripts/main.js',
    'scripts/shop.js',
    'styles.css',
    'chicken.png'
];

// This will store the initial state (hashes) of the files when first loaded
let initialHashes = {};

// Function to get the file hash
async function getFileHash(fileUrl) {
    try {
        const response = await fetch(fileUrl, { 
            cache: "no-store",
            headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${fileUrl}: ${response.status}`);
        }
        
        const fileBlob = await response.blob();
        const buffer = await fileBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        console.error(`Error getting hash for ${fileUrl}:`, error);
        return null;
    }
}

// Function to show the modal with the file update message
function showUpdateModal(fileName) {
    const modal = document.getElementById('updateModal');
    const modalMessage = document.getElementById('updateMessage');
    modalMessage.textContent = `File updated: ${fileName}\n\nRefresh the page to load the latest version.`;
    modal.style.display = 'block';
}

// Function to check if files have been updated
async function checkForFileChanges() {
    let fileUpdated = false;
    
    for (const file of filesToCheck) {
        try {
            const fileHash = await getFileHash(file);
            
            // Skip if we couldn't get the hash
            if (!fileHash) continue;
            
            // If this is the first time checking this file, just store the hash
            if (!initialHashes[file]) {
                initialHashes[file] = fileHash;
                continue;
            }
            
            // If the file hash is different from the stored one, it means the file has changed
            if (initialHashes[file] !== fileHash) {
                console.log(`File updated: ${file}`);
                showUpdateModal(file);  // Show the modal with the updated file
                fileUpdated = true;
                break; // Only show one update notification at a time
            }
        } catch (error) {
            console.error(`Error checking file: ${file}`, error);
        }
    }

    if (!fileUpdated) {
        console.log('No file updates detected.');
    }
}

// Initial setup: Store the initial hashes of the files when the page first loads
async function initializeFileHashes() {
    for (const file of filesToCheck) {
        try {
            const fileHash = await getFileHash(file);
            if (fileHash) {
                initialHashes[file] = fileHash;
            }
        } catch (error) {
            console.error(`Error initializing file: ${file}`, error);
        }
    }
}

// Wait for page to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize hashes
    initializeFileHashes();
    
    // Set up periodic checks (every 5 minutes)
    setInterval(checkForFileChanges, 5 * 60 * 1000);
});
