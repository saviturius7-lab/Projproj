import React, { useState } from 'react';
import { Users, Radio, MapPin, RotateCcw, Search, CheckCircle, BookOpen, HardHat, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  workers: string[];
  selectedWorker: string;
  onSelectWorker: (worker: string) => void;
  onOpenSimulator: () => void;
  onQuickCheckIn: () => void;
  onResetData: () => void;
  onOpenTutorial: (role?: 'worker' | 'admin') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workers,
  selectedWorker,
  onSelectWorker,
  onOpenSimulator,
  onQuickCheckIn,
  onResetData,
  onOpenTutorial,
}) => {
  const { language, t } = useLanguage();
  const [directPhone, setDirectPhone] = useState('');

  const handleDirectLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPhone.trim()) return;
    onSelectWorker(directPhone.trim());
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 comic-card-wobble-2 p-4 sm:p-5 space-y-4">
      {/* Sidebar Header */}
      <div className="border-b-2 border-[#232b28]/20 pb-2.5">
        <h2 className="text-sm font-black text-[#232b28] uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-[#1e7587] shrink-0" />
          <span>{t.dossierSection}</span>
        </h2>
        <p className="text-xs text-[#55694a] mt-0.5 font-semibold">
          Select a worker to see their days and slips
        </p>
      </div>

      {/* Select Worker Filter */}
      <div className="comic-inset rounded-xl p-3">
        <label className="block text-xs font-black text-[#232b28] mb-2 flex items-center justify-between">
          <span>{t.workerDossierSelect}</span>
          <span className="text-[11px] bg-white text-[#1e7587] px-2 py-0.5 rounded-full font-black border-2 border-[#232b28]">
            {workers.length} {t.enrolledCount}
          </span>
        </label>
        <select
          value={selectedWorker}
          onChange={(e) => onSelectWorker(e.target.value)}
          className="w-full px-2.5 py-2 bg-white border-2 border-[#232b28] rounded-xl text-xs sm:text-sm font-bold text-[#232b28] focus:outline-none cursor-pointer shadow-[2px_2px_0px_#232b28]"
        >
          <option value="All Workers" className="bg-white text-[#232b28]">{t.allLaborersOption}</option>
          {workers.map((phone) => (
            <option key={phone} value={phone} className="bg-white text-[#232b28]">
              {phone}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Action Buttons with Tactile Feel */}
      <div className="space-y-2.5">
        <button
          onClick={onQuickCheckIn}
          className="comic-btn-emerald w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer active:scale-95 font-black"
        >
          <MapPin className="w-4 h-4 text-white shrink-0" />
          <span>{t.dispatchGpsPinBtn}</span>
        </button>

        <button
          onClick={onOpenSimulator}
          className="comic-btn-cream w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm cursor-pointer active:scale-95 font-black"
        >
          <Radio className="w-4 h-4 text-[#e8638b] shrink-0" />
          <span>{t.telexConsoleBtn}</span>
        </button>
      </div>

      {/* Dedicated Interactive Tutorials Card */}
      <div className="comic-inset rounded-xl p-3 space-y-2 border-2 border-[#232b28]">
        <div className="flex items-center justify-between text-xs font-black text-[#232b28]">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#1e7587]" />
            <span>
              {language === 'hi' ? 'फील्ड गाइड व ट्यूटोरियल' : 
               language === 'kn' ? 'ಮಾರ್ಗದರ್ಶಿ & ಟ್ಯುಟೋರಿಯಲ್' : 
               language === 'te' ? 'ఫీల్డ్ గైడ్స్ & ట్యుటోరియల్స్' : 
               language === 'ta' ? 'வழிகாட்டிகள் & டுடோரியல்' : 
               language === 'ml' ? 'ഗൈഡുകൾ & ട്യൂട്ടോറിയൽ' : 
               'Tutorials & Field Guides'}
            </span>
          </span>
          <span className="text-[10px] bg-[#e8638b] text-white px-1.5 py-0.2 rounded font-black">Help</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          <button
            onClick={() => onOpenTutorial('worker')}
            className="comic-btn-emerald w-full py-2 px-3 text-xs font-black flex items-center justify-between cursor-pointer active:scale-95"
            title="Open Worker Walkthrough"
          >
            <span className="flex items-center gap-1.5 text-left">
              <HardHat className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'hi' ? 'मजदूर साथी गाइड' : 
                     language === 'kn' ? 'ಕಾರ್ಮಿಕ ಗೈಡ್' : 
                     language === 'te' ? 'కార్మిక గైడ్' : 
                     language === 'ta' ? 'தொழிலாளர் வழிகாட்டி' : 
                     language === 'ml' ? 'തൊഴിലാളി ഗൈഡ്' : 
                     'Worker Guide'}</span>
            </span>
            <span className="text-[10px] bg-black/25 text-white px-1.5 py-0.5 rounded font-black">1-Click</span>
          </button>
          <button
            onClick={() => onOpenTutorial('admin')}
            className="comic-btn-teal w-full py-2 px-3 text-xs font-black flex items-center justify-between cursor-pointer active:scale-95"
            title="Open Admin & Supervisor Walkthrough"
          >
            <span className="flex items-center gap-1.5 text-left">
              <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'hi' ? 'ठेकेदार/मुंशी गाइड' : 
                     language === 'kn' ? 'ಮೇಲ್ವಿಚಾರಕ ಗೈಡ್' : 
                     language === 'te' ? 'సూపర్‌వైజర్ గైడ్' : 
                     language === 'ta' ? 'மேற்பார்வையாளர்' : 
                     language === 'ml' ? 'സൂപ്പർവൈസർ ഗൈഡ്' : 
                     'Admin & Supervisor'}</span>
            </span>
            <span className="text-[10px] bg-black/25 text-white px-1.5 py-0.5 rounded font-black">Ledger</span>
          </button>
        </div>
      </div>

      {/* Storybook Instructions Box */}
      <div className="bg-[#e9f0d4] border-2 border-[#232b28] rounded-[18px_240px_16px_235px/240px_18px_235px_20px] p-3 text-xs text-[#232b28] shadow-[2px_2px_0px_#232b28]">
        <div className="font-black text-[#5c6e2b] text-xs uppercase mb-1.5 flex items-center justify-between tracking-wide">
          <span>{t.regulationInstructions}</span>
          <CheckCircle className="w-3.5 h-3.5 text-[#5c6e2b]" />
        </div>
        <ol className="list-decimal list-inside space-y-1 text-xs text-[#3a4433] leading-relaxed font-semibold">
          <li>{t.instStep1}</li>
          <li>{t.instStep2}</li>
          <li>{t.instStep3}</li>
        </ol>
      </div>

      {/* Direct Search by Phone */}
      <form onSubmit={handleDirectLookup} className="pt-2 border-t-2 border-[#232b28]/20">
        <label className="block text-xs font-black text-[#1e7587] mb-1.5">
          {t.directWorkerChatLabel}
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="+91..."
            value={directPhone}
            onChange={(e) => setDirectPhone(e.target.value)}
            className="flex-1 min-w-0 px-2.5 py-1.5 bg-white border-2 border-[#232b28] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#232b28] placeholder-[#7d8f78] focus:outline-none shadow-[2px_2px_0px_#232b28]"
          />
          <button
            type="submit"
            className="comic-btn-pink px-3 py-1.5 text-xs font-black shrink-0 flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Search className="w-3 h-3" />
            <span>{t.chatBtn}</span>
          </button>
        </div>
      </form>

      {/* Reset Records */}
      <div className="pt-2 border-t-2 border-dashed border-[#232b28]/20">
        <button
          onClick={onResetData}
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#55694a] hover:text-[#1e7587] font-black transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span>{t.resetArchivedBtn}</span>
        </button>
      </div>
    </aside>
  );
};
