# FIMI Incident Report Generator (Client)

Client-side web application for creating structured FIMI incident reports, enriching URL evidence workflows, and exporting reports to JSON.

This repository is the browser-based front end. Server-side Azure endpoints are hosted separately in a private repository and are summarized in [documentation/azure-endpoints-overview.md](documentation/azure-endpoints-overview.md).

## What this app does

- Captures incident metadata, threat actors, narratives, outcomes, and recommendations.
- Supports country selection and DISARM objective/TTP selection.
- Helps process evidence URLs from Google Sheets.
- Integrates optional AI-assisted text generation from PDF reports.
- Exports completed reports as JSON.

## Quick start

1. Fork and clone this repository.
2. Adjust configuration in `config.js` to communicate with the server (see below).
3. Commit and push your changes to GitHub. 
4. In GitHub under Settings>Pages select "Deploy from a branch" for the Source, select branch "Main" and folder "/root", and press Save. GitHub will take a few minutes to build your site and return with "Your site is now live at <Your Site URL>"
5. Access your site at <Your Site URL>  

## Configuration

Primary runtime settings are in `config.js`:

- `window.AZURE_APP_NAME` — set this to `<YOUR_AZURE_APP_NAME_FROM_ADMIN>` (provided by your system administrator).
- `window.AZURE_BASE_URL` — set to `https://<YOUR_AZURE_APP_NAME_FROM_ADMIN>.azurewebsites.net` (or the explicit API base URL provided by your system administrator).
- `window.GSHEETS_SERVICE_ACCOUNT_EMAIL` — the Google service account email used by the server to update Google Sheets (domains, channels, archive URLs, etc.); obtain this from your system administrator.

The client calls Azure endpoints using `window.AZURE_BASE_URL` in modules such as:

- `pdf-ai-summarizer.js`
- `urls-management.js`

## Main feature docs

- [documentation/feature-overview.md](documentation/feature-overview.md) — End-to-end product features.
- [documentation/report-generation.md](documentation/report-generation.md) — Form completion and JSON export behavior.
- [documentation/url-and-archiving-workflow.md](documentation/url-and-archiving-workflow.md) — Trusted/malicious URL flows, Google Sheets integration, and archiving options.
- [documentation/azure-endpoints-overview.md](documentation/azure-endpoints-overview.md) — High-level overview of Azure endpoints used by the client.
- [documentation/module-map.md](documentation/module-map.md) — File-by-file map of key client modules.
- [documentation/troubleshooting.md](documentation/troubleshooting.md) — Common setup/runtime issues and quick fixes.

## Azure integration summary

Endpoint host format used by this client:

- `https://<YOUR_AZURE_APP_NAME_FROM_ADMIN>.azurewebsites.net`

Key endpoint groups used by the client:

- AI text generation and PDF proxying
- Library lookups (threat actors, narratives, countermeasures)
- Google Sheets permission/data/extraction/archive workflows
- Bellingcat async archive job start + status checks

See [documentation/azure-endpoints-overview.md](documentation/azure-endpoints-overview.md) for details.

## Notes

- The Azure endpoint server repository is private; this documentation intentionally stays at a high-level integration view.
- Some external dependencies are loaded from CDN (e.g., PDF.js, FileSaver, html2pdf).
- DISARM content is integrated using local assets and/or remote framework references as available.
