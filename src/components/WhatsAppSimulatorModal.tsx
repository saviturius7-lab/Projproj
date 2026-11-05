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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#232b28]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="comic-card rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col h-[680px] max-h-[92vh] bg-white">
        {/* Scalloped Roof Trim at Modal Top */}
        <div className="h-3 roof-scallops border-b-2 border-[#232b28]" />

        {/* Telex Terminal Header */}
        <div className="bg-[#e8638b] border-b-2 border-[#232b28] p-3 text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio className="w-5 h-5 text-white shrink-0 animate-pulse" />
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-wide flex flex-wrap items-center gap-1.5 leading-tight">
                <span>{t.telexTerminalTitle}</span>
                <span className="bg-[#1e7587] text-white text-[8px] py-0 px-2 rounded-full border border-white">
                  {t.deterministicStamp}
                </span>
              </div>
              <div className="text-[10px] text-white/90 font-mono truncate mt-0.5">
                FIELD STATION: WIRE LINE 1974-IND • DFSA SYNTAX ENGINE
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 border border-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Worker Phone Dial Bar */}
        <div className="bg-[#fef5dc] border-b-2 border-[#232b28] px-3.5 py-2 text-xs flex flex-wrap items-center gap-2 text-[#232b28]">
          <span className="text-[10px] uppercase font-black text-[#5c6e2b] whitespace-nowrap shrink-0">
            {t.musterLineId}:
          </span>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 min-w-[140px] px-2.5 py-1 rounded-lg bg-white border-2 border-[#232b28] text-xs font-mono font-black text-[#232b28] focus:outline-none shadow-[1px_1px_0px_#232b28]"
            placeholder="+91..."
          />
        </div>

        {/* Teletype Paper Roll */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#faf6ea] text-[#232b28] text-xs scrollbar-thin">
          <div className="text-center my-1 border-b-2 border-dashed border-[#232b28]/20 pb-1">
            <span className="text-[10px] uppercase tracking-widest text-[#55694a] font-black">
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
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed border-2 border-[#232b28] shadow-[2px_2px_0px_#232b28] transition-all ${
                  m.sender === 'user'
                    ? 'bg-[#fedbe6] text-[#232b28]'
                    : 'bg-[#ffffff] text-[#232b28]'
                }`}
              >
                <div className="text-[9px] font-black uppercase mb-1.5 text-[#55694a] flex items-center justify-between border-b border-[#232b28]/15 pb-1 gap-2">
                  <span className="truncate">{m.sender === 'user' ? t.transmitterWorker : t.expertEngine}</span>
                  <span className="shrink-0 font-mono text-[#1e7587] font-bold">{m.timestamp.slice(11, 19)}</span>
                </div>

                {m.isLocationPin && (
                  <div className="mb-2 p-2 bg-[#d8f1e9] border border-[#232b28] rounded-lg text-[10px] leading-snug">
                    <strong className="block text-[#1e7587]">📍 {t.satelliteGpsBroadcast}:</strong>
                    <span className="font-mono text-[#2f855a] font-bold">
                      {m.latitude?.toFixed(4)}, {m.longitude?.toFixed(4)}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed font-semibold">
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Telex Quick Buttons */}
        <div className="bg-[#fffef9] border-t-2 border-[#232b28] p-3 space-y-2.5">
          {/* Quick Pre-AI Rule Triggers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-thin">
            <button
              onClick={() => sendMessage('MENU')}
              className="comic-btn-cream px-2.5 py-1 text-[#232b28] whitespace-nowrap font-black shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroMenu}
            </button>
            <button
              onClick={() => sendMessage('Hisaab')}
              className="comic-btn-cream px-2.5 py-1 text-[#1e7587] whitespace-nowrap font-black shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroHisaab}
            </button>
            <button
              onClick={() => sendMessage('Shikayat')}
              className="comic-btn-cream px-2.5 py-1 text-[#e8638b] whitespace-nowrap font-black shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroShikayat}
            </button>
            <button
              onClick={() => sendMessage('Rate')}
              className="comic-btn-cream px-2.5 py-1 text-[#38a169] whitespace-nowrap font-black shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroRate}
            </button>
            <button
              onClick={() => sendMessage('Help')}
              className="comic-btn-cream px-2.5 py-1 text-[#d97706] whitespace-nowrap font-black shrink-0 cursor-pointer active:scale-95"
            >
              {t.macroHelp}
            </button>
          </div>

          {/* Location Pin Trigger Row */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSiteIndex}
              onChange={(e) => setSelectedSiteIndex(Number(e.target.value))}
              className="flex-1 min-w-0 px-2.5 py-1.5 bg-white border-2 border-[#232b28] rounded-xl text-xs text-[#232b28] font-bold truncate focus:outline-none cursor-pointer shadow-[1px_1px_0px_#232b28]"
            >
              {PRESET_SITES.map((site, idx) => (
                <option key={site.name} value={idx} className="bg-white text-[#232b28]">
                  📍 {site.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSendPresetLocation}
              className="comic-btn-emerald px-3.5 py-1.5 text-xs font-black whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            >
              {t.broadcastPinBtn}
            </button>

            <button
              onClick={handleSendBrowserGPS}
              disabled={isLocating}
              title="Use current device GPS"
              className="comic-btn-cream p-1.5 rounded-lg text-[#e8638b] shrink-0 cursor-pointer active:scale-95"
            >
              <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-[#e8638b]' : 'text-[#e8638b]'}`} />
            </button>
          </div>

          {/* Text Line */}
          <form onSubmit={handleSendText} className="flex items-center gap-2 pt-0.5">
            <input
              type="text"
              placeholder={t.typeCommandPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 bg-white border-2 border-[#232b28] rounded-xl text-xs text-[#232b28] focus:outline-none font-bold placeholder-[#7d8f78] shadow-[2px_2px_0px_#232b28]"
            />
            <button
              type="submit"
              className="comic-btn-teal px-3.5 py-1.5 font-black text-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
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
