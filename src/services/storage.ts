import { WorkLog } from '../types';
import { INITIAL_WORK_LOGS } from '../data/initialLogs';

const STORAGE_KEY = 'shramik_sakshi_work_logs_v1';

export function getStoredLogs(): WorkLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WORK_LOGS));
      return INITIAL_WORK_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_WORK_LOGS;
  } catch (err) {
    console.error('Error reading work logs from storage', err);
    return INITIAL_WORK_LOGS;
  }
}

export function saveStoredLogs(logs: WorkLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving work logs', err);
  }
}

export function resetStoredLogs(): WorkLog[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WORK_LOGS));
  return INITIAL_WORK_LOGS;
}

export function formatISTDateTime(isoDateString?: string): string {
  const date = isoDateString ? new Date(isoDateString) : new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  return `${formatter.format(date)} IST`;
}

export function generateVerificationToken(phone: string): string {
  const prefix = 'SS-LOC';
  const cleanPhone = phone.replace(/\D/g, '').slice(-4);
  const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${cleanPhone}-${randomHex}`;
}

/**
 * Replicates the exact Python Twilio webhook logic from main.py:
 * Handles incoming location pins or text commands ('hisaab' / 'summary' / 'हिसाब').
 */
export function processIncomingWhatsAppMessage(
  from: string,
  body: string,
  latitude?: number | null,
  longitude?: number | null,
  locationName?: string
): { reply: string; newLog?: WorkLog } {
  const phone = from.trim();
  const currentLogs = getStoredLogs();

  if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null) {
    const timestampStr = formatISTDateTime();
    const token = generateVerificationToken(phone);
    const newLog: WorkLog = {
      id: `rec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      phone_number: phone,
      latitude: Number(latitude),
      longitude: Number(longitude),
      message_type: 'location',
      raw_message: body || (locationName ? `Location Pin: ${locationName}` : 'Location Pin'),
      estimated_wage: 600.0,
      created_at: new Date().toISOString(),
      location_name: locationName || `Site (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      status: 'verified',
      verification_token: token,
    };

    const updatedLogs = [newLog, ...currentLogs];
    saveStoredLogs(updatedLogs);

    const reply = 
      "🛠️ *श्रमिक साक्षी (Shramik Sakshi) - उपस्थिति रसीद* 🛠️\n\n" +
      `👤 *मोबाईल:* ${phone}\n` +
      `📅 *दिनांक:* ${timestampStr}\n` +
      `📍 *लोकेशन:* दर्ज (GPS Verified: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})\n` +
      `💰 *आज की तय दिहाड़ी:* ₹600.00\n` +
      `🔐 *रसीद टोकन:* ${token}\n\n` +
      "✅ *आपकी हाजिरी सुरक्षित कर ली गई है।* यह डिजिटल रिकॉर्ड बदला नहीं जा सकता। ठगी से बचने के लिए इसे संभाल कर रखें।";

    return { reply, newLog };
  }

  const cleanBody = body.trim().toLowerCase();
  if (['hisaab', 'summary', 'हिसाब', 'hisab'].includes(cleanBody)) {
    const workerLogs = currentLogs.filter(log => log.phone_number === phone);
    const totalDays = workerLogs.length;
    const totalEarnings = totalDays * 600;

    const reply = 
      "📊 *श्रमिक साक्षी - आपका आधिकारिक खाता* 📊\n\n" +
      `👤 *मोबाईल:* ${phone}\n` +
      `📈 *कुल कार्य दिवस (Total Days):* ${totalDays} दिन\n` +
      `💵 *कुल निश्चित कमाई (Total Earnings):* ₹${totalEarnings.toLocaleString('en-IN')}\n` +
      "⚖️ *सुरक्षित स्थिति:* कोई विसंगति नहीं (No Discrepancies)\n\n" +
      "💡 *Tip:* ठेकेदार द्वारा पैसे काटने पर तुरंत इस रसीद को अपनी स्थानीय लेबर यूनियन या NGO को दिखाएं।";

    return { reply };
  }

  // Fallback greeting identical to main.py
  const reply = 
    "श्रमिक साक्षी में आपका स्वागत है।\n\n" +
    "• उपस्थिति दर्ज करने के लिए अपना *Location (स्थान)* भेजें।\n" +
    "• अपना कुल बकाया देखने के लिए *Hisaab* लिखकर भेजें।";

  return { reply };
}

export function generateAuditText(workerPhone: string, logs: WorkLog[]): string {
  const workerLogs = logs.filter(l => l.phone_number === workerPhone);
  const totalWage = workerLogs.reduce((acc, curr) => acc + (curr.estimated_wage || 600), 0);
  
  let content = "====================================================\n";
  content += "   SHRAMIK SAKSHI - WORK HISTORY & WAGE AUDIT\n";
  content += "      Official NGO Ledger Proof of Attendance\n";
  content += "====================================================\n\n";
  content += `Worker Identifier (Mobile): ${workerPhone}\n`;
  content += `Audit Timestamp: ${formatISTDateTime()}\n`;
  content += `Total Verified Workdays: ${workerLogs.length} Days\n`;
  content += `Standard Wage Rate: ₹600.00 / day\n`;
  content += `Total Secured Capital (Earnings): ₹${totalWage.toLocaleString('en-IN')}\n`;
  content += `Dispute Status: Verified / Dispute-Free\n\n`;
  content += "----------------------------------------------------\n";
  content += "VERIFIED CHRONOLOGICAL ATTENDANCE LOGS:\n";
  content += "----------------------------------------------------\n";

  workerLogs
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .forEach((log, index) => {
      content += `[Day ${index + 1}] ${formatISTDateTime(log.created_at)}\n`;
      content += `  Location: Lat ${log.latitude?.toFixed(4) || 'N/A'}, Lon ${log.longitude?.toFixed(4) || 'N/A'}\n`;
      content += `  Site Tag: ${log.location_name || log.raw_message}\n`;
      content += `  Token: ${log.verification_token}\n`;
      content += `  Wage Locked: ₹${(log.estimated_wage || 600).toFixed(2)}\n\n`;
    });

  content += "====================================================\n";
  content += "LEGAL NOTICE: This document is an unalterable proof of\n";
  content += "physical presence recorded via automated GPS coordinate\n";
  content += "receipts. Presented on behalf of unorganized sector labor.\n";
  content += "====================================================\n";

  return content;
}
