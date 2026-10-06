import React from 'react';
import { useFarm, NavigationTab } from '../../context/FarmContext';
import {
  LayoutDashboard,
  Beef,
  Layers,
  Scale,
  Wheat,
  Activity,
  Boxes,
  DollarSign,
  ShoppingCart,
  FileBarChart,
  Users,
  Settings,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, animals, lots, inventory, atypicalAlerts, currentUser } = useFarm();

  const activeAnimalsCount = animals.filter((a) => a.status === 'Confinado').length;
  const activeLotsCount = lots.filter((l) => l.status !== 'Finalizado').length;
  const lowInventoryCount = inventory.filter((i) => i.currentStock < i.minimumStock).length;
  const pendingAlertsCount = atypicalAlerts.filter((a) => !a.resolved).length;

  const menuItems: {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'animais',
      label: 'Animais',
      icon: <Beef className="w-5 h-5" />,
      badge: activeAnimalsCount,
      badgeColor: 'bg-emerald-800 text-emerald-200',
    },
    {
      id: 'lotes',
      label: 'Lotes',
      icon: <Layers className="w-5 h-5" />,
      badge: activeLotsCount,
      badgeColor: 'bg-amber-900/60 text-amber-200',
    },
    {
      id: 'pesagens',
      label: 'Pesagens & Balança',
      icon: <Scale className="w-5 h-5" />,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-mono text-[9px]',
    },
    {
      id: 'alimentacao',
      label: 'Alimentação & Trato',
      icon: <Wheat className="w-5 h-5" />,
    },
    {
      id: 'saude',
      label: 'Saúde Animal',
      icon: <Activity className="w-5 h-5" />,
      badge: pendingAlertsCount > 0 ? pendingAlertsCount : undefined,
      badgeColor: 'bg-rose-900/80 text-rose-200 animate-pulse',
    },
    {
      id: 'estoque',
      label: 'Estoque & Insumos',
      icon: <Boxes className="w-5 h-5" />,
      badge: lowInventoryCount > 0 ? `${lowInventoryCount} crit` : undefined,
      badgeColor: 'bg-amber-800/80 text-amber-200 text-[10px]',
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'vendas',
      label: 'Vendas & Abate',
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      id: 'relatorios',
      label: 'Relatórios & PDF',
      icon: <FileBarChart className="w-5 h-5" />,
    },
    {
      id: 'funcionarios',
      label: 'Funcionários',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-stone-900 border-r border-stone-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-30 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Mobile */}
        <div className="h-16 px-5 border-b border-stone-800 flex items-center justify-between lg:hidden bg-emerald-950">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">Menu do Sistema</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-stone-500">
            Módulos de Gestão
          </div>

          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-800/90 text-white shadow-md shadow-emerald-950/50'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-amber-400' : 'text-stone-400 group-hover:text-emerald-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.badgeColor || 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-300" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Farm Badge & System Version */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/80 border border-stone-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Fazenda Vale Forte</p>
              <p className="text-[10px] text-stone-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Confinamento v3.4 Pro
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
