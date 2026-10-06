import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Settings,
  Scale,
  Building,
  Wifi,
  Bell,
  RotateCcw,
  CheckCircle2,
  Save,
  HelpCircle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    config,
    updateConfig,
    resetToInitialData,
    showToast,
  } = useFarm();

  const [formData, setFormData] = useState({ ...config });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-stone-700" />
            Configurações Gerais da Fazenda
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Identidade cadastral, protocolos de balança digital e preferências de sistema
          </p>
        </div>

        <button
          onClick={resetToInitialData}
          className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-stone-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar Dados de Demonstração
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Farm Identity Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-800" />
            Identidade da Propriedade & Dados Fiscais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Razão Social:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Nome Curto da Marca:</label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-bold font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Slogan Oficial:</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs italic"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">CNPJ:</label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Inscrição Estadual (IE):</label>
              <input
                type="text"
                value={formData.stateRegistration}
                onChange={(e) => setFormData({ ...formData, stateRegistration: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Endereço da Fazenda:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Cidade / UF:</label>
              <input
                type="text"
                value={`${formData.city} - ${formData.state}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  setFormData({
                    ...formData,
                    city: parts[0]?.trim() || '',
                    state: parts[1]?.trim() || '',
                  });
                }}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Responsável Técnico (CRMV):</label>
              <input
                type="text"
                value={formData.responsibleVet}
                onChange={(e) => setFormData({ ...formData, responsibleVet: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Electronic Scale Setup Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600" />
            Parâmetros da Balança Eletrônica & RFID
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Fabricante da Balança:</label>
              <select
                value={formData.scaleIntegration.brand}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scaleIntegration: {
                      ...formData.scaleIntegration,
                      brand: e.target.value as any,
                    },
                  })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
              >
                <option value="Tru-Test">Tru-Test (XR5000 / S3)</option>
                <option value="Coimma">Coimma (KM3-N / Megatron)</option>
                <option value="Toledo">Toledo Pecuária MGR-3000</option>
                <option value="Genérica">Genérica RS232 / Bluetooth</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Porta / Comunicação:</label>
              <input
                type="text"
                value={formData.scaleIntegration.port}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scaleIntegration: {
                      ...formData.scaleIntegration,
                      port: e.target.value,
                    },
                  })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Tempo de Auto-Trava do Peso:
              </label>
              <input
                type="number"
                value={formData.scaleIntegration.autoLockSeconds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scaleIntegration: {
                      ...formData.scaleIntegration,
                      autoLockSeconds: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Offline & System Defaults */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-emerald-800" />
            Operação no Campo & Unidades
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Unidade Padrão de Peso:</label>
              <select
                value={formData.weightUnit}
                onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
              >
                <option value="kg">Quilogramas (kg)</option>
                <option value="arroba">Arroba (@ carcaça - 15kg)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="offlineEnable"
                checked={formData.enableOfflineMode}
                onChange={(e) => setFormData({ ...formData, enableOfflineMode: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
              />
              <label htmlFor="offlineEnable" className="text-xs font-semibold text-stone-800">
                Habilitar cache offline para currais sem sinal 4G/Wi-Fi
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-stone-900">Aplicativo Instalável (PWA)</p>
              <p className="text-[11px] text-stone-500">
                Instale no smartphone ou computador para acesso instantâneo na rotina do curral.
              </p>
            </div>
            <PWAInstallButton variant="settings" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações da Fazenda
          </button>
        </div>
      </form>
    </div>
  );
};
