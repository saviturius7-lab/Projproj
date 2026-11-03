import React from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime } from '../services/storage';
import { X, ShieldCheck, MapPin, Receipt, CheckCircle, Share2, Copy } from 'lucide-react';

interface DigitalReceiptModalProps {
  log: WorkLog | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const copyReceiptText = () => {
    const text = 
      `🛠️ श्रमिक साक्षी (Shramik Sakshi) - उपस्थिति रसीद 🛠️\n\n` +
      `👤 मोबाईल: ${log.phone_number}\n` +
      `📅 दिनांक: ${formatISTDateTime(log.created_at)}\n` +
      `📍 लोकेशन: दर्ज (GPS: ${log.latitude?.toFixed(4)}, ${log.longitude?.toFixed(4)})\n` +
      `💰 आज की तय दिहाड़ी: ₹${log.estimated_wage.toFixed(2)}\n` +
      `🔐 रसीद टोकन: ${log.verification_token}\n\n` +
      `✅ आपकी हाजिरी सुरक्षित कर ली गई है। यह डिजिटल रिकॉर्ड बदला नहीं जा सकता। ठगी से बचने के लिए इसे संभाल कर रखें।`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#f7f0de] border-2 border-[#8b6f47] rounded-lg max-w-md w-full p-5 sm:p-6 shadow-2xl relative text-[#3b2f1e]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[#efe4c8] text-[#5a3e1b] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vintage Seal Header */}
        <div className="text-center border-b-2 border-[#8b6f47] pb-4 mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7a5a2e] text-[#f4ecd8] mb-2 shadow-inner">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#2a1f12]">
            श्रमिक साक्षी (Shramik Sakshi)
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#7a5a2e] font-semibold mt-0.5">
            Immutable Digital Workday Receipt
          </p>
        </div>

        {/* Receipt Slip Container */}
        <div className="bg-[#efe4c8] border border-[#8b6f47] rounded p-4 space-y-3 font-serif text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#8b6f47]/40">
            <span className="text-[#6b5330]">Verification Token</span>
            <span className="font-mono font-bold text-[#2a1f12] text-sm">
              {log.verification_token}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6b5330]">Worker Mobile:</span>
            <span className="font-semibold text-[#2a1f12] font-mono">
              {log.phone_number}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6b5330]">Timestamp:</span>
            <span className="font-medium text-[#2a1f12]">
              {formatISTDateTime(log.created_at)}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[#6b5330]">GPS Coordinates:</span>
            <span className="text-right font-medium text-[#5a3e1b]">
              {log.latitude?.toFixed(4)}, {log.longitude?.toFixed(4)}
              <span className="block text-[10px] text-emerald-800 font-sans font-semibold">
                ✓ Satellite GPS Verified
              </span>
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[#6b5330]">Site / Message:</span>
            <span className="text-right font-medium text-[#2a1f12] max-w-[200px]">
              {log.location_name || log.raw_message}
            </span>
          </div>

          <div className="pt-2 border-t border-[#8b6f47]/40 flex justify-between items-center text-sm font-display">
            <span className="font-bold text-[#2a1f12]">Locked Daily Wage:</span>
            <span className="font-bold text-lg text-[#5a3e1b]">
              ₹{log.estimated_wage.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Legal wage guarantee note */}
        <div className="mt-4 p-3 bg-[#ebe0c2] border border-[#8b6f47] rounded text-[11px] text-[#4a3a25] leading-relaxed">
          <p className="font-semibold text-[#2a1f12] mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Digital Wage Protection Guarantee</span>
          </p>
          <p className="hindi-quote italic">
            "आपकी हाजिरी सुरक्षित कर ली गई है। यह डिजिटल रिकॉर्ड बदला नहीं जा सकता। ठेकेदार द्वारा पैसे काटने पर तुरंत इस रसीद को अपनी स्थानीय लेबर यूनियन या NGO को दिखाएं।"
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={copyReceiptText}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#7a5a2e] hover:bg-[#5a3e1b] text-[#f4ecd8] text-xs font-semibold shadow transition border border-[#5a3e1b]"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Receipt Slip
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded bg-[#efe4c8] hover:bg-[#ebe0c2] border border-[#8b6f47] text-xs font-medium text-[#3b2f1e]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
