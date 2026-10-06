import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Logo } from '../common/Logo';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  KeyRound,
  Check,
  HelpCircle,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import heroBg from '../../assets/images/feedlot_farm_hero_1791329214275.jpg';

export const LoginView: React.FC = () => {
  const { login, employees, showToast } = useFarm();
  const [email, setEmail] = useState('admin@valeforte.com.br');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Por favor, informe seu e-mail de acesso.', 'warning');
      return;
    }
    login(email, password);
  };

  const handleSelectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('123456');
    login(userEmail, '123456');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Instruções de redefinição enviadas para ${forgotEmail || email}!`, 'info');
    setIsForgotModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-stone-950 font-['Plus_Jakarta_Sans'] select-none">
      {/* Background Hero Image with dark agricultural gradient overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroBg}
          alt="Fazenda Vale Forte Confinamento"
          className="w-full h-full object-cover object-center scale-105 filter brightness-45 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-emerald-950/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-stone-950/80" />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-stone-900/90 backdrop-blur-xl border border-stone-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo variant="light" size="lg" showSubtitle={true} />
          <h2 className="mt-4 text-xl sm:text-2xl font-bold text-white tracking-tight">
            Painel Agropecuário & Confinamento
          </h2>
          <p className="text-xs text-stone-300 mt-1 italic">
            “Gestão que transforma gado em resultado.”
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              E-mail ou Usuário
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@valeforte.com.br"
                className="w-full bg-stone-950/80 border border-stone-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950/80 border border-stone-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-stone-950 border-stone-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Lembrar meu acesso neste dispositivo</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/80 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
          >
            <span>Entrar no Confinamento</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts Selection */}
        <div className="mt-6 pt-5 border-t border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              Acesso Rápido para Demonstração:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => handleSelectDemoUser(emp.email)}
                className="p-2 rounded-xl bg-stone-950/60 hover:bg-emerald-950/60 border border-stone-800 hover:border-emerald-700/80 transition-all text-left group"
              >
                <p className="text-xs font-bold text-stone-200 group-hover:text-emerald-300 truncate">
                  {emp.name.split(' ')[0]} {emp.name.split(' ')[1] || ''}
                </p>
                <p className="text-[10px] text-stone-400 truncate">{emp.role}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Security watermark */}
        <div className="mt-5 text-center text-[10px] text-stone-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ambiente Seguro • Fazenda Vale Forte Agropecuária Ltda.</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-sm w-full text-stone-100">
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Recuperar Senha</h3>
            </div>
            <p className="text-xs text-stone-300 mb-4">
              Informe seu e-mail cadastrado. Um link temporário de acesso será gerado para seu correio eletrônico.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="seu-email@valeforte.com.br"
                value={forgotEmail || email}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3 py-2 text-xs text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Enviar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
