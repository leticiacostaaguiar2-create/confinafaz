import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Search,
  Bell,
  Scale,
  Wifi,
  WifiOff,
  LogOut,
  ChevronDown,
  Menu,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenSearch }) => {
  const {
    currentUser,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentTab,
    isOnline,
    toggleSimulatedOffline,
    pendingSyncCount,
    syncOfflineQueue,
    setIsScaleModalOpen,
    scaleState,
  } = useFarm();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-emerald-950 border-b border-emerald-900/80 text-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-md">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-emerald-100 hover:bg-emerald-900 focus:outline-none"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Logo variant="light" size="sm" showSubtitle={true} />
      </div>

      {/* Center: Search Trigger (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-800/60 text-stone-300 text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Buscar animal, brinco, lote, produto...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Quick actions, Connectivity, Notifications & User */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl text-emerald-200 hover:bg-emerald-900/80"
          title="Pesquisa Global"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Offline / Online Mode Pill */}
        <div className="flex items-center">
          <button
            onClick={toggleSimulatedOffline}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isOnline
                ? 'bg-emerald-900/40 border-emerald-700/60 text-emerald-200 hover:bg-emerald-900'
                : 'bg-amber-950/80 border-amber-600 text-amber-200 animate-pulse'
            }`}
            title={isOnline ? 'Online (Clique para simular modo campo offline)' : 'Modo Campo Ativo (Offline). Clique para reconectar.'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Modo Campo</span>
                {pendingSyncCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px]">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            )}
          </button>

          {!isOnline && pendingSyncCount > 0 && (
            <button
              onClick={syncOfflineQueue}
              className="ml-1 p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs"
              title="Sincronizar dados gravados localmente"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Electronic Scale Quick Trigger */}
        <button
          onClick={() => setIsScaleModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors shadow-sm"
          title="Abrir Balança Eletrônica"
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Balança Tru-Test</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </button>

        {/* PWA In-App Install Button */}
        <PWAInstallButton variant="nav" />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-emerald-200 hover:bg-emerald-900/80 transition-colors"
            title="Notificações e Alertas"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">Alertas & Notificações</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  Marcar todas
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-800">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400">
                    Nenhuma notificação recente.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationAsRead(item.id);
                        if (item.linkTab) setCurrentTab(item.linkTab as any);
                        setShowNotifications(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-stone-800/80 transition-colors flex items-start gap-3 ${
                        !item.read ? 'bg-emerald-950/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'alerta' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        ) : item.type === 'aviso' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : item.type === 'sucesso' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Info className="w-4 h-4 text-sky-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-stone-200 truncate">{item.title}</p>
                          <span className="text-[10px] text-stone-500">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{item.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-emerald-900/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center font-bold text-xs text-amber-300 overflow-hidden">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser?.name.substring(0, 2).toUpperCase() || 'VF'}</span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white max-w-[120px] truncate">
                {currentUser?.name || 'Administrador'}
              </span>
              <span className="text-[10px] text-emerald-300 font-medium">
                {currentUser?.role || 'Acesso Total'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-300 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-stone-800">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-stone-400 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-medium">
                  Nível: {currentUser?.accessLevel}
                </span>
              </div>
              <button
                onClick={() => {
                  setCurrentTab('configuracoes');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-stone-300 hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                Configurações da Conta
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair do Sistema
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
