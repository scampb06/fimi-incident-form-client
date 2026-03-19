# Report Generation and Export

## Form data collection

Core form aggregation is implemented in `form-data-processing.js`:

- `collectFormData()` consolidates scalar fields, authors, narratives, and actions.
- `processNarratives()` prepares narrative/recommendation content from the form.
- `processObjectivesAndTTPs()` normalizes DISARM selections for output tables.

## JSON generation

JSON export is handled by `json-generator.js`:

- Builds a structured object via `buildIncidentJson()`
- Includes targeted countries, threat actors, narratives, DISARM tactics, actions, recommendations, and URL datasets
- Triggers browser download through `downloadAsJson()`

## Expected workflow

1. Complete all major form sections.
2. Use DISARM + URL tools as needed.
3. Generate AI summary (optional).
4. Export JSON for machine-readable archival or follow-on processing.
