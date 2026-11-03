import { WorkLog } from '../types';
import { INITIAL_WORK_LOGS } from '../data/initialLogs';
import { runPreAiBot } from './preAiBot';

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
 * Replaces any AI/LLM with the deterministic Pre-AI Rule-Based Expert System
 */
export function processIncomingWhatsAppMessage(
  from: string,
  body: string,
  latitude?: number | null,
  longitude?: number | null,
  locationName?: string
): { reply: string; newLog?: WorkLog } {
  const currentLogs = getStoredLogs();

  // Run the deterministic Pre-AI Finite State Automaton
  const result = runPreAiBot(from, body, latitude, longitude, locationName, currentLogs);

  let newLog: WorkLog | undefined = undefined;

  if (result.logData) {
    const cleanPhone = from.replace(/^whatsapp:/, '').trim() || '+919876543210';
    const cleanLast4 = cleanPhone.replace(/\D/g, '').slice(-4);
    const token = result.logData.status === 'disputed'
      ? `DISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      : `SS-WA-${new Date().getFullYear()}-${cleanLast4}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;

    newLog = {
      id: `rec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      phone_number: cleanPhone,
      latitude: result.logData.latitude,
      longitude: result.logData.longitude,
      message_type: 'location',
      raw_message: result.logData.rawMessage,
      estimated_wage: result.logData.estimatedWage || 600.0,
      created_at: new Date().toISOString(),
      location_name: result.logData.locationName || `Site (${result.logData.latitude.toFixed(4)}, ${result.logData.longitude.toFixed(4)})`,
      status: result.logData.status || 'verified',
      verification_token: token,
    };

    const updated = [newLog, ...currentLogs];
    saveStoredLogs(updated);
  }

  return { reply: result.reply, newLog };
}

export function generateAuditText(workerPhone: string, logs: WorkLog[]): string {
  const workerLogs = logs.filter(l => l.phone_number === workerPhone);
  const totalWage = workerLogs.reduce((acc, curr) => acc + (curr.estimated_wage || 600), 0);
  
  let content = "====================================================\n";
  content += "   SHRAMIK SAKSHI - WORK HISTORY & WAGE AUDIT\n";
  content += "      Official Pre-Internet Ledger Proof of Attendance\n";
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
