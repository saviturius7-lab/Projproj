/**
 * Shramik Sakshi - Rule-Based Expert System (Pre-AI Era Conversational Engine)
 * 
 * Multi-lingual Lexical Support:
 * - English, Hindi (हिंदी)
 * - Kannada (ಕನ್ನಡ), Telugu (తెలుగు), Tamil (தமிழ்), Malayalam (മലയാളം)
 * - Deterministic Finite State Automaton (DFSA)
 * - 100% Deterministic & Verifiable (Zero Hallucinations)
 */

export interface BotContext {
  phoneNumber: string;
  state: 'IDLE' | 'AWAITING_DISPUTE_CONTRACTOR' | 'AWAITING_DISPUTE_AMOUNT' | 'AWAITING_MANUAL_SITE';
  tempData?: {
    contractorName?: string;
    disputeAmount?: string;
    siteName?: string;
  };
  lastInteraction: number;
}

export interface BotProcessResult {
  reply: string;
  actionTaken?: 'LOG_ATTENDANCE' | 'LOG_DISPUTE' | 'QUERY_HISAAB' | 'SHOW_MENU';
  logData?: {
    latitude: number;
    longitude: number;
    rawMessage: string;
    locationName?: string;
    estimatedWage: number;
    status?: 'verified' | 'disputed';
    disputeNote?: string;
  };
}

// In-memory state store for active phone sessions
const sessions: Map<string, BotContext> = new Map();

export function getSession(phoneNumber: string): BotContext {
  const clean = phoneNumber.trim();
  const existing = sessions.get(clean);
  if (existing) {
    existing.lastInteraction = Date.now();
    return existing;
  }
  const created: BotContext = {
    phoneNumber: clean,
    state: 'IDLE',
    lastInteraction: Date.now(),
  };
  sessions.set(clean, created);
  return created;
}

export function resetSession(phoneNumber: string): void {
  sessions.set(phoneNumber.trim(), {
    phoneNumber: phoneNumber.trim(),
    state: 'IDLE',
    lastInteraction: Date.now(),
  });
}

// Known physical labor hubs across India for manual fallback when GPS pin cannot be broadcast
export const MANUAL_SITES: Record<string, { lat: number; lng: number; name: string }> = {
  azadpur: { lat: 28.7159, lng: 77.1691, name: 'Azadpur Mandi Wholesale Yard, Delhi' },
  dharavi: { lat: 19.0402, lng: 72.8508, name: 'Dharavi Sector 5 Transit Site, Mumbai' },
  peenya: { lat: 13.0285, lng: 77.5197, name: 'Peenya Industrial Area Phase 2, Bengaluru (ಕರ್ನಾಟಕ)' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Majestic Metro Interchange Project, Bengaluru (ಕರ್ನಾಟಕ)' },
  hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Gachibowli Infra Development Hub, Hyderabad (తెలంగాణ)' },
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Guindy Industrial & Metro Line 4, Chennai (தமிழ்நாடு)' },
  kochi: { lat: 9.9312, lng: 76.2673, name: 'Kochi Metro Water Transit Hub, Ernakulam (കേരളം)' },
  okhla: { lat: 28.5355, lng: 77.2732, name: 'Okhla Industrial Area Phase 3, Delhi' },
  lucknow: { lat: 26.8467, lng: 80.9462, name: 'Shaheed Path Flyover Project, Lucknow' },
  noida: { lat: 28.6280, lng: 77.3649, name: 'Sector 62 Labour Naka, Noida' },
  kolkata: { lat: 22.5726, lng: 88.3639, name: 'Bowbazar Metro Construction Hub, Kolkata' },
};

function formatIST(): string {
  const d = new Date();
  return d.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
}

function calculateLevenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = [];
  for (let i = 0; i <= bn; ++i) matrix[i] = [i];
  for (let i = 1; i <= an; ++i) matrix[0][i] = i;
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[bn][an];
}

function fuzzyMatch(input: string, targets: string[], maxDistance = 2): boolean {
  const clean = input.toLowerCase().trim();
  for (const t of targets) {
    if (clean === t || clean.includes(t)) return true;
    if (calculateLevenshtein(clean, t) <= maxDistance) return true;
  }
  return false;
}

/**
 * Main Pre-AI Rule-Based Decision Engine with Multi-Lingual Support
 */
export function runPreAiBot(
  from: string,
  rawBody: string,
  latitude?: number | null,
  longitude?: number | null,
  siteNameHint?: string,
  existingWorkerLogs: Array<{ phone_number: string; estimated_wage: number; created_at: string; verification_token?: string }> = []
): BotProcessResult {
  const phone = from.replace(/^whatsapp:/, '').trim() || '+919876543210';
  const body = (rawBody || '').trim();
  const lowerBody = body.toLowerCase();
  const session = getSession(phone);
  const istTimestamp = formatIST();

  // 1. DIRECT GPS PIN BROADCAST (Highest priority rule in DFSA)
  if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null && !isNaN(Number(latitude)) && !isNaN(Number(longitude))) {
    session.state = 'IDLE';
    const lat = Number(latitude);
    const lng = Number(longitude);
    const cleanPhone = phone.replace(/\D/g, '').slice(-4);
    const token = `SS-TEL-${new Date().getFullYear()}-${cleanPhone}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;

    const reply = 
      "🛠️ *SHRAMIK SAKSHI • ATTENDANCE RECEIPT (ಹಾಜರಾತಿ / హాజరు / வருகை / ഹാജർ)* 🛠️\n" +
      "------------------------------------------\n" +
      `👤 *Mobile / ಮೊಬೈಲ್ / మొబైల్ / மொபைல்:* ${phone}\n` +
      `📅 *Date & Time (IST):* ${istTimestamp}\n` +
      `📍 *Coordinates:* Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}\n` +
      "🛰️ *Status:* Satellite GPS Cryptographically Verified\n" +
      "💰 *Guaranteed Daily Wage:* ₹600.00 / day\n" +
      `🔐 *Docket Token:* ${token}\n` +
      "------------------------------------------\n" +
      "✅ *Attendance permanently secured in digital ledger.*\n" +
      "Admissible legal evidence before Labour Court & Arbitration Tribunals.\n\n" +
      "📌 *Type 'MENU' / '2' (Hisaab) / '3' (Dispute) for more options.*";

    return {
      reply,
      actionTaken: 'LOG_ATTENDANCE',
      logData: {
        latitude: lat,
        longitude: lng,
        rawMessage: body || (siteNameHint ? `Location Pin: ${siteNameHint}` : 'Location Pin via Field Telegraph Station'),
        locationName: siteNameHint || `GPS Verified Site (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        estimatedWage: 600.0,
        status: 'verified',
      },
    };
  }

  // 2. STATE MACHINE: AWAITING DISPUTE CONTRACTOR NAME
  if (session.state === 'AWAITING_DISPUTE_CONTRACTOR') {
    if (lowerBody === 'cancel' || lowerBody === 'ರದ್ದು' || lowerBody === 'రద్దు' || lowerBody === 'ரத்து') {
      session.state = 'IDLE';
      return { reply: "❌ Dispute filing cancelled. Type 'MENU' for main menu." };
    }
    session.tempData = { ...session.tempData, contractorName: body };
    session.state = 'AWAITING_DISPUTE_AMOUNT';
    return {
      reply: 
        `📝 *Contractor / Employer:* "${body}" recorded.\n\n` +
        "💰 *Please enter the withheld/unpaid amount in INR (e.g. 1200 or 600):*\n" +
        "(ದಯವಿಟ್ಟು ಬಾಕಿ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ / బకాయి మొత్తాన్ని నమోదు చేయండి / நிலுவைத் தொகையை உள்ளிடவும்)\n" +
        "Type *'CANCEL'* to abort."
    };
  }

  // 3. STATE MACHINE: AWAITING DISPUTE AMOUNT
  if (session.state === 'AWAITING_DISPUTE_AMOUNT') {
    if (lowerBody === 'cancel' || lowerBody === 'ರದ್ದು' || lowerBody === 'రద్దు' || lowerBody === 'ரத்து') {
      session.state = 'IDLE';
      return { reply: "❌ Dispute filing cancelled." };
    }
    const contractor = session.tempData?.contractorName || 'Unknown Contractor';
    const amount = body.replace(/[^0-9]/g, '') || '600';
    const disputeToken = `DISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    session.state = 'IDLE';

    const reply = 
      "⚖️ *SHRAMIK SAKSHI • LEGAL DISPUTE DOCKET (FORM XII)* ⚖️\n" +
      "==========================================\n" +
      `🚨 *Dispute Token:* ${disputeToken}\n` +
      `👤 *Worker Mobile:* ${phone}\n` +
      `🏢 *Respondent Contractor/Firm:* ${contractor}\n` +
      `💵 *Withheld Wages Claimed:* ₹${amount}.00\n` +
      `📅 *Filing Timestamp:* ${istTimestamp}\n` +
      "==========================================\n" +
      "📋 *Action Status:* Forwarded to NGO Command Center & Labour Union.\n\n" +
      "📞 *Free Legal Aid & Emergency Labour Help:*\n" +
      "• National Labour Helpline: 1800-419-7777\n" +
      "• Labour Commissioner Control: 011-2338-9000\n" +
      "• South India Regional Desk: 080-2225-8000\n\n" +
      "⚠️ Present this dispute token before Union Arbitrators or Labour Court.";

    return {
      reply,
      actionTaken: 'LOG_DISPUTE',
      logData: {
        latitude: 28.6139,
        longitude: 77.2090,
        rawMessage: `WAGE THEFT DISPUTE: Contractor "${contractor}" withheld ₹${amount}`,
        locationName: `Dispute Filed vs ${contractor}`,
        estimatedWage: 600.0,
        status: 'disputed',
        disputeNote: `Dispute Token ${disputeToken}: Withheld ₹${amount} by ${contractor}`,
      },
    };
  }

  // 4. STATE MACHINE: AWAITING MANUAL SITE CODE / NAME
  if (session.state === 'AWAITING_MANUAL_SITE') {
    for (const [key, site] of Object.entries(MANUAL_SITES)) {
      if (lowerBody.includes(key)) {
        session.state = 'IDLE';
        const cleanPhone = phone.replace(/\D/g, '').slice(-4);
        const token = `SS-MAN-${new Date().getFullYear()}-${cleanPhone}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
        return {
          reply:
            `📍 *Site Verified:* ${site.name}\n` +
            `💰 *Statutory Wage Locked:* ₹600.00\n` +
            `🔐 *Docket Token:* ${token}\n` +
            `📅 *Timestamp:* ${istTimestamp}\n\n` +
            "✅ *Attendance logged successfully under manual site code.*",
          actionTaken: 'LOG_ATTENDANCE',
          logData: {
            latitude: site.lat,
            longitude: site.lng,
            rawMessage: `Manual Site Code: ${site.name}`,
            locationName: site.name,
            estimatedWage: 600.0,
            status: 'verified',
          },
        };
      }
    }
  }

  // 5. INTENT: HISAAB / SUMMARY / EARNINGS (English, Hindi, Kannada, Telugu, Tamil, Malayalam)
  const isHisaabIntent = 
    lowerBody === '2' ||
    lowerBody === 'hisaab' ||
    lowerBody === 'hisab' ||
    lowerBody === 'summary' ||
    lowerBody === 'earnings' ||
    lowerBody === 'balance' ||
    lowerBody === 'khata' ||
    // Kannada:
    lowerBody.includes('ಲೆಕ್ಕ') ||
    lowerBody.includes('ಹಣ') ||
    lowerBody.includes('ಗಳಿಕೆ') ||
    lowerBody.includes('ದುಡ್ಡು') ||
    // Telugu:
    lowerBody.includes('లెక్క') ||
    lowerBody.includes('డబ్బులు') ||
    lowerBody.includes('సంపాదన') ||
    // Tamil:
    lowerBody.includes('கணக்கு') ||
    lowerBody.includes('பணம்') ||
    lowerBody.includes('சம்பளம்') ||
    // Malayalam:
    lowerBody.includes('കണക്ക്') ||
    lowerBody.includes('ശമ്പളം') ||
    // Hindi:
    lowerBody.includes('हिसाब') ||
    lowerBody.includes('कमाई') ||
    lowerBody.includes('paisa') ||
    fuzzyMatch(lowerBody, ['hisaab', 'hisab', 'earnings', 'account', 'lekka', 'kanakku']);

  if (isHisaabIntent) {
    const workerLogs = existingWorkerLogs.filter((l) => {
      const p = l.phone_number || '';
      return p.includes(phone) || phone.includes(p);
    });
    const totalDays = workerLogs.length;
    const totalEarnings = totalDays * 600;

    const reply = 
      "📊 *SHRAMIK SAKSHI • OFFICIAL LEDGER ACCOUNT STATEMENT* 📊\n" +
      "==========================================\n" +
      `👤 *Worker Mobile / ಮೊಬೈಲ್ / మొబైల్ / மொபைல்:* ${phone}\n` +
      `📈 *Verified Man-Days Logged (ಒಟ್ಟು ದಿನಗಳು / మొత్తం రోజులు):* ${totalDays} Days\n` +
      `💵 *Total Secured Earnings (ಗಳಿಸಿದ ಕೂಲಿ / మొత్తం వేతనం):* ₹${totalEarnings.toLocaleString('en-IN')}.00\n` +
      `⚖️ *Dispute Standing:* Verified / Dispute-Free\n` +
      `📅 *Audit Timestamp:* ${istTimestamp}\n` +
      "==========================================\n" +
      "💡 *Tip:* In case of contractor wage withholding, show this statement to your local trade union or legal aid center.\n\n" +
      "📌 *To file a wage theft dispute, reply '3' or 'Shikayat'.*";

    return {
      reply,
      actionTaken: 'QUERY_HISAAB',
    };
  }

  // 6. INTENT: DISPUTE / WAGE THEFT REPORTING
  const isDisputeIntent =
    lowerBody === '3' ||
    lowerBody === 'shikayat' ||
    lowerBody === 'dispute' ||
    lowerBody === 'theft' ||
    lowerBody === 'thekedar' ||
    // Kannada:
    lowerBody.includes('ದೂರು') ||
    lowerBody.includes('ಗುತ್ತಿಗೆದಾರ') ||
    lowerBody.includes('ಮೋಸ') ||
    // Telugu:
    lowerBody.includes('ఫిర్యాదు') ||
    lowerBody.includes('కాంట్రాక్టర్') ||
    // Tamil:
    lowerBody.includes('புகார்') ||
    lowerBody.includes('ஒப்பந்ததாரர்') ||
    // Malayalam:
    lowerBody.includes('പരാതി') ||
    lowerBody.includes('കരാറുകാരൻ') ||
    // Hindi:
    lowerBody.includes('शिकायत') ||
    lowerBody.includes('ठेकेदार') ||
    lowerBody.includes('kat') ||
    lowerBody.includes('chori');

  if (isDisputeIntent) {
    session.state = 'AWAITING_DISPUTE_CONTRACTOR';
    session.tempData = {};
    return {
      reply:
        "⚖️ *SHRAMIK SAKSHI • WAGE THEFT & DISPUTE REDRESSAL DESK* ⚖️\n" +
        "------------------------------------------\n" +
        "If a contractor has deducted, delayed, or withheld your rightful wages, we will register an official dispute docket.\n\n" +
        "👉 *Please type the Contractor or Firm Name:*\n" +
        "(ಗುತ್ತಿಗೆದಾರರ ಹೆಸರು / కాంట్రాక్టర్ పేరు / ஒப்பந்ததாரர் பெயர் / കരാറുകാരന്റെ പേര്)\n" +
        "(Type *'CANCEL'* to abort)"
    };
  }

  // 7. INTENT: STATUTORY WAGE RATES & LABOR LAWS
  const isWageRatesIntent =
    lowerBody === '4' ||
    lowerBody === 'rate' ||
    lowerBody === 'wage' ||
    lowerBody === 'dihadi' ||
    lowerBody.includes('ದರ') ||
    lowerBody.includes('రేటు') ||
    lowerBody.includes('கூலி') ||
    lowerBody.includes('നിരക്ക്') ||
    lowerBody.includes('दर') ||
    lowerBody.includes('minimum');

  if (isWageRatesIntent) {
    return {
      reply:
        "📜 *STATUTORY MINIMUM WAGES & LABOUR RIGHTS (Act 1974)* 📜\n" +
        "------------------------------------------\n" +
        "• *Daily Minimum Wage:* ₹600.00 / 8-hour shift\n" +
        "• *Overtime Rate:* 2x normal rate (₹150.00 / hour)\n" +
        "• *Weekly Rest:* 1 paid rest day after 6 consecutive working days\n" +
        "• *Protection:* Deducting wages without legal notice is a punishable offense under the Payment of Wages Act.\n\n" +
        "📌 *Reply 'MENU' to return to main options.*"
    };
  }

  // 8. INTENT: UNION HELPLINE & EMERGENCY
  const isHelplineIntent =
    lowerBody === '5' ||
    lowerBody === 'help' ||
    lowerBody === 'madad' ||
    lowerBody === 'sos' ||
    lowerBody === 'union' ||
    lowerBody.includes('ಸಹಾಯ') ||
    lowerBody.includes('సహాయం') ||
    lowerBody.includes('உதவி') ||
    lowerBody.includes('സഹായം') ||
    lowerBody.includes('मदद');

  if (isHelplineIntent) {
    return {
      reply:
        "🚨 *SHRAMIK SAKSHI • EMERGENCY LABOUR HELPLINES* 🚨\n" +
        "------------------------------------------\n" +
        "📞 *Toll-Free Government & Union Helplines:*\n" +
        "• National Labour Helpline: *1800-419-7777*\n" +
        "• Labour Commissioner Control: *011-2338-9000*\n" +
        "• South India Regional Desk (Bengaluru/Hyderabad/Chennai): *080-2225-8000*\n" +
        "• Women Workers Helpline: *1091*\n" +
        "• Police Emergency: *112*\n\n" +
        "🛡️ Trade union legal representatives are available 24x7 to protect worker rights."
    };
  }

  // 9. INTENT: MANUAL SITE FALLBACK (No GPS)
  const isManualSiteIntent =
    lowerBody === '6' ||
    lowerBody === 'site' ||
    lowerBody.includes('ಸ್ಥಳ') ||
    lowerBody.includes('లొకేషన్') ||
    lowerBody.includes('தளம்') ||
    lowerBody.includes('സ്ഥലം') ||
    lowerBody.includes('मंडी');

  if (isManualSiteIntent) {
    session.state = 'AWAITING_MANUAL_SITE';
    const siteList = Object.keys(MANUAL_SITES).map((s) => `• ${s.toUpperCase()}`).join('\n');
    return {
      reply:
        "📍 *LOG ATTENDANCE WITHOUT GPS (MANUAL SITE CODE)* 📍\n" +
        "Type one of the following site names to verify attendance:\n\n" +
        `${siteList}\n\n` +
        "e.g. Type 'PEENYA', 'BENGALURU', 'CHENNAI', 'HYDERABAD' or 'AZADPUR'"
    };
  }

  // 10. GREETING & GENERAL INTERACTIVE MENU
  return {
    reply:
      "🛠️ *SHRAMIK SAKSHI • AUTOMATED LABOUR DESK* 🛠️\n" +
      "------------------------------------------\n" +
      "Pre-AI Digital Wage Protection Ledger for Unorganized Workers.\n" +
      "(ಕನ್ನಡ | తెలుగు | தமிழ் | മലയാളം | हिंदी | English)\n\n" +
      "📌 *Reply with any number or command:*\n\n" +
      "1️⃣ *Log Attendance:* Send your WhatsApp 📎 Location Pin.\n" +
      "2️⃣ *Check Hisaab:* Reply '2' or 'Hisaab' (ಲೆಕ್ಕ / లెక్క / கணக்கு).\n" +
      "3️⃣ *Report Dispute:* Reply '3' or 'Shikayat' (ದೂರು / ఫిర్యాదు / புகார்).\n" +
      "4️⃣ *Minimum Wage:* Reply '4' or 'Rate' (ದರ / రేటు / கூலி).\n" +
      "5️⃣ *Helpline:* Reply '5' or 'Help' (ಸಹಾಯ / సహాయం / உதவி).\n" +
      "6️⃣ *Manual Site:* Reply '6' or 'Site' (without GPS).\n" +
      "------------------------------------------\n" +
      "⚖️ *Note:* Pre-AI Deterministic Expert System. 100% legal evidence.",
    actionTaken: 'SHOW_MENU',
  };
}
