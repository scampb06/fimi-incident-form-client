/**
 * Global Configuration and State Variables
 * Contains all global variables, counters, and configuration used across modules
 */

// ============================================================
// Azure Configuration
// ============================================================
// window.AZURE_APP_NAME = 'fimi-incident-form-server-pt';
window.AZURE_APP_NAME = 'fimi-incident-form-genai'
window.AZURE_BASE_URL = `https://${window.AZURE_APP_NAME}.azurewebsites.net`;

// ============================================================
// Google Sheets Configuration
// ============================================================
// window.GSHEETS_SERVICE_ACCOUNT_EMAIL = 'gsheets-service@bright-lattice-490523-c6.iam.gserviceaccount.com';
window.GSHEETS_SERVICE_ACCOUNT_EMAIL = 'gsheets-service@spheric-baton-459622-f4.iam.gserviceaccount.com';

// Global state variables for form data
let objectivesList = [];
let ttpsList = [];
let imagelogo = null;
let navigatorFileUploaded = false; // Track if the navigator file was uploaded successfully

// UI counters for dynamic form elements
let ttpCount = 1;
let observableCount = 1;
let authorCount = 1;
let subNarrativeCount = 1; // Start from 1 since one is already present in compact form
let recommendationCount = 1; // Start from 1 since one is already present in compact form

// Debounce timers for URL validation
let reportdebounceTimer;
let evidencedebounceTimer;

// Author modal callback
let authorCallback = null;

// OpenAI API configuration for AI Summarizer
const OPENAI_API_KEY = ''; // API key will be prompted on first use

// DOM element references (initialized when DOM is ready)
let reporturlinput = null;
let reporturlerror = null;
let evidenceurlinput = null;
let evidenceurlerror = null;

// Initialize DOM references when document is loaded
function initializeConfig() {
    reporturlinput = document.getElementById('reporturlInput');
    reporturlerror = document.getElementById('reporturlError');
    evidenceurlinput = document.getElementById('evidenceurlInput');
    evidenceurlerror = document.getElementById('evidenceurlError');
    
    // Initialize AI Summarizer if API key is configured
    initializeAISummarizer();
}

// Initialize AI Summarizer with API key
function initializeAISummarizer() {
    // Try to get API key from localStorage first
    let apiKey = OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
        console.log('🔑 OpenAI API key not found. Will prompt when AI Summarizer is used.');
        return;
    }
    
    // Check if setOpenAIApiKey function is available (from pdf-ai-summarizer.js)
    if (typeof setOpenAIApiKey === 'function') {
        setOpenAIApiKey(apiKey);
        console.log('✅ AI Summarizer initialized successfully');
    } else {
        // Retry after a short delay if the function isn't loaded yet
        setTimeout(initializeAISummarizer, 100);
    }
}

// Function to prompt for API key when needed
function promptForAPIKey() {
    const apiKey = prompt(
        'Please enter your OpenAI API key:\n\n' +
        '• Get your API key from: https://platform.openai.com/api-keys\n' +
        '• Your key should start with "sk-"\n' +
        '• The key will be saved locally for this session'
    );
    
    if (apiKey && apiKey.trim()) {
        const trimmedKey = apiKey.trim();
        
        if (!trimmedKey.startsWith('sk-')) {
            alert('Warning: API key should start with "sk-". Please verify your key.');
        }
        
        // Save to localStorage for future use
        localStorage.setItem('openai_api_key', trimmedKey);
        
        // Initialize the AI summarizer
        if (typeof setOpenAIApiKey === 'function') {
            setOpenAIApiKey(trimmedKey);
            console.log('✅ AI Summarizer initialized with provided API key');
            return trimmedKey;
        }
    }
    
    return null;
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConfig);
} else {
    initializeConfig();
}