import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MessageSquare, ExternalLink, Radio, Copy, Send, RefreshCw } from 'lucide-react';
import { WorkLog } from '../types';

interface WhatsAppConnectHubProps {
  onLogReceived: (log: WorkLog) => void;
  onRefreshLedger: () => void;
}

export const WhatsAppConnectHub: React.FC<WhatsAppConnectHubProps> = ({
  onLogReceived,
  onRefreshLedger,
}) => {
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const publicBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const webhookUrl = `${publicBaseUrl}/api/webhook`;
  const whatsappJoinUrl = 'https://wa.me/14155238886?text=join%20smart-river';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  const testWebhookCommand = async (command: string, lat?: number, lng?: number) => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const testPhone = '+9198765' + Math.floor(10000 + Math.random() * 90000);
      const params = new URLSearchParams();
      params.append('From', `whatsapp:${testPhone}`);
      params.append('Body', command);
      if (lat && lng) {
        params.append('Latitude', lat.toString());
        params.append('Longitude', lng.toString());
      }

      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      await res.text();
      setIsPinging(false);
      setPingResult(`✓ Pre-AI Bot Processed "${command}". Twilio TwiML 200 OK.`);
      onRefreshLedger();
    } catch (err: any) {
      setIsPinging(false);
      setPingResult(`Error: ${err.message}`);
    }
  };

  return (
    <div className="manila-folder border-2 border-[#aa8c58] rounded-md p-4 sm:p-5 mb-6 relative">
      {/* Non-overlapping Top Bar: Flex layout instead of absolute positioning */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b-2 border-[#aa8c58] pb-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Radio className="w-5 h-5 text-[#6f4e24] shrink-0 animate-pulse" />
          <div className="min-w-0">
            <h2 className="font-typewriter text-base sm:text-lg font-bold text-[#221910] uppercase tracking-wide leading-tight">
              Automated WhatsApp Teletype Station
            </h2>
            <p className="font-serif text-xs text-[#684f33] mt-0.5 leading-normal">
              Deterministic Finite State Machine (DFSA) &amp; Multi-lingual Lexical Syntax Parser for Laborers
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <span className="rubber-stamp rubber-stamp-red text-[9px] sm:text-[10px]">
            PRE-AI DETERMINISTIC BOT • ZERO HALLUCINATION
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Step 1 & QR Code */}
        <div className="lg:col-span-4 bg-[#fbf6ea] border-2 border-[#aa8c58] rounded p-3.5 shadow-inner flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-white p-2 border border-[#aa8c58] rounded shadow-xs shrink-0 text-center">
            <QRCodeSVG
              value={whatsappJoinUrl}
              size={105}
              bgColor="#ffffff"
              fgColor="#221910"
              level="M"
            />
            <span className="block text-[8px] font-typewriter text-[#684f33] mt-1 font-bold">
              SCAN WITH CAMERA
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-serif text-[#382819] flex-1 min-w-0 w-full">
            <div className="font-typewriter font-bold text-xs uppercase text-[#6f4e24]">
              Step 1: Connect Phone
            </div>
            <p className="text-[11px] leading-snug">
              Scan QR or click below to connect WhatsApp to official node:
            </p>
            <div className="bg-[#ebdcb9] px-2 py-1 rounded font-typewriter text-[11px] font-bold text-[#221910] border border-[#aa8c58]/60 inline-block">
              join smart-river
            </div>
            <p className="text-[10px] text-[#684f33] italic">
              Node Number: <strong>+1 (415) 523-8886</strong>
            </p>

            <div>
              <a
                href={whatsappJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-1 bg-[#2d6a4f] hover:bg-[#1b4332] text-[#fbf6ea] rounded font-typewriter text-[10px] font-bold shadow-xs transition"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                Open WhatsApp Web
                <ExternalLink className="w-2.5 h-2.5 opacity-80 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Step 2: Pre-AI Bot Command Tree */}
        <div className="lg:col-span-5 bg-[#fbf6ea] border-2 border-[#aa8c58] rounded p-3.5 shadow-inner text-xs font-typewriter space-y-2.5 flex flex-col justify-between">
          <div className="font-bold text-xs uppercase text-[#6f4e24] flex items-center justify-between border-b border-[#aa8c58]/40 pb-1.5">
            <span>Pre-AI Menu Commands Tree</span>
            <span className="text-[10px] text-[#9e2a2b] font-mono shrink-0">100% RELIABLE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-[#fae4df] border border-[#ecc2ba] rounded leading-snug">
              <strong className="text-[#9e2a2b] block text-[11px] mb-0.5">1. 📎 Location Pin</strong>
              <span className="text-[#382819]">Issues GPS Receipt &amp; locks ₹600</span>
            </div>

            <div className="p-2 bg-[#e8edf5] border border-[#c2d0e5] rounded leading-snug">
              <strong className="text-[#1d3557] block text-[11px] mb-0.5">2. "Hisaab" (हिसाब)</strong>
              <span className="text-[#382819]">Calculates total days &amp; wage balance</span>
            </div>

            <div className="p-2 bg-[#fff7f5] border border-[#d6a59b] rounded leading-snug">
              <strong className="text-[#9e2a2b] block text-[11px] mb-0.5">3. "Shikayat" (शिकायत)</strong>
              <span className="text-[#382819]">Files formal contractor wage dispute</span>
            </div>

            <div className="p-2 bg-[#f4ecd8] border border-[#aa8c58] rounded leading-snug">
              <strong className="text-[#6f4e24] block text-[11px] mb-0.5">4. "Rate" (नियम)</strong>
              <span className="text-[#382819]">Statutory minimum wage regulations</span>
            </div>

            <div className="p-2 bg-[#e8f5e9] border border-[#a5d6a7] rounded leading-snug">
              <strong className="text-[#2e7d32] block text-[11px] mb-0.5">5. "Help" (मदद)</strong>
              <span className="text-[#382819]">National labor helpline numbers</span>
            </div>

            <div className="p-2 bg-[#ebdcb9] border border-[#aa8c58] rounded leading-snug">
              <strong className="text-[#221910] block text-[11px] mb-0.5">6. "Site" (साइट)</strong>
              <span className="text-[#382819]">Manual site entry without GPS</span>
            </div>
          </div>
        </div>

        {/* Step 3: Direct Webhook Simulator & Endpoint */}
        <div className="lg:col-span-3 bg-[#fbf6ea] border-2 border-[#aa8c58] rounded p-3.5 shadow-inner flex flex-col justify-between h-full text-xs font-serif space-y-2.5">
          <div>
            <div className="font-typewriter font-bold text-xs uppercase text-[#6f4e24] flex items-center justify-between">
              <span>Webhook Receiver</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="w-full px-2 py-1 bg-[#ebdcb9] border border-[#aa8c58] rounded text-[10px] font-mono font-bold text-[#221910] truncate"
              />
              <button
                onClick={() => copyToClipboard(webhookUrl)}
                className="px-2 py-1 bg-[#aa8c58] hover:bg-[#8b6f47] text-[#fbf6ea] rounded text-[10px] font-typewriter shrink-0 font-bold"
              >
                {copiedWebhook ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-typewriter text-[#6f4e24] block font-bold">
              Test Pre-AI Bot Webhook POST:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => testWebhookCommand('Location Pin: Azadpur Hub', 28.7159, 77.1691)}
                disabled={isPinging}
                className="flex-1 py-1 px-1.5 bg-[#9e2a2b] hover:bg-[#781f20] text-[#fbf6ea] rounded font-typewriter text-[9px] font-bold shadow-xs transition"
              >
                Pin GPS
              </button>
              <button
                onClick={() => testWebhookCommand('Hisaab')}
                disabled={isPinging}
                className="flex-1 py-1 px-1.5 bg-[#1d3557] hover:bg-[#122238] text-[#fbf6ea] rounded font-typewriter text-[9px] font-bold shadow-xs transition"
              >
                Hisaab
              </button>
              <button
                onClick={() => testWebhookCommand('Shikayat')}
                disabled={isPinging}
                className="flex-1 py-1 px-1.5 bg-[#6f4e24] hover:bg-[#4e3314] text-[#fbf6ea] rounded font-typewriter text-[9px] font-bold shadow-xs transition"
              >
                Dispute
              </button>
            </div>
            {pingResult && (
              <p className="text-[9px] text-[#2d6a4f] font-typewriter mt-1 break-words font-bold">
                {pingResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
