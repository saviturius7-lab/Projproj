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
import { TutorialModal } from './components/TutorialModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CheckSquare, ListFilter, UserCheck, Map, LayoutGrid, BookOpen, HardHat, ClipboardCheck } from 'lucide-react';

import { BoidsCanvas } from './components/BoidsCanvas';

type ActiveViewTab = 'all' | 'attendance' | 'register' | 'worker' | 'map';

const AppContent: React.FC = () => {
  const { language, t } = useLanguage();
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>('All Workers');
  const [selectedReceiptLog, setSelectedReceiptLog] = useState<WorkLog | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [tutorialRole, setTutorialRole] = useState<'worker' | 'admin'>('worker');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('all');

  const handleOpenTutorial = (role: 'worker' | 'admin' = 'worker') => {
    setTutorialRole(role);
    setIsTutorialOpen(true);
  };

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
    <div className="min-h-screen relative font-sans flex flex-col selection:bg-[#f49ab8] selection:text-[#232b28]">
      {/* Flocking Boids Simulation Canvas running smoothly behind the UI */}
      <BoidsCanvas />

      {/* Toast Notification styled as comic speech bubble */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#fffef9] text-[#232b28] px-4 py-3 border-[2.5px] border-[#232b28] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[4px_4px_0px_#232b28] text-sm font-extrabold flex items-center gap-2.5 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38a169]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container sitting cleanly above the boids canvas */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col">
        {/* Storybook Cottage Header */}
        <Header
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onRefresh={handleRefresh}
          onOpenTutorial={handleOpenTutorial}
        />

        {/* 3 Storybook Dollhouse Rooms (Library, Living Room, Safe) */}
        <MetricsOverview
          activeLaborers={selectedWorker === 'All Workers' ? activeLaborersCount : 1}
          totalDays={totalManDays}
          totalCapital={securedCapital}
        />

        {/* Irregular Hand-Drawn Navigation Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'all'
                ? 'bg-[#1e7587] text-white border-[2.5px] border-[#232b28] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[3px_3px_0px_#232b28]'
                : 'comic-btn-cream'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{t.tabAllInOne}</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'attendance'
                ? 'bg-[#38a169] text-white border-[2.5px] border-[#232b28] rounded-[225px_15px_255px_15px/15px_255px_15px_225px] shadow-[3px_3px_0px_#232b28]'
                : 'comic-btn-cream'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{t.tabMarkAttendance}</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'register'
                ? 'bg-[#1e7587] text-white border-[2.5px] border-[#232b28] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[3px_3px_0px_#232b28]'
                : 'comic-btn-cream'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>{t.tabAttendanceList}</span>
          </button>

          <button
            onClick={() => setActiveTab('worker')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'worker'
                ? 'bg-[#e8638b] text-white border-[2.5px] border-[#232b28] rounded-[18px_255px_16px_240px/240px_16px_255px_18px] shadow-[3px_3px_0px_#232b28]'
                : 'comic-btn-cream'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.tabWorkerPassbook}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'map'
                ? 'bg-[#7c9438] text-white border-[2.5px] border-[#232b28] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[3px_3px_0px_#232b28]'
                : 'comic-btn-cream'
            }`}
          >
            <Map className="w-4 h-4" />
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
            onOpenTutorial={handleOpenTutorial}
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

      {/* Floating Quick Field Guide Launcher in bottom-right corner */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => handleOpenTutorial('worker')}
          className="comic-btn-emerald px-3 sm:px-3.5 py-2 text-xs font-black shadow-[3px_3px_0px_#232b28] flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="Open Worker Walkthrough"
        >
          <HardHat className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'मजदूर गाइड' : 
                 language === 'kn' ? 'ಕಾರ್ಮಿಕ ಗೈಡ್' : 
                 language === 'te' ? 'కార్మిక గైడ్' : 
                 language === 'ta' ? 'தொழிலாளர்' : 
                 language === 'ml' ? 'തൊഴിലാളി' : 
                 'Worker Guide'}</span>
        </button>
        <button
          onClick={() => handleOpenTutorial('admin')}
          className="comic-btn-teal px-3 sm:px-3.5 py-2 text-xs font-black shadow-[3px_3px_0px_#232b28] flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="Open Admin & Supervisor Walkthrough"
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'ठेकेदार गाइड' : 
                 language === 'kn' ? 'ಮೇಲ್ವಿಚಾರಕ' : 
                 language === 'te' ? 'సూపర్‌వైజర్' : 
                 language === 'ta' ? 'மேற்பார்வையாளர்' : 
                 language === 'ml' ? 'സൂപ്പർവൈസർ' : 
                 'Admin Guide'}</span>
        </button>
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

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        initialRole={tutorialRole}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          triggerToast(`✓ Switched to ${tab} view`);
        }}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
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
