import React from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime, generateAuditText } from '../services/storage';
import { Download, MapPin } from 'lucide-react';

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
      <div className="manila-folder border-2 border-[#aa8c58] rounded p-3.5 mb-6 text-xs font-serif text-[#382819] flex flex-wrap items-center gap-3 shadow-inner leading-relaxed">
        <span className="rubber-stamp rubber-stamp-blue text-[9px]">NOTICE</span>
        <span className="flex-1 min-w-[200px]">
          Select an individual worker dossier from the sidebar file index to inspect chronological wage accumulation slips, dispute certificate, and typewriter audit export.
        </span>
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
    link.download = `${selectedWorker.replace(/\D/g, '')}_official_audit_dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ledger-paper border-2 border-[#8b6f47] rounded-md p-4 sm:p-5 mb-6 shadow-md relative overflow-hidden">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-[#8b6f47] pb-3 mb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-typewriter font-bold bg-[#6f4e24] text-[#fbf6ea] px-2 py-0.5 rounded-xs shrink-0">
              INDIVIDUAL DOSSIER FILE
            </span>
            <span className="rubber-stamp rubber-stamp-green text-[9px]">
              [ VERIFIED / DISPUTE-FREE ]
            </span>
          </div>

          <h2 className="font-typewriter text-lg sm:text-2xl font-bold text-[#221910] mt-1 flex flex-wrap items-center gap-2 leading-tight">
            <span>LABORER DOSSIER:</span>
            <span className="bg-[#ebdcb9] px-2.5 py-0.5 border border-[#aa8c58] text-[#9e2a2b] font-mono shrink-0">
              {selectedWorker}
            </span>
          </h2>
          <p className="font-serif italic text-xs text-[#684f33] mt-1 leading-normal">
            Physical muster roll record verified under Unorganized Workers' Social Security Act
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleDownloadAudit}
            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-[#6f4e24] hover:bg-[#4e3314] text-[#fbf6ea] font-typewriter font-bold text-xs transition border-2 border-[#382819] shadow-sm active:translate-y-0.5"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            EXPORT OFFICIAL AUDIT (.TXT)
          </button>
        </div>
      </div>

      {/* Typewriter Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#fbf6ea] border-2 border-[#aa8c58]/60 p-2.5 rounded shadow-inner flex flex-col justify-between">
          <span className="text-[10px] font-typewriter uppercase text-[#6f4e24] block font-bold leading-tight">
            Verified Days:
          </span>
          <span className="text-xl font-typewriter font-bold text-[#221910] mt-1">
            {workerLogs.length} DAYS
          </span>
        </div>

        <div className="bg-[#fbf6ea] border-2 border-[#aa8c58]/60 p-2.5 rounded shadow-inner flex flex-col justify-between">
          <span className="text-[10px] font-typewriter uppercase text-[#6f4e24] block font-bold leading-tight">
            Entitled Capital:
          </span>
          <span className="text-xl font-typewriter font-bold text-[#9e2a2b] mt-1">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#fbf6ea] border-2 border-[#aa8c58]/60 p-2.5 rounded shadow-inner flex flex-col justify-between">
          <span className="text-[10px] font-typewriter uppercase text-[#6f4e24] block font-bold leading-tight">
            Mandated Rate:
          </span>
          <span className="text-xl font-typewriter font-bold text-[#221910] mt-1">
            ₹600.00
          </span>
        </div>

        <div className="bg-[#fbf6ea] border-2 border-[#aa8c58]/60 p-2.5 rounded shadow-inner flex flex-col justify-between">
          <span className="text-[10px] font-typewriter uppercase text-[#6f4e24] block font-bold leading-tight">
            Legal Standing:
          </span>
          <span className="text-sm font-typewriter font-bold text-[#2d6a4f] block mt-1">
            IMMUTABLE
          </span>
        </div>
      </div>

      {/* Chronological Workdays Ledger Bars - Guaranteed Zero Collision */}
      <div className="bg-[#fbf6ea] border-2 border-[#aa8c58]/60 rounded p-4 mb-4 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-[#aa8c58]/40 pb-1.5">
          <span className="font-typewriter text-xs font-bold text-[#6f4e24] uppercase">
            CHRONOLOGICAL ACCUMULATION TIMELINE (MAN-DAYS)
          </span>
          <span className="font-typewriter text-[10px] text-[#684f33]">
            {sortedLogs.length} CONSECUTIVE PERIODS
          </span>
        </div>

        {/* Scrollable Container with Minimum Bar Width so text never collides */}
        <div className="overflow-x-auto pb-2">
          <div className="h-32 flex items-end gap-3 pt-6 px-2 pb-2 border-b-2 border-[#aa8c58]/40 min-w-[280px]">
            {sortedLogs.map((log, idx) => {
              const heightPercent = Math.min(100, Math.round(((idx + 1) / Math.max(sortedLogs.length, 1)) * 100));
              return (
                <div
                  key={log.id}
                  className="flex-1 min-w-[36px] max-w-[56px] flex flex-col items-center group relative cursor-pointer"
                  onClick={() => onOpenReceipt(log)}
                  title={`Day ${idx + 1}: ₹${(idx + 1) * 600} - Click for Receipt`}
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-[#6f4e24] group-hover:bg-[#9e2a2b] transition-all relative border border-[#382819] flex items-center justify-center"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#fbf6ea] opacity-90 select-none">
                      ₹{(idx + 1) * 600}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#221910] mt-1.5 font-mono font-bold whitespace-nowrap">
                    D{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-[10px] font-serif text-[#684f33] mt-2 italic leading-tight">
          Click any chronological bar to view the unalterable physical carbon receipt for that workday.
        </p>
      </div>

      {/* Chronological Workday Log Rows */}
      <div>
        <h4 className="text-[11px] font-typewriter font-bold text-[#6f4e24] uppercase mb-2">
          INDIVIDUAL REGISTER SLIPS:
        </h4>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {sortedLogs.slice().reverse().map((log, index) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 rounded bg-[#fbf6ea] border border-[#aa8c58]/50 text-xs gap-2 hover:border-[#6f4e24] transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono font-bold text-[#9e2a2b] text-[11px] shrink-0">
                  #{sortedLogs.length - index}
                </span>
                <div className="min-w-0">
                  <div className="font-typewriter font-bold text-[#221910] leading-tight">
                    {formatISTDateTime(log.created_at)}
                  </div>
                  <div className="text-[10px] font-mono text-[#684f33] flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-[#6f4e24] shrink-0" />
                    <span className="truncate">
                      {log.location_name || `${log.latitude?.toFixed(4)}, ${log.longitude?.toFixed(4)}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#aa8c58]/20">
                <span className="font-typewriter font-bold text-sm text-[#9e2a2b] shrink-0">
                  ₹{log.estimated_wage.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenReceipt(log)}
                  className="px-2.5 py-1 bg-[#ebdcb9] hover:bg-[#dfcaa0] border border-[#aa8c58] text-[10px] font-typewriter font-bold text-[#221910] rounded shadow-xs shrink-0"
                >
                  RECEIPT SLIP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
