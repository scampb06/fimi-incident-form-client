# Troubleshooting

This guide covers common issues when using the FIMI Incident Report Generator client with Azure-hosted backend endpoints.

## 1) Google Sheets permission errors

### Symptoms

- `check-permissions` fails
- Archive/extract actions report access denied
- Sheet loads in browser but API calls fail

### Checks

- Confirm the Google Sheet is shared with the configured service account email.
- Confirm the service account has **Editor** access for extract/archive operations.
- Confirm `window.GSHEETS_SERVICE_ACCOUNT_EMAIL` in `config.js` is the Google service account email used by the server for sheet updates (domains, channels, archive URLs, etc.).

### Fix

1. Open the Google Sheet.
2. Select **Share**.
3. Add the service account email from `window.GSHEETS_SERVICE_ACCOUNT_EMAIL` (value provided by your system administrator).
4. Grant **Editor** (or at least **Viewer** for read-only checks).

## 2) Azure endpoint not reachable

### Symptoms

- `fetch` calls fail with network/CORS errors
- URL workflows never complete
- AI summary endpoint returns connection errors

### Checks

- Verify `window.AZURE_APP_NAME` and `window.AZURE_BASE_URL` in `config.js` match values provided by your system administrator.
- Test the base URL in browser: `https://<app-name>.azurewebsites.net`.
- Confirm the backend app is running and deployed.

### Fix

- Set `window.AZURE_APP_NAME` to `<YOUR_AZURE_APP_NAME_FROM_ADMIN>` or explicitly set `window.AZURE_BASE_URL` to the API host provided by your system administrator.
- Ensure backend deployment/environment is healthy.
- Ensure backend CORS settings allow your client origin.

## 3) PDF summarization issues

### Symptoms

- PDF download/extraction fails
- Summarization stalls during proxy attempts
- `/generate-text` returns API/config errors

### Checks

- Confirm PDF URL is public/reachable.
- Confirm backend endpoint `/cors-proxy/pdf` is available.
- Confirm backend has valid OpenAI configuration for `/generate-text`.

### Fix

- Retry with a different PDF URL.
- Use URLs that do not require authentication/session cookies.
- Verify backend app settings for OpenAI key/model access.

## 4) Domain/channel extraction does not populate values

### Symptoms

- Extraction runs but expected columns remain blank
- Some rows are skipped unexpectedly

### Checks

- Confirm sheet has a `URL` column.
- Confirm existing values are not already present (processed rows are skipped).
- For channel extraction, expect rule-based matching on backend parser configs.

### Fix

- Standardize URL column header to `URL`.
- Clear stale partial values for rows you want reprocessed.
- Re-run extraction after confirming permission and URL validity.

## 5) Archiving jobs (Bellingcat) appear stuck

### Symptoms

- Async start succeeds but completion is delayed
- Status endpoint remains `starting`/`running`

### Checks

- Poll `/bellingcat/auto-archiver/status/{jobId}` periodically.
- Expect longer startup when backend uses Azure Container Instances (image pull/start delay).
- Review backend logs for container/runtime errors if status becomes `failed`.

### Fix

- Continue status polling at sensible intervals (30–60s).
- Reduce URL batch size in sheet when jobs are very large.
- Validate backend storage/container configuration if failures repeat.

## 6) JSON export missing data

### Symptoms

- Exported report omits fields you expected

### Checks

- Confirm fields were entered in the active form sections.
- Confirm dynamic entries (authors, recommendations, actions) were added via UI controls.
- Confirm URL lists were loaded/applied before export.

### Fix

- Re-enter or re-add dynamic items.
- Re-run URL import/sync step before exporting.
- Export JSON first to quickly verify structured data completeness.

## Quick diagnostics checklist

- Confirm `config.js` values (`AZURE_BASE_URL`, service account email).
- Confirm Azure backend URL is reachable from browser.
- Confirm Google Sheet sharing/permissions for service account.
- Confirm endpoint-specific prerequisites (OpenAI key, parser configs, archive settings) are configured server-side.

## Support matrix (feature → required backend)

| Client feature | Required endpoint(s) | Primary server-side prerequisites |
|---|---|---|
| AI summary from PDF | `GET /cors-proxy/pdf`, `POST /generate-text` | Reachable PDF URL, OpenAI key/model configured on backend |
| Validate Google Sheet access | `GET /google-sheets/check-permissions` | Service account credentials configured; sheet shared with service account |
| Load sheet URL dataset | `GET /google-sheets/data-for-url` | Same as above; readable target sheet |
| Extract trusted domains | `POST /google-sheets/extract-domains` | Sheet has `URL` column; service account has Editor access |
| Extract malicious channels | `POST /google-sheets/extract-channels` | Parser/platform configs on backend; service account has Editor access |
| Archive via Wayback workflow | `GET/POST /google-sheets/archive-urls` | Wayback/archive workflow enabled; service account has Editor access |
| Start async Bellingcat archive | `POST /bellingcat/auto-archiver-sheets-asynchronous` | Auto-Archiver configured (ACI/Docker/local), storage + runtime config present |
| Check async Bellingcat status | `GET /bellingcat/auto-archiver/status/{jobId}` | Valid `jobId`; backend job tracking/state available |
| Reference data libraries | `GET /get-threat-actors`, `GET /get-narratives`, `GET /get-countermeasures` | Data files available server-side; endpoint CORS allows client origin |
