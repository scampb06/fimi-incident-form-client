/**
 * Form Data Processing Module
 * Handles basic form data collection and narrative processing
 */

// Form Data Collection
function collectFormData() {
    // Collect added author entries
    const authors = Array.from(document.querySelectorAll('#additional-authors .author-entry'))
        .map(entry => {
            const name = (entry.getAttribute('data-author-name') || '').trim();
            const org = (entry.getAttribute('data-author-org') || '').trim();
            if (!name || !org) return '';
            return `${name}, ${org}`;
        })
        .filter(Boolean);

    // Helper function to safely get element value
    function safeGetValue(elementId, defaultValue = "") {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID '${elementId}' not found`);
            return defaultValue;
        }
        return element.value || defaultValue;
    }

    // Helper function to safely get selected options
    function safeGetSelectedOptions(elementId, defaultValue = "") {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID '${elementId}' not found`);
            return defaultValue;
        }
        if (!element.selectedOptions) {
            console.warn(`Element with ID '${elementId}' has no selectedOptions property`);
            return defaultValue;
        }
        return Array.from(element.selectedOptions).map(option => option.value).join(', ') || defaultValue;
    }

    const collectedMetaNarratives = Array.from(
        document.querySelectorAll('#meta-narratives-container .meta-narrative-group')
    )
        .map(group => (group.getAttribute('data-meta-text') || '').trim())
        .filter(Boolean)
        .join('; ');

    const collectedActionsTaken = Array.from(
        document.querySelectorAll('#actions-taken-container .action-taken-entry')
    )
        .map(block => {
            const actionText = (block.getAttribute('data-action-text') || '').trim();
            const actionDate = (block.getAttribute('data-action-date') || '').trim();
            if (!actionText) return '';
            return actionDate ? `${actionText} (${actionDate})` : actionText;
        })
        .filter(Boolean)
        .join('; ');

    return {
        incidentNumber: safeGetValue("incidentNumber", "0000"),
        tlpLevel: safeGetValue("tlpLevel", "TLP:CLEAR"),
        selectedCountries: document.getElementById('country')?.selectedOptions,
        country: safeGetSelectedOptions('country'),
        platforms: safeGetSelectedOptions('platforms'),
        title: safeGetValue("title"),
        date: safeGetValue("date"),
        threatActor: (typeof getSelectedThreatActors === 'function'
            ? getSelectedThreatActors().map(function(ta) { return ta.name + (ta.type ? ' (' + ta.type + ')' : ''); }).join(', ')
            : safeGetValue("threatActor")),
        authors: authors.join('; '),
        summary: safeGetValue("executive-summary"),
        incident: safeGetValue("incidentDescription"),
        metaNarrative: collectedMetaNarratives || (document.getElementById('metaNarrative')?.value || ''),
        reach: safeGetValue("reach"),
        outcome: safeGetValue("outcome"),
        actionsTaken: collectedActionsTaken
    };
}

// Process narratives and recommendations into docx paragraphs
function processNarratives() {
    const subNarrativeEntries = document.querySelectorAll(".sub-narrative-text");
    let subNarratives = Array.from(subNarrativeEntries)
        .map((entry, index) => {
            const entryText = (entry.value !== undefined ? entry.value : entry.textContent) || "";
            return `Sub-Narrative ${index + 1}: ${entryText}`;
        })
        .join("\n");

    const subNarrativeTextRuns = subNarratives.split("\n").map(line => 
        new docx.TextRun({ 
            break: 1, 
            text: line, 
            font: "Times New Roman", 
            size: 22 
        })
    );
    const subNarrativeParagraph = new docx.Paragraph({ children: subNarrativeTextRuns });

    const recommendationEntries = document.querySelectorAll("#recommendations-container .recommendation-entry");
    let recommendations = Array.from(recommendationEntries)
        .map((entry, index) => `Recommendation ${index + 1}: ${(entry.getAttribute('data-recommendation-text') || '').trim()}`)
        .join("\n");

    const recommendationTextRuns = recommendations.split("\n").map(line => 
        new docx.TextRun({ 
            break: 1, 
            text: line, 
            font: "Times New Roman", 
            size: 22 
        })
    );
    const recommendationParagraph = new docx.Paragraph({ children: recommendationTextRuns });

    return {
        subNarrativeParagraph,
        recommendationParagraph
    };
}

// Process objectives and TTPs for docx generation
function processObjectivesAndTTPs() {
    const objectivesData = [];
    const ttpsData = [];

    // Process objectives
    objectivesList.forEach((objective, index) => {
        const [id, ...titleParts] = objective.split(': ');
        const title = titleParts.join(': ');
        
        objectivesData.push({
            number: `${index + 1}`,
            id: id,
            title: title || id,
            justification: objective
        });
    });

    // Process TTPs
    ttpsList.forEach((ttp, index) => {
        const [id, ...titleParts] = ttp.split(': ');
        const title = titleParts.join(': ');
        
        ttpsData.push({
            number: `${index + 1}`,
            id: id,
            title: title || id,
            justification: ttp
        });
    });

    return {
        objectivesData,
        ttpsData
    };
}

// Process URLs data for docx generation
function processUrlsData() {
    const urlsData = [];

    // Process each URL entry
    urlsList.forEach((url, index) => {
        urlsData.push({
            number: `${index + 1}`,
            reportUrl: url.reportUrl || '',
            threatActor: url.threatActor || '',
            evidenceUrl: url.evidenceUrl || '',
            authors: url.authors || '',
            platforms: url.platforms || '',
            logo: url.logo || ''
        });
    });

    return urlsData;
}