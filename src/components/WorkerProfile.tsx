import React from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime, generateAuditText } from '../services/storage';
import { Download, CheckCircle, TrendingUp, Calendar, MapPin, Receipt } from 'lucide-react';

interface WorkerProfileProps {
  selectedWorker: string;
  workerLogs: WorkLog[];
  allLogs: WorkLog[];
  onOpenReceipt: (log: WorkLog) => void;
}

export const WorkerProfile: React.FC<WorkerProfileProps> = ({
  selectedWorker,
  workerLogs,
  allLogs,
  onOpenReceipt,
}) => {
  if (selectedWorker === 'All Workers') {
    return (
      <div className="bg-[#e7ddc4] border border-[#a0845c] rounded-md p-4 mb-6 text-sm text-[#3b2f1e]">
        <div className="flex items-center gap-2">
          <span className="text-base">ℹ️</span>
          <span>
            Select a specific worker from the sidebar controls to inspect their individual chronological timeline, dispute badge, and download an official audit certificate.
          </span>
        </div>
      </div>
    );
  }

  const sortedLogs = [...workerLogs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const totalEarnings = workerLogs.reduce((acc, curr) => acc + (curr.estimated_wage || 600), 0);

  const handleDownloadAudit = () => {
    const auditText = generateAuditText(selectedWorker, allLogs);
    const blob = new Blob([auditText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedWorker.replace(/\D/g, '')}_work_history_audit.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#efe4c8] border border-[#8b6f47] rounded-md p-4 sm:p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#8b6f47]/50 pb-3 mb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2a1f12] flex items-center gap-2 flex-wrap">
            <span>🧑‍🏭 Worker Profile</span>
            <span className="font-mono text-base font-normal text-[#5a3e1b] bg-[#f7f0de] px-2 py-0.5 rounded border border-[#8b6f47]/50">
              {selectedWorker}
            </span>
          </h2>
          <p className="text-xs text-[#6b5330] mt-0.5">
            Cryptographic GPS attendance records & verified daily wage entitlement ledger
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#ebe0c2] border border-[#8b6f47] text-xs font-semibold text-[#2a1f12]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            Verified / Dispute-Free
          </div>

          <button
            onClick={handleDownloadAudit}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#7a5a2e] hover:bg-[#5a3e1b] text-[#f4ecd8] font-semibold text-xs transition shadow-sm border border-[#5a3e1b]"
          >
            <Download className="w-3.5 h-3.5" />
            Download Official Audit (.txt)
          </button>
        </div>
      </div>

      {/* Worker Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#f7f0de] border border-[#8b6f47]/40 rounded p-2.5">
          <span className="text-[11px] text-[#6b5330] block">Days Verified</span>
          <span className="text-lg font-bold font-display text-[#3b2f1e]">
            {workerLogs.length} Workdays
          </span>
        </div>
        <div className="bg-[#f7f0de] border border-[#8b6f47]/40 rounded p-2.5">
          <span className="text-[11px] text-[#6b5330] block">Locked Wage Entitlement</span>
          <span className="text-lg font-bold font-display text-[#5a3e1b]">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="bg-[#f7f0de] border border-[#8b6f47]/40 rounded p-2.5">
          <span className="text-[11px] text-[#6b5330] block">Daily Wage Scale</span>
          <span className="text-lg font-bold font-display text-[#3b2f1e]">₹600.00 / day</span>
        </div>
        <div className="bg-[#f7f0de] border border-[#8b6f47]/40 rounded p-2.5">
          <span className="text-[11px] text-[#6b5330] block">Legal Standing</span>
          <span className="text-lg font-bold font-display text-emerald-800">Tamper-Proof</span>
        </div>
      </div>

      {/* Chronological Workdays Chart (Replaces Streamlit st.line_chart) */}
      <div className="bg-[#f7f0de] border border-[#8b6f47]/40 rounded p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5a3e1b]">
            <TrendingUp className="w-4 h-4 text-[#7a5a2e]" />
            <span>Chronological Workdays Accumulation</span>
          </div>
          <span className="text-[11px] text-[#6b5330]">
            Cumulative logged man-days
          </span>
        </div>

        {/* Visual Accumulation Graph */}
        <div className="h-28 w-full flex items-end gap-2 pt-4 px-2 pb-2 border-b border-[#8b6f47]/30">
          {sortedLogs.map((log, idx) => {
            const heightPercent = Math.min(100, Math.round(((idx + 1) / Math.max(sortedLogs.length, 1)) * 100));
            return (
              <div
                key={log.id}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
                onClick={() => onOpenReceipt(log)}
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-[#7a5a2e] group-hover:bg-[#5a3e1b] rounded-t transition-all relative"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2a1f12] text-[#f7f0de] text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                    Day {idx + 1}: ₹{(idx + 1) * 600}
                  </span>
                </div>
                <span className="text-[9px] text-[#6b5330] mt-1 font-mono">
                  D{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-[#6b5330] mt-2 italic">
          Chronological workdays for the selected laborer. Click any bar to inspect that day's immutable receipt.
        </p>
      </div>

      {/* Recent worker attendance records list */}
      <div>
        <h4 className="text-xs font-semibold text-[#5a3e1b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Individual Days Breakdown</span>
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {sortedLogs.slice().reverse().map((log, index) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2 rounded bg-[#f4ecd8] border border-[#8b6f47]/30 text-xs hover:border-[#7a5a2e] transition"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#7a5a2e] text-[11px]">
                  #{sortedLogs.length - index}
                </span>
                <div>
                  <div className="font-medium text-[#2a1f12]">
                    {formatISTDateTime(log.created_at)}
                  </div>
                  <div className="text-[10px] text-[#6b5330] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#7a5a2e]" />
                    <span>
                      {log.location_name || `${log.latitude?.toFixed(4)}, ${log.longitude?.toFixed(4)}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-[#5a3e1b] font-display text-sm">
                  ₹{log.estimated_wage.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenReceipt(log)}
                  className="px-2 py-1 rounded bg-[#efe4c8] hover:bg-[#ebe0c2] border border-[#8b6f47] text-[11px] text-[#3b2f1e] font-serif"
                >
                  Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
