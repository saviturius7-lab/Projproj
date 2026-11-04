import React from 'react';
import { RefreshCw, Radio, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../types';

interface HeaderProps {
  onOpenSimulator: () => void;
  onRefresh: () => void;
}

const LANGUAGES: Array<{ code: SupportedLanguage; label: string; native: string }> = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenSimulator, onRefresh }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="mb-6 retro-card rounded-xl p-4 sm:p-5 relative overflow-hidden">
      {/* Subtle retro chassis top glow accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#0284c7] opacity-80" />

      {/* Top Bar with Language Selector & Station Callout */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18455a] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="retro-stamp-emerald text-[11px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
            <span>{t.gazetteDocNo}</span>
          </span>
          <span className="text-xs text-[#89b8aa] font-medium hidden sm:inline tracking-wide">
            {t.commandDeskSubtitle}
          </span>
        </div>

        {/* Clear Language Selector with Vintage Inset Display */}
        <div className="flex items-center gap-2 bg-[#061722] px-3 py-1.5 rounded-lg border-t border-l border-t-[#02070c] border-l-[#02070c] border-b border-r border-b-[#1f5971] border-r-[#1f5971] shadow-inner">
          <Globe className="w-4 h-4 text-[#22d3ee] shrink-0 animate-pulse" />
          <span className="text-xs font-bold text-[#89b8aa]">
            {t.languageSelectLabel}:
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="bg-[#0b2432] text-[#f0faf7] text-xs sm:text-sm font-extrabold border border-[#22576f] rounded px-2.5 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22d3ee] transition-all duration-200"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#0b2432] text-[#edf8f5]">
                {lang.native} ({lang.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Title Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#edf8f5] tracking-tight drop-shadow-sm">
              {t.appTitle}
            </h1>
            <span className="retro-stamp-cyan text-xs font-extrabold px-3 py-1 rounded">
              {t.immutableLedgerBadge}
            </span>
          </div>
          <p className="text-sm text-[#9bc5ba] mt-1.5 leading-relaxed max-w-3xl font-medium">
            {t.appDescription}
          </p>
        </div>

        {/* Action Controls with Tactile 3D Buttons & Smooth Transitions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={onRefresh}
            className="retro-btn-muted inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg cursor-pointer active:scale-95"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4 text-[#22d3ee] shrink-0" />
            <span>{t.syncRegisterBtn}</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="retro-btn-petrol inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer active:scale-95"
          >
            <Radio className="w-4 h-4 text-[#34d399] shrink-0 animate-pulse" />
            <span>{t.telexConsoleBtn}</span>
          </button>
        </div>
      </div>

      {/* Status Ticker with Phosphor Beacon */}
      <div className="mt-4 pt-3 border-t border-[#18455a] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8cbab0]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
          </span>
          <span className="font-bold text-[#34d399] tracking-wide">{t.wireStatus}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-semibold">
          <span className="bg-[#071822] px-2.5 py-0.5 rounded border border-[#1b4b60] text-[#22d3ee] font-mono text-[11px] font-bold">
            {t.joinCodeLabel}
          </span>
          <span className="text-[#34d399] font-bold">✓ {t.evidenceLabel}</span>
        </div>
      </div>
    </header>
  );
};
