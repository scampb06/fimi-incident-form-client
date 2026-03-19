/**
 * Image Handling Module
 * Handles image upload, processing, and preview functionality
 */

// Trigger file picker for logo upload
function triggerFilePicker() {
    document.getElementById('logoFileInput').click();
}

// Upload and process image for logo cell
async function previewImage(event) {
    const input = event.target;
    const file = input.files[0];
    const messageDiv = document.getElementById("logo-message");

    // Check MIME types supported by Word
    const allowedTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"];
    if (!file || !allowedTypes.includes(file.type)) {
        console.log("File is invalid or type not allowed");
        messageDiv.textContent = "Please upload a JPEG, PNG, BMP, or GIF image.";
        return;
    }

    // Clear logo-message after successful validation
    messageDiv.textContent = "";
    
    const arrayBuffer = await file.arrayBuffer();

    // Create a FileReader to read the file
    const reader = new FileReader();
    reader.onload = function (e) {
        // Create an image element to preview the uploaded image
        const img = document.getElementById("imagePreview");
        img.src = e.target.result;

        // Create a temporary image to get dimensions and maintain aspect ratio                
        const tempImg = new window.Image();
        tempImg.onload = function() {
            const scale = 0.5; // Adjust the scale as needed
            imagelogo = new docx.ImageRun({
                data: arrayBuffer,
                transformation: {
                    width: tempImg.width * scale,
                    height: tempImg.height * scale
                },
            });
        };
        tempImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Initialize image handling functionality
function initializeImageHandling() {
    // Set up file input event listener
    const logoFileInput = document.getElementById('logoFileInput');
    if (logoFileInput) {
        logoFileInput.addEventListener('change', previewImage);
    }
    
    // Set up trigger button
    const logoUploadButton = document.querySelector('button[onclick="triggerFilePicker()"]');
    if (logoUploadButton) {
        logoUploadButton.addEventListener('click', triggerFilePicker);
    }
}