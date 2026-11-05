import React from 'react';
import { RefreshCw, Radio, Globe, ShieldCheck } from 'lucide-react';
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
    <header className="mb-6 comic-card rounded-2xl p-4 sm:p-6 overflow-hidden relative">
      {/* Scalloped Teal Roof Shingles Trim across the top (from Image 2 dollhouse roof) */}
      <div className="absolute top-0 left-0 right-0 h-3 roof-scallops border-b-2 border-[#232b28]" />

      {/* Chimney & Smiling Sleeping Cloud Accent (from Image 1) */}
      <div className="flex items-center justify-between pt-1 mb-3">
        <div className="flex items-center gap-2">
          {/* Cute Dormer Cottage Badge */}
          <span className="bg-[#e8638b] text-white border-2 border-[#232b28] text-xs font-black px-3 py-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[2px_2px_0px_#232b28] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.gazetteDocNo}</span>
          </span>
          <span className="text-xs text-[#526431] font-bold hidden sm:inline tracking-wide">
            {t.commandDeskSubtitle}
          </span>
        </div>

        {/* Hand-Drawn Smiling Sleeping Cloud Badge from Image 1 */}
        <div className="flex items-center gap-3">
          <div className="cloud-bubble px-3 py-1 hidden md:flex items-center gap-2 text-xs font-black text-[#232b28] bg-white">
            <span className="text-[#e8638b] text-sm">☁️</span>
            <span className="font-mono text-[11px] text-[#4a554f]">~ u ~ peaceful ledger</span>
          </div>

          {/* Language Selector styled like a cottage window */}
          <div className="flex items-center gap-1.5 bg-[#fef5dc] px-3 py-1 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] border-2 border-[#232b28] shadow-[2px_2px_0px_#232b28]">
            <Globe className="w-4 h-4 text-[#1e7587] shrink-0" />
            <span className="text-xs font-black text-[#232b28]">
              {t.languageSelectLabel}:
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-white text-[#232b28] text-xs sm:text-sm font-black border border-[#232b28] rounded px-2 py-0.5 cursor-pointer focus:outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Title Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-1">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#232b28] tracking-tight">
              {t.appTitle}
            </h1>
            <span className="bg-[#1e7587] text-white border-2 border-[#232b28] text-xs font-black px-3 py-0.5 rounded-[225px_15px_255px_15px/15px_255px_15px_225px] shadow-[2px_2px_0px_#232b28]">
              {t.immutableLedgerBadge}
            </span>
          </div>
          <p className="text-sm text-[#4d5e46] mt-1.5 leading-relaxed max-w-3xl font-medium">
            {t.appDescription}
          </p>
        </div>

        {/* Action Controls with Tactile Storybook Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={onRefresh}
            className="comic-btn-cream inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-black cursor-pointer active:scale-95"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4 text-[#1e7587] shrink-0" />
            <span>{t.syncRegisterBtn}</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="comic-btn-pink inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-black cursor-pointer active:scale-95"
          >
            <Radio className="w-4 h-4 text-white shrink-0 animate-pulse" />
            <span>{t.telexConsoleBtn}</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-2.5 border-t-2 border-dashed border-[#232b28]/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4d5e46]">
        <div className="flex items-center gap-2 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38a169] border border-[#232b28] animate-ping shrink-0" />
          <span className="font-extrabold text-[#232b28]">{t.wireStatus}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-extrabold">
          <span className="bg-[#fde4d7] px-2.5 py-0.5 rounded border border-[#232b28] text-[#232b28]">
            {t.joinCodeLabel}
          </span>
          <span className="text-[#2f855a]">✓ {t.evidenceLabel}</span>
        </div>
      </div>
    </header>
  );
};
