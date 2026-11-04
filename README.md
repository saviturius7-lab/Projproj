# Shramik Sakshi

Shramik Sakshi is a prototype wage-and-attendance record system for informal and daily-wage work. It combines a React dashboard, a local/server-side work-log ledger, a deterministic multilingual command handler, and simulated field/WhatsApp workflows.

The repository implements a demonstration of those flows. It does **not** provide cryptographically immutable records, independently verify a worker's physical presence, calculate legally applicable minimum wages, or automatically file/forward a legal complaint. Treat generated receipts and exports as prototype records, not certified legal evidence.

## What the application does

- **Attendance capture:** Create an attendance entry from a selected sample worksite or the browser Geolocation API. The record stores coordinates, a timestamp, phone number, wage estimate, status, and generated reference token.
- **Deterministic command handling:** A rule-based finite-state command handler processes attendance pins and text commands. It includes explicit phrase/keyword matching for English, Hindi, Kannada, Telugu, Tamil, and Malayalam.
- **Worker ledger:** View records in a searchable, sortable register and filter by worker phone number.
- **Worker passbook:** Review a selected worker's logged entries and wage estimates, with a chronological list and downloadable text audit.
- **Receipts:** Open a record as a receipt, copy it as text, or send it to the browser print dialog.
- **Map view:** Leaflet plots records with coordinates on OpenStreetMap tiles. Markers can be opened to inspect a record and its receipt.
- **WhatsApp-style testing:** An in-app conversation simulator exercises the command handler without a WhatsApp account. A separate Twilio-compatible webhook endpoint accepts inbound form fields and returns TwiML; the UI includes instructions for configuring a Twilio WhatsApp Sandbox.
- **Language selection:** Dashboard labels are available in English, Hindi, Kannada, Telugu, Tamil, and Malayalam. The selected interface language is saved in browser local storage.
- **Sample data and reset:** The project starts with bundled demonstration records. The dashboard reset action restores the sample data.

## Command handler

The rule engine lives in **src/services/preAiBot.ts**. It maintains an in-memory conversation state per phone number and recognizes commands for:

| Command | Current behavior |
| --- | --- |
| Location pin / coordinates | Creates an attendance-style record with the supplied coordinates |
| 2, Hisaab, Earnings | Summarizes the worker's logged record count and estimated earnings |
| 3, Shikayat, Dispute | Starts a multi-step dispute intake for contractor name and claimed amount |
| 4, Rate, Wage | Returns the project's hard-coded wage/rate information |
| 5, Help, SOS | Returns the hard-coded help/helpline response |
| 6, Site | Prompts for a manual site code from the predefined site list |
| MENU or other text | Returns the command menu |

Command matching is deterministic rule/keyword matching, not an AI/LLM conversation system. Language support in the bot is based on explicit phrase and keyword rules; it is not comprehensive natural-language understanding.

## How data is stored

- Browser fallback data uses localStorage under the key **shramik_sakshi_work_logs_v1**.
- The Express server loads and writes records to the root-level **work_logs_db.json** file.
- The frontend requests **GET /api/logs** and refreshes from the server every six seconds. If that request fails, it falls back to browser storage.
- The server's initial records and the frontend's initial records are defined separately in **server.ts** and **src/data/initialLogs.ts**.

This is a lightweight prototype storage arrangement, not a production database. The JSON file is not an append-only or tamper-evident ledger, and browser local storage can be edited or cleared by the user.

## Technology

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS
- **Backend:** Express 5, Node.js
- **Maps:** Leaflet with OpenStreetMap tiles
- **UI icons:** lucide-react
- **QR rendering dependency:** qrcode.react is included in the dependencies
- **Language content:** Local translation dictionary in **src/i18n/translations.ts**

There is no external database, authentication provider, AI model, payment integration, or Twilio SDK configured in this repository.

## Project structure

~~~text
.
├── server.ts                     # Express server, API routes, webhook, JSON-file persistence
├── work_logs_db.json             # Server-side prototype work-log data
├── src/
│   ├── App.tsx                   # Dashboard state, navigation, and data synchronization
│   ├── components/
│   │   ├── FieldTelegraphStation.tsx
│   │   ├── WhatsAppSimulatorModal.tsx
│   │   ├── WhatsAppConnectHub.tsx
│   │   ├── LedgerTable.tsx
│   │   ├── WorkerProfile.tsx
│   │   ├── LiveMap.tsx
│   │   └── DigitalReceiptModal.tsx
│   ├── context/LanguageContext.tsx
│   ├── data/initialLogs.ts        # Browser fallback sample records
│   ├── i18n/translations.ts       # Interface translations
│   ├── services/
│   │   ├── preAiBot.ts            # Deterministic multilingual command engine
│   │   └── storage.ts             # Browser storage, record helpers, text audit export
│   └── types.ts
├── index.html
├── package.json
└── vite.config.ts
~~~

## Run locally

### Requirements

- Node.js 22.6 or newer (the current scripts run server.ts directly using Node's built-in TypeScript support)
- npm

### Development

~~~bash
npm install
npm run dev
~~~

The Express/Vite development server listens on port 3000 by default. Open http://localhost:3000 in your browser.

### Production build and start

~~~bash
npm install
npm run build
npm start
~~~

The build runs TypeScript checking and creates the Vite production bundle in dist/. The production server serves that bundle and the API from the same Express process. The server uses process.env.PORT when provided, otherwise port 3000.

### Available scripts

| Script | What it does |
| --- | --- |
| npm run dev | Starts the Express server with Vite middleware |
| npm run build | Runs tsc and vite build |
| npm start | Starts the server in production mode; build first |
| npm run lint | Runs tsc --noEmit (there is no ESLint configuration/script) |
| npm run preview | Runs Vite's preview server for the built frontend |

There is currently no automated test script in package.json.

## HTTP endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /api/logs | Returns the server's current work-log array |
| POST | /api/logs | Adds a supplied log object (currently checks only that a phone number is present) |
| POST | /api/dispatch | Runs a text/location command through the server-side rule engine and persists a record when the engine returns log data |
| POST | /api/reset | Replaces server records with the built-in sample records |
| GET | /api/status | Returns a basic server/engine status payload |
| POST | /api/webhook or /webhook | Accepts Twilio-style inbound message fields and returns a TwiML message response |

The webhook reads From, Body, Latitude, and Longitude from form/body or query parameters. To use it with Twilio Sandbox, the server must be reachable from the public internet and the incoming-message webhook must be configured in Twilio Console. The repository does not provision a Twilio account or deploy the server for you.

## Important implementation boundaries

These limitations are visible in the current code and should be addressed before any real-world deployment:

- **No record immutability:** Tokens are generated with Math.random(); there is no digital signature, hash chain, trusted timestamp, append-only storage, or audit trail protecting records against modification.
- **No independent location verification:** The app records coordinates supplied by browser geolocation, a selected preset site, or a webhook request. It does not verify GPS authenticity, enforce geofences, or prove that the worker was physically present.
- **No authentication or authorization:** The API currently has no user/worker login, role-based access, or protection for record reads, writes, reset, and dispatch routes. CORS is enabled broadly.
- **Prototype persistence:** Server data is stored in a local JSON file. This is not suitable for concurrent production workloads, reliable backups, or multi-instance hosting.
- **Fixed wage assumptions:** ₹600 is embedded in the rule engine, sample records, and UI. It is a demonstration value, not a jurisdiction-aware or legally maintained minimum-wage calculation. Wage-rate and helpline text is static project content and has not been legally validated by this codebase.
- **Disputes are recorded locally:** The bot collects a contractor name and claimed amount and creates a disputed record. It does not submit a government/union filing, contact an NGO, or verify that a complaint was received.
- **WhatsApp integration needs setup and validation:** The webhook route and Twilio Sandbox instructions are present, but a live connection requires external Twilio configuration, a public HTTPS deployment, and end-to-end testing. The in-app simulator is not a live WhatsApp client.
- **Map display is basic:** The map uses ordinary Leaflet layer-group markers; no clustering engine is implemented.
- **Session state is in memory:** Multi-step bot conversations are lost when the relevant server process restarts and are not shared across multiple server instances.
- **Sample data is illustrative:** Names, phone numbers, work locations, tokens, and timestamps in the initial datasets are demo records, not verified worker records.

## License

MIT. See [LICENSE](LICENSE).
