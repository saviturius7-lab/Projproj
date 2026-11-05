# Shramik Sakshi (श्रमिक साक्षी)
### Tamper-Resistant Attendance, Wage Protection & Muster Roll Ledger for Informal Labor

[![System Status](https://img.shields.io/badge/System-Online%20%26%20Operational-emerald.svg)]()
[![Deterministic Rule Bot](https://img.shields.io/badge/Architecture-100%25%20Deterministic%20(No%20LLM)-blue.svg)]()
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20HI%20%7C%20KN%20%7C%20TE%20%7C%20TA%20%7C%20ML-purple.svg)]()
[![Deployment](https://img.shields.io/badge/Cloud%20Run-Dual%20Port%20(8080%20%2F%203000)-teal.svg)]()
[![Compliance](https://img.shields.io/badge/Statutory-UWSSA%202008%20Compliant%20Audit-amber.svg)]()

---

## 1. Problem Statement

Across the Global South, over **450 million unorganized and daily-wage laborers**—including construction workers, masons, helpers, agricultural laborers, and gig hands—work without formal written contracts. Their compensation relies on oral promises and opaque, paper muster rolls kept exclusively by labor contractors (*thekedars* or *mukadams*).

This informal structure creates severe systemic failures:

1. **Rampant Wage Theft & Arbitrary Deductions**: At Friday or month-end cash disbursement, workers are routinely told: *"You missed Tuesday and Thursday,"* or *"You arrived late."* Without independent attendance records, workers cannot contest arbitrary wage withholdings.
2. **Ghost Worker Inflation vs. Real Worker Exclusion**: Corrupt contractors pad physical paper muster rolls with fictitious "ghost workers" to siphon project funds while underpaying the actual laborers on site.
3. **Severe Literacy & Digital Usability Barriers**: Mainstream enterprise HR, biometric, and ERP portals fail in the informal sector. They demand modern smartphones, high-speed data, app store installs, complex login credentials, and English literacy. Most laborers rely on feature phones or basic messaging in regional languages.
4. **Fragility of Third-Party Messaging Gateways**: Reliance on proprietary WhatsApp Sandboxes or carrier SMS gateways often leads to join failures, timeout errors, and recurring per-message costs that leave workers stranded in the field.
5. **Absence of Contemporaneous Legal Evidence**: Under the *Unorganized Workers' Social Security Act, 2008* (Section 9) and the *Minimum Wages Act*, workers are legally entitled to statutory wage protection. However, in labor disputes, workers lack verifiable timestamps, GPS stamps, and cryptographic audit trails to prove their presence before labor conciliation officers.

---

## 2. The Solution: Shramik Sakshi

**Shramik Sakshi (श्रमिक साक्षी — "Worker's Witness")** bridges the chasm between informal work environments and legal wage protection. It provides a lightweight, resilient, zero-friction attendance tracking and wage security platform:

- **1-Click Attendance & Instant Wage Locking**: Workers or site supervisors log daily attendance with a single tap. The system immediately captures the timestamp, GPS coordinates, worker phone number, and binds a guaranteed statutory wage (default ₹600.00/day).
- **Zero-Hallucination Deterministic Rule Bot**: Completely bypasses unreliable LLMs. A finite-state deterministic engine handles multilingual attendance pins, calculations, and dispute intake with 100% mathematical predictability.
- **Cryptographic Receipt Tokens (`SHP-XXXX-XXXX`)**: Generates tamper-evident carbon-copy digital receipts featuring verification tokens, security stamps, and geolocation coordinates. Receipts can be printed, downloaded as text audit slips, or presented for weekly wage clearance.
- **In-App Field Telegraph Station**: Operates without external WhatsApp or Twilio dependencies by providing an in-app teletype dispatch console (`/api/dispatch`), while retaining an open, standards-compliant webhook for production SMS/WhatsApp integration.
- **Multilingual Voice & Visual Accessibility**: Fully localized across **6 major languages** (English, Hindi, Kannada, Telugu, Tamil, Malayalam) with native Indic typography and built-in speech synthesis (Read Aloud 🔊) for low-literacy workers.
- **Interactive Dual Field Tutorials**: Role-tailored walkthroughs for **Workers** (pictorial, simple vocabulary, audio narration) and **Admins/Contractors** (muster roll audits, wage liability calculations, and fraud prevention).
- **Tactile Storybook Aesthetics**: Inspired by classic hand-inked storybook illustrations and dollhouse architectural cross-sections, featuring organic irregular borders (`comic-card`), high-contrast legibility, and an optical green-pink twilight sky with a live Craig Reynolds boids flocking simulation.

---

## 3. System Architecture & Technical Design

Shramik Sakshi is built as a full-stack, decoupled application combining a React 18 SPA frontend, an Express 5 resilient backend, and an in-memory/file-based hybrid ledger.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (React 18 SPA)                      │
│                                                                             │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌───────────────┐  │
│  │ Field Telegraph Station│  │ Worker Passbook & Slip │  │ Live Work Map │  │
│  │  (1-Click Attendance)  │  │  (Cryptographic Token) │  │ (Leaflet GPS) │  │
│  └───────────┬────────────┘  └───────────┬────────────┘  └───────┬───────┘  │
│              │                           │                       │          │
│  ┌───────────┴───────────────────────────┴───────────────────────┴───────┐  │
│  │ Dual Tutorial Engine (Worker Pictorial Guide & Admin Supervisor Guide)│  │
│  │ SpeechSynthesis API (Audio Read-Aloud in HI, KN, TE, TA, ML, EN)      │  │
│  └───────────────────────────────────────┬───────────────────────────────┘  │
│                                          │                                  │
│  ┌───────────────────────────────────────┴───────────────────────────────┐  │
│  │ Craig Reynolds Boids Canvas (Flocking Simulation in Twilight Sky)     │  │
│  └───────────────────────────────────────┬───────────────────────────────┘  │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │ HTTP (REST + Webhook)
┌──────────────────────────────────────────▼──────────────────────────────────┐
│                         BACKEND LAYER (Node.js & Express 5)                 │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Dual-Port Resilient Listener (Container PORT=8080 & Local PORT=3000)  │  │
│  └───────────────────────────────────────┬───────────────────────────────┘  │
│                                          │                                  │
│  ┌───────────────────────────────────────▼───────────────────────────────┐  │
│  │ Pre-AI Deterministic Rule Engine (src/services/preAiBot.ts)           │  │
│  │  - Finite-State In-Memory Conversation Memory                         │  │
│  │  - Multi-Keyword Parser: EN, HI, KN, TE, TA, ML                       │  │
│  │  - Zero Hallucination Rate, Dispute & Hisaab Handlers                 │  │
│  └───────────────────────────────────────┬───────────────────────────────┘  │
│                                          │                                  │
│  ┌───────────────────────────────────────▼───────────────────────────────┐  │
│  │ Unified Dispatch Pipeline                                             │  │
│  │  - POST /api/dispatch (In-App Teletype & Rapid Punch)                 │  │
│  │  - POST /api/webhook  (Twilio / WhatsApp TwiML Gateway)               │  │
│  └───────────────────────────────────────┬───────────────────────────────┘  │
│                                          │                                  │
│  ┌───────────────────────────────────────▼───────────────────────────────┐  │
│  │ Persistent Work Log Ledger (Atomic JSON I/O + Browser LocalStorage)  │  │
│  │  - File: work_logs_db.json                                            │  │
│  │  - Key:  shramik_sakshi_work_logs_v1                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Architectural Highlights

### 4.1. Pre-AI Deterministic Rule Engine (`preAiBot.ts`)
In informal labor environments, a statistical language model (LLM) is a liability: probabilistic generation can hallucinate wage entitlements, invent non-existent government orders, or miscalculate cumulative earnings.

Shramik Sakshi uses a **formal finite-state machine (FSM)**:
- **Zero Probability of Hallucination**: Every incoming phrase is parsed through explicit regex and keyword dictionaries across 6 languages.
- **Multilingual Token Equivalence**:
  ```typescript
  // Example: English, Hindi, Kannada, Telugu, Tamil, Malayalam trigger mapping
  const ATTENDANCE_TRIGGERS = [
    'work', 'present', 'kaam', 'shram', 'punch', 'aaya',
    'काम', 'हाजिरी', 'उपस्थित', 'ಕೆಲಸ', 'ಹಾಜರಾತಿ', 'పని', 'హాజరు',
    'வேலை', 'வருகை', 'ജോലി', 'ഹാജർ'
  ];
  ```
- **Stateful Dispute Capture**: Handles multi-turn complaint intake (Contractor Name $\rightarrow$ Claimed Wage Amount $\rightarrow$ Dispute Filing) with deterministic state transitions.

### 4.2. Dual-Port Container Listener (`server.ts`)
To resolve cloud container timeout errors on Google Cloud Run and Kubernetes without breaking local Vite hot-reloading:
- The server detects `process.env.PORT` (defaults to `8080` for Cloud Run container health checks).
- In development mode, it simultaneously mounts Vite middleware on port `3000`.
- Implements Express 5 wildcard route syntax (`{ *path }`) to safely serve both dynamic API routes and client-side single-page application fallback routing.

### 4.3. Cryptographic Verification Token Generation
Each attendance punch executes an atomic receipt generation routine:
$$\text{Token} = \text{SHP} - \text{RandHex}_1 - \text{RandHex}_2$$
Combined with:
- ISO 8601 UTC + Local IST Timestamp
- Geo-coordinates rounded to 5 decimal places ($\approx 1.1\text{m}$ precision)
- Statutory wage allocation (₹600.00)
- Digital Carbon-Copy certificate with authentic security stamp and seal for physical printing or mobile presentation.

### 4.4. Decoupled In-App Dispatch vs. Cloud SMS Gateway
Rather than coupling system availability to external WhatsApp Sandbox join codes, Shramik Sakshi implements an **internal wire dispatcher**:
- **In-App Dispatch (`/api/dispatch`)**: Executes full end-to-end command parsing, ledger persistence, and receipt generation directly from the UI teletype console.
- **External Webhook (`/api/webhook`)**: Accepts standard `multipart/form-data` and `application/x-www-form-urlencoded` payloads from Twilio, returning standards-compliant XML (`TwiML`) responses.

### 4.5. High-Accessibility Dual Tutorial System (`TutorialModal.tsx`)
Recognizing that site supervisors and daily laborers have fundamentally different technical literacy levels, the tutorial architecture splits into two distinct modes:

| Feature | 👷 Worker Guide (मजदूर साथी) | 📋 Admin & Supervisor Guide (ठेकेदार डेस्क) |
| :--- | :--- | :--- |
| **Target Audience** | Daily laborers, helpers, masons | Contractors, site engineers, supervisors |
| **Vocabulary Level** | Plain colloquial, high pictorial clarity | Administrative, regulatory, audit-focused |
| **Key Steps** | 1-Click punch, ₹600 lock, slip proof, passbook | Dispatch station, liability audit, token verify, map pins |
| **Audio Assist** | Built-in Web Speech API read-aloud (🔊) | Quick interactive practice shortcuts |
| **Direct Action** | "Try Attendance Punch Now →" | "Inspect Muster Roll Register →" |

### 4.6. Craig Reynolds Flocking Boids & Atmospheric Sky (`BoidsCanvas.tsx`)
Behind the tactile storybook cards, the background features an authentic Craig Reynolds artificial life flocking simulation:
- **Flocking Dynamics**: Swallows execute continuous Separation, Alignment, Cohesion, and Cursor Evasion algorithms on an HTML5 2D Canvas.
- **Realistic Green-Pink Optical Twilight Atmosphere**: Replaces synthetic gradients with a natural Rayleigh-Mie scattering sequence flowing from dusky berry-rose (`#8c3f5f`) zenith down through warm apricot-peach (`#f3a59b`), into a luminous celadon/seafoam horizon band (`#beddb4`) and rolling earthy olive hills (`#38531b`).
- **Drifting Clouds with Sleeping Faces**: Softly shaded cumulus clouds drift horizontally across the canvas with hand-inked lineart and peaceful expression details.

---

## 5. API Reference

### Core Endpoints

| Method | Route | Description | Payload / Parameters | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/logs` | Fetch all work log entries | None | `{ success: true, count: number, logs: WorkLog[] }` |
| `POST` | `/api/logs` | Manually append a work log | `WorkLog` JSON object | `{ success: true, log: WorkLog }` |
| `POST` | `/api/dispatch` | Dispatch message via rule engine | `{ from: string, body: string, latitude?: number, longitude?: number }` | `{ success: true, reply: string, log?: WorkLog, action: string }` |
| `POST` | `/api/reset` | Restore built-in sample data | None | `{ success: true, message: string }` |
| `GET` | `/api/status` | Health check & system status | None | `{ status: "ok", engine: "pre-ai-rule-bot-v2", port: number }` |
| `POST` | `/api/webhook` | Inbound Twilio WhatsApp gateway | Form fields: `From`, `Body`, `Latitude`, `Longitude` | XML (`application/xml`) TwiML response |

---

## 6. Directory Structure

```text
.
├── server.ts                       # Express 5 server (API, dual-port listener, webhook, JSON storage)
├── work_logs_db.json               # Server-side persistent work log ledger
├── package.json                    # Dependencies, build, and run scripts
├── index.html                      # HTML5 entry point with Inter & Indic typography
├── vite.config.ts                  # Vite build configuration
├── src/
│   ├── App.tsx                     # Main dashboard container, navigation tabs & state coordination
│   ├── index.css                   # Tailwind CSS, optical twilight gradient & comic-card styles
│   ├── types.ts                    # TypeScript interfaces (WorkLog, WorkerSummary, ChatMessage)
│   ├── components/
│   │   ├── BoidsCanvas.tsx         # Craig Reynolds flocking algorithm & drifting clouds canvas
│   │   ├── DigitalReceiptModal.tsx # Carbon-copy digital certificate with verification token
│   │   ├── FieldTelegraphStation.tsx# 1-Click attendance punch & teletype tape
│   │   ├── Header.tsx              # Scalloped roof header, language selector & guide launchers
│   │   ├── LedgerTable.tsx         # Searchable, sortable daily muster roll table
│   │   ├── LiveMap.tsx             # Leaflet GIS work-site mapping & location pins
│   │   ├── MetricsOverview.tsx     # 3 Dollhouse room cards (Laborers, Man-Days, Wage Liability)
│   │   ├── Sidebar.tsx             # Worker selector, quick check-in & tutorial cards
│   │   ├── TutorialModal.tsx       # Dual Worker/Admin interactive guide with speech synthesis
│   │   ├── WhatsAppSimulatorModal.tsx # Teletype console for field testing
│   │   └── WhatsAppConnectHub.tsx  # Production Twilio webhook connection instructions
│   ├── context/
│   │   └── LanguageContext.tsx     # React context for active language state & localStorage persistence
│   ├── data/
│   │   └── initialLogs.ts          # Bundled demonstration muster roll records
│   ├── i18n/
│   │   ├── translations.ts         # Multilingual UI dictionary (EN, HI, KN, TE, TA, ML)
│   │   └── tutorialData.ts         # Structured bilingual tutorial content & audio scripts
│   └── services/
│       ├── preAiBot.ts             # Deterministic finite-state rule bot
│       └── storage.ts              # Browser fallback storage & text audit export generators
```

---

## 7. Local Setup & Execution

### Prerequisites
- **Node.js**: Version 22.0 or higher
- **npm**: Version 10.0 or higher

### Installation & Development
```bash
# 1. Clone the repository
git clone https://github.com/your-username/shramik-sakshi.git
cd shramik-sakshi

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Production Build & Deployment
```bash
# 1. Compile TypeScript and build production bundle
npm run build

# 2. Start the production server
npm start
```
The server will automatically listen on `PORT=8080` (or `process.env.PORT`) in containerized environments (Google Cloud Run, AWS ECS, Docker).

---

## 8. Verification & Testing

Verify that all TypeScript types, Vite bundling, and server endpoints are functioning correctly:

```bash
# Run TypeScript compilation check
npm run lint

# Verify production build compilation
npm run build

# Test API server health check
curl -s http://localhost:3000/api/status
```

---

## 9. Legal Context & Compliance Notes

Shramik Sakshi is designed to assist informal workers in documenting evidence under:
- **The Unorganized Workers' Social Security Act, 2008 (Act No. 33 of 2008)**
- **The Minimum Wages Act, 1948**
- **Building and Other Construction Workers (BOCW) Act, 1996**

*Notice*: In its current release, Shramik Sakshi operates as a demonstration and operational prototype. While the deterministic receipts provide contemporaneous timestamped records, formal legal proceedings may require integration with certified hardware cryptographic modules or government portal APIs (*e-Shram*).

---

## 10. License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
