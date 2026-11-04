import React from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime, generateAuditText } from '../services/storage';
import { Download, MapPin, FileText, CheckCircle2, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();

  if (selectedWorker === 'All Workers') {
    return (
      <div className="retro-card rounded-xl p-4 sm:p-5 mb-6 text-sm text-[#edf8f5] flex items-center gap-3">
        <span className="retro-stamp-cyan text-xs font-black shrink-0 px-2.5 py-1">
          NOTE
        </span>
        <span className="font-medium text-[#9fc7bd]">
          {t.workerProfileNotice}
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
    link.download = `${selectedWorker.replace(/\D/g, '')}_wage_record.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="retro-card rounded-xl p-4 sm:p-6 mb-6">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1b4b60] pb-3.5 mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="retro-stamp-emerald text-[11px] font-extrabold px-2.5 py-0.5 rounded">
              {t.individualDossierBadge}
            </span>
            <span className="text-xs font-bold text-[#34d399] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.verifiedBadge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#edf8f5] flex flex-wrap items-center gap-2">
            <span>{t.laborerDossierTitle}</span>
            <span className="bg-[#081b27] px-3 py-0.5 rounded-lg border border-[#22576f] text-[#22d3ee] font-mono font-bold shadow-inner">
              {selectedWorker}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#94c3b7] mt-0.5 font-medium">
            {t.dossierSubtitle}
          </p>
        </div>

        <button
          onClick={handleDownloadAudit}
          className="retro-btn-petrol inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm cursor-pointer shrink-0 active:scale-95"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{t.exportAuditBtn}</span>
        </button>
      </div>

      {/* 4 Clean Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="retro-inset p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#8ebfb4] block uppercase tracking-wider">
            {t.verifiedDays}
          </span>
          <span className="text-2xl font-black text-[#edf8f5] mt-1 block font-mono">
            {workerLogs.length} Days
          </span>
        </div>

        <div className="retro-inset p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#8ebfb4] block uppercase tracking-wider">
            {t.entitledCapital}
          </span>
          <span className="text-2xl font-black text-[#34d399] mt-1 block font-mono">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="retro-inset p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#8ebfb4] block uppercase tracking-wider">
            {t.mandatedRate}
          </span>
          <span className="text-2xl font-black text-[#22d3ee] mt-1 block font-mono">
            ₹600.00
          </span>
        </div>

        <div className="retro-inset p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#8ebfb4] block uppercase tracking-wider">
            {t.legalStanding}
          </span>
          <span className="text-xs font-black text-[#6ee7b7] mt-2 block tracking-wide">
            ✓ {t.immutableStanding}
          </span>
        </div>
      </div>

      {/* Visual Work Days Chart */}
      <div className="retro-inset rounded-xl p-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-[#1b485d] pb-2">
          <span className="text-xs sm:text-sm font-extrabold text-[#edf8f5] flex items-center gap-2 uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-[#22d3ee]" />
            {t.timelineTitle}
          </span>
          <span className="text-xs font-bold text-[#34d399] bg-[#07241b] px-2.5 py-0.5 rounded border border-[#165640]">
            {sortedLogs.length} {t.consecutivePeriods}
          </span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="h-28 flex items-end gap-2.5 pt-4 px-2 pb-2 border-b border-[#1b485d] min-w-[280px]">
            {sortedLogs.map((log, idx) => {
              const heightPercent = Math.min(100, Math.round(((idx + 1) / Math.max(sortedLogs.length, 1)) * 100));
              return (
                <div
                  key={log.id}
                  className="flex-1 min-w-[42px] max-w-[64px] flex flex-col items-center cursor-pointer group"
                  onClick={() => onOpenReceipt(log)}
                  title={`Day ${idx + 1}: ₹${(idx + 1) * 600} - Click to view slip`}
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#0e5138] to-[#1cb07e] group-hover:from-[#136c4b] group-hover:to-[#22d3ee] transition-all duration-300 rounded-t-sm flex items-center justify-center border-t border-l border-[#34d399] border-r border-[#03130d] shadow-sm"
                  >
                    <span className="text-[10px] font-mono font-bold text-white select-none">
                      ₹{(idx + 1) * 600}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#8cbab0] mt-1.5 whitespace-nowrap group-hover:text-[#22d3ee] transition-colors">
                    Day {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-[#70a194] mt-2 font-medium">
          {t.timelineNote}
        </p>
      </div>

      {/* Workday Log Rows */}
      <div>
        <h4 className="text-xs sm:text-sm font-black text-[#edf8f5] uppercase mb-2.5 tracking-wider">
          {t.individualSlipsTitle}
        </h4>
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {sortedLogs.slice().reverse().map((log, index) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl bg-[#08202d] border border-[#1c4b60] text-xs sm:text-sm gap-2 hover:border-[#22d3ee] transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono font-bold text-[#22d3ee] text-xs bg-[#051722] px-2.5 py-1 rounded border border-[#1b4b60] shrink-0">
                  #{sortedLogs.length - index}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-[#edf8f5] leading-tight font-mono">
                    {formatISTDateTime(log.created_at)}
                  </div>
                  <div className="text-xs text-[#8abcb0] flex items-center gap-1.5 mt-0.5 truncate font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
                    <span className="truncate">
                      {log.location_name || `${log.latitude?.toFixed(4)}, ${log.longitude?.toFixed(4)}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-[#1b485d]">
                <span className="font-black text-sm sm:text-base text-[#34d399] font-mono shrink-0">
                  ₹{log.estimated_wage.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenReceipt(log)}
                  className="retro-btn-petrol px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-[#22d3ee]" />
                  <span>{t.receiptSlipBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
