# Module Map

## Entry + configuration

- `index.html`: Main UI layout and script includes
- `main.js`: App initialization and default startup behavior
- `config.js`: Global runtime settings (Azure base URL, service account email, state counters)

## Form and UI logic

- `ui-interactions.js`: Tabs, dynamic field add/remove, URL validation hooks, modal interactions
- `form-data-processing.js`: Collects/normalizes form content for export
- `image-handling.js`: Image/logo handling for evidence/report content

## DISARM and taxonomy

- `disarm-framework-integration.js`: DISARM interactive modal + navigator upload parsing
- `objectives-ttps-management.js`: Selected objectives/TTPs UI state and counters
- `disarm-technique-selector.html`: Selector support UI
- `disarm-techniques.json`: Technique metadata source

## Country selector

- `country-selector.html`: Country selection UI
- `countries.json`: Country dataset

## URL intelligence + archiving

- `urls-management.js`: Trusted/malicious URL workflows, Google Sheets integrations, archive actions
- `url-validation.js`: Additional URL validation helper logic

## AI and external processing

- `pdf-ai-summarizer.js`: PDF extraction + server-assisted AI summary workflow

## Export generation

- `json-generator.js`: JSON schema export and download
