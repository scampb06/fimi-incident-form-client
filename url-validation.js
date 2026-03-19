/**
 * URL Validation Module
 * Handles validation of report and evidence URLs
 */

// Validate report URL
function validatereportURL(url) {
    try {
        new URL(url);
        reporturlerror.style.display = 'none';
    } catch (_) {
        reporturlerror.style.display = 'block';
        reporturlerror.textContent = 'Invalid URL. Please enter a valid URL starting with http:// or https://';
    }
}

// Validate evidence URL
function validateevidenceURL(url) {
    try {
        new URL(url);
        evidenceurlerror.style.display = 'none';
    } catch (_) {
        evidenceurlerror.style.display = 'block';
        evidenceurlerror.textContent = 'Invalid URL. Please enter a valid URL starting with http:// or https://';
    }
}

// Initialize URL validation listeners
function initializeURLValidation() {
    const reporturlinput = document.getElementById('reporturlInput');
    const reporturlerror = document.getElementById('reporturlError');
    let reportdebounceTimer;

    reporturlinput.addEventListener('input', () => {
        clearTimeout(reportdebounceTimer);
        reportdebounceTimer = setTimeout(() => {
            const url = reporturlinput.value.trim();
            if (url) {
                validatereportURL(url);
            } else {
                reporturlerror.style.display = 'none';
            }
        }, 1500); // wait 500ms after typing stops
    });

    const evidenceurlinput = document.getElementById('evidenceurlInput');
    const evidenceurlerror = document.getElementById('evidenceurlError');
    let evidencedebounceTimer;

    evidenceurlinput.addEventListener('input', () => {
        clearTimeout(evidencedebounceTimer);
        evidencedebounceTimer = setTimeout(() => {
            const url = evidenceurlinput.value.trim();
            if (url) {
                validateevidenceURL(url);
            } else {
                evidenceurlerror.style.display = 'none';
            }
        }, 1500); // wait 500ms after typing stops
    });
}