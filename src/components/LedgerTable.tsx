import React, { useState } from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime } from '../services/storage';
import { Search, Download, MapPin, ArrowUpDown } from 'lucide-react';

interface LedgerTableProps {
  logs: WorkLog[];
  onOpenReceipt: (log: WorkLog) => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ logs, onOpenReceipt }) => {
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
      'Docket Token',
      'IST Timestamp',
      'Worker Phone',
      'Latitude',
      'Longitude',
      'Message Type',
      'Site Description',
      'Mandated Wage (INR)',
      'Verification Status'
    ];

    const rows = filteredLogs.map((log) => [
      log.verification_token,
      `"${formatISTDateTime(log.created_at)}"`,
      `"${log.phone_number}"`,
      log.latitude ?? '',
      log.longitude ?? '',
      log.message_type,
      `"${(log.raw_message || '').replace(/"/g, '""')}"`,
      log.estimated_wage,
      log.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shramik_sakshi_muster_roll_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ledger-paper border-2 border-[#8b6f47] rounded-md p-4 sm:p-5 shadow-md relative overflow-hidden">
      {/* Top Filing Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border-b-2 border-[#8b6f47] pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-typewriter font-bold bg-[#6f4e24] text-[#fbf6ea] px-2 py-0.5 rounded-xs shrink-0">
              MUSTER ROLL SCHEDULE 'A'
            </span>
            <span className="rubber-stamp rubber-stamp-red text-[8px]">
              OFFICIAL REGISTER
            </span>
          </div>
          <h3 className="font-typewriter text-lg sm:text-xl font-bold text-[#221910] uppercase leading-tight">
            General Wage Protection Ledger
          </h3>
          <p className="font-serif italic text-xs text-[#684f33] mt-1 leading-normal">
            Consecutive tamper-evident attendance slips entered via telecommunication
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6f4e24]" />
            <input
              type="text"
              placeholder="Filter docket, phone, site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#fbf6ea] border-2 border-[#aa8c58] rounded text-xs font-typewriter text-[#221910] placeholder-[#aa8c58] focus:outline-none focus:ring-1 focus:ring-[#6f4e24]"
            />
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#ebdcb9] border-2 border-[#aa8c58] text-xs font-typewriter font-bold text-[#221910] hover:bg-[#dfcaa0] shrink-0"
          >
            <ArrowUpDown className="w-3 h-3 text-[#6f4e24] shrink-0" />
            <span className="whitespace-nowrap">{sortAsc ? 'OLDEST' : 'NEWEST'}</span>
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#6f4e24] hover:bg-[#4e3314] text-[#fbf6ea] text-xs font-typewriter font-bold border-2 border-[#382819] shadow-sm transition active:translate-y-0.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">EXPORT LEDGER CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="overflow-x-auto border-2 border-[#aa8c58] rounded bg-[#fbf6ea] shadow-inner">
        <table className="w-full text-left text-xs font-typewriter border-collapse">
          <thead>
            <tr className="bg-[#ebdcb9] text-[#221910] font-bold border-b-2 border-[#aa8c58] text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 border-r border-[#aa8c58]/60 whitespace-nowrap">DOCKET TOKEN</th>
              <th className="py-2.5 px-3 border-r border-[#aa8c58]/60 whitespace-nowrap">DATE / TIME (IST)</th>
              <th className="py-2.5 px-3 border-r border-[#aa8c58]/60 whitespace-nowrap">WORKER PHONE</th>
              <th className="py-2.5 px-3 border-r border-[#aa8c58]/60 whitespace-nowrap">GPS COORDS</th>
              <th className="py-2.5 px-3 border-r border-[#aa8c58]/60 whitespace-nowrap">LOCATION / SITE</th>
              <th className="py-2.5 px-3 border-r border-[#aa8c58]/60 text-right whitespace-nowrap">WAGE (INR)</th>
              <th className="py-2.5 px-3 border-r border-[#aa8c58]/60 text-center whitespace-nowrap">STANDING</th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">SLIP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d6e0ea] text-[#221910]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm font-serif italic text-[#684f33]">
                  No ledger entries recorded under current search docket.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f5ecda] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#9e2a2b] whitespace-nowrap border-r border-[#aa8c58]/30">
                    {log.verification_token}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] whitespace-nowrap text-[#382819] border-r border-[#aa8c58]/30">
                    {formatISTDateTime(log.created_at)}
                  </td>
                  <td className="py-2.5 px-3 font-bold font-mono whitespace-nowrap text-[#221910] border-r border-[#aa8c58]/30">
                    {log.phone_number}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap border-r border-[#aa8c58]/30 text-[#1d3557]">
                    {log.latitude && log.longitude ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                        <MapPin className="w-3 h-3 text-[#6f4e24] shrink-0" />
                        <span>{Number(log.latitude).toFixed(4)}, {Number(log.longitude).toFixed(4)}</span>
                      </span>
                    ) : (
                      <span className="text-[#aa8c58] italic font-serif">N/A</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 min-w-[150px] max-w-xs border-r border-[#aa8c58]/30 text-[#221910] leading-snug">
                    <span className="line-clamp-2" title={log.location_name || log.raw_message}>
                      {log.location_name || log.raw_message}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#9e2a2b] text-sm whitespace-nowrap border-r border-[#aa8c58]/30">
                    ₹{log.estimated_wage.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap border-r border-[#aa8c58]/30">
                    {log.status === 'disputed' ? (
                      <span className="rubber-stamp rubber-stamp-red text-[8px]">
                        DISPUTED
                      </span>
                    ) : (
                      <span className="rubber-stamp rubber-stamp-green text-[8px]">
                        VERIFIED
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onOpenReceipt(log)}
                      className="px-2.5 py-1 rounded bg-[#ebdcb9] hover:bg-[#dfcaa0] border border-[#aa8c58] text-[10px] font-bold text-[#221910] uppercase active:translate-y-0.5"
                    >
                      VIEW SLIP
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
