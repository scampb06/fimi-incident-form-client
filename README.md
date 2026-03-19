# FIMI Incident Report Generator (Client)

Client-side web application for creating structured FIMI incident reports, enriching URL evidence workflows, and exporting reports to DOCX/JSON.

This repository is the browser-based front end. Server-side Azure endpoints are hosted separately in a private repository and are summarized in [documentation/azure-endpoints-overview.md](documentation/azure-endpoints-overview.md).

## What this app does

- Captures incident metadata, threat actors, narratives, outcomes, and recommendations.
- Supports country selection and DISARM objective/TTP selection.
- Helps process evidence URLs from Google Sheets.
- Integrates optional AI-assisted text generation from PDF reports.
- Exports completed reports as DOCX and JSON.

## Quick start

1. Clone this repository.
2. Serve the folder with a local static web server (recommended) or open `index.html` directly.
3. Adjust configuration in `config.js` as needed (especially Azure app name/base URL).
4. Open the app and complete form sections.

## Configuration

Primary runtime settings are in `config.js`:

- `window.AZURE_APP_NAME` (default: `fimi-incident-form-server-pt`)
- `window.AZURE_BASE_URL` (derived: `https://<app-name>.azurewebsites.net`)
- `window.GSHEETS_SERVICE_ACCOUNT_EMAIL`

The client calls Azure endpoints using `window.AZURE_BASE_URL` in modules such as:

- `pdf-ai-summarizer.js`
- `urls-management.js`

## Main feature docs

- [documentation/feature-overview.md](documentation/feature-overview.md) — End-to-end product features.
- [documentation/report-generation.md](documentation/report-generation.md) — Form completion and DOCX/JSON export behavior.
- [documentation/url-and-archiving-workflow.md](documentation/url-and-archiving-workflow.md) — Trusted/malicious URL flows, Google Sheets integration, and archiving options.
- [documentation/azure-endpoints-overview.md](documentation/azure-endpoints-overview.md) — High-level overview of Azure endpoints used by the client.
- [documentation/module-map.md](documentation/module-map.md) — File-by-file map of key client modules.
- [documentation/troubleshooting.md](documentation/troubleshooting.md) — Common setup/runtime issues and quick fixes.

## Azure integration summary

Current default endpoint host from this repo:

- `https://fimi-incident-form-server-pt.azurewebsites.net`

Key endpoint groups used by the client:

- AI text generation and PDF proxying
- Library lookups (threat actors, narratives, countermeasures)
- Google Sheets permission/data/extraction/archive workflows
- Bellingcat async archive job start + status checks

See [documentation/azure-endpoints-overview.md](documentation/azure-endpoints-overview.md) for details.

## Notes

- The Azure endpoint server repository is private; this documentation intentionally stays at a high-level integration view.
- Some external dependencies are loaded from CDN (e.g., PDF.js, docx, FileSaver, html2pdf).
- DISARM content is integrated using local assets and/or remote framework references as available.
