/**
 * DISARM Framework Integration Module
 * Handles DISARM Navigator file uploads and interactive framework selection
 */

// Upload and process DISARM Navigator JSON file
async function uploadNavigatorFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.onchange = async function () {
        const file = fileInput.files[0];
        if (!file) return;

        try {
            const json = JSON.parse(await file.text());
            objectivesList = []; // Reset the global list
            ttpsList = [];       // Reset the global list

            for (const technique of json.techniques || []) {
                if (technique.score > 0) {
                    const title = await fetchTechniqueTitle(technique.techniqueID);
                    const justification = technique.comment || '';

                    if (['plan-strategy', 'plan-objectives'].includes(technique.tactic)) {
                        objectivesList.push(`Objective: ${title} - ${justification}`);
                    } else {
                        ttpsList.push(`TTP: ${title} - ${justification}`);
                    }
                }
            }

            // Populate the objectives and TTPs in the UI
            const objectivesContainer = document.getElementById('objectives-container');
            objectivesContainer.innerHTML = objectivesList.map(obj => `
                <div class="objective-entry">
                    <span>${obj}</span>
                </div>
            `).join('');

            const ttpsContainer = document.getElementById('ttps-container');
            ttpsContainer.innerHTML = ttpsList.map(ttp => `
                <div class="ttp-entry">
                    <span>${ttp}</span>
                </div>
            `).join('');

            // Remove the "Add TTP" button after populating
            const addTTPButton = document.getElementById('addTTPButton');
            if (addTTPButton) {
                addTTPButton.parentNode.removeChild(addTTPButton);
            }                    

            navigatorFileUploaded = true; // Mark navigator file as successfully uploaded
            alert('Navigator file processed successfully!');
        } catch (error) {
            console.error('Error processing Navigator file:', error);
            alert('Failed to process the Navigator file. Please ensure it is a valid JSON file.');
        }
    };
    fileInput.click();
}

// Helper function to send current selections to iframe
function sendCurrentSelectionsToIframe(targetWindow) {
    // Extract technique IDs from current selections
    const selectedTechniques = [];
    
    // Extract from objectives list
    objectivesList.forEach(obj => {
        const match = obj.match(/^([T]\d+(?:\.\d+)?)/);
        if (match) {
            selectedTechniques.push(match[1]);
        }
    });
    
    // Extract from TTPs list
    ttpsList.forEach(ttp => {
        const match = ttp.match(/^([T]\d+(?:\.\d+)?)/);
        if (match) {
            selectedTechniques.push(match[1]);
        }
    });
    
    // Send initialization message to iframe
    if (selectedTechniques.length > 0) {
        console.log('Sending pre-selected techniques to iframe:', selectedTechniques);
        targetWindow.postMessage({
            type: 'initializeSelections',
            selectedTechniques: selectedTechniques
        }, '*');
    } else {
        console.log('No pre-existing selections to highlight');
    }
}

// Interactive DISARM Framework Selection
function openDISARMFramework() {
    // Note: We don't reset the global lists here so that new selections append to existing techniques
    
    // Add message listener for iframe communication
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'techniqueSelected') {
            const { techniqueId, techniqueName, tactic, isObjective, selected } = event.data;
            
            if (selected) {
                // Use the tactic information from the iframe to determine categorization
                if (isObjective || tactic === 'TA01' || tactic === 'TA02') {
                    // It's an objective (from TA01 Plan Strategy or TA02 Plan Objectives)
                    if (!objectivesList.some(obj => obj.includes(techniqueId))) {
                        // Remove the technique ID from techniqueName since it's already included
                        const cleanTechniqueName = techniqueName.replace(/^T\d+(?:\.\d+)?\s+/, '');
                        const finalText = `${techniqueId}: ${cleanTechniqueName}`;
                        objectivesList.push(finalText);
                        console.log('Added objective ('+tactic+'):', finalText);
                    }
                } else {
                    // It's a TTP (from TA05+ columns)
                    if (!ttpsList.some(ttp => ttp.includes(techniqueId))) {
                        // Remove the technique ID from techniqueName since it's already included
                        const cleanTechniqueName = techniqueName.replace(/^T\d+(?:\.\d+)?\s+/, '');
                        const finalText = `${techniqueId}: ${cleanTechniqueName}`;
                        ttpsList.push(finalText);
                        console.log('Added TTP ('+tactic+'):', finalText);
                    }
                }
                updateSelectionInfo();
            } else {
                // Remove from appropriate list
                if (isObjective || tactic === 'TA01' || tactic === 'TA02') {
                    objectivesList = objectivesList.filter(obj => !obj.includes(techniqueId));
                } else {
                    ttpsList = ttpsList.filter(ttp => !ttp.includes(techniqueId));
                }
                updateSelectionInfo();
                console.log('Removed technique ('+tactic+'):', techniqueId);
            }
        } else if (event.data && event.data.type === 'frameworkReady') {
            // Framework is ready, now send current selections
            sendCurrentSelectionsToIframe(event.source);
        }
    });
    
    // Create modal for DISARM framework
    const modal = document.createElement('div');
    modal.id = 'disarmModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        width: 95%;
        height: 90%;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;
    
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f5f5f5;
    `;
    
    const headerLeft = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = 'Select DISARM Techniques';
    title.style.margin = '0 0 5px 0';
    
    const instructions = document.createElement('p');
    instructions.style.cssText = 'margin: 0; font-size: 14px; color: #666;';
    instructions.innerHTML = 'Click techniques in the framework below to add them to your report. If the framework doesn\'t load, you can <a href="https://github.com/DISARMFoundation/DISARMframeworks/blob/main/generated_files/disarm_red_framework_clickable.html" target="_blank">open it in a new tab</a>.';
    
    headerLeft.appendChild(title);
    headerLeft.appendChild(instructions);
    
    const selectionInfo = document.createElement('div');
    selectionInfo.id = 'selectionInfo';
    selectionInfo.style.cssText = `
        font-size: 16px;
        font-weight: bold;
        color: #666;
        margin: 0 20px;
        text-align: center;
    `;
    // Initialize with current counts and appropriate styling
    const currentObjCount = objectivesList.length;
    const currentTtpCount = ttpsList.length;
    selectionInfo.textContent = `Objectives: ${currentObjCount} (rec: 2) | TTPs: ${currentTtpCount} (rec: 4)`;
    
    // Set initial color based on current counts
    if (currentObjCount > 2 || currentTtpCount > 4) {
        selectionInfo.style.color = '#dc3545'; // Red when exceeding recommended limits
    } else if (currentObjCount === 2 || currentTtpCount === 4) {
        selectionInfo.style.color = '#28a745'; // Green when at recommended limit
    } else {
        selectionInfo.style.color = '#666'; // Default gray
    }
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Done';
    closeButton.style.cssText = `
        padding: 10px 20px;
        background: #007cba;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;
    closeButton.onclick = () => closeDISARMModal(modal);
    
    const iframe = document.createElement('iframe');
    
    // Try your own GitHub Pages hosted version first, then fallbacks
    const frameworkUrls = [
        './disarm_red_framework_clickable_no_checkboxes.html', // Local hosted version
        'https://scampb06.github.io/fimi-incident-form/disarm_red_framework_clickable.html', // Your GitHub Pages
        'https://disarmfoundation.github.io/disarm-navigator/', // DISARM Navigator fallback
    ];
    
    let currentUrlIndex = 0;
    
    function tryNextUrl() {
        if (currentUrlIndex < frameworkUrls.length) {
            iframe.src = frameworkUrls[currentUrlIndex];
            console.log(`Trying URL ${currentUrlIndex + 1}: ${frameworkUrls[currentUrlIndex]}`);
            currentUrlIndex++;
        } else {
            // All URLs failed, show manual selection only
            iframe.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                padding: 40px;
                text-align: center;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                margin: 20px;
                flex: 1;
            `;
            errorMsg.innerHTML = `
                <h3>📋 DISARM Framework Reference</h3>
                <p>The interactive framework couldn't be loaded. Please open the framework in a new tab to reference techniques.</p>
                <p><strong>Reference:</strong> <a href="https://github.com/DISARMFoundation/DISARMframeworks/blob/main/generated_files/disarm_red_framework_clickable.html" target="_blank">View DISARM Framework in new tab</a></p>
                <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-radius: 4px; text-align: left;">
                    <strong>Framework Structure:</strong><br>
                    • <strong>Objectives</strong> (columns 1-2): TA01 Plan Strategy, TA02 Plan Objectives<br>
                    • <strong>TTPs</strong> (columns 3+): TA05-TA18 (Microtarget, Develop Content, etc.)<br>
                    • Click on techniques directly in the interactive version when available
                </div>
            `;
            iframe.parentNode.replaceChild(errorMsg, iframe);
        }
    }
    
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        flex: 1;
    `;
    
    // Handle iframe load errors with timeout
    let loadTimeout;
    
    iframe.addEventListener('error', () => {
        clearTimeout(loadTimeout);
        tryNextUrl();
    });
    
    iframe.addEventListener('load', function() {
        clearTimeout(loadTimeout);
        try {
            // Check if the iframe content loaded successfully
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && (iframeDoc.body.innerHTML.includes('404') || iframeDoc.body.innerHTML.includes('Not Found'))) {
                tryNextUrl();
            }
        } catch (e) {
            // Cross-origin restriction or successful load
            console.log('Framework loaded (cross-origin or success)');
        }
        
        // Also send selections with a delay as fallback in case frameworkReady message isn't received
        setTimeout(() => {
            sendCurrentSelectionsToIframe(iframe.contentWindow);
        }, 2000);
    });
    
    // Set a timeout for loading
    loadTimeout = setTimeout(() => {
        tryNextUrl();
    }, 5000);
    
    // Start with the first URL
    tryNextUrl();
    
    modalHeader.appendChild(headerLeft);
    modalHeader.appendChild(selectionInfo);
    modalHeader.appendChild(closeButton);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    console.log('DISARM Framework modal opened');
}

// Handle technique clicks from the iframe (fallback for manual input)
function handleTechniqueClick(event) {
    // This is a fallback handler - the main interaction will be through manual input
    // since we can't directly interact with the GitHub-hosted iframe content
    console.log('Technique click handler triggered');
}

// Update selection info display
function updateSelectionInfo() {
    const selectionInfo = document.getElementById('selectionInfo');
    if (selectionInfo) {
        const objectiveCount = objectivesList.length;
        const ttpCount = ttpsList.length;
        
        // Show actual counts with recommended limits for reference
        selectionInfo.textContent = `Objectives: ${objectiveCount} (rec: 2) | TTPs: ${ttpCount} (rec: 4)`;
        
        // Update styling based on recommended limits
        if (objectiveCount > 2 || ttpCount > 4) {
            selectionInfo.style.color = '#dc3545'; // Red when exceeding recommended limits
        } else if (objectiveCount === 2 || ttpCount === 4) {
            selectionInfo.style.color = '#28a745'; // Green when at recommended limit
        } else {
            selectionInfo.style.color = '#666'; // Default gray
        }
    }
    
    // Also update the main form UI
    updateObjectivesAndTTPsUI();
    
    // Update the main form counters
    if (typeof updateCounters === 'function') {
        updateCounters();
    }
}

// Close DISARM modal and update UI
function closeDISARMModal(modal) {
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
    
    // Update the main form with selected techniques
    updateObjectivesAndTTPsUI();
    
    console.log('DISARM Framework modal closed');
    console.log('Final objectives:', objectivesList);
    console.log('Final TTPs:', ttpsList);
}

// Open technique selector for individual technique selection
function openTechniqueSelector() {
    // Create modal for technique selector
    const modal = document.createElement('div');
    modal.id = 'techniqueSelectorModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        width: 90%;
        max-width: 800px;
        height: 80%;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;
    
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f5f5f5;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Select DISARM Technique';
    title.style.margin = '0';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
        padding: 8px 16px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;
    closeButton.onclick = () => closeTechniqueSelectorModal(modal);
    
    const iframe = document.createElement('iframe');
    iframe.src = './disarm-technique-selector.html';
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        flex: 1;
    `;
    
    // Listen for technique selection from the iframe
    function handleTechniqueSelection(event) {
        if (event.data && event.data.type === 'techniqueSelected') {
            const { id, name } = event.data;
            
            // Determine if this technique should be classified as objective or TTP
            // Based on DISARM framework: TA01 and TA02 are objectives, others are TTPs
            // Using accurate technique mappings from the official DISARM framework
            const objectiveTechniques = [
                // TA01 techniques
                'T0073', 'T0074',
                // TA02 techniques  
                'T0002', 'T0066', 'T0075', 'T0076', 'T0077', 'T0078', 'T0079', 'T0135', 'T0136', 'T0137', 'T0138', 'T0139', 'T0140'
            ];
            
            const baseId = id.split('.')[0]; // Remove sub-technique numbering (e.g., T0135.001 -> T0135)
            const isObjective = objectiveTechniques.includes(baseId);
            
            console.log(`Technique ${id} (base: ${baseId}) classified as: ${isObjective ? 'Objective' : 'TTP'}`);
            
            let addedSuccessfully = false;
            let addedAs = '';
            let warningMessage = '';
            
            if (isObjective) {
                // Add as objective (check for duplicates)
                // Remove the technique ID from name if it's included
                const cleanName = name.replace(/^T\d+(?:\.\d+)?\s+/, '');
                const objectiveText = `${id}: ${cleanName}`;
                if (!objectivesList.some(obj => obj.includes(id))) {
                    objectivesList.push(objectiveText);
                    console.log('Added objective:', objectiveText);
                    addedSuccessfully = true;
                    addedAs = 'objective';
                    
                    // Check if exceeding recommended limit
                    if (objectivesList.length > 2) {
                        warningMessage = `\n\n⚠️ Warning: You now have ${objectivesList.length} objectives. The recommended limit is 2 objectives for optimal report structure.`;
                    }
                } else {
                    alert(`Technique "${id}: ${cleanName}" is already added as an objective.`);
                    return;
                }
            } else {
                // Add as TTP (check for duplicates)
                // Remove the technique ID from name if it's included
                const cleanName = name.replace(/^T\d+(?:\.\d+)?\s+/, '');
                const ttpText = `${id}: ${cleanName}`;
                if (!ttpsList.some(ttp => ttp.includes(id))) {
                    ttpsList.push(ttpText);
                    console.log('Added TTP:', ttpText);
                    addedSuccessfully = true;
                    addedAs = 'TTP';
                    
                    // Check if exceeding recommended limit
                    if (ttpsList.length > 4) {
                        warningMessage = `\n\n⚠️ Warning: You now have ${ttpsList.length} TTPs. The recommended limit is 4 TTPs for optimal report structure.`;
                    }
                } else {
                    alert(`Technique "${id}: ${cleanName}" is already added as a TTP.`);
                    return;
                }
            }
            
            if (addedSuccessfully) {
                // Update UI
                updateObjectivesAndTTPsUI();
                updateSelectionInfo();
                if (typeof updateCounters === 'function') {
                    updateCounters();
                }
                
                // Only show warning message if exceeding recommended limits, otherwise just close modal
                if (warningMessage) {
                    alert(`Technique "${id}: ${name}" added as ${addedAs}.${warningMessage}`);
                }
                closeTechniqueSelectorModal(modal);
            }
        }
    }
    
    // Add event listener for cross-frame communication
    window.addEventListener('message', handleTechniqueSelection, false);
    
    // Store the handler reference to remove it later
    modal.messageHandler = handleTechniqueSelection;
    
    modalHeader.appendChild(title);
    modalHeader.appendChild(closeButton);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    console.log('Technique selector modal opened');
}

// Close technique selector modal
function closeTechniqueSelectorModal(modal) {
    if (modal && modal.parentNode) {
        // Remove the event listener
        if (modal.messageHandler) {
            window.removeEventListener('message', modal.messageHandler, false);
        }
        modal.parentNode.removeChild(modal);
    }
    console.log('Technique selector modal closed');
}

// Fetch technique title from DISARM API or fallback
async function fetchTechniqueTitle(techniqueID) {
    try {
        // Try DISARM framework GitHub API first
        const response = await fetch(`https://raw.githubusercontent.com/DISARMFoundation/DISARMframeworks/main/techniques/${techniqueID}.md`);
        if (response.ok) {
            const text = await response.text();
            const titleMatch = text.match(/^# (.+)$/m);
            if (titleMatch) {
                return titleMatch[1];
            }
        }
        
        // Fallback to technique ID if title not found
        return techniqueID;
    } catch (error) {
        console.warn(`Could not fetch title for ${techniqueID}:`, error);
        return techniqueID;
    }
}