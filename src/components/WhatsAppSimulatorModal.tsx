import React, { useState } from 'react';
import { WorkLog, ChatMessage } from '../types';
import { processIncomingWhatsAppMessage, formatISTDateTime } from '../services/storage';
import { X, Send, MapPin, Radio } from 'lucide-react';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCreated: (newLog: WorkLog) => void;
  currentPhoneNumber: string;
}

const PRESET_SITES = [
  { name: 'Azadpur Mandi Yard Gate 3, Delhi', lat: 28.7172, lng: 77.1678 },
  { name: 'Dharavi Transit Camp Site 4, Mumbai', lat: 19.0428, lng: 72.8521 },
  { name: 'Peenya Industrial Line 12, Bengaluru', lat: 13.0312, lng: 77.5165 },
  { name: 'Shaheed Path Flyover Pier 14, Lucknow', lat: 26.8485, lng: 80.9491 },
  { name: 'Okhla Phase 3 Construction Yard, Delhi', lat: 28.5367, lng: 77.2745 },
];

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  onLogCreated,
  currentPhoneNumber,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber || '+919876543210');
  const [inputText, setInputText] = useState('');
  const [selectedSiteIndex, setSelectedSiteIndex] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'bot',
      text: 
        "🛠️ *श्रमिक साक्षी (Shramik Sakshi) - स्वचालित लेबर डेस्क* 🛠️\n" +
        "------------------------------------------\n" +
        "असंगठित क्षेत्र के कामगारों के लिए प्री-एआई डिजिटल वेतन सुरक्षा प्रणाली।\n\n" +
        "1️⃣ *हाजिरी दर्ज करें:* Location Pin भेजें।\n" +
        "2️⃣ *हिसाब देखें:* '2' या *'Hisaab'* लिखकर कुल कमाई देखें।\n" +
        "3️⃣ *ठेकेदार शिकायत:* '3' या *'Shikayat'* लिखकर वेतन चोरी दर्ज करें।\n" +
        "4️⃣ *मजदूरी दर व नियम:* '4' या *'Rate'* लिखकर नियम जानें।\n" +
        "5️⃣ *हेल्पलाइन नंबर:* '5' या *'Help'* लिखकर मुफ्त कानूनी मदद पाएं।\n" +
        "6️⃣ *बिना GPS हाजिरी:* '6' या *'Site'* लिखकर साइट कोड दर्ज करें।",
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

      // Forward to backend express webhook route
      try {
        const params = new URLSearchParams();
        params.append('From', `whatsapp:${phoneNumber}`);
        params.append('Body', body || 'Location Pin');
        if (lat) params.append('Latitude', lat.toString());
        if (lng) params.append('Longitude', lng.toString());

        await fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-typewriter">
      <div className="bg-[#2a241b] border-4 border-[#aa8c58] rounded-md max-w-lg w-full overflow-hidden shadow-2xl flex flex-col h-[670px] max-h-[92vh]">
        {/* Telex Terminal Header - Zero Collision */}
        <div className="bg-[#1a140d] border-b-2 border-[#aa8c58] p-3 text-[#fbf6ea] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio className="w-5 h-5 text-[#9e2a2b] shrink-0 animate-pulse" />
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wide flex flex-wrap items-center gap-1.5 leading-tight">
                <span>PRE-AI TRANSCEIVER T-74</span>
                <span className="rubber-stamp rubber-stamp-red text-[8px] py-0 px-1">
                  DETERMINISTIC
                </span>
              </div>
              <div className="text-[10px] text-[#aa8c58] truncate mt-0.5">
                SANDBOX: +1 (415) 523-8886 • RULE ENGINE
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#382819] text-[#fbf6ea] transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worker Phone Dial Bar */}
        <div className="bg-[#382819] border-b border-[#aa8c58] px-3 py-2 text-xs flex flex-wrap items-center gap-2 text-[#fbf6ea]">
          <span className="text-[10px] uppercase font-bold text-[#aa8c58] whitespace-nowrap shrink-0">
            MUSTER LINE ID:
          </span>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 min-w-[140px] px-2 py-0.5 rounded bg-[#1a140d] border border-[#aa8c58] text-xs font-mono font-bold text-[#9e2a2b] focus:outline-none"
            placeholder="+91..."
          />
        </div>

        {/* Teletype Paper Roll */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#fbf5e8] text-[#221910] font-typewriter shadow-inner">
          <div className="text-center my-1 border-b border-dashed border-[#aa8c58] pb-1">
            <span className="text-[9px] uppercase tracking-widest text-[#684f33] font-bold">
              --- TELEGRAPH TRANSCRIPT • DETERMINISTIC DECISION RULES ---
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
                className={`max-w-[90%] p-3 rounded text-xs leading-relaxed border-2 ${
                  m.sender === 'user'
                    ? 'bg-[#fae4df] border-[#ecc2ba] text-[#221910]'
                    : 'bg-[#fff] border-[#aa8c58] text-[#221910] shadow-xs'
                }`}
              >
                <div className="text-[9px] font-bold uppercase mb-1.5 text-[#6f4e24] flex items-center justify-between border-b border-[#aa8c58]/30 pb-0.5 gap-2">
                  <span className="truncate">{m.sender === 'user' ? 'TRANSMITTER (LABORER)' : 'SHRAMIK SAKSHI EXPERT ENGINE'}</span>
                  <span className="shrink-0">{m.timestamp.slice(11, 19)}</span>
                </div>

                {m.isLocationPin && (
                  <div className="mb-2 p-1.5 bg-[#e8edf5] border border-[#c2d0e5] rounded text-[10px] leading-snug">
                    <strong className="block text-[#1d3557]">📍 SATELLITE GPS BROADCAST:</strong>
                    <span className="font-mono text-[#221910]">
                      {m.latitude?.toFixed(4)}, {m.longitude?.toFixed(4)}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-typewriter leading-relaxed">
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Telex Quick Buttons */}
        <div className="bg-[#1a140d] border-t-2 border-[#aa8c58] p-3 space-y-2">
          {/* Quick Pre-AI Rule Triggers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
            <button
              onClick={() => sendMessage('MENU')}
              className="px-2 py-1 rounded bg-[#382819] hover:bg-[#4e3314] border border-[#aa8c58] text-[#fbf6ea] whitespace-nowrap font-bold shrink-0"
            >
              [ 0. MENU ]
            </button>
            <button
              onClick={() => sendMessage('Hisaab')}
              className="px-2 py-1 rounded bg-[#382819] hover:bg-[#4e3314] border border-[#aa8c58] text-[#fbf6ea] whitespace-nowrap font-bold shrink-0"
            >
              [ 2. 📊 HISAAB ]
            </button>
            <button
              onClick={() => sendMessage('Shikayat')}
              className="px-2 py-1 rounded bg-[#382819] hover:bg-[#4e3314] border border-[#aa8c58] text-[#fbf6ea] whitespace-nowrap font-bold text-[#e57373] shrink-0"
            >
              [ 3. 🚨 SHIKAYAT ]
            </button>
            <button
              onClick={() => sendMessage('Rate')}
              className="px-2 py-1 rounded bg-[#382819] hover:bg-[#4e3314] border border-[#aa8c58] text-[#fbf6ea] whitespace-nowrap font-bold shrink-0"
            >
              [ 4. 📜 RATE ]
            </button>
            <button
              onClick={() => sendMessage('Help')}
              className="px-2 py-1 rounded bg-[#382819] hover:bg-[#4e3314] border border-[#aa8c58] text-[#fbf6ea] whitespace-nowrap font-bold shrink-0"
            >
              [ 5. 📞 HELP ]
            </button>
          </div>

          {/* Location Pin Trigger Row */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedSiteIndex}
              onChange={(e) => setSelectedSiteIndex(Number(e.target.value))}
              className="flex-1 min-w-0 px-2 py-1 bg-[#2a241b] border border-[#aa8c58] rounded text-xs text-[#fbf6ea] truncate focus:outline-none font-typewriter"
            >
              {PRESET_SITES.map((site, idx) => (
                <option key={site.name} value={idx}>
                  📍 {site.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSendPresetLocation}
              className="px-3 py-1 bg-[#9e2a2b] hover:bg-[#781f20] text-[#fbf6ea] rounded text-xs font-bold whitespace-nowrap border border-[#aa8c58] transition shrink-0"
            >
              PIN
            </button>

            <button
              onClick={handleSendBrowserGPS}
              disabled={isLocating}
              title="Use current device GPS"
              className="p-1.5 bg-[#382819] hover:bg-[#4e3314] border border-[#aa8c58] rounded text-[#fbf6ea] shrink-0"
            >
              <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce text-[#9e2a2b]' : 'text-[#aa8c58]'}`} />
            </button>
          </div>

          {/* Text Line */}
          <form onSubmit={handleSendText} className="flex items-center gap-1.5 pt-0.5">
            <input
              type="text"
              placeholder="Type command, e.g. 'Shikayat', '2', 'Hisaab'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 bg-[#2a241b] border border-[#aa8c58] rounded text-xs text-[#fbf6ea] focus:outline-none focus:ring-1 focus:ring-[#9e2a2b] font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-[#2d6a4f] hover:bg-[#1b4332] text-white transition font-bold border border-[#aa8c58] text-xs flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
