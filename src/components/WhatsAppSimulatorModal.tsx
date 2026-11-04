import React, { useState } from 'react';
import { WorkLog, ChatMessage } from '../types';
import { processIncomingWhatsAppMessage, formatISTDateTime } from '../services/storage';
import { X, Send, MapPin, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCreated: (newLog: WorkLog) => void;
  currentPhoneNumber: string;
}

const PRESET_SITES = [
  { name: 'Peenya Industrial Line 12, Bengaluru (Bengaluru/ಕನ್ನಡ)', lat: 13.0312, lng: 77.5165 },
  { name: 'Sanathnagar Industrial Hub, Hyderabad (Hyderabad/తెలుగు)', lat: 17.4578, lng: 78.4412 },
  { name: 'Guindy Estate Sector 4, Chennai (Chennai/தமிழ்)', lat: 13.0067, lng: 80.2025 },
  { name: 'Willingdon Island Cargo Dock, Kochi (Kochi/മലയാളം)', lat: 9.9482, lng: 76.2731 },
  { name: 'Azadpur Mandi Yard Gate 3, Delhi', lat: 28.7172, lng: 77.1678 },
  { name: 'Dharavi Transit Camp Site 4, Mumbai', lat: 19.0428, lng: 72.8521 },
];

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  onLogCreated,
  currentPhoneNumber,
}) => {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber || '+919876543210');
  const [inputText, setInputText] = useState('');
  const [selectedSiteIndex, setSelectedSiteIndex] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'bot',
      text: 
        "🛠️ *श्रमिक साक्षी (Shramik Sakshi) - Automated Labor Telex* 🛠️\n" +
        "------------------------------------------\n" +
        "Pre-AI Digital Wage Protection & Muster Roll System.\n\n" +
        "1️⃣ *Log Attendance:* Send GPS Location Pin (ಸ್ಥಳ / లొకేషన్ / இடம் / സ്ഥലം).\n" +
        "2️⃣ *Ledger Balance:* '2' or *'Hisaab'* (ಲೆಕ್ಕ / లెక్క / கணக்கு / കണക്ക്).\n" +
        "3️⃣ *Dispute Filing:* '3' or *'Shikayat'* (ದೂರು / ఫిర్యాదు / புகார் / പരാതി).\n" +
        "4️⃣ *Statutory Rate:* '4' or *'Rate'* (ದರ / రేటు / கூலி / നിരക്ക്).\n" +
        "5️⃣ *Helpline:* '5' or *'Help'* (ಸಹಾಯ / సహాయం / உதவி / സഹായം).\n" +
        "6️⃣ *Manual Site Code:* '6' or *'Site'* (ಉದಾ: Site Peenya).",
      timestamp: formatISTDateTime(),
    },
  ]);

  if (!isOpen) return null;

  const sendMessage = async (body: string, lat?: number, lng?: number, locationName?: string) => {
    if (!body && !lat) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: body,
      timestamp: formatISTDateTime(),
      isLocationPin: lat !== undefined,
      latitude: lat,
      longitude: lng,
      locationName,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(async () => {
      const { reply, newLog } = processIncomingWhatsAppMessage(
        phoneNumber,
        body,
        lat,
        lng,
        locationName
      );

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: formatISTDateTime(),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (newLog) {
        onLogCreated(newLog);
      }

      // Forward to backend express dispatch route
      try {
        await fetch('/api/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phoneNumber,
            body: body || 'Location Pin',
            latitude: lat,
            longitude: lng,
            locationName,
          }),
        });
      } catch (e) {
        // Ignored
      }
    }, 350);
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
  };

  const handleSendPresetLocation = () => {
    const site = PRESET_SITES[selectedSiteIndex];
    sendMessage(`Location Pin: ${site.name}`, site.lat, site.lng, site.name);
  };

  const handleSendBrowserGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by device.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        sendMessage(
          `Location Pin: Live Field Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          latitude,
          longitude,
          'Live Browser Geolocation Pin'
        );
      },
      (err) => {
        setIsLocating(false);
        alert(`GPS unavailable: ${err.message}. Using default preset station.`);
        handleSendPresetLocation();
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="retro-card rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col h-[680px] max-h-[92vh]">
        {/* Telex Terminal Header */}
        <div className="bg-[#061824] border-b border-[#1b4b60] p-3 text-[#edf8f5] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio className="w-5 h-5 text-[#22d3ee] shrink-0 animate-pulse" />
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-wide flex flex-wrap items-center gap-1.5 leading-tight">
                <span>{t.telexTerminalTitle}</span>
                <span className="retro-stamp-cyan text-[8px] py-0 px-1.5">
                  {t.deterministicStamp}
                </span>
              </div>
              <div className="text-[10px] text-[#34d399] font-mono truncate mt-0.5">
                FIELD STATION: WIRE LINE 1974-IND • DFSA SYNTAX ENGINE
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#102e40] text-[#edf8f5] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worker Phone Dial Bar */}
        <div className="bg-[#081f2f] border-b border-[#1b485d] px-3.5 py-2 text-xs flex flex-wrap items-center gap-2 text-[#edf8f5]">
          <span className="text-[10px] uppercase font-bold text-[#89b8aa] whitespace-nowrap shrink-0">
            {t.musterLineId}:
          </span>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 min-w-[140px] px-2.5 py-1 rounded bg-[#05141e] border border-[#1d4d62] text-xs font-mono font-bold text-[#22d3ee] focus:outline-none focus:ring-1 focus:ring-[#22d3ee]"
            placeholder="+91..."
          />
        </div>

        {/* Teletype Paper Roll */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 retro-inset text-[#edf8f5] font-mono text-xs scrollbar-thin">
          <div className="text-center my-1 border-b border-dashed border-[#1b485d] pb-1">
            <span className="text-[9px] uppercase tracking-widest text-[#70a194] font-bold">
              --- {t.telegraphTranscriptHeader} ---
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed border transition-all ${
                  m.sender === 'user'
                    ? 'bg-[#0a2736] border-[#1d556e] text-[#edf8f5]'
                    : 'bg-[#06261d] border-[#166348] text-[#edf8f5] shadow-md'
                }`}
              >
                <div className="text-[9px] font-bold uppercase mb-1.5 text-[#8cbab0] flex items-center justify-between border-b border-white/10 pb-1 gap-2">
                  <span className="truncate">{m.sender === 'user' ? t.transmitterWorker : t.expertEngine}</span>
                  <span className="shrink-0 font-mono text-[#22d3ee]">{m.timestamp.slice(11, 19)}</span>
                </div>

                {m.isLocationPin && (
                  <div className="mb-2 p-2 bg-[#051a24] border border-[#1b4b60] rounded-lg text-[10px] leading-snug">
                    <strong className="block text-[#22d3ee]">📍 {t.satelliteGpsBroadcast}:</strong>
                    <span className="font-mono text-[#34d399]">
                      {m.latitude?.toFixed(4)}, {m.longitude?.toFixed(4)}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Telex Quick Buttons */}
        <div className="bg-[#061824] border-t border-[#1b485d] p-3 space-y-2.5">
          {/* Quick Pre-AI Rule Triggers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-thin">
            <button
              onClick={() => sendMessage('MENU')}
              className="retro-btn-muted px-2.5 py-1 rounded text-[#edf8f5] whitespace-nowrap font-bold shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroMenu}
            </button>
            <button
              onClick={() => sendMessage('Hisaab')}
              className="retro-btn-muted px-2.5 py-1 rounded text-[#38bdf8] whitespace-nowrap font-bold shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroHisaab}
            </button>
            <button
              onClick={() => sendMessage('Shikayat')}
              className="retro-btn-muted px-2.5 py-1 rounded text-[#22d3ee] whitespace-nowrap font-bold shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroShikayat}
            </button>
            <button
              onClick={() => sendMessage('Rate')}
              className="retro-btn-muted px-2.5 py-1 rounded text-[#34d399] whitespace-nowrap font-bold shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroRate}
            </button>
            <button
              onClick={() => sendMessage('Help')}
              className="retro-btn-muted px-2.5 py-1 rounded text-[#fbbf24] whitespace-nowrap font-bold shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroHelp}
            </button>
          </div>

          {/* Location Pin Trigger Row */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSiteIndex}
              onChange={(e) => setSelectedSiteIndex(Number(e.target.value))}
              className="flex-1 min-w-0 px-2.5 py-1.5 bg-[#081b27] border border-[#1d4d62] rounded-lg text-xs text-[#edf8f5] truncate focus:outline-none cursor-pointer"
            >
              {PRESET_SITES.map((site, idx) => (
                <option key={site.name} value={idx} className="bg-[#081b27] text-[#edf8f5]">
                  📍 {site.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSendPresetLocation}
              className="retro-btn-emerald px-3.5 py-1.5 rounded-lg text-xs font-black whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            >
              {t.broadcastPinBtn}
            </button>

            <button
              onClick={handleSendBrowserGPS}
              disabled={isLocating}
              title="Use current device GPS"
              className="retro-btn-muted p-1.5 rounded-lg text-[#22d3ee] shrink-0 cursor-pointer active:scale-95"
            >
              <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-[#22d3ee]' : 'text-[#22d3ee]'}`} />
            </button>
          </div>

          {/* Text Line */}
          <form onSubmit={handleSendText} className="flex items-center gap-2 pt-0.5">
            <input
              type="text"
              placeholder={t.typeCommandPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 bg-[#081b27] border border-[#1d4d62] rounded-lg text-xs text-[#edf8f5] focus:outline-none focus:ring-1 focus:ring-[#22d3ee] font-mono placeholder-[#5f8d83]"
            />
            <button
              type="submit"
              className="retro-btn-petrol px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.sendBtn}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
