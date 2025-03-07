// Define the files to be checked for changes
const filesToCheck = [
    'index.html',         // Adding index.html to the list
    'scripts/main.js',
    'scripts/shop.js',
    'styles.css',
    'chicken.png'
];

// This will store the initial state (hashes) of the files when first loaded
let initialHashes = {};

// Function to get the file hash
async function getFileHash(fileUrl) {
    const response = await fetch(fileUrl, { cache: "no-store" });
    const fileBlob = await response.blob();
    const buffer = await fileBlob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Function to show the modal with the file update message
function showUpdateModal(fileName) {
    const modal = document.getElementById('updateModal');
    const modalMessage = document.getElementById('updateMessage');
    modalMessage.textContent = `File updated: ${fileName}`;
    modal.style.display = 'block';
}

// Function to check if files have been updated
async function checkForFileChanges() {
    let fileUpdated = false;
    
    for (const file of filesToCheck) {
        try {
            const fileHash = await getFileHash(file);
            
            // If the file hash is different from the stored one, it means the file has changed
            if (initialHashes[file] && initialHashes[file] !== fileHash) {
                console.log(`File updated: ${file}`);
                showUpdateModal(file);  // Show the modal with the updated file
                fileUpdated = true;
            }
            
            // Store the new hash for the file
            initialHashes[file] = fileHash;
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
            initialHashes[file] = fileHash;
        } catch (error) {
            console.error(`Error initializing file: ${file}`, error);
        }
    }

    // Now that the initial hashes are stored, check for file updates
    checkForFileChanges();
}

// Call the initialization function on page load/reload
initializeFileHashes();
