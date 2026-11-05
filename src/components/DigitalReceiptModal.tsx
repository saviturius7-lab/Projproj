import React from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime } from '../services/storage';
import { X, Copy, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#232b28]/60 backdrop-blur-xs overflow-y-auto font-sans transition-all duration-300">
      <div className="carbon-receipt max-w-lg w-full p-5 sm:p-7 relative text-[#232b28] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#fedbe6] text-[#232b28] border-2 border-[#232b28] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Block with Scalloped Motif */}
        <div className="text-center pb-3 mb-4 border-b-2 border-[#232b28]/25">
          <div className="inline-flex items-center gap-1.5 bg-[#e8638b] text-white border-2 border-[#232b28] px-3.5 py-1 rounded-full text-xs font-black uppercase mb-1.5 shadow-[2px_2px_0px_#232b28]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.receiptModalHeader}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#232b28] mt-1 tracking-tight">
            {t.dailyWageProofTitle}
          </h3>
          <p className="text-xs text-[#55694a] mt-0.5 font-bold">
            {t.satelliteSystemNote}
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white border-2 border-[#232b28] p-4 rounded-xl space-y-2.5 text-sm my-3 shadow-[2px_2px_0px_#232b28]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#232b28]/15 pb-2">
            <span className="text-[#55694a] font-bold text-xs uppercase">{t.receiptDocketToken}:</span>
            <span className="font-mono font-black text-[#1e7587] text-sm sm:text-base">
              {log.verification_token}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#232b28]/15 pb-2">
            <span className="text-[#55694a] font-bold text-xs uppercase">{t.receiptWorkerPhone}:</span>
            <span className="font-black text-[#232b28] font-mono">
              {log.phone_number}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#232b28]/15 pb-2">
            <span className="text-[#55694a] font-bold text-xs uppercase">{t.receiptDateTime}:</span>
            <span className="font-bold text-[#232b28] font-mono">
              {formatISTDateTime(log.created_at)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 border-b border-[#232b28]/15 pb-2">
            <span className="text-[#55694a] font-bold text-xs uppercase">{t.receiptGpsCoords}:</span>
            <span className="text-left sm:text-right font-black text-[#1e7587] font-mono">
              {log.latitude?.toFixed(4)}, {log.longitude?.toFixed(4)}
              <span className="block text-xs text-[#2f855a] font-black">
                ✓ {t.receiptSatelliteVerified}
              </span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 border-b border-[#232b28]/15 pb-2">
            <span className="text-[#55694a] font-bold text-xs uppercase">{t.receiptFieldSite}:</span>
            <span className="text-left sm:text-right font-bold text-[#232b28] max-w-xs">
              {log.location_name || log.raw_message}
            </span>
          </div>

          {/* Statutory Wage Guarantee Callout */}
          <div className="bg-[#d8f1e9] border-2 border-[#232b28] p-3 rounded-xl flex items-center justify-between mt-2 shadow-[2px_2px_0px_#232b28]">
            <div>
              <span className="text-xs font-black text-[#2f855a] uppercase tracking-wide block">
                {t.receiptStatutoryWage}
              </span>
              <span className="text-xs text-[#2c473c] font-bold">Guaranteed Legal Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#232b28] font-mono">
              ₹{log.estimated_wage.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Legal Protection Notice */}
        <div className="bg-[#fef5dc] border-2 border-[#232b28] p-3 rounded-xl text-xs leading-relaxed text-[#232b28] my-3 shadow-[2px_2px_0px_#232b28]">
          <div className="font-black text-[#232b28] uppercase mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2f855a]" />
            <span>{t.legalProtectionNoticeTitle}</span>
          </div>
          <p className="font-semibold text-[#4d5e46]">
            {t.legalProtectionNoticeBody}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t-2 border-[#232b28]/20">
          <button
            onClick={copyReceiptText}
            className="comic-btn-cream px-4 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Copy className="w-4 h-4 text-[#1e7587]" />
            <span>{t.copyTranscriptBtn}</span>
          </button>

          <button
            onClick={printReceipt}
            className="comic-btn-emerald px-4 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>{t.printBtn}</span>
          </button>

          <button
            onClick={onClose}
            className="comic-btn-pink px-4 py-2 text-xs font-black cursor-pointer active:scale-95"
          >
            <span>{t.dismissBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
