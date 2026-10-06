import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Animal, WeighingRecord, HealthTreatment } from '../../types';
import {
  X,
  Scale,
  Activity,
  Wheat,
  Calendar,
  Layers,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileText,
  User,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BadgeAlert
} from 'lucide-react';

interface AnimalDetailModalProps {
  animalId: string | null;
  onClose: () => void;
}

export const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({ animalId, onClose }) => {
  const {
    animals,
    lots,
    feedingLogs,
    diets,
    setIsScaleModalOpen,
    recordWeighing,
    addHealthTreatment,
    currentUser,
    showToast,
  } = useFarm();

  const [activeTab, setActiveTab] = useState<'geral' | 'pesagens' | 'alimentacao' | 'saude'>('geral');
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [weightNotes, setWeightNotes] = useState('');

  if (!animalId) return null;

  const animal = animals.find((a) => a.id === animalId);
  if (!animal) return null;

  const lot = lots.find((l) => l.id === animal.lotId);

  // Calculate overall metrics
  const totalGain = animal.currentWeight - animal.entryWeight;
  const daysInFeedlot = Math.max(
    1,
    Math.round(
      (new Date().getTime() - new Date(animal.entryDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const overallAdg = +(totalGain / daysInFeedlot).toFixed(2);

  // Active treatments with withdrawal period
  const activeTreatments = animal.treatments.filter((t) => t.status === 'Em andamento');

  const handleSaveQuickWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(newWeight);
    if (!weightNum || weightNum <= 0) {
      showToast('Informe um peso válido!', 'warning');
      return;
    }
    recordWeighing({
      animalId: animal.id,
      weight: weightNum,
      responsible: currentUser?.name || 'Administrador',
      origin: 'Manual',
      notes: weightNotes || 'Pesagem manual registrada no perfil.',
    });
    setNewWeight('');
    setWeightNotes('');
    setShowAddWeight(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header with Earring and Quick Stats */}
        <div className="bg-emerald-950 text-white px-6 py-5 flex items-start justify-between border-b border-emerald-900">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900 border border-emerald-700/80 flex items-center justify-center text-3xl shadow-md">
              🐂
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl font-black font-mono tracking-tight text-white">
                  {animal.earringNumber}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    animal.status === 'Confinado'
                      ? 'bg-emerald-600 text-white'
                      : animal.status === 'Em tratamento'
                      ? 'bg-rose-600 text-white'
                      : animal.status === 'Vendido'
                      ? 'bg-sky-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {animal.status}
                </span>

                {animal.rfidTag && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    RFID: {animal.rfidTag}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 mt-1">
                {animal.breed} • {animal.sex} • Lote Atual: <strong className="text-white">{lot?.name || 'Sem Lote'}</strong> • Curral {lot?.corralNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-emerald-900/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2">
          {[
            { id: 'geral', label: 'Informações Gerais', icon: <User className="w-4 h-4" /> },
            { id: 'pesagens', label: `Histórico de Peso (${animal.weighings.length})`, icon: <Scale className="w-4 h-4" /> },
            { id: 'alimentacao', label: 'Nutrição & Dieta', icon: <Wheat className="w-4 h-4" /> },
            { id: 'saude', label: `Saúde & Sanitário (${animal.treatments.length})`, icon: <Activity className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-700 text-emerald-800 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Informações Gerais */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              {/* Highlight summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">Peso Atual</span>
                  <div className="text-2xl font-black text-stone-900 font-mono mt-0.5">
                    {animal.currentWeight} <span className="text-xs font-normal text-stone-500">kg</span>
                  </div>
                  <span className="text-[11px] text-stone-500">{(animal.currentWeight / 30).toFixed(1)} @ líquidas</span>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">Ganho Total</span>
                  <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                    +{totalGain} <span className="text-xs font-normal text-stone-500">kg</span>
                  </div>
                  <span className="text-[11px] text-stone-500">Entrada: {animal.entryWeight} kg</span>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">GMD Médio Ciclo</span>
                  <div className="text-2xl font-black text-amber-700 font-mono mt-0.5">
                    {overallAdg.toFixed(2)} <span className="text-xs font-normal text-stone-500">kg/dia</span>
                  </div>
                  <span className="text-[11px] text-stone-500">{daysInFeedlot} dias confinado</span>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">Meta do Lote</span>
                  <div className="text-2xl font-black text-stone-900 font-mono mt-0.5">
                    {lot?.targetWeight || 540} <span className="text-xs font-normal text-stone-500">kg</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    Faltam {Math.max(0, (lot?.targetWeight || 540) - animal.currentWeight)} kg
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Ficha Cadastral Zootécnica
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-xs">
                  <div>
                    <span className="text-stone-400 block">ID Interno / Brinco:</span>
                    <span className="font-bold text-stone-800">{animal.earringNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Brinco Eletrônico RFID:</span>
                    <span className="font-mono text-stone-800">{animal.rfidTag || 'Não instalado'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Raça / Composição:</span>
                    <span className="font-bold text-stone-800">{animal.breed}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Sexo:</span>
                    <span className="font-medium text-stone-800">{animal.sex}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Data de Nascimento Estimada:</span>
                    <span className="font-medium text-stone-800">{animal.birthDate}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Origem / Fazenda de Cria:</span>
                    <span className="font-medium text-stone-800">{animal.origin}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Data de Entrada no Confinamento:</span>
                    <span className="font-medium text-stone-800">{animal.entryDate}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Lote Vinculado:</span>
                    <span className="font-bold text-emerald-800">{lot?.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Curral de Confinamento:</span>
                    <span className="font-medium text-stone-800">{lot?.corralNumber}</span>
                  </div>
                </div>

                {animal.notes && (
                  <div className="mt-4 pt-3 border-t border-stone-200 text-xs">
                    <span className="text-stone-400 block mb-0.5">Observações Adicionais:</span>
                    <p className="text-stone-700 italic">{animal.notes}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setIsScaleModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Scale className="w-4 h-4 fill-current" />
                  Pesar na Balança Eletrônica
                </button>
                <button
                  onClick={() => setActiveTab('pesagens')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  Ver Histórico de Peso
                </button>
                <button
                  onClick={() => setActiveTab('saude')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Activity className="w-4 h-4 text-rose-700" />
                  Lançar Tratamento Clínico
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Histórico de Pesagens */}
          {activeTab === 'pesagens' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Evolução Ponderal Individual
                  </h4>
                  <p className="text-xs text-stone-500">
                    Histórico de pesagens automáticas via balança eletrônica e manuais
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddWeight(!showAddWeight)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Pesagem Manual
                  </button>
                  <button
                    onClick={() => setIsScaleModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Scale className="w-4 h-4" />
                    Balança Tru-Test
                  </button>
                </div>
              </div>

              {/* Add manual weight inline form */}
              {showAddWeight && (
                <form
                  onSubmit={handleSaveQuickWeight}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-end gap-3"
                >
                  <div className="w-full sm:w-36">
                    <label className="block text-xs font-bold text-emerald-950 mb-1">
                      Novo Peso (kg):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="ex: 504"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                      required
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-emerald-950 mb-1">
                      Observação:
                    </label>
                    <input
                      type="text"
                      placeholder="Motivo da pesagem..."
                      value={weightNotes}
                      onChange={(e) => setWeightNotes(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Salvar Pesagem
                  </button>
                </form>
              )}

              {/* Weighings Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Data</th>
                      <th className="p-3.5">Peso (kg)</th>
                      <th className="p-3.5">Ganho vs Anterior</th>
                      <th className="p-3.5">GMD (kg/dia)</th>
                      <th className="p-3.5">Origem</th>
                      <th className="p-3.5">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {animal.weighings.map((w, idx) => (
                      <tr key={w.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-medium text-stone-800">{w.date}</td>
                        <td className="p-3.5 font-bold font-mono text-stone-900 text-sm">
                          {w.weight} kg
                        </td>
                        <td className="p-3.5 font-mono">
                          {w.weightGain !== undefined && w.weightGain > 0 ? (
                            <span className="text-emerald-700 font-bold">+{w.weightGain} kg</span>
                          ) : (
                            <span className="text-stone-400">-</span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono">
                          {w.adg ? (
                            <span className="text-amber-700 font-bold">{w.adg} kg/dia</span>
                          ) : (
                            <span className="text-stone-400">-</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium text-[10px]">
                            {w.origin}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-600">{w.responsible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Nutrição & Dieta */}
          {activeTab === 'alimentacao' && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Dieta Atual Fornecida ao Animal
                    </span>
                    <h4 className="text-base font-extrabold text-stone-900 mt-0.5">
                      {lot?.dietName || 'Dieta Padrão'}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-200 text-amber-900 text-xs font-bold rounded-lg">
                    Consumo Estimado: {lot?.dailyIntakePerHeadKg || 12.5} kg/dia
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Últimos Tratos Registrados no Curral {lot?.corralNumber}
                </h4>
                <div className="border border-stone-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="p-3">Data & Horário</th>
                        <th className="p-3">Dieta</th>
                        <th className="p-3">Trato do Curral</th>
                        <th className="p-3">Leitura de Cocho</th>
                        <th className="p-3">Operador do Vagão</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {feedingLogs
                        .filter((f) => f.lotId === animal.lotId)
                        .slice(0, 5)
                        .map((f) => (
                          <tr key={f.id} className="hover:bg-stone-50">
                            <td className="p-3 font-medium text-stone-800">
                              {f.date} às {f.time}
                            </td>
                            <td className="p-3 text-stone-700">{f.dietName}</td>
                            <td className="p-3 font-mono font-bold text-stone-900">
                              {f.amountKg} kg
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Nota {f.troughScore ?? 1} (Ajustado)
                              </span>
                            </td>
                            <td className="p-3 text-stone-600">{f.responsible}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Saúde & Sanitário */}
          {activeTab === 'saude' && (
            <div className="space-y-6">
              {/* Active alerts / withdrawal period */}
              {activeTreatments.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Tratamento Clínico em Andamento / Período de Carência Ativo
                  </div>
                  <p className="text-xs text-rose-900">
                    Medicamento: {activeTreatments[0].medicine}. Carência para abate até{' '}
                    <strong>{activeTreatments[0].withdrawalEndDate}</strong> ({activeTreatments[0].withdrawalDays} dias de carência). Bloqueado para frigorífico.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Histórico Clínico e Vacinal
                  </h4>
                  <p className="text-xs text-stone-500">
                    Medicamentos aplicados, dosagem, período de carência e responsável
                  </p>
                </div>
              </div>

              {animal.treatments.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-600" />
                  <p className="text-sm font-bold text-stone-800">Nenhuma enfermidade registrada</p>
                  <p className="text-xs text-stone-500 mt-1">Animal em ótimo estado sanitário e sem carência ativa.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {animal.treatments.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900">{t.diagnosis}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            t.status === 'Em andamento'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-stone-400 block">Medicamento:</span>
                          <span className="font-bold text-stone-800">{t.medicine}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Dosagem / Via:</span>
                          <span className="font-medium text-stone-800">{t.dosage} ({t.route})</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Data Aplicação:</span>
                          <span className="font-medium text-stone-800">{t.date}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">Carência para Abate:</span>
                          <span className="font-bold text-rose-700">{t.withdrawalEndDate}</span>
                        </div>
                      </div>
                      {t.notes && (
                        <p className="text-xs text-stone-600 italic border-t border-stone-200 pt-2">
                          Obs: {t.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-mono">
            Registro SISBOV: {animal.earringNumber} • Fazenda Vale Forte
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
