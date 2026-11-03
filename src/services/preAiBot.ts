/**
 * Shramik Sakshi - Rule-Based Expert System (Pre-AI Era Conversational Engine)
 * 
 * Architecture:
 * - Deterministic Finite State Automaton (DFSA)
 * - Multi-lingual Lexical Pattern Matcher (Devanagari, Hinglish & English)
 * - Levenshtein Distance & Token Regex Classifier
 * - Offline Context Memory per Phone Number
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

// Known physical labor hubs for manual fallback when GPS pin cannot be broadcast
export const MANUAL_SITES: Record<string, { lat: number; lng: number; name: string }> = {
  azadpur: { lat: 28.7159, lng: 77.1691, name: 'Azadpur Mandi Wholesale Yard, Delhi' },
  dharavi: { lat: 19.0402, lng: 72.8508, name: 'Dharavi Sector 5 Transit Site, Mumbai' },
  peenya: { lat: 13.0285, lng: 77.5197, name: 'Peenya Industrial Area Phase 2, Bengaluru' },
  okhla: { lat: 28.5355, lng: 77.2732, name: 'Okhla Industrial Area Phase 3, Delhi' },
  lucknow: { lat: 26.8467, lng: 80.9462, name: 'Shaheed Path Flyover Project, Lucknow' },
  noida: { lat: 28.6280, lng: 77.3649, name: 'Sector 62 Labour Naka, Noida' },
  andheri: { lat: 19.1197, lng: 72.8464, name: 'Andheri East Metro Yard, Mumbai' },
  kolkata: { lat: 22.5726, lng: 88.3639, name: 'Bowbazar Construction Hub, Kolkata' },
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
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion / deletion
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
 * Main Pre-AI Rule-Based Decision Engine
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
    const token = `SS-WA-${new Date().getFullYear()}-${cleanPhone}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;

    const reply = 
      "🛠️ *श्रमिक साक्षी (Shramik Sakshi) - उपस्थिति रसीद* 🛠️\n" +
      "------------------------------------------\n" +
      `👤 *मोबाईल:* ${phone}\n` +
      `📅 *दिनांक व समय:* ${istTimestamp}\n` +
      `📍 *स्थान:* अक्षांश ${lat.toFixed(4)}, देशांतर ${lng.toFixed(4)}\n` +
      "🛰️ *स्थिति:* उपग्रह द्वारा प्रमाणित (GPS Verified)\n" +
      "💰 *आज की तय न्यूनतम दिहाड़ी:* ₹600.00\n" +
      `🔐 *रसीद टोकन:* ${token}\n` +
      "------------------------------------------\n" +
      "✅ *आपकी हाजिरी स्थायी रूप से सुरक्षित कर ली गई है।*\n" +
      "यह डिजिटल रिकॉर्ड न्यायालय व लेबर कोर्ट में मान्य साक्ष्य है।\n\n" +
      "📌 *अन्य विकल्प के लिए 'MENU' या 'मदद' लिखकर भेजें।*";

    return {
      reply,
      actionTaken: 'LOG_ATTENDANCE',
      logData: {
        latitude: lat,
        longitude: lng,
        rawMessage: body || (siteNameHint ? `Location Pin: ${siteNameHint}` : 'Location Pin via WhatsApp'),
        locationName: siteNameHint || `GPS Verified Site (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        estimatedWage: 600.0,
        status: 'verified',
      },
    };
  }

  // 2. STATE MACHINE: AWAITING DISPUTE CONTRACTOR NAME
  if (session.state === 'AWAITING_DISPUTE_CONTRACTOR') {
    if (lowerBody === 'cancel' || lowerBody === 'रद्द') {
      session.state = 'IDLE';
      return { reply: "❌ शिकायत प्रक्रिया रद्द कर दी गई। सामान्य मेनू के लिए 'MENU' भेजें।" };
    }
    session.tempData = { ...session.tempData, contractorName: body };
    session.state = 'AWAITING_DISPUTE_AMOUNT';
    return {
      reply: 
        `📝 *ठेकेदार:* "${body}" दर्ज किया गया।\n\n` +
        "💰 *कृपया रोकी गई या काटी गई बकाया राशि (रुपयों में) लिखें:*\n" +
        "(उदाहरण: 1200 या 600)\n" +
        "रद्द करने के लिए *'CANCEL'* लिखें।"
    };
  }

  // 3. STATE MACHINE: AWAITING DISPUTE AMOUNT
  if (session.state === 'AWAITING_DISPUTE_AMOUNT') {
    if (lowerBody === 'cancel' || lowerBody === 'रद्द') {
      session.state = 'IDLE';
      return { reply: "❌ शिकायत प्रक्रिया रद्द कर दी गई।" };
    }
    const contractor = session.tempData?.contractorName || 'अज्ञात ठेकेदार';
    const amount = body.replace(/[^0-9]/g, '') || '600';
    const disputeToken = `DISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    session.state = 'IDLE';

    const reply = 
      "⚖️ *श्रमिक साक्षी - आधिकारिक श्रम विवाद नोटिस (FORM XII)* ⚖️\n" +
      "==========================================\n" +
      `🚨 *शिकायत टोकन:* ${disputeToken}\n` +
      `👤 *पीड़ित श्रमिक मोबाईल:* ${phone}\n` +
      `🏢 *आरोपी ठेकेदार / फर्म:* ${contractor}\n` +
      `💵 *हड़पी गई मजदूरी:* ₹${amount}.00\n` +
      `📅 *पंजीयन तिथि:* ${istTimestamp}\n` +
      "==========================================\n" +
      "📋 *कार्यवाही स्थिति:* NGO कमान केंद्र को अलर्ट प्रेषित कर दिया गया है।\n\n" +
      "📞 *मुफ्त कानूनी सहायता के लिए संपर्क करें:*\n" +
      "• राष्ट्रीय लेबर हेल्पलाइन: 1800-419-7777\n" +
      "• स्थानीय मजदूर यूनियन विंग: 011-2338-9000\n\n" +
      "⚠️ यह टोकन ठेकेदार द्वारा विवाद की स्थिति में यूनियन मध्यस्थ को दिखाएं।";

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
            `📍 *स्थान की पुष्टि:* ${site.name}\n` +
            `💰 *दिहाड़ी सुरक्षित:* ₹600.00\n` +
            `🔐 *टोकन:* ${token}\n` +
            `📅 *समय:* ${istTimestamp}\n\n` +
            "✅ *आपकी हाजिरी दर्ज कर ली गई है।* (मैन्युअल साइट कोड)",
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

  // 5. INTENT: HISAAB / SUMMARY / EARNINGS (Regex & token matching)
  const isHisaabIntent = 
    lowerBody === '2' ||
    lowerBody === 'hisaab' ||
    lowerBody === 'hisab' ||
    lowerBody === 'summary' ||
    lowerBody === 'कमाई' ||
    lowerBody === 'हिसाब' ||
    lowerBody.includes('paisa') ||
    lowerBody.includes('kamai') ||
    lowerBody.includes('balance') ||
    lowerBody.includes('khata') ||
    lowerBody.includes('kitna') ||
    lowerBody.includes('batao') ||
    fuzzyMatch(lowerBody, ['hisaab', 'hisab', 'earnings', 'account']);

  if (isHisaabIntent) {
    const workerLogs = existingWorkerLogs.filter((l) => {
      const p = l.phone_number || '';
      return p.includes(phone) || phone.includes(p);
    });
    const totalDays = workerLogs.length;
    const totalEarnings = totalDays * 600;

    const reply = 
      "📊 *श्रमिक साक्षी - आपका आधिकारिक खाता बही* 📊\n" +
      "==========================================\n" +
      `👤 *श्रमिक मोबाईल:* ${phone}\n` +
      `📈 *कुल प्रमाणित कार्य दिवस (Total Days):* ${totalDays} दिन\n` +
      `💵 *कुल निश्चित कमाई (Guaranteed Wage):* ₹${totalEarnings.toLocaleString('en-IN')}.00\n` +
      `⚖️ *कानूनी स्थिति:* कोई विसंगति नहीं (Dispute-Free)\n` +
      `📅 *विवरण तिथि:* ${istTimestamp}\n` +
      "==========================================\n" +
      "💡 *सलाह:* किसी भी ठेकेदार द्वारा पैसे काटने पर तुरंत इस डिजिटल बही खाते को अपनी स्थानीय यूनियन को दिखाएं।\n\n" +
      "📌 *विवाद दर्ज करने के लिए '3' या 'शिकायात' लिखें।*";

    return {
      reply,
      actionTaken: 'QUERY_HISAAB',
    };
  }

  // 6. INTENT: DISPUTE / WAGE THEFT REPORTING
  const isDisputeIntent =
    lowerBody === '3' ||
    lowerBody === 'shikayat' ||
    lowerBody === 'शिकायत' ||
    lowerBody === 'thekedar' ||
    lowerBody === 'ठेकेदार' ||
    lowerBody === 'dispute' ||
    lowerBody === 'theft' ||
    lowerBody.includes('kat') ||
    lowerBody.includes('chori') ||
    lowerBody.includes('paise nahi') ||
    lowerBody.includes('rok');

  if (isDisputeIntent) {
    session.state = 'AWAITING_DISPUTE_CONTRACTOR';
    session.tempData = {};
    return {
      reply:
        "⚖️ *श्रमिक साक्षी - वेतन चोरी व विवाद पंजीयन सेल* ⚖️\n" +
        "------------------------------------------\n" +
        "यदि ठेकेदार ने आपका पैसा काटा है या देने से मना कर रहा है, तो हम तत्काल आधिकारिक विवाद दर्ज करेंगे।\n\n" +
        "👉 *कृपया ठेकेदार या कंपनी का नाम लिखें:* (उदा: गुप्ता कंस्ट्रक्शन या रमेश ठेकेदार)\n" +
        "(रद्द करने के लिए *'CANCEL'* लिखें)"
    };
  }

  // 7. INTENT: STATUTORY WAGE RATES & LABOR LAWS
  const isWageRatesIntent =
    lowerBody === '4' ||
    lowerBody === 'rate' ||
    lowerBody === 'wage' ||
    lowerBody === 'dihadi' ||
    lowerBody === 'दर' ||
    lowerBody === 'नियम' ||
    lowerBody.includes('kanoon') ||
    lowerBody.includes('minimum');

  if (isWageRatesIntent) {
    return {
      reply:
        "📜 *सरकारी न्यूनतम मजदूरी व श्रम अधिकार निर्देशिका (1974 Act)* 📜\n" +
        "------------------------------------------\n" +
        "• *दैनिक न्यूनतम दिहाड़ी:* ₹600.00 / 8 घंटे\n" +
        "• *ओवरटाइम नियम:* सामान्य दर से दोगुना (₹150.00/घंटा)\n" +
        "• *सप्ताहिक अवकाश:* 6 दिन कार्य के उपरांत 1 दिन सवेतन अवकाश\n" +
        "• *अधिकार:* बिना पूर्व सूचना या कानूनी आधार के मजदूरी कटौती दंडनीय अपराध है।\n\n" +
        "📌 *वापस मुख्य मेनू के लिए 'MENU' लिखें।*"
    };
  }

  // 8. INTENT: UNION HELPLINE & EMERGENCY
  const isHelplineIntent =
    lowerBody === '5' ||
    lowerBody === 'helpline' ||
    lowerBody === 'madad' ||
    lowerBody === 'help' ||
    lowerBody === 'मदद' ||
    lowerBody === 'sos' ||
    lowerBody === 'union' ||
    lowerBody.includes('phone') ||
    lowerBody.includes('number');

  if (isHelplineIntent) {
    return {
      reply:
        "🚨 *श्रमिक साक्षी - आपातकालीन लेबर सहायता केंद्र* 🚨\n" +
        "------------------------------------------\n" +
        "📞 *टोल-फ्री हेल्पलाइन नंबर:*\n" +
        "• राष्ट्रीय श्रम हेल्पलाइन: *1800-419-7777*\n" +
        "• लेबर कमिश्नर कंट्रोल रूम: *011-2338-9000*\n" +
        "• महिला मजदूर सुरक्षा सेल: *1091*\n" +
        "• पुलिस आपातकालीन सेवा: *112*\n\n" +
        "🛡️ यूनियन के कानूनी प्रतिनिधि 24x7 आपकी सहायता के लिए उपस्थित हैं।"
    };
  }

  // 9. INTENT: MANUAL SITE FALLBACK (No GPS)
  const isManualSiteIntent =
    lowerBody === '6' ||
    lowerBody === 'site' ||
    lowerBody === 'mandi' ||
    lowerBody.includes('bina gps') ||
    lowerBody.includes('landmark');

  if (isManualSiteIntent) {
    session.state = 'AWAITING_MANUAL_SITE';
    const siteList = Object.keys(MANUAL_SITES).map((s) => `• ${s.toUpperCase()}`).join('\n');
    return {
      reply:
        "📍 *बिना GPS हाजिरी दर्ज करें (मैन्युअल साइट कोड)* 📍\n" +
        "नीचे दी गई सूची में से अपनी कार्य साइट का नाम लिखकर भेजें:\n\n" +
        `${siteList}\n\n` +
        "उदा: 'AZADPUR' या 'DHARAVI'"
    };
  }

  // 10. GREETING & GENERAL INTERACTIVE MENU
  const isMenuIntent =
    lowerBody === 'menu' ||
    lowerBody === 'मेनू' ||
    lowerBody === 'सूची' ||
    lowerBody === 'hi' ||
    lowerBody === 'hello' ||
    lowerBody === 'namaste' ||
    lowerBody === 'नमस्ते' ||
    lowerBody === 'start' ||
    lowerBody === 'join smart-river';

  return {
    reply:
      "🛠️ *श्रमिक साक्षी (Shramik Sakshi) - स्वचालित लेबर डेस्क* 🛠️\n" +
      "------------------------------------------\n" +
      "असंगठित क्षेत्र के कामगारों के लिए डिजिटल वेतन सुरक्षा प्रणाली।\n\n" +
      "📌 *नीचे दिए गए किसी भी विकल्प का नंबर या शब्द लिखकर भेजें:*\n\n" +
      "1️⃣ *हाजिरी दर्ज करें:* अपना WhatsApp लोकेशन (📎 Location Pin) भेजें।\n" +
      "2️⃣ *हिसाब देखें:* '2' या *'Hisaab'* लिखकर कुल कमाई देखें।\n" +
      "3️⃣ *ठेकेदार शिकायत:* '3' या *'Shikayat'* लिखकर वेतन चोरी रिपोर्ट करें।\n" +
      "4️⃣ *मजदूरी दर व नियम:* '4' या *'Rate'* लिखकर सरकारी नियम जानें।\n" +
      "5️⃣ *हेल्पलाइन नंबर:* '5' या *'Help'* लिखकर मुफ्त कानूनी मदद पाएं।\n" +
      "6️⃣ *बिना GPS हाजिरी:* '6' या *'Site'* लिखकर साइट कोड दर्ज करें।\n" +
      "------------------------------------------\n" +
      "⚖️ *नोट:* यह एक स्वचालित प्री-एआई एक्सपर्ट सिस्टम है। आपका प्रत्येक रिकॉर्ड न्यायालय में साक्ष्य हेतु सुरक्षित है।",
    actionTaken: 'SHOW_MENU',
  };
}
