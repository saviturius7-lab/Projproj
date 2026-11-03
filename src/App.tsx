import React, { useState, useEffect, useMemo } from 'react';
import { WorkLog } from './types';
import { getStoredLogs, resetStoredLogs, saveStoredLogs } from './services/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MetricsOverview } from './components/MetricsOverview';
import { WorkerProfile } from './components/WorkerProfile';
import { LiveMap } from './components/LiveMap';
import { LedgerTable } from './components/LedgerTable';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal';

export const App: React.FC = () => {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>('All Workers');
  const [selectedReceiptLog, setSelectedReceiptLog] = useState<WorkLog | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load logs on mount
  useEffect(() => {
    const stored = getStoredLogs();
    setLogs(stored);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRefresh = () => {
    const stored = getStoredLogs();
    setLogs(stored);
    triggerToast('Ledger successfully re-synchronized with local node.');
  };

  const handleResetData = () => {
    const fresh = resetStoredLogs();
    setLogs(fresh);
    setSelectedWorker('All Workers');
    triggerToast('Demo records reset to default initial job site logs.');
  };

  const handleLogCreated = (newLog: WorkLog) => {
    setLogs((prev) => [newLog, ...prev]);
    triggerToast(`New verified workday recorded for ${newLog.phone_number}!`);
  };

  const handleQuickCheckIn = () => {
    setIsSimulatorOpen(true);
  };

  // Derive workers
  const uniqueWorkers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((log) => {
      if (log.phone_number) {
        set.add(log.phone_number);
      }
    });
    return Array.from(set).sort();
  }, [logs]);

  // Filter logs for active selection
  const filteredLogs = useMemo(() => {
    if (selectedWorker === 'All Workers') {
      return logs;
    }
    return logs.filter((l) => l.phone_number === selectedWorker);
  }, [logs, selectedWorker]);

  const activeLaborersCount = uniqueWorkers.length;
  const totalManDays = filteredLogs.length;
  const securedCapital = filteredLogs.reduce(
    (acc, curr) => acc + (Number(curr.estimated_wage) || 600),
    0
  );

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#3b2f1e] font-serif flex flex-col selection:bg-[#7a5a2e] selection:text-[#f4ecd8]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#2a1f12] text-[#f7f0de] px-4 py-2.5 rounded shadow-lg text-xs border border-[#8b6f47] flex items-center gap-2 animate-fade-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col">
        {/* Header */}
        <Header
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onRefresh={handleRefresh}
        />

        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start flex-1">
          {/* Controls Sidebar */}
          <Sidebar
            workers={uniqueWorkers}
            selectedWorker={selectedWorker}
            onSelectWorker={setSelectedWorker}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onQuickCheckIn={handleQuickCheckIn}
            onResetData={handleResetData}
          />

          {/* Main Dashboard Section */}
          <main className="flex-1 w-full min-w-0 space-y-6">
            {/* Top 3 Metrics Row */}
            <MetricsOverview
              activeLaborers={selectedWorker === 'All Workers' ? activeLaborersCount : 1}
              totalDays={totalManDays}
              totalCapital={securedCapital}
            />

            {/* Individual Worker Profile Details & Timeline */}
            <WorkerProfile
              selectedWorker={selectedWorker}
              workerLogs={filteredLogs}
              allLogs={logs}
              onOpenReceipt={(log) => setSelectedReceiptLog(log)}
            />

            {/* Map Deployment */}
            <LiveMap
              logs={filteredLogs}
              selectedWorker={selectedWorker}
              onOpenReceipt={(log) => setSelectedReceiptLog(log)}
            />

            {/* Work Log Ledger */}
            <LedgerTable
              logs={filteredLogs}
              onOpenReceipt={(log) => setSelectedReceiptLog(log)}
            />
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-4 pb-6 border-t border-[#8b6f47]/40 text-center text-xs text-[#6b5330] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Shramik Sakshi</strong> • Digital Wage Protection for the Unorganized Workforce
          </div>
          <div className="italic">
            No Apps to Install. WhatsApp Verified GPS Ledger. MIT Open Source.
          </div>
        </footer>
      </div>

      {/* Modals */}
      <DigitalReceiptModal
        log={selectedReceiptLog}
        onClose={() => setSelectedReceiptLog(null)}
      />

      <WhatsAppSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onLogCreated={handleLogCreated}
        currentPhoneNumber={selectedWorker !== 'All Workers' ? selectedWorker : '+919876543210'}
      />
    </div>
  );
};

export default App;
