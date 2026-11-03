import React, { useState } from 'react';
import { Compass, MessageSquare, ExternalLink, Radio, MapPin, RotateCcw, Paperclip } from 'lucide-react';

interface SidebarProps {
  workers: string[];
  selectedWorker: string;
  onSelectWorker: (worker: string) => void;
  onOpenSimulator: () => void;
  onQuickCheckIn: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workers,
  selectedWorker,
  onSelectWorker,
  onOpenSimulator,
  onQuickCheckIn,
  onResetData,
}) => {
  const [directPhone, setDirectPhone] = useState('');

  const launchDirectChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPhone) return;
    const clean = directPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${clean}?text=Shramik%20Sakshi%20Labor%20Protection%20Record`, '_blank');
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 manila-folder border-2 border-[#aa8c58] rounded-md p-4 shadow-md relative">
      {/* Decorative brass paperclip */}
      <div className="absolute -top-3 left-6 text-[#aa8c58] pointer-events-none">
        <Paperclip className="w-6 h-6 transform -rotate-45" />
      </div>

      <div className="border-b-2 border-[#aa8c58] pb-2 mb-4 pt-1">
        <span className="text-[10px] font-typewriter font-bold uppercase text-[#6f4e24] block leading-tight">
          DOSSIER SECTION 4-A
        </span>
        <h2 className="font-typewriter text-base font-bold text-[#221910] uppercase tracking-wide flex items-center gap-2 mt-0.5">
          <Compass className="w-4 h-4 text-[#6f4e24] shrink-0" />
          Command Controls
        </h2>
      </div>

      {/* Select Worker Filter */}
      <div className="mb-5 bg-[#fbf6ea] border-2 border-[#aa8c58] rounded p-2.5 shadow-inner">
        <label className="block text-[11px] font-typewriter font-bold uppercase text-[#6f4e24] mb-1.5 flex flex-wrap items-center justify-between gap-1 leading-tight">
          <span>Worker Dossier Select:</span>
          <span className="text-[10px] text-[#9e2a2b] font-mono shrink-0">
            {workers.length} ENROLLED
          </span>
        </label>
        <select
          value={selectedWorker}
          onChange={(e) => onSelectWorker(e.target.value)}
          className="w-full px-2 py-1.5 bg-[#ebdcb9] border border-[#aa8c58] rounded text-xs font-mono font-bold text-[#221910] focus:outline-none focus:ring-1 focus:ring-[#6f4e24]"
        >
          <option value="All Workers">All Laborers (Master Roll)</option>
          {workers.map((phone) => (
            <option key={phone} value={phone}>
              Dossier: {phone}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2 mb-5">
        <button
          onClick={onOpenSimulator}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#6f4e24] hover:bg-[#4e3314] text-[#fbf6ea] font-typewriter font-bold text-xs transition border-2 border-[#382819] shadow-sm active:translate-y-0.5"
        >
          <Radio className="w-4 h-4 text-[#ecc2ba] shrink-0" />
          <span>WHATSAPP TELEX CONSOLE</span>
        </button>

        <button
          onClick={onQuickCheckIn}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#ebdcb9] hover:bg-[#dfcaa0] text-[#221910] font-typewriter font-bold text-xs transition border-2 border-[#aa8c58] active:translate-y-0.5"
        >
          <MapPin className="w-3.5 h-3.5 text-[#9e2a2b] shrink-0" />
          <span>DISPATCH GPS ATTENDANCE PIN</span>
        </button>
      </div>

      {/* Instructions Card: Carbon slip style */}
      <div className="carbon-copy-pink border-2 border-[#ecc2ba] rounded p-3 mb-4 text-xs font-serif text-[#382819] shadow-inner relative">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
          <span className="font-typewriter font-bold text-[#9e2a2b] text-[11px] uppercase shrink-0">
            REGULATION INSTRUCTIONS:
          </span>
          <span className="rubber-stamp rubber-stamp-red text-[8px]">
            URGENT
          </span>
        </div>
        <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
          <li>
            Open WhatsApp on personal device or web.
          </li>
          <li>
            Send code: <strong className="font-typewriter text-[#9e2a2b] bg-[#fbf6ea] px-1 py-0.5 border border-[#ecc2ba] whitespace-nowrap">join smart-river</strong>
          </li>
          <li>
            Broadcast <strong className="text-[#221910]">Location Pin</strong> to log attendance or text <strong className="font-typewriter whitespace-nowrap">Hisaab</strong>.
          </li>
        </ol>
      </div>

      {/* External WhatsApp button */}
      <a
        href="https://wa.me/14155238886?text=join%20smart-river"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#2d6a4f] hover:bg-[#1b4332] text-[#fbf6ea] font-typewriter font-bold text-xs transition border-2 border-[#1b4332] shadow-sm leading-tight"
      >
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span>CONNECT LIVE WHATSAPP</span>
        <ExternalLink className="w-3 h-3 ml-0.5 opacity-80 shrink-0" />
      </a>

      {/* Direct phone WhatsApp lookup */}
      <form onSubmit={launchDirectChat} className="mt-4 pt-3 border-t border-[#aa8c58]/60">
        <label className="block text-[10px] font-typewriter font-bold text-[#6f4e24] mb-1.5 uppercase leading-tight">
          Direct Worker WhatsApp Link:
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="+91..."
            value={directPhone}
            onChange={(e) => setDirectPhone(e.target.value)}
            className="flex-1 min-w-0 px-2 py-1 bg-[#fbf6ea] border border-[#aa8c58] rounded text-xs font-mono font-bold text-[#221910] focus:outline-none"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-[#aa8c58] hover:bg-[#8b6f47] text-[#fbf6ea] text-xs font-typewriter font-bold rounded shrink-0"
          >
            Chat
          </button>
        </div>
      </form>

      {/* Reset ledger button */}
      <div className="mt-4 pt-2 border-t border-[#aa8c58]/60">
        <button
          onClick={onResetData}
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-typewriter font-bold text-[#684f33] hover:text-[#9e2a2b] transition leading-tight text-center"
        >
          <RotateCcw className="w-3 h-3 shrink-0" />
          <span>RESET TO ARCHIVED SEED DOSSIERS</span>
        </button>
      </div>
    </aside>
  );
};
