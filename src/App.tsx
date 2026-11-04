import React, { useState, useEffect, useMemo } from 'react';
import { WorkLog } from './types';
import { getStoredLogs, resetStoredLogs, saveStoredLogs } from './services/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FieldTelegraphStation } from './components/FieldTelegraphStation';
import { MetricsOverview } from './components/MetricsOverview';
import { WorkerProfile } from './components/WorkerProfile';
import { LiveMap } from './components/LiveMap';
import { LedgerTable } from './components/LedgerTable';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CheckSquare, ListFilter, UserCheck, Map, LayoutGrid } from 'lucide-react';

type ActiveViewTab = 'all' | 'attendance' | 'register' | 'worker' | 'map';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>('All Workers');
  const [selectedReceiptLog, setSelectedReceiptLog] = useState<WorkLog | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('all');

  // Sync logs from backend and localStorage
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          setLogs(data.logs);
          saveStoredLogs(data.logs);
          return;
        }
      }
    } catch {
      // Fallback to client storage
    }
    const local = getStoredLogs();
    setLogs(local);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 6000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRefresh = async () => {
    await fetchLogs();
    triggerToast('✓ Register synchronized with latest records.');
  };

  const handleResetData = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch {
      // Ignored
    }
    const fresh = resetStoredLogs();
    setLogs(fresh);
    setSelectedWorker('All Workers');
    triggerToast('✓ Records reset to sample data.');
  };

  const handleLogCreated = (newLog: WorkLog) => {
    setLogs((prev) => [newLog, ...prev]);
    triggerToast(`✓ New attendance slip #${newLog.verification_token} issued to ${newLog.phone_number}!`);
  };

  const handleQuickCheckIn = () => {
    setActiveTab('attendance');
  };

  // Derive unique workers
  const uniqueWorkers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((log) => {
      if (log.phone_number) {
        set.add(log.phone_number);
      }
    });
    return Array.from(set).sort();
  }, [logs]);

  // Filter logs for selected worker
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
    <div className="min-h-screen bg-[#05121a] text-[#edf8f5] font-sans flex flex-col selection:bg-[#2dd4bf] selection:text-[#05121a]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#09202c] text-[#edf8f5] px-4 py-3 rounded-lg shadow-2xl text-sm font-semibold border-2 border-[#2dd4bf] flex items-center gap-2.5 animate-bounce shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(45,212,191,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col">
        {/* Simple Header with Language Selector */}
        <Header
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onRefresh={handleRefresh}
        />

        {/* Top 3 Summary Cards */}
        <MetricsOverview
          activeLaborers={selectedWorker === 'All Workers' ? activeLaborersCount : 1}
          totalDays={totalManDays}
          totalCapital={securedCapital}
        />

        {/* Easy Fast-Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-6 scrollbar-thin">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#176d4e] to-[#0f4d37] text-white border-t-2 border-l-2 border-t-[#34d399] border-l-[#34d399] border-b-2 border-r-2 border-b-[#020d09] border-r-[#020d09] shadow-[0_0_18px_rgba(52,211,153,0.3)]'
                : 'bg-[#0c2330] text-[#9fc7bd] border-t border-l border-t-[#22576f] border-l-[#22576f] border-b border-r border-b-[#03090e] border-r-[#03090e] hover:bg-[#112d3e] hover:text-[#edf8f5] hover:border-t-[#38bdf8]'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#38bdf8]" />
            <span>{t.tabAllInOne}</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
              activeTab === 'attendance'
                ? 'bg-gradient-to-r from-[#176d4e] to-[#0f4d37] text-white border-t-2 border-l-2 border-t-[#34d399] border-l-[#34d399] border-b-2 border-r-2 border-b-[#020d09] border-r-[#020d09] shadow-[0_0_18px_rgba(52,211,153,0.3)]'
                : 'bg-[#0c2330] text-[#9fc7bd] border-t border-l border-t-[#22576f] border-l-[#22576f] border-b border-r border-b-[#03090e] border-r-[#03090e] hover:bg-[#112d3e] hover:text-[#edf8f5] hover:border-t-[#38bdf8]'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-[#34d399]" />
            <span>{t.tabMarkAttendance}</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-[#176d4e] to-[#0f4d37] text-white border-t-2 border-l-2 border-t-[#34d399] border-l-[#34d399] border-b-2 border-r-2 border-b-[#020d09] border-r-[#020d09] shadow-[0_0_18px_rgba(52,211,153,0.3)]'
                : 'bg-[#0c2330] text-[#9fc7bd] border-t border-l border-t-[#22576f] border-l-[#22576f] border-b border-r border-b-[#03090e] border-r-[#03090e] hover:bg-[#112d3e] hover:text-[#edf8f5] hover:border-t-[#38bdf8]'
            }`}
          >
            <ListFilter className="w-4 h-4 text-[#38bdf8]" />
            <span>{t.tabAttendanceList}</span>
          </button>

          <button
            onClick={() => setActiveTab('worker')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
              activeTab === 'worker'
                ? 'bg-gradient-to-r from-[#176d4e] to-[#0f4d37] text-white border-t-2 border-l-2 border-t-[#34d399] border-l-[#34d399] border-b-2 border-r-2 border-b-[#020d09] border-r-[#020d09] shadow-[0_0_18px_rgba(52,211,153,0.3)]'
                : 'bg-[#0c2330] text-[#9fc7bd] border-t border-l border-t-[#22576f] border-l-[#22576f] border-b border-r border-b-[#03090e] border-r-[#03090e] hover:bg-[#112d3e] hover:text-[#edf8f5] hover:border-t-[#38bdf8]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#2dd4bf]" />
            <span>{t.tabWorkerPassbook}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-[#176d4e] to-[#0f4d37] text-white border-t-2 border-l-2 border-t-[#34d399] border-l-[#34d399] border-b-2 border-r-2 border-b-[#020d09] border-r-[#020d09] shadow-[0_0_18px_rgba(52,211,153,0.3)]'
                : 'bg-[#0c2330] text-[#9fc7bd] border-t border-l border-t-[#22576f] border-l-[#22576f] border-b border-r border-b-[#03090e] border-r-[#03090e] hover:bg-[#112d3e] hover:text-[#edf8f5] hover:border-t-[#38bdf8]'
            }`}
          >
            <Map className="w-4 h-4 text-[#38bdf8]" />
            <span>{t.tabWorkMap}</span>
          </button>
        </div>

        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start flex-1">
          {/* Controls Sidebar */}
          <Sidebar
            workers={uniqueWorkers}
            selectedWorker={selectedWorker}
            onSelectWorker={(worker) => {
              setSelectedWorker(worker);
              if (worker !== 'All Workers' && activeTab === 'all') {
                setActiveTab('worker');
              }
            }}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onQuickCheckIn={handleQuickCheckIn}
            onResetData={handleResetData}
          />

          {/* Main Workspace Section based on Active Tab */}
          <main className="flex-1 w-full min-w-0 space-y-6">
            {/* 1. Mark Attendance Section */}
            {(activeTab === 'all' || activeTab === 'attendance') && (
              <FieldTelegraphStation
                onLogReceived={handleLogCreated}
                onRefreshLedger={fetchLogs}
                onOpenReceipt={(log) => setSelectedReceiptLog(log)}
                selectedWorker={selectedWorker}
                workers={uniqueWorkers}
              />
            )}

            {/* 2. Worker Passbook Section */}
            {(activeTab === 'all' || activeTab === 'worker') && (
              <WorkerProfile
                selectedWorker={selectedWorker}
                workerLogs={filteredLogs}
                allLogs={logs}
                onOpenReceipt={(log) => setSelectedReceiptLog(log)}
              />
            )}

            {/* 3. Daily Attendance Register Table */}
            {(activeTab === 'all' || activeTab === 'register') && (
              <LedgerTable
                logs={filteredLogs}
                onOpenReceipt={(log) => setSelectedReceiptLog(log)}
              />
            )}

            {/* 4. Map Deployment Section */}
            {(activeTab === 'all' || activeTab === 'map') && (
              <LiveMap
                logs={filteredLogs}
                selectedWorker={selectedWorker}
                onOpenReceipt={(log) => setSelectedReceiptLog(log)}
              />
            )}
          </main>
        </div>

        {/* Simple Accessible Footer */}
        <footer className="mt-12 pt-4 pb-6 border-t-2 border-[#526a3c]/30 text-center text-xs sm:text-sm font-medium text-[#2d4726] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{t.footerActTitle}</strong>
          </div>
          <div className="text-[#19616e] font-bold">
            {t.footerNodeNote}
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

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
