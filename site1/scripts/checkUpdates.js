// Function to generate the SHA-256 hash of a string
async function generateSHA256Hash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Function to fetch file content (you can adjust the URL for your specific files)
async function fetchFileContent(url) {
    const response = await fetch(url);
    if (response.ok) {
        return await response.text();
    }
    return null;
}

// Function to fetch image file content and convert to base64 (used for chicken.png)
async function fetchImageContent(url) {
    const response = await fetch(url);
    if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    return null;
}

// Function to check if any of the files have changed
async function checkForFileChanges() {
    const files = [
        { url: '../index.html', isImage: false }, // Relative path from /scripts
        { url: '../chicken.png', isImage: true }, // Relative path from /scripts
        { url: '../styles.css', isImage: false }, // Relative path from /scripts
        { url: 'main.js', isImage: false }, // Current file itself
        { url: 'shop.js', isImage: false } // Current file itself
    ];

    let changedFiles = [];
    for (let file of files) {
        const fileUrl = file.url;
        const previousHash = localStorage.getItem(`previousHash-${fileUrl}`);

        let currentContent = file.isImage ? await fetchImageContent(fileUrl) : await fetchFileContent(fileUrl);

        if (currentContent) {
            const currentHash = await generateSHA256Hash(currentContent);

            // Compare the current hash with the saved one
            if (previousHash && previousHash !== currentHash) {
                changedFiles.push(fileUrl);
                console.log(`${fileUrl} has changed!`);
            }

            // Save the current hash to localStorage for future comparison
            localStorage.setItem(`previousHash-${fileUrl}`, currentHash);
        } else {
            console.error(`Failed to load the file: ${fileUrl}`);
        }
    }

    if (changedFiles.length > 0) {
        showUpdateModal(changedFiles);
    }
}

// Function to show the update modal with the list of updated files
function showUpdateModal(updatedFiles) {
    const updateList = document.getElementById("updateList");
    updateList.innerHTML = ''; // Clear any existing content
    updatedFiles.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = `${file} has been updated.`;
        updateList.appendChild(listItem);
    });

    const modal = document.getElementById("updateModal");
    modal.style.display = "block";

    // Close the modal when the close button is clicked
    const closeBtn = document.getElementById("closeModalBtn");
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside the modal content
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

// Run the check when the page loads
window.onload = () => {
    checkForFileChanges();
};

