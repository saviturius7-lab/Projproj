# Shramik Sakshi 🛠️
### Empowering the Unorganized Workforce with Digital Wage Protection

Shramik Sakshi is an automated wage protection and attendance verification system designed for the unorganized labor sector. By leveraging simple technology—WhatsApp and GPS—we provide laborers with an immutable "Digital Receipt" for every day of work, ensuring they have the proof needed to fight wage theft.

---

## 💡 The Problem
Millions of daily wage laborers face the constant risk of "wage theft," where contractors deny they worked specific days or withhold payments without evidence. Existing solutions require apps, smartphones, and digital literacy that the average laborer often lacks.

## 🚀 The Solution
**Shramik Sakshi** removes barriers:
1. **Attendance:** A laborer sends their location via WhatsApp.
2. **Verification:** The system generates an immediate, timestamped digital receipt.
3. **Transparency:** An NGO Dashboard tracks work history, providing a ledger that can be presented during labor disputes.

---

## 🛠️ Tech Stack (React + TypeScript)
- **Frontend / Dashboard:** React 18, TypeScript, Tailwind CSS, Vite
- **Mapping:** Leaflet & OpenStreetMap geospatial clustering
- **Typography & Theme:** Vintage warm parchment palette, Playfair Display & Lora serif typography
- **Verification Engine:** Cryptographic attendance token generator & client ledger persistence
- **Simulator:** In-browser WhatsApp & Twilio webhook testing console

---

## 📋 Features
- **Immutable Receipts:** Every location pin generates a verification token stored in our tamper-evident ledger.
- **Automated Wage Calculations:** Locks in daily wage rate (₹600.00 / day) to prevent manual accounting discrepancies.
- **NGO Command Center:** Live-updating deployment map, worker filter controls, dispute-free badges, and cumulative workday charts.
- **Interactive WhatsApp Bot Simulator:** Test sending location pins, requesting "Hisaab" (earnings), and inspecting generated digital receipts without needing external webhooks.
- **Audit Export:** Download official `.txt` and `.csv` work history audits for legal standing in labor courts and union disputes.

---

## 💻 Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`.

---

## ⚖️ License
MIT License. Built for the community, by the community.
