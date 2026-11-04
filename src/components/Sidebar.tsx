import React, { useState } from 'react';
import { Users, Radio, MapPin, RotateCcw, Search, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const [directPhone, setDirectPhone] = useState('');

  const handleDirectLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPhone.trim()) return;
    onSelectWorker(directPhone.trim());
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 retro-card rounded-xl p-4 sm:p-5 space-y-4">
      {/* Sidebar Header */}
      <div className="border-b border-[#1b485d] pb-2.5">
        <h2 className="text-sm font-extrabold text-[#edf8f5] uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-[#22d3ee] shrink-0" />
          <span>{t.dossierSection}</span>
        </h2>
        <p className="text-xs text-[#8abcb0] mt-0.5 font-medium">
          Select a worker to see their days and slips
        </p>
      </div>

      {/* Select Worker Filter */}
      <div className="retro-inset rounded-lg p-3">
        <label className="block text-xs font-bold text-[#edf8f5] mb-2 flex items-center justify-between">
          <span>{t.workerDossierSelect}</span>
          <span className="text-[11px] bg-[#07241b] text-[#34d399] px-2 py-0.5 rounded font-bold border border-[#165640]">
            {workers.length} {t.enrolledCount}
          </span>
        </label>
        <select
          value={selectedWorker}
          onChange={(e) => onSelectWorker(e.target.value)}
          className="w-full px-2.5 py-2 bg-[#091e2b] border border-[#1d4d62] rounded-md text-xs sm:text-sm font-mono font-bold text-[#edf8f5] focus:outline-none focus:ring-2 focus:ring-[#22d3ee] cursor-pointer transition-all duration-200"
        >
          <option value="All Workers" className="bg-[#091e2b] text-[#edf8f5]">{t.allLaborersOption}</option>
          {workers.map((phone) => (
            <option key={phone} value={phone} className="bg-[#091e2b] text-[#edf8f5]">
              {phone}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Action Buttons with Tactile 3D Feel */}
      <div className="space-y-2.5">
        <button
          onClick={onQuickCheckIn}
          className="retro-btn-emerald w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg font-black text-xs sm:text-sm cursor-pointer active:scale-95 shadow-md"
        >
          <MapPin className="w-4 h-4 text-[#7ff0cb] shrink-0" />
          <span>{t.dispatchGpsPinBtn}</span>
        </button>

        <button
          onClick={onOpenSimulator}
          className="retro-btn-muted w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg font-extrabold text-xs sm:text-sm cursor-pointer active:scale-95"
        >
          <Radio className="w-4 h-4 text-[#22d3ee] shrink-0" />
          <span>{t.telexConsoleBtn}</span>
        </button>
      </div>

      {/* Simple How-it-Works Box */}
      <div className="bg-[#06241b] border border-[#15664a] rounded-lg p-3 text-xs text-[#edf8f5]">
        <div className="font-extrabold text-[#34d399] text-xs uppercase mb-1.5 flex items-center justify-between tracking-wide">
          <span>{t.regulationInstructions}</span>
          <CheckCircle className="w-3.5 h-3.5 text-[#34d399]" />
        </div>
        <ol className="list-decimal list-inside space-y-1 text-xs text-[#9fc7bd] leading-relaxed font-medium">
          <li>{t.instStep1}</li>
          <li>{t.instStep2}</li>
          <li>{t.instStep3}</li>
        </ol>
      </div>

      {/* Direct Search by Phone */}
      <form onSubmit={handleDirectLookup} className="pt-2 border-t border-[#1b485d]">
        <label className="block text-xs font-bold text-[#22d3ee] mb-1.5">
          {t.directWorkerChatLabel}
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="+91..."
            value={directPhone}
            onChange={(e) => setDirectPhone(e.target.value)}
            className="flex-1 min-w-0 px-2.5 py-1.5 bg-[#081b27] border border-[#1c4b60] rounded-md text-xs sm:text-sm font-mono font-bold text-[#edf8f5] placeholder-[#679187] focus:outline-none focus:ring-1 focus:ring-[#22d3ee]"
          />
          <button
            type="submit"
            className="retro-btn-petrol px-3 py-1.5 text-xs font-bold rounded-md shrink-0 flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Search className="w-3 h-3" />
            <span>{t.chatBtn}</span>
          </button>
        </div>
      </form>

      {/* Reset Records */}
      <div className="pt-2 border-t border-[#1b485d]">
        <button
          onClick={onResetData}
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#70a194] hover:text-[#22d3ee] font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span>{t.resetArchivedBtn}</span>
        </button>
      </div>
    </aside>
  );
};
