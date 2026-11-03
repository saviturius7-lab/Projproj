import React from 'react';
import { Users, CalendarCheck, Coins, CheckCircle2 } from 'lucide-react';

interface MetricsOverviewProps {
  activeLaborers: number;
  totalDays: number;
  totalCapital: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  activeLaborers,
  totalDays,
  totalCapital,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Metric 1 */}
      <div className="bg-[#efe4c8] border border-[#8b6f47] rounded-md p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6b5330] mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Active Laborers Verified
          </span>
          <Users className="w-4 h-4 text-[#7a5a2e]" />
        </div>
        <div className="text-3xl font-bold font-display text-[#5a3e1b] mt-1">
          {activeLaborers}
        </div>
        <div className="text-[11px] text-[#7a5a2e] mt-2 flex items-center gap-1 font-serif">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Biometric & GPS phone verified</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-[#efe4c8] border border-[#8b6f47] rounded-md p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6b5330] mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Man-Days Logged
          </span>
          <CalendarCheck className="w-4 h-4 text-[#7a5a2e]" />
        </div>
        <div className="text-3xl font-bold font-display text-[#5a3e1b] mt-1">
          {totalDays}
        </div>
        <div className="text-[11px] text-[#7a5a2e] mt-2 flex items-center gap-1 font-serif">
          <span className="font-semibold">₹600.00</span> / guaranteed day rate
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-[#efe4c8] border border-[#8b6f47] rounded-md p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#6b5330] mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Secured Capital
          </span>
          <Coins className="w-4 h-4 text-[#7a5a2e]" />
        </div>
        <div className="text-3xl font-bold font-display text-[#5a3e1b] mt-1">
          ₹{totalCapital.toLocaleString('en-IN')}
        </div>
        <div className="text-[11px] text-[#7a5a2e] mt-2 flex items-center gap-1 font-serif">
          <span className="text-emerald-800 font-medium">100% dispute-backed collateral</span>
        </div>
      </div>
    </div>
  );
};
