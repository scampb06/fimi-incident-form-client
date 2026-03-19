/**
 * Main JavaScript File
 * Initializes all modules and sets up the application
 */

// Initialize the application once the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('FIMI Incident Report Generator loaded successfully');
    
    // Initialize all modules
    initializeConfig();
    initializeUIInteractions();
    initializeURLValidation();
    initializeImageHandling();
    
    // Set default date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // Open the form tab by default
    const firstTabButton = document.querySelector('.tab-button');
    if (firstTabButton) {
        firstTabButton.click();
    }
});

// Global initialization functions that modules can define
function initializeConfig() {
    // Configuration already initialized in config.js
}

function initializeUIInteractions() {
    // UI interactions already set up in ui-interactions.js
}

function initializeURLValidation() {
    // URL validation is handled in ui-interactions.js
    // No need to call anything here - it's already initialized
}

function initializeImageHandling() {
    // Image handling is handled in image-handling.js
    // No need to call anything here - it's already initialized
}