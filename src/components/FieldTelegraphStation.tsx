import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Send, CheckCircle2, FileText, Phone, Building2, HelpCircle, AlertTriangle, Printer, Sparkles } from 'lucide-react';
import { WorkLog } from '../types';
import { formatISTDateTime, processTelegraphTransmission } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface FieldTelegraphStationProps {
  onLogReceived: (log: WorkLog) => void;
  onRefreshLedger: () => void;
  onOpenReceipt: (log: WorkLog) => void;
  selectedWorker: string;
  workers: string[];
}

interface MessageTapeEntry {
  id: string;
  sender: 'WORKER' | 'DESK';
  text: string;
  timestamp: string;
  isPunch?: boolean;
  log?: WorkLog;
}

const POPULAR_HUBS = [
  { name: 'Peenya Industrial Area, Bengaluru (ಬೆಂಗಳೂರು)', lat: 13.0312, lng: 77.5165 },
  { name: 'Sanathnagar Industrial Hub, Hyderabad (హైదరాబాద్)', lat: 17.4578, lng: 78.4412 },
  { name: 'Guindy Industrial Estate, Chennai (சென்னை)', lat: 13.0067, lng: 80.2025 },
  { name: 'Willingdon Cargo Dock, Kochi (കൊച്ചി)', lat: 9.9482, lng: 76.2731 },
  { name: 'Azadpur Mandi Yard, North Delhi (दिल्ली)', lat: 28.7172, lng: 77.1678 },
  { name: 'Dharavi Sector 5, Mumbai (मुंबई)', lat: 19.0428, lng: 72.8521 },
];

export const FieldTelegraphStation: React.FC<FieldTelegraphStationProps> = ({
  onLogReceived,
  onRefreshLedger,
  onOpenReceipt,
  selectedWorker,
  workers,
}) => {
  const { t } = useLanguage();
  const [workerPhone, setWorkerPhone] = useState<string>(() => {
    return selectedWorker !== 'All Workers' ? selectedWorker : '+919876543210';
  });

  useEffect(() => {
    if (selectedWorker !== 'All Workers') {
      setWorkerPhone(selectedWorker);
    }
  }, [selectedWorker]);

  const [selectedHubIdx, setSelectedHubIdx] = useState(0);
  const [customText, setCustomText] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSlip, setLastSlip] = useState<WorkLog | null>(null);

  const [messages, setMessages] = useState<MessageTapeEntry[]>([
    {
      id: 'init_welcome',
      sender: 'DESK',
      text: 
        "🛠️ SHRAMIK SAKSHI • DAILY WAGE & ATTENDANCE DESK\n" +
        "--------------------------------------------------\n" +
        "• Tap the big green button to mark today's work & lock ₹600.\n" +
        "• Tap 'Check Hisaab' to see how many days you worked and total earnings.\n" +
        "• Tap 'File Complaint' if a contractor refuses to pay your wage.",
      timestamp: formatISTDateTime(),
    },
  ]);

  const tapeEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tapeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (body: string, lat?: number, lng?: number, locationName?: string) => {
    if (!workerPhone.trim()) {
      alert('Please enter a phone number.');
      return;
    }

    setIsSubmitting(true);

    const userEntry: MessageTapeEntry = {
      id: `u_${Date.now()}`,
      sender: 'WORKER',
      text: body || `Marked Work at ${locationName}`,
      timestamp: formatISTDateTime(),
      isPunch: lat !== undefined,
    };

    setMessages((prev) => [...prev, userEntry]);
    setCustomText('');

    // Local finite state parser
    const localResult = processTelegraphTransmission(
      workerPhone,
      body,
      lat,
      lng,
      locationName
    );

    if (localResult.newLog) {
      onLogReceived(localResult.newLog);
      userEntry.log = localResult.newLog;
      setLastSlip(localResult.newLog);
    }

    // Server persistence
    try {
      await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: workerPhone,
          body,
          latitude: lat,
          longitude: lng,
          siteName: locationName,
        }),
      });
      onRefreshLedger();
    } catch {
      // Local storage handles it
    }

    setTimeout(() => {
      setIsSubmitting(false);
      const deskEntry: MessageTapeEntry = {
        id: `d_${Date.now()}`,
        sender: 'DESK',
        text: localResult.reply,
        timestamp: formatISTDateTime(),
        log: localResult.newLog,
      };

      setMessages((prev) => [...prev, deskEntry]);
    }, 250);
  };

  const handlePunchAttendance = () => {
    const hub = POPULAR_HUBS[selectedHubIdx];
    handleSendMessage(`Location Pin: ${hub.name}`, hub.lat, hub.lng, hub.name);
  };

  const handleUseDeviceGps = () => {
    if (!navigator.geolocation) {
      alert('Device GPS not available. Using selected city site.');
      handlePunchAttendance();
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        handleSendMessage(
          `Location Pin: Live Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          latitude,
          longitude,
          'Live Device Location'
        );
      },
      (err) => {
        setIsLocating(false);
        alert(`Could not get GPS location (${err.message}). Using selected site.`);
        handlePunchAttendance();
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="retro-card rounded-xl p-4 sm:p-6 mb-6 relative overflow-hidden">
      {/* Station Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1b4b60] pb-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#edf8f5] flex items-center gap-2.5">
            <span>{t.teletypeStationTitle}</span>
            <span className="retro-stamp-emerald text-[11px] font-extrabold px-2.5 py-0.5 rounded">
              {t.preAiBadge}
            </span>
          </h2>
          <p className="text-sm text-[#93c3b7] mt-0.5 font-medium">
            {t.teletypeStationSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#34d399] bg-[#071f1a] px-3 py-1.5 rounded-lg border border-[#17664b] shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span>✓ Guaranteed ₹600.00 / Day</span>
        </div>
      </div>

      {/* Main 2-Panel Layout: Easy Controls (Left) + Clean Slip Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick 3-Step Punch (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step 1: Worker Phone */}
          <div className="retro-inset rounded-xl p-4">
            <label className="text-xs sm:text-sm font-extrabold text-[#edf8f5] flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#22d3ee]" />
                1. Worker Phone Number (मजदूर का फोन नंबर):
              </span>
              <span className="text-xs text-[#34d399] font-bold bg-[#07241b] px-2 py-0.5 rounded border border-[#165640]">
                Step 1
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
              <input
                type="text"
                value={workerPhone}
                onChange={(e) => setWorkerPhone(e.target.value)}
                placeholder="+91..."
                className="w-full px-3 py-2 bg-[#091e2b] border-2 border-[#1c4b60] rounded-lg font-mono font-bold text-sm text-[#edf8f5] focus:outline-none focus:ring-2 focus:ring-[#22d3ee] transition-all"
              />

              <select
                value={workerPhone}
                onChange={(e) => setWorkerPhone(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#091e2b] border border-[#1c4b60] rounded-lg font-medium text-xs sm:text-sm text-[#edf8f5] focus:outline-none focus:ring-2 focus:ring-[#22d3ee] transition-all cursor-pointer"
              >
                <option value={workerPhone}>{workerPhone} (Active)</option>
                {workers.filter((w) => w !== workerPhone).map((phone) => (
                  <option key={phone} value={phone} className="bg-[#091e2b] text-[#edf8f5]">
                    {phone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Work Location */}
          <div className="retro-inset rounded-xl p-4">
            <label className="text-xs sm:text-sm font-extrabold text-[#edf8f5] flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#34d399]" />
                2. Work Location (काम की जगह):
              </span>
              <span className="text-xs text-[#34d399] font-bold bg-[#07241b] px-2 py-0.5 rounded border border-[#165640]">
                Step 2
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2 mt-1.5">
              <select
                value={selectedHubIdx}
                onChange={(e) => setSelectedHubIdx(Number(e.target.value))}
                className="flex-1 px-3 py-2 bg-[#091e2b] border-2 border-[#1c4b60] rounded-lg font-bold text-xs sm:text-sm text-[#edf8f5] focus:outline-none focus:ring-2 focus:ring-[#22d3ee] transition-all cursor-pointer"
              >
                {POPULAR_HUBS.map((hub, idx) => (
                  <option key={hub.name} value={idx} className="bg-[#091e2b] text-[#edf8f5]">
                    📍 {hub.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleUseDeviceGps}
                disabled={isLocating || isSubmitting}
                className="retro-btn-muted px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
              >
                <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-[#22d3ee]' : 'text-[#22d3ee]'}`} />
                <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
              </button>
            </div>
          </div>

          {/* Step 3: Giant Tactile Attendance Punch Button */}
          <div>
            <button
              type="button"
              onClick={handlePunchAttendance}
              disabled={isSubmitting}
              className="retro-btn-emerald w-full py-4 px-6 rounded-xl text-base sm:text-lg font-black tracking-wide flex items-center justify-center gap-3 cursor-pointer shadow-lg active:scale-98"
            >
              <CheckCircle2 className="w-6 h-6 text-[#7ff0cb] shrink-0 animate-pulse" />
              <span>📌 MARK TODAY'S ATTENDANCE • ₹600 (हाजिरी लगाएं)</span>
            </button>
            <p className="text-xs text-center text-[#8ebfb4] mt-2 font-medium">
              1 tap locks ₹600 daily wage into official government record. Cannot be cut or denied by contractor.
            </p>
          </div>

          {/* Quick Helpful Buttons for Hisaab, Complaint, Rules, Help */}
          <div className="pt-2">
            <span className="text-xs font-black text-[#8ebfb4] block mb-2 uppercase tracking-wider">
              Quick Helpful Services:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSendMessage('Hisaab')}
                disabled={isSubmitting}
                className="retro-btn-muted p-3 rounded-lg text-left flex flex-col justify-between cursor-pointer active:scale-95 group"
              >
                <span className="text-[#38bdf8] text-sm font-black group-hover:text-[#70c4ec]">📊 Check Hisaab</span>
                <span className="text-[11px] text-[#86b5aa] mt-1 font-medium">See Total Earnings</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage('Shikayat')}
                disabled={isSubmitting}
                className="retro-btn-muted p-3 rounded-lg text-left flex flex-col justify-between cursor-pointer active:scale-95 group"
              >
                <span className="text-[#22d3ee] text-sm font-black group-hover:text-[#67e8f9]">🚨 File Complaint</span>
                <span className="text-[11px] text-[#86b5aa] mt-1 font-medium">Report Unpaid Wage</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage('Rate')}
                disabled={isSubmitting}
                className="retro-btn-muted p-3 rounded-lg text-left flex flex-col justify-between cursor-pointer active:scale-95 group"
              >
                <span className="text-[#34d399] text-sm font-black group-hover:text-[#6ee7b7]">📜 Wage Rules</span>
                <span className="text-[11px] text-[#86b5aa] mt-1 font-medium">₹600 Legal Rate</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage('Help')}
                disabled={isSubmitting}
                className="retro-btn-muted p-3 rounded-lg text-left flex flex-col justify-between cursor-pointer active:scale-95 group"
              >
                <span className="text-[#fbbf24] text-sm font-black group-hover:text-[#fde68a]">📞 Free Help</span>
                <span className="text-[11px] text-[#86b5aa] mt-1 font-medium">Labour Helpline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Work Slip & Message Output (5 cols) */}
        <div className="lg:col-span-5 retro-inset rounded-xl p-4 flex flex-col justify-between h-[490px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1b485d] pb-2.5 mb-2.5">
            <span className="text-xs font-black text-[#edf8f5] flex items-center gap-2 uppercase tracking-wide">
              <Printer className="w-4 h-4 text-[#22d3ee]" />
              Official Attendance Log &amp; Slip
            </span>
            <span className="text-[11px] font-extrabold text-[#34d399] bg-[#07241b] px-2.5 py-0.5 rounded border border-[#165640]">
              ● LIVE RECEIPT
            </span>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs sm:text-sm scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border leading-relaxed transition-all duration-200 ${
                  m.sender === 'WORKER'
                    ? 'bg-[#082230] border-[#1d4d62] text-[#edf8f5]'
                    : 'bg-[#06241b] border-[#165842] text-[#edf8f5] shadow-md'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold border-b border-white/10 pb-1 mb-2 text-[#8cbab0]">
                  <span className="font-mono">
                    {m.sender === 'WORKER' ? `Worker: ${workerPhone}` : 'Shramik Sakshi Official Desk'}
                  </span>
                  <span className="font-mono text-[#22d3ee]">{m.timestamp.slice(11, 19)}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                  {m.text}
                </div>

                {/* Instant View Slip Button */}
                {m.log && (
                  <div className="mt-3 pt-2.5 border-t border-dashed border-[#1f5643] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#34d399]">
                      Slip: {m.log.verification_token}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenReceipt(m.log!)}
                      className="retro-btn-petrol px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span>VIEW OFFICIAL SLIP (पर्ची देखें)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={tapeEndRef} />
          </div>

          {/* Quick command input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customText.trim()) handleSendMessage(customText.trim());
            }}
            className="mt-3 pt-2.5 border-t border-[#1b485d] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type: '2' for Hisaab, '3' for Complaint..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 bg-[#081b27] border border-[#1d4d62] rounded-lg text-xs sm:text-sm text-[#edf8f5] placeholder-[#679187] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]"
            />
            <button
              type="submit"
              disabled={isSubmitting || !customText.trim()}
              className="retro-btn-emerald px-4 py-2 text-xs font-black rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SEND</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
