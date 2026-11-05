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
      <div className="comic-card rounded-2xl p-4 sm:p-5 mb-6 text-sm text-[#232b28] flex items-center gap-3">
        <span className="bg-[#1e7587] text-white border-2 border-[#232b28] text-xs font-black shrink-0 px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#232b28]">
          NOTE
        </span>
        <span className="font-bold text-[#4d5e46]">
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
    <div className="comic-card rounded-2xl p-4 sm:p-6 mb-6">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-[#232b28]/20 pb-3.5 mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="bg-[#e8638b] text-white border-2 border-[#232b28] text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#232b28]">
              {t.individualDossierBadge}
            </span>
            <span className="text-xs font-black text-[#2f855a] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.verifiedBadge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#232b28] flex flex-wrap items-center gap-2">
            <span>{t.laborerDossierTitle}</span>
            <span className="bg-[#fef5dc] px-3 py-0.5 rounded-xl border-2 border-[#232b28] text-[#1e7587] font-mono font-black shadow-[2px_2px_0px_#232b28]">
              {selectedWorker}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#55694a] mt-0.5 font-semibold">
            {t.dossierSubtitle}
          </p>
        </div>

        <button
          onClick={handleDownloadAudit}
          className="comic-btn-teal inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm cursor-pointer shrink-0 active:scale-95"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{t.exportAuditBtn}</span>
        </button>
      </div>

      {/* 4 Storybook Room Stat Cards (Dollhouse inspired) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="room-bedroom p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#52323f] block uppercase tracking-wider">
            {t.verifiedDays}
          </span>
          <span className="text-2xl font-black text-[#232b28] mt-1 block font-mono">
            {workerLogs.length} Days
          </span>
        </div>

        <div className="room-living p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#2c473c] block uppercase tracking-wider">
            {t.entitledCapital}
          </span>
          <span className="text-2xl font-black text-[#2f855a] mt-1 block font-mono">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="room-bathroom p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#523e2d] block uppercase tracking-wider">
            {t.mandatedRate}
          </span>
          <span className="text-2xl font-black text-[#d97706] mt-1 block font-mono">
            ₹600.00
          </span>
        </div>

        <div className="room-music p-3.5 rounded-xl">
          <span className="text-xs font-black text-[#3a4433] block uppercase tracking-wider">
            {t.legalStanding}
          </span>
          <span className="text-xs font-black text-[#2f855a] mt-2 block tracking-wide">
            ✓ {t.immutableStanding}
          </span>
        </div>
      </div>

      {/* Visual Work Days Chart */}
      <div className="comic-inset rounded-2xl p-4 mb-5 bg-[#faf5e8]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b-2 border-[#232b28]/15 pb-2">
          <span className="text-xs sm:text-sm font-black text-[#232b28] flex items-center gap-2 uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-[#1e7587]" />
            {t.timelineTitle}
          </span>
          <span className="text-xs font-black text-[#232b28] bg-white px-2.5 py-0.5 rounded-full border-2 border-[#232b28] shadow-[1px_1px_0px_#232b28]">
            {sortedLogs.length} {t.consecutivePeriods}
          </span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="h-28 flex items-end gap-2.5 pt-4 px-2 pb-2 border-b-2 border-[#232b28]/20 min-w-[280px]">
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
                    className="w-full bg-[#1e7587] group-hover:bg-[#e8638b] transition-all duration-200 rounded-t-lg flex items-center justify-center border-2 border-[#232b28] shadow-[2px_0px_0px_#232b28]"
                  >
                    <span className="text-[10px] font-mono font-black text-white select-none">
                      ₹{(idx + 1) * 600}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#232b28] mt-1.5 whitespace-nowrap group-hover:text-[#e8638b] transition-colors">
                    Day {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-[#55694a] mt-2 font-semibold">
          {t.timelineNote}
        </p>
      </div>

      {/* Workday Log Rows */}
      <div>
        <h4 className="text-xs sm:text-sm font-black text-[#232b28] uppercase mb-2.5 tracking-wider">
          {t.individualSlipsTitle}
        </h4>
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {sortedLogs.slice().reverse().map((log, index) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl bg-white border-2 border-[#232b28] text-xs sm:text-sm gap-2 hover:border-[#e8638b] transition-all duration-150 shadow-[2px_2px_0px_#232b28]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono font-black text-[#1e7587] text-xs bg-[#d8f1e9] px-2.5 py-1 rounded-lg border-2 border-[#232b28] shrink-0">
                  #{sortedLogs.length - index}
                </span>
                <div className="min-w-0">
                  <div className="font-black text-[#232b28] leading-tight font-mono">
                    {formatISTDateTime(log.created_at)}
                  </div>
                  <div className="text-xs text-[#55694a] flex items-center gap-1.5 mt-0.5 truncate font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#38a169] shrink-0" />
                    <span className="truncate">
                      {log.location_name || `${log.latitude?.toFixed(4)}, ${log.longitude?.toFixed(4)}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-[#232b28]/15">
                <span className="font-black text-sm sm:text-base text-[#2f855a] font-mono shrink-0">
                  ₹{log.estimated_wage.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenReceipt(log)}
                  className="comic-btn-pink px-3 py-1.5 text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
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
