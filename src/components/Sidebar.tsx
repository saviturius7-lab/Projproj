import React from 'react';
import { Compass, MessageSquare, ExternalLink, Smartphone, MapPin, RotateCcw, Users } from 'lucide-react';

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
  return (
    <aside className="w-full lg:w-72 shrink-0 bg-[#efe4c8] border-2 border-[#8b6f47] rounded-md p-4 lg:p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b border-[#8b6f47] pb-3 mb-4">
        <Compass className="w-5 h-5 text-[#7a5a2e]" />
        <h2 className="font-display text-lg font-bold text-[#2a1f12]">
          Command Center Controls
        </h2>
      </div>

      {/* Select Worker Filter */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6b5330] mb-1.5 flex items-center justify-between">
          <span>Select Worker</span>
          <span className="text-[11px] normal-case font-normal text-[#7a5a2e]">
            {workers.length} active
          </span>
        </label>
        <select
          value={selectedWorker}
          onChange={(e) => onSelectWorker(e.target.value)}
          className="w-full px-3 py-2 bg-[#f7f0de] border border-[#8b6f47] rounded text-sm text-[#3b2f1e] focus:outline-none focus:ring-1 focus:ring-[#7a5a2e] font-serif shadow-inner"
        >
          <option value="All Workers">All Workers (Combined Overview)</option>
          {workers.map((phone) => (
            <option key={phone} value={phone}>
              {phone}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Action buttons */}
      <div className="space-y-2 mb-5">
        <button
          onClick={onOpenSimulator}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#7a5a2e] hover:bg-[#5a3e1b] text-[#f4ecd8] font-semibold text-xs transition shadow border border-[#5a3e1b]"
        >
          <Smartphone className="w-4 h-4" />
          Test WhatsApp Bot Simulator
        </button>

        <button
          onClick={onQuickCheckIn}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#ebe0c2] hover:bg-[#dfd2b0] text-[#3b2f1e] font-medium text-xs transition border border-[#8b6f47]"
        >
          <MapPin className="w-3.5 h-3.5 text-[#7a5a2e]" />
          Record Fast Location Pin
        </button>
      </div>

      <hr className="border-[#8b6f47]/50 my-4" />

      {/* HOW TO TEST Instructions (from original Streamlit app) */}
      <div className="bg-[#ebe0c2] border border-[#8b6f47] rounded p-3 mb-4 text-xs text-[#3b2f1e] leading-relaxed">
        <div className="font-bold text-[#2a1f12] mb-1.5 flex items-center gap-1">
          <span>⚠️ HOW TO TEST:</span>
        </div>
        <ol className="list-decimal list-inside space-y-1 text-[#4a3a25]">
          <li>
            Click the button below or use our <strong className="text-[#2a1f12]">Simulator</strong>.
          </li>
          <li>
            Send the message: <strong className="text-[#2a1f12] font-mono bg-[#f4ecd8] px-1 py-0.5 rounded">join smart-river</strong>
          </li>
          <li>
            Once joined, send your <strong className="text-[#2a1f12]">Location Pin</strong> or type <strong className="text-[#2a1f12] font-mono">Hisaab</strong>!
          </li>
        </ol>
      </div>

      {/* External WhatsApp button */}
      <a
        href="https://wa.me/14155238886?text=join%20smart-river"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#7a5a2e] hover:bg-[#5a3e1b] text-[#f4ecd8] font-semibold text-xs transition shadow border border-[#5a3e1b]"
      >
        <MessageSquare className="w-4 h-4" />
        Chat with Bot on WhatsApp
        <ExternalLink className="w-3 h-3 ml-1 opacity-75" />
      </a>

      <hr className="border-[#8b6f47]/50 my-4" />

      {/* Reset Data */}
      <div className="pt-1">
        <button
          onClick={onResetData}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-[#6b5330] hover:text-[#2a1f12] hover:bg-[#e7ddc4] rounded border border-transparent hover:border-[#8b6f47]/40 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Demo Data to Initial Seeds
        </button>
      </div>
    </aside>
  );
};
