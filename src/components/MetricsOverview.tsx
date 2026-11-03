import React from 'react';

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
      <div className="manila-folder border-2 border-[#aa8c58] rounded p-4 shadow-sm flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#aa8c58]/60 pb-1.5 mb-2">
          <span className="text-[10px] font-typewriter font-bold uppercase text-[#6f4e24] tracking-wider shrink-0">
            TAB 01 • ACTIVE ENROLLMENT
          </span>
          <span className="rubber-stamp rubber-stamp-blue text-[8px]">
            VERIFIED
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-typewriter font-bold text-[#221910] tracking-tight my-1">
          {String(activeLaborers).padStart(2, '0')}
        </div>
        <div className="text-xs font-serif text-[#684f33] italic leading-tight">
          Active laborers on field muster roll
        </div>
        <div className="mt-2.5 pt-1.5 border-t border-[#aa8c58]/40 text-[10px] font-typewriter text-[#1d3557] font-bold leading-normal">
          [ REGISTRATION: VERIFIED GPS SATELLITE ]
        </div>
      </div>

      {/* Metric 2 */}
      <div className="manila-folder border-2 border-[#aa8c58] rounded p-4 shadow-sm flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#aa8c58]/60 pb-1.5 mb-2">
          <span className="text-[10px] font-typewriter font-bold uppercase text-[#6f4e24] tracking-wider shrink-0">
            TAB 02 • CUMULATIVE WORKDAYS
          </span>
          <span className="rubber-stamp rubber-stamp-green text-[8px]">
            LOGGED
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-typewriter font-bold text-[#221910] tracking-tight my-1">
          {String(totalDays).padStart(3, '0')}
        </div>
        <div className="text-xs font-serif text-[#684f33] italic leading-tight">
          Verified man-days logged on ledger
        </div>
        <div className="mt-2.5 pt-1.5 border-t border-[#aa8c58]/40 text-[10px] font-typewriter text-[#2d6a4f] font-bold leading-normal">
          [ MANDATED RATE: ₹600.00 / DAY ]
        </div>
      </div>

      {/* Metric 3 */}
      <div className="manila-folder border-2 border-[#aa8c58] rounded p-4 shadow-sm flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#aa8c58]/60 pb-1.5 mb-2">
          <span className="text-[10px] font-typewriter font-bold uppercase text-[#6f4e24] tracking-wider shrink-0">
            TAB 03 • SECURED WAGE CAPITAL
          </span>
          <span className="rubber-stamp rubber-stamp-red text-[8px]">
            MANDATORY
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-typewriter font-bold text-[#9e2a2b] tracking-tight my-1">
          ₹{totalCapital.toLocaleString('en-IN')}
        </div>
        <div className="text-xs font-serif text-[#684f33] italic leading-tight">
          Total locked wage entitlement collateral
        </div>
        <div className="mt-2.5 pt-1.5 border-t border-[#aa8c58]/40 text-[10px] font-typewriter text-[#9e2a2b] font-bold leading-normal">
          [ 100% UNORGANIZED DISPUTE PROOF ]
        </div>
      </div>
    </div>
  );
};
