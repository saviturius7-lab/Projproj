import React from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime } from '../services/storage';
import { X, Copy, Printer } from 'lucide-react';

interface DigitalReceiptModalProps {
  log: WorkLog | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const copyReceiptText = () => {
    const text = 
      `====================================================\n` +
      `GOVERNMENT OF INDIA • UNORGANIZED WORKERS REGISTER\n` +
      `FORM IV: IMMUTABLE PHYSICAL RECEIPT & SATELLITE PROOF\n` +
      `====================================================\n` +
      `RECEIPT TOKEN: ${log.verification_token}\n` +
      `WORKER MOBILE: ${log.phone_number}\n` +
      `RECORDED DATE: ${formatISTDateTime(log.created_at)}\n` +
      `GPS COORDINATES: ${log.latitude?.toFixed(4)}, ${log.longitude?.toFixed(4)}\n` +
      `WORK SITE TAG: ${log.location_name || log.raw_message}\n` +
      `DAILY STATUTORY WAGE: ₹${log.estimated_wage.toFixed(2)}\n` +
      `DISPUTE STATUS: ${log.status === 'disputed' ? 'DISPUTED CLAIM FILED' : 'GUARANTEED / NON-NEGOTIABLE'}\n` +
      `====================================================\n` +
      `LEGAL NOTE: This record is protected under the Anti-Wage\n` +
      `Theft Enforcement Protocol. Presentable before Labour Union\n` +
      `Arbitration Tribunals and Magistrates.\n` +
      `====================================================`;
    navigator.clipboard.writeText(text);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="carbon-copy-pink border-4 border-[#8b6f47] rounded-sm max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-[#221910] font-typewriter my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded hover:bg-[#ecc2ba] text-[#6f4e24] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Perforated edge tear indicator */}
        <div className="border-b-2 border-dashed border-[#8b6f47] pb-2 mb-3 text-center">
          <div className="text-[10px] uppercase tracking-widest text-[#9e2a2b] font-bold">
            - - - - - [ OFFICIAL TRIPLICATE DUPLICATE • CARBON RECEIPT ] - - - - -
          </div>
        </div>

        {/* Header Block */}
        <div className="text-center pb-3 mb-3 border-b-2 border-[#8b6f47]">
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f4e24] leading-tight">
            GOVERNMENT OF INDIA • UNORGANIZED LABOUR PROTECTION
          </div>
          <h3 className="text-base sm:text-xl font-black uppercase tracking-wide text-[#221910] mt-1 leading-tight">
            श्रमिक साक्षी • DAILY WAGE PROOF VOUCHER
          </h3>
          <div className="text-[10px] text-[#9e2a2b] font-bold mt-1">
            REGISTERED UNDER FIELD SATELLITE GPS VERIFICATION SYSTEM
          </div>
        </div>

        {/* Rubber stamps */}
        <div className="flex flex-wrap items-center justify-between gap-2 my-2.5">
          <span className="rubber-stamp rubber-stamp-red text-[10px]">
            [ मुहर: सत्यमेव जयते ]
          </span>
          <span className="rubber-stamp rubber-stamp-blue text-[10px]">
            [ IMMUTABLE WAGE PROOF ]
          </span>
        </div>

        {/* Typewritten Details Slip with clean non-overlapping rows */}
        <div className="bg-[#fff7f5] border-2 border-[#aa8c58] p-3 sm:p-4 rounded space-y-2.5 text-xs leading-normal my-3 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#aa8c58]/40 pb-1.5">
            <span className="text-[#684f33] font-bold shrink-0">DOCKET TOKEN:</span>
            <span className="font-mono font-black text-[#9e2a2b] text-sm break-all">
              {log.verification_token}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#aa8c58]/30 pb-1.5">
            <span className="text-[#684f33] font-bold shrink-0">WORKER PHONE:</span>
            <span className="font-bold text-[#221910] font-mono">
              {log.phone_number}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[#aa8c58]/30 pb-1.5">
            <span className="text-[#684f33] font-bold shrink-0">DATE &amp; TIME (IST):</span>
            <span className="font-bold text-[#221910]">
              {formatISTDateTime(log.created_at)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 border-b border-[#aa8c58]/30 pb-1.5">
            <span className="text-[#684f33] font-bold shrink-0">GPS COORDINATES:</span>
            <span className="text-left sm:text-right font-bold text-[#1d3557]">
              {log.latitude?.toFixed(4)}, {log.longitude?.toFixed(4)}
              <span className="block text-[9px] text-[#2d6a4f] uppercase font-bold">
                ✓ SATELLITE VERIFIED
              </span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 border-b border-[#aa8c58]/30 pb-1.5">
            <span className="text-[#684f33] font-bold shrink-0">FIELD SITE / MESSAGE:</span>
            <span className="text-left sm:text-right font-bold text-[#221910] max-w-xs break-words">
              {log.location_name || log.raw_message}
            </span>
          </div>

          <div className="pt-1 flex items-center justify-between text-sm">
            <span className="font-black text-[#221910] uppercase">STATUTORY WAGE:</span>
            <span className="font-black text-lg text-[#9e2a2b]">
              ₹{log.estimated_wage.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Legal anti-theft notice */}
        <div className="p-2.5 bg-[#fbf6ea] border border-[#8b6f47] text-[10px] text-[#382819] leading-snug">
          <p className="font-bold text-[#9e2a2b] uppercase mb-1">
            कानूनी सुरक्षा गारंटी (LEGAL PROTECTION NOTICE):
          </p>
          <p className="italic">
            "यह डिजिटल व मुद्रित रसीद उपस्थिति का गैर-परिवर्तनीय साक्ष्य है। ठेकेदार या मालिक द्वारा वेतन काटने पर इसे तुरंत स्थानीय लेबर कोर्ट या यूनियन कार्यालय में प्रस्तुत करें।"
          </p>
        </div>

        {/* Signatures & Seal Box */}
        <div className="mt-4 pt-3 border-t border-[#8b6f47] grid grid-cols-2 gap-4 text-[10px] text-center">
          <div>
            <div className="border-b border-[#221910] h-6"></div>
            <span className="text-[#684f33] uppercase mt-1 block">Officer / Witness Signature</span>
          </div>
          <div>
            <div className="border-b border-[#221910] h-6 flex items-center justify-center font-bold text-[#9e2a2b]">
              [ SEAL AFFIXED ]
            </div>
            <span className="text-[#684f33] uppercase mt-1 block">Labour Union Registry Stamp</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-2 flex flex-wrap gap-2">
          <button
            onClick={copyReceiptText}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#6f4e24] hover:bg-[#4e3314] text-[#fbf6ea] text-xs font-typewriter font-bold shadow transition border-2 border-[#382819]"
          >
            <Copy className="w-3.5 h-3.5 shrink-0" />
            COPY TRANSCRIPT
          </button>
          <button
            onClick={printReceipt}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#ebdcb9] hover:bg-[#dfcaa0] border-2 border-[#aa8c58] text-xs font-typewriter font-bold text-[#221910]"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            PRINT
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded bg-[#fbf6ea] hover:bg-[#fae4df] border-2 border-[#8b6f47] text-xs font-typewriter font-bold text-[#221910]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
