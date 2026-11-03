import React, { useState } from 'react';
import { WorkLog, ChatMessage } from '../types';
import { processIncomingWhatsAppMessage, formatISTDateTime } from '../services/storage';
import { X, Send, MapPin, Smartphone, Check, CheckCheck, RefreshCw } from 'lucide-react';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCreated: (newLog: WorkLog) => void;
  currentPhoneNumber: string;
}

const PRESET_SITES = [
  { name: 'Azadpur Mandi Gate 3, Delhi', lat: 28.7172, lng: 77.1678 },
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
      text: "श्रमिक साक्षी में आपका स्वागत है।\n\n• उपस्थिति दर्ज करने के लिए अपना *Location (स्थान)* भेजें।\n• अपना कुल बकाया देखने के लिए *Hisaab* लिखकर भेजें।",
      timestamp: formatISTDateTime(),
    },
  ]);

  if (!isOpen) return null;

  const sendMessage = (body: string, lat?: number, lng?: number, locationName?: string) => {
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

    // Trigger process incoming WhatsApp message (identical to FastAPI Twilio webhook)
    setTimeout(() => {
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
    }, 450);
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
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        sendMessage(
          `Location Pin: Live Field GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          latitude,
          longitude,
          'Live Browser GPS Field Pin'
        );
      },
      (err) => {
        setIsLocating(false);
        alert(`Could not fetch GPS: ${err.message}. Sending preset site instead.`);
        handleSendPresetLocation();
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#efe4c8] border-2 border-[#8b6f47] rounded-xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col h-[650px] max-h-[92vh]">
        {/* Phone / WhatsApp Header */}
        <div className="bg-[#075e54] text-white p-3 sm:p-3.5 flex items-center justify-between shadow">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-400 flex items-center justify-center font-bold text-sm">
              🛠️
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                <span>Shramik Sakshi Bot</span>
                <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.2 rounded text-emerald-100">
                  Twilio Node
                </span>
              </div>
              <div className="text-[11px] text-emerald-200">
                +1 (415) 523-8886 (Official Sandbox)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-emerald-800 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worker Phone Selector Strip */}
        <div className="bg-[#e7ddc4] border-b border-[#8b6f47]/50 px-3 py-2 text-xs flex items-center justify-between gap-2">
          <span className="text-[#6b5330] font-medium whitespace-nowrap">
            Simulated Mobile:
          </span>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 px-2 py-1 rounded bg-[#f7f0de] border border-[#8b6f47] text-xs font-mono font-bold text-[#2a1f12] focus:outline-none"
            placeholder="+91..."
          />
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#e5ddd5]/60 font-sans">
          <div className="text-center my-1">
            <span className="bg-[#f7f0de] text-[#6b5330] text-[10px] px-2.5 py-1 rounded-full border border-[#8b6f47]/40 shadow-xs">
              End-to-End Wage Proof • WhatsApp Simulation
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
                className={`max-w-[85%] rounded-lg p-2.5 shadow-xs text-xs ${
                  m.sender === 'user'
                    ? 'bg-[#dcf8c6] text-[#111] rounded-tr-none'
                    : 'bg-white text-[#111] rounded-tl-none border border-black/5'
                }`}
              >
                {m.isLocationPin && (
                  <div className="mb-1.5 p-2 bg-emerald-100/70 border border-emerald-300 rounded text-[11px] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                    <div>
                      <strong className="text-emerald-900 block">GPS Pin Broadcast</strong>
                      <span className="text-emerald-800 font-mono text-[10px]">
                        {m.latitude?.toFixed(4)}, {m.longitude?.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed font-serif">
                  {m.text}
                </div>

                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-gray-500 font-mono">
                  <span>{m.timestamp.slice(11, 16)}</span>
                  {m.sender === 'user' && (
                    <CheckCheck className="w-3 h-3 text-emerald-600 inline" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Simulator Actions */}
        <div className="bg-[#efe4c8] border-t border-[#8b6f47]/60 p-2.5 space-y-2">
          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => sendMessage('join smart-river')}
              className="px-2 py-1 rounded bg-[#ebe0c2] hover:bg-[#dfd2b0] border border-[#8b6f47] text-[#3b2f1e] whitespace-nowrap font-mono"
            >
              join smart-river
            </button>
            <button
              onClick={() => sendMessage('Hisaab')}
              className="px-2 py-1 rounded bg-[#ebe0c2] hover:bg-[#dfd2b0] border border-[#8b6f47] text-[#3b2f1e] whitespace-nowrap font-medium"
            >
              📊 Hisaab (Earnings)
            </button>
            <button
              onClick={() => sendMessage('हिसाब')}
              className="px-2 py-1 rounded bg-[#ebe0c2] hover:bg-[#dfd2b0] border border-[#8b6f47] text-[#3b2f1e] whitespace-nowrap font-medium"
            >
              हिसाब
            </button>
          </div>

          {/* Location Pin Trigger Row */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedSiteIndex}
              onChange={(e) => setSelectedSiteIndex(Number(e.target.value))}
              className="flex-1 px-2 py-1 bg-[#f7f0de] border border-[#8b6f47] rounded text-xs text-[#3b2f1e] truncate focus:outline-none"
            >
              {PRESET_SITES.map((site, idx) => (
                <option key={site.name} value={idx}>
                  📍 {site.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSendPresetLocation}
              className="px-2.5 py-1 bg-[#7a5a2e] hover:bg-[#5a3e1b] text-[#f4ecd8] rounded text-xs font-semibold whitespace-nowrap border border-[#5a3e1b] transition shadow-xs"
            >
              Send Location Pin
            </button>

            <button
              onClick={handleSendBrowserGPS}
              disabled={isLocating}
              title="Use current device GPS"
              className="p-1.5 bg-[#ebe0c2] hover:bg-[#dfd2b0] border border-[#8b6f47] rounded text-[#3b2f1e]"
            >
              <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce text-red-600' : 'text-[#7a5a2e]'}`} />
            </button>
          </div>

          {/* Text Input Form */}
          <form onSubmit={handleSendText} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              placeholder="Type WhatsApp message (e.g. 'Hisaab', 'Hello')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#f7f0de] border border-[#8b6f47] rounded text-xs text-[#3b2f1e] focus:outline-none focus:ring-1 focus:ring-[#7a5a2e]"
            />
            <button
              type="submit"
              className="p-2 rounded bg-[#075e54] hover:bg-[#128c7e] text-white transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
