document.addEventListener('DOMContentLoaded', function () {
    // Load theme preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').checked = true;
    }
    
    // Theme toggle event listener
    document.getElementById('theme-toggle').addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('darkMode', 'false');
        }
    });
    
    // Add event listener for Enter key in the prompt input
    document.getElementById('promptInput').addEventListener('keydown', function(event) {
        // Check if the Enter key was pressed without Shift
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default action (new line)
            generateImage(); // Call the generate function
        }
    });
});

function autoGrowTextBox(element) {
    element.style.height = "auto"; 
    element.style.height = (element.scrollHeight) + "px";
    // Cap the height
    if (parseInt(element.style.height) > 200) {
        element.style.height = "200px";
        element.style.overflowY = "auto";
    } else {
        element.style.overflowY = "hidden";
    }
}

function generateImage() {
    const prompt = document.getElementById('promptInput').value.trim();
    
    if (!prompt) {
        showToast("Please enter a prompt to generate an image");
        return;
    }
    
    // Hide placeholder and show loading indicator
    document.getElementById('placeholderContainer').style.display = 'none';
    document.getElementById('loadingIndicator').classList.remove('hidden');
    document.getElementById('resultContainer').classList.add('hidden');
    
    // Make request to backend
    fetch('/generate_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading indicator
        document.getElementById('loadingIndicator').classList.add('hidden');
        
        if (data.success) {
            // Show result
            document.getElementById('resultContainer').classList.remove('hidden');
            
            // Create an image with the watermark area cropped
            const imageUrl = data.imageUrl + '/image';
            const imageViewer = document.getElementById('imageViewer');
            
            imageViewer.innerHTML = `
                <div class="glowing-border-wrap">
                    <div class="cropped-image-container">
                        <img src="${imageUrl}" alt="${prompt}" class="cropped-image">
                    </div>
                </div>
            `;
            
            document.getElementById('promptText').textContent = data.prompt;
            
            // Store current image URL for download
            localStorage.setItem('currentImageUrl', imageUrl);
        } else {
            showToast("Error: " + data.error);
        }
    })
    .catch(error => {
        document.getElementById('loadingIndicator').classList.add('hidden');
        showToast("An error occurred: " + error.message);
    });
}

function downloadImage() {
    const imageUrl = localStorage.getItem('currentImageUrl');
    if (!imageUrl) {
        showToast("No image to download");
        return;
    }
    
    // Open a new window to the image URL
    window.open(imageUrl, '_blank');
    
    showToast("Image opened in a new tab. Right-click and select 'Save image as...' to download.");
}

function showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.className = "toast show";
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}
