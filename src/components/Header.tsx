import React from 'react';
import { RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  onOpenSimulator: () => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSimulator, onRefresh }) => {
  return (
    <header className="relative mb-6">
      {/* Top Filing Tab / Gazette Banner */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#8b6f47] pb-1.5 mb-3 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#6f4e24] text-[#fbf6ea] px-2.5 py-0.5 text-[10px] font-typewriter font-bold uppercase tracking-widest rounded-t shadow-xs shrink-0">
            DOC. NO. 1974-LAB / GAZETTE
          </span>
          <span className="text-[11px] font-typewriter text-[#684f33] hidden md:inline">
            CONFIDENTIAL UNION COMMAND DESK • UNORGANIZED SECTOR REGISTER
          </span>
        </div>
        <div className="text-[10px] font-typewriter text-[#6f4e24] font-bold shrink-0">
          EST. MANUAL VERIFICATION ACT
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#221910] tracking-wider uppercase border-b-2 border-[#8b6f47] pb-1 leading-tight">
              श्रमिक साक्षी • SHRAMIK SAKSHI
            </h1>
            <span className="rubber-stamp rubber-stamp-red text-[10px] sm:text-[11px]">
              [ IMMUTABLE LEDGER ]
            </span>
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-[#4e3314] mt-2 leading-relaxed max-w-3xl">
            Official Pre-Internet Physical Command Register: Digital wage theft prevention ledger for unorganized laborers via WhatsApp telegraphic satellite GPS tokens.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-typewriter font-bold rounded bg-[#ebdcb9] hover:bg-[#dfcaa0] border-2 border-[#aa8c58] text-[#221910] shadow-sm transition active:translate-y-0.5"
            title="Re-read physical ledger cards"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#6f4e24] shrink-0" />
            SYNC REGISTER
          </button>

          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-typewriter font-bold rounded bg-[#6f4e24] hover:bg-[#4e3314] border-2 border-[#382819] text-[#fbf6ea] shadow-md transition active:translate-y-0.5"
          >
            <Radio className="w-4 h-4 text-[#ecc2ba] shrink-0" />
            WHATSAPP TELEX CONSOLE
          </button>
        </div>
      </div>

      {/* Decorative Ticker Tape / Registry Ribbon */}
      <div className="mt-4 p-2.5 bg-[#ebdcb9] border-y-2 border-[#aa8c58] text-[11px] font-typewriter text-[#382819] flex flex-wrap items-center justify-between gap-2.5 shadow-inner leading-normal">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#9e2a2b] shrink-0 animate-ping"></span>
          <span>TELEGRAPH WIRE: <strong className="whitespace-nowrap">+1 (415) 523-8886</strong> (TWILIO SANDBOX)</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span>CODE: <strong className="bg-[#fbf6ea] px-1 py-0.5 border border-[#aa8c58] whitespace-nowrap">join smart-river</strong></span>
          <span className="hidden sm:inline text-[#aa8c58]">•</span>
          <span>STATUTORY WAGE: <strong className="text-[#9e2a2b] whitespace-nowrap">₹600.00 / DAY</strong></span>
          <span className="hidden sm:inline text-[#aa8c58]">•</span>
          <span>EVIDENCE: <strong className="whitespace-nowrap">UNALTERABLE GPS TOKEN</strong></span>
        </div>
      </div>
    </header>
  );
};
