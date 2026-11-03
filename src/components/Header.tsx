import React from 'react';
import { ShieldCheck, MapPin, Receipt, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenSimulator: () => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSimulator, onRefresh }) => {
  return (
    <header className="border-b-2 border-[#8b6f47] pb-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-[#2a1f12] tracking-wide flex items-center gap-2">
            <span>📊 Shramik Sakshi</span>
            <span className="text-base font-normal px-2.5 py-0.5 rounded border border-[#8b6f47] bg-[#efe4c8] text-[#5a3e1b] inline-flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#7a5a2e]" />
              NGO Command Center
            </span>
          </h1>
          <p className="text-[#4a3a25] mt-1 text-sm md:text-base leading-relaxed">
            Clear worker visibility, transparent wage tracking, and trustworthy field oversight for the unorganized workforce.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            title="Reload ledger records"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium rounded border border-[#8b6f47] bg-[#efe4c8] hover:bg-[#e7ddc4] text-[#3b2f1e] shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#7a5a2e]" />
            Sync Ledger
          </button>

          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded border border-[#5a3e1b] bg-[#7a5a2e] hover:bg-[#5a3e1b] text-[#f4ecd8] shadow-md transition"
          >
            <Receipt className="w-4 h-4" />
            WhatsApp Test Bot
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#6b5330]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
          Twilio WhatsApp Node: <strong className="text-[#3b2f1e] font-serif">+1 (415) 523-8886</strong>
        </span>
        <span className="hidden sm:inline text-[#b59b72]">•</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#7a5a2e]" />
          GPS Attendance Rate: <strong className="text-[#3b2f1e] font-serif">₹600.00 / day</strong>
        </span>
        <span className="hidden sm:inline text-[#b59b72]">•</span>
        <span>
          Tamper-Evident Standard: <strong className="text-[#3b2f1e]">Immutable Receipts</strong>
        </span>
      </div>
    </header>
  );
};
