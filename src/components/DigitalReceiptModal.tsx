import React from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime } from '../services/storage';
import { X, Copy, Printer, CheckCircle2, ShieldCheck, Stamp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DigitalReceiptModalProps {
  log: WorkLog | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ log, onClose }) => {
  const { t } = useLanguage();

  if (!log) return null;

  const copyReceiptText = () => {
    const text = 
      `====================================================\n` +
      `${t.receiptModalHeader}\n` +
      `${t.dailyWageProofTitle}\n` +
      `====================================================\n` +
      `${t.receiptDocketToken}: ${log.verification_token}\n` +
      `${t.receiptWorkerPhone}: ${log.phone_number}\n` +
      `${t.receiptDateTime}: ${formatISTDateTime(log.created_at)}\n` +
      `${t.receiptGpsCoords}: ${log.latitude?.toFixed(4)}, ${log.longitude?.toFixed(4)}\n` +
      `${t.receiptFieldSite}: ${log.location_name || log.raw_message}\n` +
      `${t.receiptStatutoryWage}: ₹${log.estimated_wage.toFixed(2)}\n` +
      `STATUS: ${log.status === 'disputed' ? 'DISPUTED CLAIM FILED' : 'VERIFIED / GUARANTEED'}\n` +
      `====================================================\n` +
      `${t.legalProtectionNoticeTitle}:\n` +
      `${t.legalProtectionNoticeBody}\n` +
      `====================================================`;
    navigator.clipboard.writeText(text);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto font-sans transition-all duration-300">
      <div className="carbon-receipt border-4 border-[#125841] rounded-2xl max-w-lg w-full p-5 sm:p-7 relative text-[#071922] my-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#d8ece4] text-[#071922] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Block */}
        <div className="text-center pb-3 mb-4 border-b-2 border-[#125841]/30">
          <div className="inline-flex items-center gap-1.5 bg-[#0f4d39] text-[#f7fbf9] px-3.5 py-1 rounded text-xs font-black uppercase mb-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7ff0cb]" />
            <span>{t.receiptModalHeader}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#071922] mt-1 tracking-tight">
            {t.dailyWageProofTitle}
          </h3>
          <p className="text-xs text-[#205244] mt-0.5 font-semibold">
            {t.satelliteSystemNote}
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white/90 border-2 border-[#125841]/40 p-4 rounded-xl space-y-2.5 text-sm my-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#125841]/15 pb-2">
            <span className="text-[#326154] font-bold text-xs uppercase">{t.receiptDocketToken}:</span>
            <span className="font-mono font-black text-[#0e513c] text-sm sm:text-base">
              {log.verification_token}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#125841]/15 pb-2">
            <span className="text-[#326154] font-bold text-xs uppercase">{t.receiptWorkerPhone}:</span>
            <span className="font-bold text-[#071922] font-mono">
              {log.phone_number}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#125841]/15 pb-2">
            <span className="text-[#326154] font-bold text-xs uppercase">{t.receiptDateTime}:</span>
            <span className="font-bold text-[#071922] font-mono">
              {formatISTDateTime(log.created_at)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 border-b border-[#125841]/15 pb-2">
            <span className="text-[#326154] font-bold text-xs uppercase">{t.receiptGpsCoords}:</span>
            <span className="text-left sm:text-right font-bold text-[#145374] font-mono">
              {log.latitude?.toFixed(4)}, {log.longitude?.toFixed(4)}
              <span className="block text-xs text-[#0f6047] font-black">
                ✓ {t.receiptSatelliteVerified}
              </span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 border-b border-[#125841]/15 pb-2">
            <span className="text-[#326154] font-bold text-xs uppercase">{t.receiptFieldSite}:</span>
            <span className="text-left sm:text-right font-bold text-[#071922] max-w-xs">
              {log.location_name || log.raw_message}
            </span>
          </div>

          {/* Statutory Wage Guarantee Callout */}
          <div className="bg-[#e7f5ef] border-2 border-[#125841] p-3 rounded-lg flex items-center justify-between mt-2">
            <div>
              <span className="text-xs font-black text-[#0f4d39] uppercase tracking-wide block">
                {t.receiptStatutoryWage}
              </span>
              <span className="text-xs text-[#205244] font-medium">Guaranteed Legal Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0e513c] font-mono">
              ₹{log.estimated_wage.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Legal Protection Plain Notice */}
        <div className="bg-[#eff8f4] border border-[#125841]/40 p-3 rounded-lg text-xs leading-relaxed text-[#071922] my-3">
          <div className="font-black text-[#0f4d39] uppercase mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0f4d39]" />
            <span>{t.legalProtectionNoticeTitle}</span>
          </div>
          <p className="font-medium">
            {t.legalProtectionNoticeBody}
          </p>
        </div>

        {/* Action Buttons with 3D tactile feel */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t-2 border-[#125841]/30">
          <button
            onClick={copyReceiptText}
            className="px-4 py-2 rounded-lg bg-[#d8ece4] hover:bg-[#c6e4d9] text-[#071922] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Copy className="w-4 h-4 text-[#125841]" />
            <span>{t.copyTranscriptBtn}</span>
          </button>

          <button
            onClick={printReceipt}
            className="px-4 py-2 rounded-lg bg-[#0f4d39] hover:bg-[#0b3c2c] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-md"
          >
            <Printer className="w-4 h-4 text-[#7ff0cb]" />
            <span>{t.printBtn}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#145374] hover:bg-[#0e3c54] text-white text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <span>{t.dismissBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
