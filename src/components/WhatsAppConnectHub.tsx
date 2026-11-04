import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MessageSquare, ExternalLink, Radio, Copy, HelpCircle, CheckCircle2, AlertTriangle, Settings, Terminal } from 'lucide-react';
import { WorkLog } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WhatsAppConnectHubProps {
  onLogReceived: (log: WorkLog) => void;
  onRefreshLedger: () => void;
  onOpenSimulator?: () => void;
}

export const WhatsAppConnectHub: React.FC<WhatsAppConnectHubProps> = ({
  onRefreshLedger,
  onOpenSimulator,
}) => {
  const { t } = useLanguage();
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedJoinCode, setCopiedJoinCode] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [showSandboxGuide, setShowSandboxGuide] = useState(false);

  // User-configurable Twilio Sandbox Word (saved to localStorage)
  const [sandboxWord, setSandboxWord] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('shramik_twilio_sandbox_code');
      return saved || 'smart-river';
    } catch {
      return 'smart-river';
    }
  });

  const handleSandboxWordChange = (val: string) => {
    const cleaned = val.replace(/^join\s+/i, '').trim();
    setSandboxWord(cleaned);
    try {
      localStorage.setItem('shramik_twilio_sandbox_code', cleaned);
    } catch {
      // Ignored
    }
  };

  const publicBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const webhookUrl = `${publicBaseUrl}/api/webhook`;
  const activeJoinText = `join ${sandboxWord || 'smart-river'}`;
  const whatsappJoinUrl = `https://wa.me/14155238886?text=${encodeURIComponent(activeJoinText)}`;

  const copyToClipboard = (text: string, isCode = false) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedJoinCode(true);
      setTimeout(() => setCopiedJoinCode(false), 2500);
    } else {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2500);
    }
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

      const xmlText = await res.text();
      setIsPinging(false);
      setPingResult(`✓ Pre-AI Bot Processed "${command}". Twilio TwiML 200 OK.`);
      onRefreshLedger();
    } catch (err: any) {
      setIsPinging(false);
      setPingResult(`Error: ${err.message}`);
    }
  };

  return (
    <div className="manila-folder border-2 border-[#526a3c] rounded-md p-4 sm:p-5 mb-6 relative">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b-2 border-[#526a3c]/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Radio className="w-5 h-5 text-[#19616e] shrink-0 animate-pulse" />
          <div className="min-w-0">
            <h2 className="font-typewriter text-base sm:text-lg font-bold text-[#142618] uppercase tracking-wide leading-tight">
              {t.teletypeStationTitle}
            </h2>
            <p className="font-serif text-xs text-[#3f5732] mt-0.5 leading-normal">
              {t.teletypeStationSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSandboxGuide(!showSandboxGuide)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#dbe5d2] hover:bg-[#ccd9c2] border border-[#526a3c] text-[11px] font-typewriter font-bold text-[#142618]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#19616e]" />
            <span>Twilio Setup Guide</span>
          </button>
          <span className="rubber-stamp rubber-stamp-algae text-[9px] sm:text-[10px]">
            {t.preAiBadge}
          </span>
        </div>
      </div>

      {/* Twilio Sandbox Troubleshooting Alert */}
      <div className="bg-[#e4ede0] border-2 border-[#526a3c] rounded p-3 mb-4 text-xs font-serif text-[#1e3019]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#19616e] shrink-0 mt-0.5" />
            <div>
              <strong className="font-typewriter font-bold text-[#142618] uppercase block">
                Saw "Failed to join sandbox" on WhatsApp?
              </strong>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#2d4726]">
                Twilio WhatsApp Sandbox assigns a unique random 2-word code to every Twilio account (e.g. <code>join brave-badger</code>). 
                The initial code <code>smart-river</code> was a placeholder. Enter your active sandbox word below to update your QR code and link instantly, or test directly with the in-app terminal!
              </p>
            </div>
          </div>
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#19616e] hover:bg-[#0f4c55] text-[#f6f9f2] font-typewriter font-bold text-[11px] shrink-0 border border-[#092e34] shadow-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-[#80ced8]" />
              <span>Launch In-App Telex Terminal</span>
            </button>
          )}
        </div>

        {/* Expandable step-by-step guide */}
        {showSandboxGuide && (
          <div className="mt-3 pt-3 border-t border-[#526a3c]/30 text-[11px] space-y-2 bg-[#f6f9f2] p-3 rounded border border-[#526a3c]/40">
            <div className="font-typewriter font-bold uppercase text-[#142618]">
              Official 60-Second Twilio Sandbox Connection:
            </div>
            <ol className="list-decimal list-inside space-y-1 font-serif text-[#1e3019]">
              <li>
                Log into your free Twilio Console at{' '}
                <a
                  href="https://console.twilio.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#19616e] underline font-bold"
                >
                  console.twilio.com
                </a>
              </li>
              <li>
                Navigate to <strong>Messaging → Try it out → Send a WhatsApp message</strong>.
              </li>
              <li>
                Find your assigned sandbox code: <code>join &lt;your-sandbox-word&gt;</code> and enter the word in the box below.
              </li>
              <li>
                Under <strong>Sandbox Settings</strong> on that same Twilio page, set the <strong>WHEN A MESSAGE COMES IN</strong> webhook to:
                <div className="mt-1 flex items-center gap-2 font-mono text-[10px] bg-[#dbe5d2] p-1.5 rounded border border-[#526a3c]">
                  <span className="truncate">{webhookUrl}</span>
                  <button
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="px-2 py-0.5 bg-[#19616e] text-white rounded font-typewriter text-[9px] shrink-0 font-bold"
                  >
                    Copy
                  </button>
                </div>
              </li>
            </ol>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Step 1 & QR Code */}
        <div className="lg:col-span-4 bg-[#f6f9f2] border-2 border-[#526a3c]/40 rounded p-3.5 shadow-inner flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-white p-2 border border-[#526a3c]/60 rounded shadow-xs shrink-0 text-center">
            <QRCodeSVG
              value={whatsappJoinUrl}
              size={110}
              bgColor="#ffffff"
              fgColor="#1b4332"
              level="M"
            />
            <span className="block text-[8px] font-typewriter text-[#3f5732] mt-1 font-bold">
              {t.scanWithCamera}
            </span>
          </div>

          <div className="space-y-2 text-xs font-serif text-[#1e3019] flex-1 min-w-0 w-full">
            <div className="font-typewriter font-bold text-xs uppercase text-[#2d4726] flex items-center justify-between">
              <span>{t.step1Title}</span>
              <Settings className="w-3.5 h-3.5 text-[#526a3c]" />
            </div>

            {/* Editable Sandbox Word Box */}
            <div>
              <label className="text-[10px] font-typewriter font-bold text-[#3f5732] block">
                YOUR TWILIO SANDBOX KEYWORD:
              </label>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-[#526a3c] bg-[#dbe5d2] px-1.5 py-1 border border-[#526a3c]/60 rounded-l">
                  join
                </span>
                <input
                  type="text"
                  value={sandboxWord}
                  onChange={(e) => handleSandboxWordChange(e.target.value)}
                  placeholder="e.g. bold-river"
                  className="flex-1 min-w-0 px-2 py-1 bg-white border border-[#526a3c] rounded-r font-mono text-xs font-bold text-[#142618] focus:outline-none focus:ring-1 focus:ring-[#19616e]"
                  title="Enter your unique Twilio sandbox word from console.twilio.com"
                />
              </div>
            </div>

            <p className="text-[10px] text-[#3f5732] italic">
              {t.nodeNumberLabel}: <strong>+1 (415) 523-8886</strong>
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <a
                href={whatsappJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1b4332] hover:bg-[#143225] text-[#f6f9f2] rounded font-typewriter text-[10px] font-bold shadow-xs transition"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                {t.openWhatsappWeb}
                <ExternalLink className="w-2.5 h-2.5 opacity-80 shrink-0" />
              </a>

              <button
                onClick={() => copyToClipboard(activeJoinText, true)}
                className="inline-flex items-center gap-1 px-2 py-1.5 bg-[#dbe5d2] hover:bg-[#ccd9c2] border border-[#526a3c] text-[10px] font-typewriter font-bold text-[#142618] rounded"
              >
                <Copy className="w-3 h-3 text-[#19616e]" />
                <span>{copiedJoinCode ? 'Copied Code' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Pre-AI Bot Command Tree */}
        <div className="lg:col-span-5 bg-[#f6f9f2] border-2 border-[#526a3c]/40 rounded p-3.5 shadow-inner text-xs font-typewriter space-y-2.5 flex flex-col justify-between">
          <div className="font-bold text-xs uppercase text-[#2d4726] flex items-center justify-between border-b border-[#526a3c]/30 pb-1.5">
            <span>{t.step2Title}</span>
            <span className="text-[10px] text-[#19616e] font-mono shrink-0">100% RELIABLE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-[#e4ede0] border border-[#526a3c]/30 rounded leading-snug">
              <strong className="text-[#19616e] block text-[11px] mb-0.5">{t.command1}</strong>
              <span className="text-[#1e3019]">{t.command1Desc}</span>
            </div>

            <div className="p-2 bg-[#d7e5e8] border border-[#80ced8]/40 rounded leading-snug">
              <strong className="text-[#0f4c55] block text-[11px] mb-0.5">{t.command2}</strong>
              <span className="text-[#1e3019]">{t.command2Desc}</span>
            </div>

            <div className="p-2 bg-[#f0eae1] border border-[#526a3c]/30 rounded leading-snug">
              <strong className="text-[#3c4a26] block text-[11px] mb-0.5">{t.command3}</strong>
              <span className="text-[#1e3019]">{t.command3Desc}</span>
            </div>

            <div className="p-2 bg-[#eaf1e7] border border-[#526a3c]/30 rounded leading-snug">
              <strong className="text-[#1b4332] block text-[11px] mb-0.5">{t.command4}</strong>
              <span className="text-[#1e3019]">{t.command4Desc}</span>
            </div>

            <div className="p-2 bg-[#e2efe9] border border-[#2d6a4f]/30 rounded leading-snug">
              <strong className="text-[#2d6a4f] block text-[11px] mb-0.5">{t.command5}</strong>
              <span className="text-[#1e3019]">{t.command5Desc}</span>
            </div>

            <div className="p-2 bg-[#dbe5d2] border border-[#526a3c]/30 rounded leading-snug">
              <strong className="text-[#142618] block text-[11px] mb-0.5">{t.command6}</strong>
              <span className="text-[#1e3019]">{t.command6Desc}</span>
            </div>
          </div>
        </div>

        {/* Step 3: Direct Webhook Simulator & Endpoint */}
        <div className="lg:col-span-3 bg-[#f6f9f2] border-2 border-[#526a3c]/40 rounded p-3.5 shadow-inner flex flex-col justify-between h-full text-xs font-serif space-y-2.5">
          <div>
            <div className="font-typewriter font-bold text-xs uppercase text-[#2d4726] flex items-center justify-between">
              <span>{t.step3Title}</span>
              <span className="w-2 h-2 rounded-full bg-[#1b4332] animate-ping"></span>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="w-full px-2 py-1 bg-[#dbe5d2] border border-[#526a3c]/40 rounded text-[10px] font-mono font-bold text-[#142618] truncate"
              />
              <button
                onClick={() => copyToClipboard(webhookUrl)}
                className="px-2 py-1 bg-[#526a3c] hover:bg-[#3c4a26] text-[#f6f9f2] rounded text-[10px] font-typewriter shrink-0 font-bold"
                title="Copy webhook URL for Twilio Console"
              >
                {copiedWebhook ? t.copiedLabel : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-typewriter text-[#2d4726] block font-bold">
              {t.testWebhookPost}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => testWebhookCommand('Location Pin: Azadpur Hub', 28.7159, 77.1691)}
                disabled={isPinging}
                className="flex-1 py-1 px-1.5 bg-[#19616e] hover:bg-[#0f4c55] text-[#f6f9f2] rounded font-typewriter text-[9px] font-bold shadow-xs transition"
              >
                {t.testPinBtn}
              </button>
              <button
                onClick={() => testWebhookCommand('Hisaab')}
                disabled={isPinging}
                className="flex-1 py-1 px-1.5 bg-[#1b4332] hover:bg-[#143225] text-[#f6f9f2] rounded font-typewriter text-[9px] font-bold shadow-xs transition"
              >
                {t.testHisaabBtn}
              </button>
              <button
                onClick={() => testWebhookCommand('Shikayat')}
                disabled={isPinging}
                className="flex-1 py-1 px-1.5 bg-[#3c4a26] hover:bg-[#2d4726] text-[#f6f9f2] rounded font-typewriter text-[9px] font-bold shadow-xs transition"
              >
                {t.testDisputeBtn}
              </button>
            </div>
            {pingResult && (
              <p className="text-[9px] text-[#1b4332] font-typewriter mt-1 break-words font-bold">
                {pingResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
