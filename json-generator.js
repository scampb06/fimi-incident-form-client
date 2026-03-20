/**
 * JSON Export Module
 * Collects all form data and exports it as a structured JSON file
 * matching the agreed FIMI Incident Report schema.
 */

/**
 * Collect all form data and build the JSON export object.
 * @returns {object} The structured incident report object.
 */
function buildIncidentJson() {
    // ── Basic fields ──────────────────────────────────────────────
    const incidentNumber = (document.getElementById('incidentNumber')?.value || '').trim();
    const tlpLevel      = (document.getElementById('tlpLevel')?.value || '').trim();
    const title         = (document.getElementById('title')?.value || '').trim();
    const date          = (document.getElementById('date')?.value || '').trim();
    const reportUrl     = (document.getElementById('reporturlInput')?.value || '').trim();

    // ── Authors ───────────────────────────────────────────────────
    const authorEntries = document.querySelectorAll('#additional-authors .author-entry');
    const authors = [];
    authorEntries.forEach(entry => {
        const name = (entry.getAttribute('data-author-name') || '').trim();
        const org  = (entry.getAttribute('data-author-org') || '').trim();
        if (name || org) {
            authors.push({ name, organization: org });
        }
    });

    // ── Targeted countries (array of ISO codes) ───────────────────
    const countries = typeof getSelectedCountries === 'function' ? getSelectedCountries() : [];
    const targetedCountries = countries.map(c => (c.id || c).toString().trim()).filter(Boolean);

    // ── Threat actors ─────────────────────────────────────────────
    const threatActors = typeof getSelectedThreatActors === 'function'
        ? (getSelectedThreatActors() || []).map(ta => ({ name: ta.name || '', type: ta.type || '' }))
        : [];

    // ── Incident description ──────────────────────────────────────
    const incidentDescription = (document.getElementById('incidentDescription')?.value || '').trim();

    // ── Key narratives ────────────────────────────────────────────
    const keyNarratives = [];
    const metaGroups = document.querySelectorAll('#meta-narratives-container .meta-narrative-group');
    metaGroups.forEach(group => {
        const metaPlainText = (group.dataset.metaText || '').trim();
        if (!metaPlainText) return;
        const metaCode = (group.dataset.metaCode || '').trim();
        const metaNarrative = (typeof buildPrefixedMetaNarrativeText === 'function')
            ? (buildPrefixedMetaNarrativeText(metaPlainText, metaCode) || metaPlainText)
            : metaPlainText;

        const subNarratives = [];
        group.querySelectorAll('.sub-narrative-text').forEach(el => {
            // Sub-narratives are content-editable divs; use textContent
            const text = (el.value !== undefined ? el.value : el.textContent || '').trim();
            if (text) subNarratives.push(text);
        });

        keyNarratives.push({ metaNarrative, subNarratives });
    });

    // ── DISARM tactics ────────────────────────────────────────────
    const objectivesSource = (typeof objectivesList !== 'undefined' && Array.isArray(objectivesList))
        ? objectivesList
        : (Array.isArray(window.objectivesList) ? window.objectivesList : []);
    const ttpsSource = (typeof ttpsList !== 'undefined' && Array.isArray(ttpsList))
        ? ttpsList
        : (Array.isArray(window.ttpsList) ? window.ttpsList : []);

    const objectives = objectivesSource
        .map(o => (typeof o === 'string' ? o : (o.label || o.text || JSON.stringify(o))).trim())
        .filter(Boolean);
    const ttps = ttpsSource
        .map(t => (typeof t === 'string' ? t : (t.label || t.text || JSON.stringify(t))).trim())
        .filter(Boolean);

    // ── Social media engagement & outcome ─────────────────────────
    const socialMediaEngagement = (document.getElementById('reach')?.value || '').trim();
    const outcomeAssessment     = (document.getElementById('outcome')?.value || '').trim();

    // ── Actions taken ─────────────────────────────────────────────
    const actionsTaken = [];
    document.querySelectorAll('#actions-taken-container .action-taken-entry').forEach(entry => {
        const action = (entry.dataset.actionText || '').trim();
        const actionDate = (entry.dataset.actionDate || '').trim();
        if (action) {
            actionsTaken.push({ action, date: actionDate });
        }
    });

    // ── Recommendations ───────────────────────────────────────────
    const recommendations = [];
    document.querySelectorAll('#recommendations-container .recommendation-entry').forEach(entry => {
        const rec = (entry.dataset.recommendationText || '').trim();
        if (rec) recommendations.push(rec);
    });

    // ── Trusted URLs ──────────────────────────────────────────────
    const trustedGoogleSheet = (document.getElementById('googleSheetsUrl')?.value || '').trim();
    const trustedUrlEntries = (typeof urlsList !== 'undefined' ? urlsList : []).map(e => ({
        url:     (e.url     || '').trim(),
        domain:  (e.domain  || '').trim(),
        archive: (e.archiveUrl || '').trim()
    }));

    // ── Suspicious / malicious URLs ───────────────────────────────
    const suspiciousGoogleSheet = (document.getElementById('maliciousGoogleSheetsUrl')?.value || '').trim();
    const suspiciousUrlEntries = (typeof maliciousUrlsList !== 'undefined' ? maliciousUrlsList : []).map(e => ({
        url:     (e.url     || '').trim(),
        channel: (e.channel || '').trim(),
        archive: (e.archiveUrl || '').trim()
    }));

    // ── Executive summary ─────────────────────────────────────────
    const summary = (document.getElementById('executive-summary')?.value || '').trim();

    // ── Assemble schema ───────────────────────────────────────────
    return {
        incidentNumber,
        tlpLevel,
        title,
        date,
        reportUrl,
        authors,
        targetedCountries,
        threatActors,
        incidentDescription,
        keyNarratives,
        disarmTactics: { objectives, ttps },
        socialMediaEngagement,
        outcomeAssessment,
        actionsTaken,
        recommendations,
        trustedUrls: {
            googleSheet: trustedGoogleSheet,
            urls: trustedUrlEntries
        },
        suspiciousUrls: {
            googleSheet: suspiciousGoogleSheet,
            urls: suspiciousUrlEntries
        },
        socialMediaUrls: null,
        summary
    };
}

/**
 * Trigger a browser download of the incident report as a JSON file.
 * Filename: <incidentNumber>_<title-slug>.json  (falls back to "incident-report.json")
 */
function downloadAsJson() {
    let data;
    try {
        data = buildIncidentJson();
    } catch (err) {
        console.error('JSON export error:', err);
        alert('Failed to build JSON export: ' + err.message);
        return;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    // Build a safe filename
    let filename = 'incident-report.json';
    try {
        const num   = (data.incidentNumber || '').replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        const slug  = (data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
        if (num && slug) {
            filename = `${num}_${slug}.json`;
        } else if (num) {
            filename = `${num}.json`;
        } else if (slug) {
            filename = `${slug}.json`;
        }
    } catch (_) { /* keep default */ }

    // Use FileSaver.js if available, otherwise fall back to an anchor click
    if (typeof saveAs === 'function') {
        saveAs(blob, filename);
    } else {
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }
}
