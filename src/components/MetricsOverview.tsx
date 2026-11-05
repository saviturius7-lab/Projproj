import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users, Calendar, Banknote, Sparkles } from 'lucide-react';

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
      {/* Room 1: Laborers Enrolled (Dusky Pink Bedroom & Library Motif) */}
      <div className="room-bedroom p-4 sm:p-5 flex flex-col justify-between group cursor-default transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between gap-2 border-b-2 border-[#232b28]/25 pb-2.5 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white border-2 border-[#232b28] text-[#1e7587] shadow-[2px_2px_0px_#232b28]">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase text-[#232b28] tracking-wider">
              {t.tab1Title}
            </span>
          </div>
          <span className="bg-white text-[#e8638b] px-2.5 py-0.5 rounded-full border-2 border-[#232b28] text-[11px] font-black shadow-[1px_1px_0px_#232b28]">
            {t.tab1Badge}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-[#232b28] my-1 font-mono tracking-tight drop-shadow-sm">
          {String(activeLaborers).padStart(2, '0')}
        </div>

        <div className="text-xs text-[#52323f] font-semibold leading-relaxed">
          {t.tab1Desc}
        </div>

        <div className="mt-3 pt-2 border-t-2 border-dashed border-[#232b28]/25 text-xs font-black text-[#1e7587] flex items-center justify-between">
          <span>{t.tab1Foot}</span>
          <span className="text-[10px] text-[#232b28] bg-white px-1.5 py-0.5 rounded border border-[#232b28] font-mono">ROOM 01</span>
        </div>
      </div>

      {/* Room 2: Days Worked (Mint Green Living Room Motif) */}
      <div className="room-living p-4 sm:p-5 flex flex-col justify-between group cursor-default transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between gap-2 border-b-2 border-[#232b28]/25 pb-2.5 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white border-2 border-[#232b28] text-[#2f855a] shadow-[2px_2px_0px_#232b28]">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase text-[#232b28] tracking-wider">
              {t.tab2Title}
            </span>
          </div>
          <span className="bg-white text-[#2f855a] px-2.5 py-0.5 rounded-full border-2 border-[#232b28] text-[11px] font-black shadow-[1px_1px_0px_#232b28]">
            {t.tab2Badge}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-[#232b28] my-1 font-mono tracking-tight drop-shadow-sm">
          {String(totalDays).padStart(3, '0')}
        </div>

        <div className="text-xs text-[#2c473c] font-semibold leading-relaxed">
          {t.tab2Desc}
        </div>

        <div className="mt-3 pt-2 border-t-2 border-dashed border-[#232b28]/25 text-xs font-black text-[#2f855a] flex items-center justify-between">
          <span>{t.tab2Foot}</span>
          <span className="text-[10px] text-[#232b28] bg-white px-1.5 py-0.5 rounded border border-[#232b28] font-mono">ROOM 02</span>
        </div>
      </div>

      {/* Room 3: Total Money Guaranteed (Warm Peach Treasury Room Motif) */}
      <div className="room-bathroom p-4 sm:p-5 flex flex-col justify-between group cursor-default transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-center justify-between gap-2 border-b-2 border-[#232b28]/25 pb-2.5 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white border-2 border-[#232b28] text-[#d97706] shadow-[2px_2px_0px_#232b28]">
              <Banknote className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase text-[#232b28] tracking-wider">
              {t.tab3Title}
            </span>
          </div>
          <span className="bg-white text-[#d97706] px-2.5 py-0.5 rounded-full border-2 border-[#232b28] text-[11px] font-black shadow-[1px_1px_0px_#232b28]">
            {t.tab3Badge}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-[#232b28] my-1 font-mono tracking-tight drop-shadow-sm">
          ₹{totalCapital.toLocaleString('en-IN')}
        </div>

        <div className="text-xs text-[#523e2d] font-semibold leading-relaxed">
          {t.tab3Desc}
        </div>

        <div className="mt-3 pt-2 border-t-2 border-dashed border-[#232b28]/25 text-xs font-black text-[#d97706] flex items-center justify-between">
          <span>{t.tab3Foot}</span>
          <span className="text-[10px] text-[#232b28] bg-white px-1.5 py-0.5 rounded border border-[#232b28] font-mono">ROOM 03</span>
        </div>
      </div>
    </div>
  );
};
