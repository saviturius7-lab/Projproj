import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users, Calendar, Banknote } from 'lucide-react';

interface MetricsOverviewProps {
  activeLaborers: number;
  totalDays: number;
  totalCapital: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  activeLaborers,
  totalDays,
  totalCapital,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Metric 1: Workers (Sapphire Blue Card) */}
      <div className="retro-card-sapphire rounded-xl p-4 sm:p-5 flex flex-col justify-between group cursor-default">
        <div className="flex items-center justify-between gap-2 border-b border-[#1b436c] pb-2.5 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#0d2a4a] border border-[#2563a0] text-[#60a5fa]">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase text-[#93c5fd] tracking-wider">
              {t.tab1Title}
            </span>
          </div>
          <span className="bg-[#0b2440] text-[#60a5fa] px-2 py-0.5 rounded border border-[#1d4f82] text-[11px] font-extrabold tracking-wide">
            {t.tab1Badge}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-[#edf8f5] group-hover:text-[#60a5fa] transition-colors duration-300 my-1 font-mono tracking-tight drop-shadow-md">
          {String(activeLaborers).padStart(2, '0')}
        </div>

        <div className="text-xs text-[#a5c7eb] font-medium leading-relaxed">
          {t.tab1Desc}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#1b436c] text-xs font-bold text-[#60a5fa] flex items-center justify-between">
          <span>{t.tab1Foot}</span>
          <span className="text-[10px] text-[#558fcb] uppercase font-mono tracking-wider">SECURE</span>
        </div>
      </div>

      {/* Metric 2: Days Worked (Deep Emerald Algae Green Card) */}
      <div className="retro-card-algae rounded-xl p-4 sm:p-5 flex flex-col justify-between group cursor-default">
        <div className="flex items-center justify-between gap-2 border-b border-[#165640] pb-2.5 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#0a3528] border border-[#1b7a5a] text-[#34d399]">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase text-[#6ee7b7] tracking-wider">
              {t.tab2Title}
            </span>
          </div>
          <span className="bg-[#082b20] text-[#34d399] px-2 py-0.5 rounded border border-[#166348] text-[11px] font-extrabold tracking-wide">
            {t.tab2Badge}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-[#34d399] group-hover:text-[#4ade80] transition-colors duration-300 my-1 font-mono tracking-tight drop-shadow-md">
          {String(totalDays).padStart(3, '0')}
        </div>

        <div className="text-xs text-[#9fd5be] font-medium leading-relaxed">
          {t.tab2Desc}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#165640] text-xs font-bold text-[#34d399] flex items-center justify-between">
          <span>{t.tab2Foot}</span>
          <span className="text-[10px] text-[#2ba378] uppercase font-mono tracking-wider">MUSTERED</span>
        </div>
      </div>

      {/* Metric 3: Total Money Guaranteed (Rich Petrol Teal Card) */}
      <div className="retro-card rounded-xl p-4 sm:p-5 flex flex-col justify-between group cursor-default">
        <div className="flex items-center justify-between gap-2 border-b border-[#18495f] pb-2.5 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#082230] border border-[#206786] text-[#22d3ee]">
              <Banknote className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase text-[#67e8f9] tracking-wider">
              {t.tab3Title}
            </span>
          </div>
          <span className="bg-[#061d2a] text-[#22d3ee] px-2 py-0.5 rounded border border-[#1c556f] text-[11px] font-extrabold tracking-wide">
            {t.tab3Badge}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-[#22d3ee] group-hover:text-[#38bdf8] transition-colors duration-300 my-1 font-mono tracking-tight drop-shadow-md">
          ₹{totalCapital.toLocaleString('en-IN')}
        </div>

        <div className="text-xs text-[#9ecad4] font-medium leading-relaxed">
          {t.tab3Desc}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#18495f] text-xs font-bold text-[#22d3ee] flex items-center justify-between">
          <span>{t.tab3Foot}</span>
          <span className="text-[10px] text-[#20839e] uppercase font-mono tracking-wider">STATUTORY</span>
        </div>
      </div>
    </div>
  );
};
