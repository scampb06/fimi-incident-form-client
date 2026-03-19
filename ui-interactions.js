/**
 * UI Interactions Module
 * Handles tab management, form interactions, dynamic field management, and URL validation
 */

/**
 * Tab Management Functions
 */
function openTab(evt, tabName) {
    var i, tabContent, tabButtons;
    
    // Hide all tab content
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    
    // Remove "active" class from all tab buttons
    tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }
    
    // Show the current tab and add "active" class to the button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

/**
 * Dynamic TTP Field Management
 */
function addTTP() {
    if (ttpCount >= 4) {
        alert("Maximum 4 TTPs allowed");
        return;
    }
    
    ttpCount++;
    const container = document.getElementById("ttps-container");
    const newTTP = document.createElement("div");
    newTTP.className = "ttp-entry";
    newTTP.innerHTML = `
        <label>TTP ${ttpCount}:</label>
        <input type="text" class="ttp-title" placeholder="DISARM name for TTP" title="Choose the name of a DISARM tactic or technique">
        <textarea class="ttp-explanation" placeholder="Explanation for TTP ${ttpCount}" title="Explain why you chose this TTP"></textarea>
        <button type="button" class="remove-button" onclick="removeTTP(this)">Remove</button>
    `;
    container.appendChild(newTTP);
}

function removeTTP(button) {
    const entry = button.parentNode;
    entry.parentNode.removeChild(entry);
    ttpCount--;
    
    // Update labels
    const ttpEntries = document.querySelectorAll(".ttp-entry");
    for (let i = 0; i < ttpEntries.length; i++) {
        const label = ttpEntries[i].querySelector("label");
        label.textContent = `TTP ${i + 1}:`;
        const textarea = ttpEntries[i].querySelector("textarea");
        if (textarea) {
            textarea.placeholder = `Explanation for TTP ${i + 1}`;
        }
    }
}

/**
 * Dynamic Sub-Narrative Field Management
 */
function addSubNarrative() {
    const container = document.getElementById("subNarratives-container");
    const newSubNarrative = document.createElement("div");
    newSubNarrative.className = "sub-narrative-entry";
    newSubNarrative.innerHTML = `
        <label>Sub-Narrative ${subNarrativeCount}:</label>
        <textarea class="sub-narrative-text" placeholder="Enter sub-narrative ${subNarrativeCount}..." title="Specific sub-narrative"></textarea>
        <button type="button" class="remove-button" onclick="removeSubNarrative(this)">Remove</button>
    `;
    container.appendChild(newSubNarrative);
    subNarrativeCount++;
}

function removeSubNarrative(button) {
    const entry = button.parentNode;
    entry.parentNode.removeChild(entry);
    subNarrativeCount--;

    // Update labels
    const subNarrativeEntries = document.querySelectorAll(".sub-narrative-entry");
    for (let i = 0; i < subNarrativeEntries.length; i++) {
        const label = subNarrativeEntries[i].querySelector("label");
        label.textContent = `Sub-Narrative ${i + 1}:`;
        const textarea = subNarrativeEntries[i].querySelector("textarea");
        if (textarea) {
            textarea.placeholder = `Enter sub-narrative ${i + 1}...`;
        }
    }
}

/**
 * Dynamic Recommendation Field Management
 */
function addRecommendation() {
    const container = document.getElementById("recommendations-container");
    const newRecommendation = document.createElement("div");
    newRecommendation.className = "recommendation-entry";
    newRecommendation.innerHTML = `
        <label>Recommendation ${recommendationCount}:</label>
        <textarea class="recommendation-text" placeholder="Enter recommendation ${recommendationCount}..." title="What further actions would you recommend?"></textarea>
        <button type="button" class="remove-button" onclick="removeRecommendation(this)">Remove</button>
    `;
    container.appendChild(newRecommendation);
    recommendationCount++;
}

function removeRecommendation(button) {
    const entry = button.parentNode;
    entry.parentNode.removeChild(entry);
    recommendationCount--;

    // Update labels
    const recommendationEntries = document.querySelectorAll(".recommendation-entry");
    for (let i = 0; i < recommendationEntries.length; i++) {
        const label = recommendationEntries[i].querySelector("label");
        label.textContent = `Recommendation ${i + 1}:`;
        const textarea = recommendationEntries[i].querySelector("textarea");
        if (textarea) {
            textarea.placeholder = `Enter recommendation ${i + 1}...`;
        }
    }
}

/**
 * URL Validation Functions
 */
function validatereportURL(url) {
    try {
        new URL(url);
        reporturlerror.style.display = 'none';
    } catch (_) {
        reporturlerror.style.display = 'block';
        reporturlerror.textContent = 'Invalid URL. Please enter a valid URL starting with http:// or https://';
    }
}

function validateevidenceURL(url) {
    try {
        new URL(url);
        evidenceurlerror.style.display = 'none';
    } catch (_) {
        evidenceurlerror.style.display = 'block';
        evidenceurlerror.textContent = 'Invalid URL. Please enter a valid URL starting with http:// or https://';
    }
}

/**
 * Initialize URL validation event listeners
 */
function initializeURLValidation() {
    // Wait for config to initialize DOM references
    if (!reporturlinput) {
        setTimeout(initializeURLValidation, 100);
        return;
    }
    
    if (reporturlinput) {
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
    }

    if (evidenceurlinput) {
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
}

/**
 * Modal Management Functions
 */
function openAuthorModal(callback) {
    document.getElementById('modalAuthorName').value = '';
    document.getElementById('modalAuthorOrg').value = '';
    document.getElementById('authorModal').style.display = 'block';
    authorCallback = callback;
}

function closeAuthorModal() {
    document.getElementById('authorModal').style.display = 'none';
    authorCallback = null;
}

function submitAuthorModal() {
    const name = document.getElementById('modalAuthorName').value.trim();
    const org = document.getElementById('modalAuthorOrg').value.trim();
    if (authorCallback) authorCallback(name, org);
    closeAuthorModal();
}

/**
 * Evidence Author Management
 */
function addAuthor(button) {
    const authorsDiv = button.parentNode.parentNode.querySelector('.evidence-authors');
    openAuthorModal(function(name, org) {
        if (name && org) {
            const newAuthorSpan = document.createElement('span');
            newAuthorSpan.className = 'author-name';
            newAuthorSpan.textContent = `${name}, ${org} `;
            //  Add a remove button for this author
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-author';
            removeBtn.onclick = function() {
                // Remove both the author and its following <br>
                if (newAuthorSpan.nextSibling && newAuthorSpan.nextSibling.tagName === 'BR') {
                    authorsDiv.removeChild(newAuthorSpan.nextSibling);
                }
                authorsDiv.removeChild(newAuthorSpan);
            };  
            newAuthorSpan.appendChild(removeBtn);
            authorsDiv.appendChild(newAuthorSpan); 
            // Add a line break after each author
            authorsDiv.appendChild(document.createElement('br'));                    
        }
    });
}

function removeAuthor(button) {
    const authorsCell = button.parentNode.parentNode.querySelector('.evidence-authors');
    const authors = authorsCell.value.split(';').map(author => author.trim());
    const authorToRemove = button.parentNode.querySelector('.author-name').textContent;
    const updatedAuthors = authors.filter(author => author !== authorToRemove);
    authorsCell.value = updatedAuthors.join('; ');
}

// Get all authors as a string for the Word document
function getAuthorsString(authorsDiv) {
    return Array.from(authorsDiv.querySelectorAll('.author-name'))
        .map(span => span.childNodes[0].textContent.trim())
        .join('; ');
}

// Initialize UI interactions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeURLValidation);
} else {
    initializeURLValidation();
}