import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { LoginView } from './components/auth/LoginView';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ElectronicScaleModal } from './components/common/ElectronicScaleModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { AnimalsView } from './components/animals/AnimalsView';
import { LotsView } from './components/lots/LotsView';
import { WeighingView } from './components/weighing/WeighingView';
import { FeedingView } from './components/feeding/FeedingView';
import { HealthView } from './components/health/HealthView';
import { InventoryView } from './components/inventory/InventoryView';
import { FinancialView } from './components/financial/FinancialView';
import { SalesView } from './components/sales/SalesView';
import { ReportsView } from './components/reports/ReportsView';
import { EmployeesView } from './components/employees/EmployeesView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { currentUser, currentTab } = useFarm();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // If not authenticated, render Login
  if (!currentUser) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  // Render view corresponding to currentTab
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'animais':
        return <AnimalsView />;
      case 'lotes':
        return <LotsView />;
      case 'pesagens':
        return <WeighingView />;
      case 'alimentacao':
        return <FeedingView />;
      case 'saude':
        return <HealthView />;
      case 'estoque':
        return <InventoryView />;
      case 'financeiro':
        return <FinancialView />;
      case 'vendas':
        return <SalesView />;
      case 'relatorios':
        return <ReportsView />;
      case 'funcionarios':
        return <EmployeesView />;
      case 'configuracoes':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-['Plus_Jakarta_Sans'] flex flex-col antialiased selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop sticky & Mobile drawer) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ElectronicScaleModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainLayout />
    </FarmProvider>
  );
}
