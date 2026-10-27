<p align="center"><img src="dist/logo.png" width="140" alt="Car Pocket logo"></p>

# Car Pocket

A mobile-friendly digital glovebox for vehicle details, documents, and oil-change tracking. Designed and iterated by **Ratul Islam**, with AI-assisted implementation using ChatGPT/Codex.

**[Live app](https://car-pocket-ratul.chirpywasp67.chatgpt.site/)**

## Why I built it

Vehicle information is often scattered across photos and paperwork. Car Pocket brings it into a single password-protected wallet that is easy to access on a phone.

## Features

- Vehicle year, make, model, plate, VIN, and odometer.
- Wikimedia Commons reference-photo lookup, personal photo upload, or illustration.
- Driver’s license, registration, and insurance details with expiration dates.
- Optional JPEG, PNG, WebP, and PDF uploads; image preview and zoom.
- Save details independently of file uploads; calendar picker and US date format.
- Oil-change reminders after two calendar months or at 700 miles remaining.
- Five-day odometer update prompts, reset whenever a reading is saved.
- Personalized greetings, light/dark themes, and Home Screen installation support.
- Encrypted backup export and restore.

## Stack and local setup

Vanilla JavaScript, HTML, CSS, IndexedDB, Web Crypto, service workers, and a web app manifest. No build step, framework, backend, or API key required.

With Python 3 installed, run from this repository:

```sh
python3 -m http.server 8000 --directory dist
```

Open **http://localhost:8000**. Use localhost for development and HTTPS for production so Web Crypto and service workers are available. Do not open index.html directly as a file.

## Source layout

| File | Responsibility |
| --- | --- |
| `dist/index.html` | App shell and dialogs |
| `dist/app.js` | Encryption, persistence, forms, documents, reminders |
| `dist/style.css` | Responsive layout and themes |
| `dist/theme.js` | Theme preference persistence |
| `dist/calendar.js` | Calendar picker |
| `dist/car-photos.js` | Photo search, ranking, and processing |
| `dist/sw.js` | Shell caching |
| `dist/manifest.webmanifest` | Install metadata and icons |

## Privacy and storage

Wallet contents are encrypted with AES-GCM using a 256-bit key derived via PBKDF2-SHA-256 (250,000 iterations and a random salt). Each encryption uses a fresh random IV. The encrypted payload is stored locally in IndexedDB.

The greeting name is also cached outside encryption to show before unlocking. Theme preference uses localStorage. Photo lookup sends vehicle search details to Wikimedia Commons, but not plate, VIN, or documents. Reference-photo attribution is retained in the wallet.

There is no password recovery or automatic cloud sync. Export an encrypted backup before changing devices or clearing website data. This portfolio application has not undergone an independent security audit.

## Limitations

- Reminders are in-app prompts, not push notifications.
- Mileage updates are manual.
- Reference photos may differ in color or trim; some vehicles have no match.
- Shell caching is provided, but offline startup is not guaranteed across platforms.
- Paths assume hosting at the origin root. GitHub Pages project subpaths require path adjustments before deployment.

## Validation

```sh
node --check dist/app.js
node --check dist/calendar.js
node --check dist/car-photos.js
node --check dist/theme.js
node --check dist/sw.js
```

Development checks covered reminder thresholds (700 miles, overdue mileage, two-month month-end handling, and five-day odometer freshness). Manual browser checks covered theme switching and persistence. These are not a comprehensive automated test suite.

## Credits

Product direction and iterative feature decisions: **Ratul Islam**. Implementation and logo refinement used **ChatGPT/Codex** assistance. Vehicle reference photography comes from Wikimedia Commons with individual attribution shown in the app. Personal wallet contents and uploaded documents are stored on the user's device and are not included in this repository.
