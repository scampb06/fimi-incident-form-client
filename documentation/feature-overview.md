# Feature Overview

## 1) Incident form authoring

The main UI (`index.html`) supports structured capture of:

- Incident metadata (number, title, date, TLP)
- Country targeting
- Threat actors
- Incident description and executive summary
- Narrative analysis (meta-narratives + sub-narratives)
- Reach/outcome assessment
- Actions taken and recommendations

## 2) DISARM framework support

The app supports two DISARM workflows:

- Uploading navigator JSON files to pre-populate objectives/TTPs
- Interactive framework selection via modal/iframe integration

Selected objectives and TTPs are tracked in global lists and reused in report exports.

## 3) URL evidence management

Trusted and malicious URL tracks are handled separately:

- Trusted URLs: URL + domain + archive URL
- Malicious URLs: URL + channel + archive URL

Users can:

- Load and edit Google Sheets data
- Validate service-account access
- Extract missing domains/channels
- Trigger archive operations

## 4) AI-assisted incident description

`pdf-ai-summarizer.js` can:

- Fetch a PDF (including CORS-proxy fallback path)
- Extract text with PDF.js
- Submit prompt text to the server `/generate-text` endpoint
- Write generated summary content back into the incident description field

## 5) Report outputs

The client provides:

- DOCX export (`docx-generator.js` + table builder modules)
- JSON export (`json-generator.js`) using a structured incident schema

These outputs are designed for analyst workflow handoff and downstream processing.
