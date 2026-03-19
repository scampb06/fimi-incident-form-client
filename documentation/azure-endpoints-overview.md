# Azure Endpoints Overview (High-Level)

This document summarizes the private server API surface consumed by the client.

Source basis:

- Private repository `fimi-incident-form-server` README and `documentation/` files
- Client integration points in `config.js`, `urls-management.js`, and `pdf-ai-summarizer.js`

Default host configured in this client:

- `https://fimi-incident-form-server-pt.azurewebsites.net`

For fast issue triage by feature, see the support matrix in [troubleshooting.md](troubleshooting.md#support-matrix-feature--required-backend).

## Endpoint groups

## 1) Library endpoints (reference data)

### `GET /get-threat-actors`

Returns threat actor records (name/aliases/type) with ETag-based caching support.

### `GET /get-narratives`

Returns meta-narrative/sub-narrative records with ETag-based caching support.

### `GET /get-countermeasures`

Returns countermeasure name/description records with ETag-based caching support.

## 2) AI/PDF helper endpoints

### `POST /generate-text`

Accepts a prompt and returns AI-generated summary output (OpenAI-backed on server side).

### `GET /cors-proxy/pdf`

Fetches and streams PDFs through server-side proxy behavior to reduce browser CORS friction.

## 3) Google Sheets utility endpoints

### `GET /google-sheets/check-permissions`

Checks whether configured Google service account has sheet access (read/write mode options).

### `GET /google-sheets/data-for-url`

Loads structured records from a Google Sheet URL, including resolved spreadsheet/sheet context.

### `POST /google-sheets/extract-domains`

Extracts and writes missing domains from URL rows.

### `POST /google-sheets/extract-channels`

Extracts platform/channel metadata from URLs using server-side parsing rules.

### `GET` or `POST /google-sheets/archive-urls`

Archives URLs through Wayback workflow and writes status/archive outputs back to the sheet.

## 4) Bellingcat async archiving endpoints

### `POST /bellingcat/auto-archiver-sheets-asynchronous`

Starts an asynchronous auto-archiver job for sheet URLs (supports ACI/Docker/local modes server-side).

### `GET /bellingcat/auto-archiver/status/{jobId}`

Returns progress/state/log/error metadata for a previously started async archiver job.

## Integration notes

- Endpoint request details and server app settings are maintained in the private server repository.
- This client expects endpoints to be reachable from the browser and to allow configured CORS origins.
- For production changes, keep client `window.AZURE_BASE_URL` and server deployment hostnames in sync.
