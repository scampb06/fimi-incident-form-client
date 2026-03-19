# Report Generation and Export

## Form data collection

Core form aggregation is implemented in `form-data-processing.js`:

- `collectFormData()` consolidates scalar fields, authors, narratives, and actions.
- `processNarratives()` prepares paragraph content for DOCX narrative/recommendation sections.
- `processObjectivesAndTTPs()` normalizes DISARM selections for output tables.

## DOCX generation

DOCX flow is orchestrated in `docx-generator.js`:

1. Collects form + narrative + objective/TTP data
2. Builds table sections using:
   - `docx-header-tables.js`
   - `docx-summary-table.js`
   - `docx-content-tables.js`
   - `docx-footer-tables.js`
3. Packs and downloads `.docx` with a title-derived filename

The output includes summary, incident, narrative, impact, objectives/TTPs, recommendations, and footer/evidence sections.

## JSON generation

JSON export is handled by `json-generator.js`:

- Builds a structured object via `buildIncidentJson()`
- Includes targeted countries, threat actors, narratives, DISARM tactics, actions, recommendations, and URL datasets
- Triggers browser download through `downloadAsJson()`

## Expected workflow

1. Complete all major form sections.
2. Use DISARM + URL tools as needed.
3. Generate AI summary (optional).
4. Export DOCX for formatted report delivery.
5. Export JSON for machine-readable archival or follow-on processing.
