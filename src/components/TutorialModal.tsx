import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  HardHat, 
  ClipboardCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  Lightbulb, 
  ArrowRight,
  Stamp,
  Coins,
  MapPin,
  Clock,
  Radio
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TUTORIAL_DATA, TutorialRole, TutorialStep } from '../i18n/tutorialData';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: TutorialRole;
  onNavigateTab: (tab: 'all' | 'attendance' | 'register' | 'worker' | 'map') => void;
  onOpenSimulator?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'worker',
  onNavigateTab,
  onOpenSimulator,
}) => {
  const { language } = useLanguage();
  const [role, setRole] = useState<TutorialRole>(initialRole);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Sync role if initialRole changes
  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setCurrentStepIndex(0);
      setIsPlayingAudio(false);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  // Retrieve current language tutorial data, fallback to English
  const currentLangData = TUTORIAL_DATA[language] || TUTORIAL_DATA.en;
  const currentRoleData = currentLangData[role];
  const steps: TutorialStep[] = currentRoleData.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleActionClick = (step: TutorialStep) => {
    onClose();
    if (step.actionTab === 'simulator' && onOpenSimulator) {
      onOpenSimulator();
    } else if (step.actionTab && step.actionTab !== 'simulator') {
      onNavigateTab(step.actionTab);
    }
  };

  const toggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const textToSpeak = `${currentStep.title}. ${currentStep.description}. ${currentStep.tip}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Select matching language voice if available
        const langCodeMap: Record<string, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          kn: 'kn-IN',
          te: 'te-IN',
          ta: 'ta-IN',
          ml: 'ml-IN',
        };
        utterance.lang = langCodeMap[language] || 'en-US';
        utterance.rate = 0.95;

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  // Stop speech when modal closes
  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#232b28]/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#fffef9] border-[3px] border-[#232b28] rounded-[255px_18px_225px_22px/20px_225px_18px_255px] shadow-[8px_8px_0px_#232b28] overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-modal-title"
      >
        {/* Scalloped Teal Shingle Roof Trim (Image 2 Dollhouse Motif) */}
        <div className="h-3.5 roof-scallops border-b-2 border-[#232b28]" />

        {/* Modal Top Bar: Role Selector & Close */}
        <div className="p-4 sm:p-5 bg-[#faf5e8] border-b-2 border-[#232b28] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#e8638b] text-white border-2 border-[#232b28] rounded-lg shadow-[2px_2px_0px_#232b28]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 id="tutorial-modal-title" className="text-base sm:text-lg font-black text-[#232b28] tracking-tight">
                {language === 'hi' ? 'फील्ड गाइड व ट्यूटोरियल' : 
                 language === 'kn' ? 'ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಟ್ಯುಟೋರಿಯಲ್' : 
                 language === 'te' ? 'ఫీల్డ్ గైడ్ & ట్యుటోరియల్' : 
                 language === 'ta' ? 'வழிகாட்டி & டுடோரியல்' : 
                 language === 'ml' ? 'ഫീൽഡ് ഗൈഡും ട്യൂട്ടോറിയലും' : 
                 'Interactive Field Guide & Tutorial'}
              </h2>
              <p className="text-xs text-[#526431] font-bold">
                {language === 'hi' ? 'अपनी भूमिका चुनें: मजदूर या ठेकेदार/सुपरवाइज़र' :
                 language === 'kn' ? 'ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ: ಕಾರ್ಮಿಕ ಅಥವಾ ಮೇಲ್ವಿಚಾರಕ' :
                 language === 'te' ? 'మీ పాత్రను ఎంచుకోండి: కార్మికుడు లేదా పర్యవేక్షకుడు' :
                 language === 'ta' ? 'உங்கள் பங்கினைத் தேர்ந்தெடுக்கவும்: தொழிலாளி அல்லது மேற்பார்வையாளர்' :
                 language === 'ml' ? 'നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക: തൊഴിലാളി അല്ലെങ്കിൽ സൂപ്പർവൈസർ' :
                 'Select your role to view the custom walkthrough'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Read-Aloud Button */}
            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-lg border-2 border-[#232b28] text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#232b28] transition-all cursor-pointer ${
                isPlayingAudio ? 'bg-[#38a169] text-white animate-pulse' : 'bg-[#fefdfa] text-[#232b28] hover:bg-[#f2eada]'
              }`}
              title="Read aloud in your language"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#1e7587]" />}
              <span className="hidden sm:inline">
                {isPlayingAudio 
                  ? (language === 'hi' ? 'आवाज़ बंद करें' : 'Stop Audio') 
                  : (language === 'hi' ? 'सुनकर समझें 🔊' : 'Listen 🔊')}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#fde4d7] hover:bg-[#fcd0bd] border-2 border-[#232b28] flex items-center justify-center text-[#232b28] shadow-[2px_2px_0px_#232b28] cursor-pointer transition-transform active:scale-95"
              aria-label="Close tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dual Role Selector Tabs: Worker vs Admin */}
        <div className="px-4 sm:px-6 pt-4 bg-[#fffef9] border-b-2 border-dashed border-[#232b28]/30">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-md mx-auto">
            {/* Worker Tab */}
            <button
              onClick={() => {
                setRole('worker');
                setCurrentStepIndex(0);
              }}
              className={`p-2.5 sm:p-3 text-xs sm:text-sm font-black flex items-center justify-center gap-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[2.5px] border-[#232b28] transition-all cursor-pointer ${
                role === 'worker'
                  ? 'bg-[#38a169] text-white shadow-[4px_4px_0px_#232b28] translate-y-[-2px]'
                  : 'bg-[#faf5e8] text-[#232b28] hover:bg-[#f4ecda] shadow-[2px_2px_0px_#232b28]'
              }`}
            >
              <HardHat className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="leading-none">{currentLangData.worker.roleTitle}</div>
                <div className="text-[10px] opacity-90 font-medium hidden sm:block mt-0.5">
                  {currentLangData.worker.roleBadge}
                </div>
              </div>
            </button>

            {/* Admin Tab */}
            <button
              onClick={() => {
                setRole('admin');
                setCurrentStepIndex(0);
              }}
              className={`p-2.5 sm:p-3 text-xs sm:text-sm font-black flex items-center justify-center gap-2 rounded-[15px_255px_15px_225px/225px_15px_255px_15px] border-[2.5px] border-[#232b28] transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-[#1e7587] text-white shadow-[4px_4px_0px_#232b28] translate-y-[-2px]'
                  : 'bg-[#faf5e8] text-[#232b28] hover:bg-[#f4ecda] shadow-[2px_2px_0px_#232b28]'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="leading-none">{currentLangData.admin.roleTitle}</div>
                <div className="text-[10px] opacity-90 font-medium hidden sm:block mt-0.5">
                  {currentLangData.admin.roleBadge}
                </div>
              </div>
            </button>
          </div>

          {/* Role Summary Banner */}
          <div className="mt-3 py-2 px-3 bg-[#faf5e8] border-2 border-[#232b28] rounded-xl text-xs text-[#4d5e46] font-medium flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-bold text-[#232b28]">
              <span className={`w-2.5 h-2.5 rounded-full ${role === 'worker' ? 'bg-[#38a169]' : 'bg-[#1e7587]'}`} />
              {currentRoleData.audienceDesc}
            </span>
            <span className="font-mono text-[11px] font-black text-[#e8638b] shrink-0">
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>

          {/* Step Progress Tracker / Dots */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 my-3 overflow-x-auto pb-1">
            {steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex-1 py-1.5 px-2 text-center rounded-lg border-2 border-[#232b28] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStepIndex === idx
                    ? (role === 'worker' ? 'bg-[#38a169] text-white shadow-[2px_2px_0px_#232b28]' : 'bg-[#1e7587] text-white shadow-[2px_2px_0px_#232b28]')
                    : (currentStepIndex > idx ? 'bg-[#d8f1e9] text-[#232b28]' : 'bg-[#faf5e8] text-[#718096]')
                }`}
              >
                <span>{s.stepNumber}</span>
                <span className="hidden md:inline truncate">{s.title.split(' ')[0]}</span>
                {currentStepIndex > idx && <CheckCircle2 className="w-3 h-3 text-[#2f855a] shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step Body Card */}
        <div className="p-4 sm:p-6 bg-[#fffef9]">
          <div className={`p-4 sm:p-6 border-[2.5px] border-[#232b28] shadow-[4px_4px_0px_#232b28] rounded-[240px_18px_235px_20px/18px_240px_16px_235px] ${
            role === 'worker' ? 'bg-[#fefdfa]' : 'bg-[#f8fdfb]'
          }`}>
            {/* Step Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className={`text-xs font-black px-3 py-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#232b28] text-white shadow-[2px_2px_0px_#232b28] ${
                role === 'worker' ? 'bg-[#38a169]' : 'bg-[#1e7587]'
              }`}>
                {currentStep.badge}
              </span>
              <span className="text-xs font-bold text-[#62773d]">
                {role === 'worker' ? '✓ No Paperwork Required' : '✓ Tamper-Proof Audit Ready'}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-[#232b28] tracking-tight">
              {currentStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#4a554f] font-semibold mt-1">
              {currentStep.subtitle}
            </p>

            {/* Step Visual Illustration Card */}
            <div className="my-4 p-4 rounded-xl border-2 border-[#232b28] bg-[#fbf7ed] flex flex-col sm:flex-row items-center gap-4">
              {/* Visual Icon Illustration */}
              <div className="w-20 h-20 rounded-2xl border-2 border-[#232b28] bg-white flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#232b28]">
                {role === 'worker' && currentStepIndex === 0 && (
                  <div className="flex flex-col items-center text-[#38a169]">
                    <Clock className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">PUNCH</span>
                  </div>
                )}
                {role === 'worker' && currentStepIndex === 1 && (
                  <div className="flex flex-col items-center text-[#d97706]">
                    <Coins className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">₹600 LOCK</span>
                  </div>
                )}
                {role === 'worker' && currentStepIndex === 2 && (
                  <div className="flex flex-col items-center text-[#e8638b]">
                    <Stamp className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">SHP-TOKEN</span>
                  </div>
                )}
                {role === 'worker' && currentStepIndex === 3 && (
                  <div className="flex flex-col items-center text-[#1e7587]">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">PASSBOOK</span>
                  </div>
                )}

                {role === 'admin' && currentStepIndex === 0 && (
                  <div className="flex flex-col items-center text-[#1e7587]">
                    <Radio className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">TELEGRAPH</span>
                  </div>
                )}
                {role === 'admin' && currentStepIndex === 1 && (
                  <div className="flex flex-col items-center text-[#38a169]">
                    <ShieldCheck className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">LIABILITY</span>
                  </div>
                )}
                {role === 'admin' && currentStepIndex === 2 && (
                  <div className="flex flex-col items-center text-[#e8638b]">
                    <Stamp className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">VERIFY</span>
                  </div>
                )}
                {role === 'admin' && currentStepIndex === 3 && (
                  <div className="flex flex-col items-center text-[#7c9438]">
                    <MapPin className="w-8 h-8" />
                    <span className="text-[10px] font-black mt-1">GEO-MAP</span>
                  </div>
                )}
              </div>

              {/* Step Main Explanation */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-[#232b28] leading-relaxed font-medium">
                  {currentStep.description}
                </p>

                {/* Key Bullet Points */}
                <ul className="mt-2.5 space-y-1.5">
                  {currentStep.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-[#2d4726]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38a169] shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Practical Field Tip Box */}
            <div className="p-3 bg-[#fff9e6] border-2 border-dashed border-[#d97706] rounded-xl flex items-start gap-2.5 text-xs text-[#78350f] font-semibold">
              <Lightbulb className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
              <span>{currentStep.tip}</span>
            </div>

            {/* Interactive "Try Feature Now" Button */}
            {currentStep.actionLabel && (
              <div className="mt-4 pt-3 border-t-2 border-[#232b28]/15 flex items-center justify-between">
                <span className="text-xs text-[#526431] font-bold hidden sm:inline">
                  Interactive Practice:
                </span>
                <button
                  onClick={() => handleActionClick(currentStep)}
                  className="comic-btn-cream text-xs sm:text-sm font-black px-4 py-2 flex items-center gap-2 cursor-pointer active:scale-95 ml-auto"
                >
                  <span>{currentStep.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1e7587]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Navigation */}
        <div className="p-4 sm:p-5 bg-[#faf5e8] border-t-2 border-[#232b28] flex items-center justify-between gap-3">
          {/* Previous Step Button */}
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5 rounded-xl border-2 border-[#232b28] shadow-[2px_2px_0px_#232b28] transition-all cursor-pointer ${
              currentStepIndex === 0 
                ? 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500 shadow-none' 
                : 'comic-btn-cream'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>
              {language === 'hi' ? 'पिछला' : 
               language === 'kn' ? 'ಹಿಂದಿನದು' : 
               language === 'te' ? 'మునుపటి' : 
               language === 'ta' ? 'முந்தைய' : 
               language === 'ml' ? 'മുമ്പത്തേത്' : 
               'Previous'}
            </span>
          </button>

          {/* Middle Step Counter */}
          <span className="text-xs font-black text-[#526431]">
            {language === 'hi' ? `चरण ${currentStepIndex + 1} / ${steps.length}` :
             language === 'kn' ? `ಹಂತ ${currentStepIndex + 1} / ${steps.length}` :
             language === 'te' ? `దశ ${currentStepIndex + 1} / ${steps.length}` :
             language === 'ta' ? `படி ${currentStepIndex + 1} / ${steps.length}` :
             language === 'ml' ? `ഘട്ടം ${currentStepIndex + 1} / ${steps.length}` :
             `Step ${currentStepIndex + 1} of ${steps.length}`}
          </span>

          {/* Next / Finish Button */}
          <button
            onClick={handleNext}
            className={`px-5 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5 rounded-xl border-2 border-[#232b28] shadow-[3px_3px_0px_#232b28] transition-all cursor-pointer active:scale-95 ${
              role === 'worker' ? 'comic-btn-emerald' : 'comic-btn-teal'
            }`}
          >
            <span>
              {currentStepIndex < steps.length - 1 
                ? (language === 'hi' ? 'अगला चरण →' : 
                   language === 'kn' ? 'ಮುಂದಿನ ಹಂತ →' : 
                   language === 'te' ? 'తదుపరి దశ →' : 
                   language === 'ta' ? 'அடுத்த படி →' : 
                   language === 'ml' ? 'അടുത്ത ഘട്ടം →' : 
                   'Next Step →')
                : (language === 'hi' ? 'समझ गए! काम शुरू करें ✓' : 
                   language === 'kn' ? 'ಅರ್ಥವಾಯಿತು! ಕೆಲಸ ಪ್ರಾರಂಭಿಸಿ ✓' : 
                   language === 'te' ? 'అర్థమైంది! పని ప్రారంభించండి ✓' : 
                   language === 'ta' ? 'புரிந்தது! வேலையைத் தொடங்குங்கள் ✓' : 
                   language === 'ml' ? 'മനസ്സിലായി! ജോലി ആരംഭിക്കുക ✓' : 
                   'Got it! Start Working ✓')}
            </span>
            {currentStepIndex < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
