import React, { useState } from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime } from '../services/storage';
import { Search, Download, MapPin, ArrowUpDown, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LedgerTableProps {
  logs: WorkLog[];
  onOpenReceipt: (log: WorkLog) => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ logs, onOpenReceipt }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredLogs = logs
    .filter((log) => {
      const term = searchTerm.toLowerCase();
      return (
        log.phone_number.toLowerCase().includes(term) ||
        (log.raw_message && log.raw_message.toLowerCase().includes(term)) ||
        (log.location_name && log.location_name.toLowerCase().includes(term)) ||
        (log.verification_token && log.verification_token.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortAsc ? timeA - timeB : timeB - timeA;
    });

  const exportCSV = () => {
    const headers = [
      'Slip Number',
      'Date & Time (IST)',
      'Worker Phone',
      'Latitude',
      'Longitude',
      'Work Place',
      'Daily Wage (INR)',
      'Status'
    ];

    const rows = filteredLogs.map((log) => [
      log.verification_token,
      `"${formatISTDateTime(log.created_at)}"`,
      `"${log.phone_number}"`,
      log.latitude ?? '',
      log.longitude ?? '',
      `"${(log.location_name || log.raw_message || '').replace(/"/g, '""')}"`,
      log.estimated_wage,
      log.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_register_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="retro-card rounded-xl p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 border-b border-[#1b4b60] pb-3.5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="retro-stamp-emerald text-[11px] font-extrabold px-2.5 py-0.5 rounded">
              {t.officialRegisterBadge}
            </span>
            <span className="text-xs font-mono font-bold text-[#34d399]">
              {filteredLogs.length} Records
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#edf8f5]">
            {t.musterScheduleTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#93c3b7] mt-0.5 font-medium">
            {t.ledgerSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#22d3ee]" />
            <input
              type="text"
              placeholder={t.filterPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#081b27] border border-[#1d4d62] rounded-lg text-xs sm:text-sm font-semibold text-[#edf8f5] placeholder-[#679187] focus:outline-none focus:ring-2 focus:ring-[#22d3ee] transition-all"
            />
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="retro-btn-muted inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{sortAsc ? t.oldestBtn : t.newestBtn}</span>
          </button>

          <button
            onClick={exportCSV}
            className="retro-btn-petrol inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>{t.exportCsvBtn}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto retro-inset rounded-xl">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-[#061824] text-[#8ebfb4] font-black border-b border-[#1b485d] text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-3.5 whitespace-nowrap">{t.thDocketToken}</th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">{t.thDateTime}</th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">{t.thWorkerPhone}</th>
              <th className="py-3.5 px-3.5 whitespace-nowrap">{t.thLocationSite}</th>
              <th className="py-3.5 px-3.5 text-right whitespace-nowrap">{t.thWageInr}</th>
              <th className="py-3.5 px-3.5 text-center whitespace-nowrap">{t.thStanding}</th>
              <th className="py-3.5 px-3.5 text-center whitespace-nowrap">{t.thSlip}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#133549] text-[#edf8f5]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm font-semibold text-[#6d9e92]">
                  {t.emptyLedgerText}
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0c2b3d] transition-colors duration-150 font-medium group">
                  <td className="py-3.5 px-3.5 font-mono font-bold text-[#22d3ee] whitespace-nowrap">
                    {log.verification_token}
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap text-xs text-[#a5c9c0] font-mono">
                    {formatISTDateTime(log.created_at)}
                  </td>
                  <td className="py-3.5 px-3.5 font-bold font-mono whitespace-nowrap text-[#edf8f5]">
                    {log.phone_number}
                  </td>
                  <td className="py-3.5 px-3.5 min-w-[160px] max-w-xs text-[#d8eee7] leading-snug">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
                      <span className="line-clamp-2">
                        {log.location_name || log.raw_message}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 text-right font-black text-[#34d399] font-mono text-sm sm:text-base whitespace-nowrap">
                    ₹{log.estimated_wage.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                    {log.status === 'disputed' ? (
                      <span className="retro-stamp-amber text-[10px] px-2 py-0.5 rounded font-black inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Disputed
                      </span>
                    ) : (
                      <span className="retro-stamp-emerald text-[10px] px-2 py-0.5 rounded font-black inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => onOpenReceipt(log)}
                      className="retro-btn-petrol px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer active:scale-95"
                    >
                      {t.thSlip}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
