# URL and Archiving Workflow

This app supports two URL pipelines:

- Trusted URL workflow
- Malicious URL workflow

Both are managed by `urls-management.js` and can use Google Sheets as the source/editing interface.

## Core workflow

1. User provides a Google Sheets URL.
2. Client validates format and opens an editing popup.
3. Client checks Google service-account permissions.
4. User can trigger extraction and archive actions.
5. Updated values are loaded back into local client lists.

## Extraction actions

### Extract domains

For trusted URLs, the client can call:

- `POST /google-sheets/extract-domains`

Purpose: fill missing `Domain` values from URL rows.

### Extract channels

For malicious URLs, the client can call:

- `POST /google-sheets/extract-channels`

Purpose: infer `Platform`, `Channel Type`, and `Channel` fields.

## Archiving actions

### Wayback Machine path

- `GET/POST /google-sheets/archive-urls`
- Optional `preValidation=true` support

Used for synchronous Google-Sheets-driven URL archiving and writing status/archive URLs back to sheet columns.

### Bellingcat async path

- `POST /bellingcat/auto-archiver-sheets-asynchronous`
- `GET /bellingcat/auto-archiver/status/{jobId}`

Used for asynchronous background archiving jobs with explicit status polling.

## Supporting API calls

The URL workflows also use:

- `GET /google-sheets/check-permissions`
- `GET /google-sheets/data-for-url`

These endpoints help validate sheet access and inspect dataset size/content before operations.

## Azure host used by this client

By default (from `config.js`):

- `https://fimi-incident-form-server-pt.azurewebsites.net`

All endpoint paths above are called relative to this base URL unless overridden in configuration.
