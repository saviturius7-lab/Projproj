import React, { useState } from 'react';
import { WorkLog } from '../types';
import { formatISTDateTime } from '../services/storage';
import { Search, Download, FileText, CheckCircle2, MapPin, Receipt, ArrowUpDown } from 'lucide-react';

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
      'Token',
      'Created At (IST)',
      'Worker Phone',
      'Latitude',
      'Longitude',
      'Message Type',
      'Raw Message',
      'Estimated Wage (INR)',
      'Status'
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
    link.download = `shramik_sakshi_work_ledger_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#efe4c8] border border-[#8b6f47] rounded-md p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#2a1f12] flex items-center gap-2">
            <span>📋 Official Work Log Ledger</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded bg-[#f7f0de] border border-[#8b6f47]/50 text-[#5a3e1b]">
              {filteredLogs.length} Records
            </span>
          </h3>
          <p className="text-xs text-[#6b5330]">
            Immutable attendance receipts recorded via WhatsApp GPS pins
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7a5a2e]" />
            <input
              type="text"
              placeholder="Search phone, site, token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#f7f0de] border border-[#8b6f47] rounded text-xs text-[#3b2f1e] placeholder-[#8b6f47]/70 focus:outline-none focus:ring-1 focus:ring-[#7a5a2e]"
            />
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#f7f0de] border border-[#8b6f47] text-xs text-[#3b2f1e] hover:bg-[#e7ddc4]"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3 h-3 text-[#7a5a2e]" />
            {sortAsc ? 'Oldest First' : 'Newest First'}
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#7a5a2e] hover:bg-[#5a3e1b] text-[#f4ecd8] text-xs font-semibold shadow-sm border border-[#5a3e1b]"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-[#8b6f47]/40 rounded bg-[#f7f0de]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#ebe0c2] text-[#2a1f12] font-semibold border-b border-[#8b6f47]/60">
              <th className="py-2.5 px-3">Timestamp (IST)</th>
              <th className="py-2.5 px-3">Worker Mobile</th>
              <th className="py-2.5 px-3">GPS Location</th>
              <th className="py-2.5 px-3">Raw Message / Site</th>
              <th className="py-2.5 px-3 text-right">Wage (INR)</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8b6f47]/20 text-[#3b2f1e]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-sm text-[#6b5330] italic">
                  No work logs match your current filter criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f2e7cc] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap text-[#5a3e1b]">
                    {formatISTDateTime(log.created_at)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold font-mono whitespace-nowrap text-[#2a1f12]">
                    {log.phone_number}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {log.latitude && log.longitude ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#5a3e1b]">
                        <MapPin className="w-3 h-3 text-[#7a5a2e]" />
                        {Number(log.latitude).toFixed(4)}, {Number(log.longitude).toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-[#8b6f47] italic">No GPS coordinates</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs truncate" title={log.raw_message}>
                    <div className="font-medium text-[#2a1f12] truncate">
                      {log.location_name || log.raw_message}
                    </div>
                    <div className="text-[10px] text-[#6b5330] font-mono">
                      {log.verification_token}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold font-display text-sm text-[#5a3e1b]">
                    ₹{log.estimated_wage.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e8f5e9] text-[#1b5e20] border border-[#a5d6a7]">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onOpenReceipt(log)}
                      className="px-2.5 py-1 rounded bg-[#efe4c8] hover:bg-[#e7ddc4] border border-[#8b6f47] text-[11px] text-[#3b2f1e] font-serif transition"
                    >
                      View Receipt
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
