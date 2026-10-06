import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { HealthTreatment, AtypicalAlert } from '../../types';
import {
  Activity,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Calendar,
  Layers,
  Search,
  Check,
  X,
  Stethoscope,
  Pill,
  Syringe,
  AlertCircle
} from 'lucide-react';

export const HealthView: React.FC = () => {
  const {
    animals,
    lots,
    healthTreatments,
    addHealthTreatment,
    completeHealthTreatment,
    atypicalAlerts,
    resolveAtypicalAlert,
    setSelectedAnimalId,
    currentUser,
    showToast,
  } = useFarm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetAnimalId, setTargetAnimalId] = useState(animals[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicine, setMedicine] = useState('Draxxin (Tulitromicina 100mg/mL)');
  const [dosage, setDosage] = useState('10 mL subcutânea');
  const [route, setRoute] = useState<'Subcutânea' | 'Intramuscular' | 'Oral' | 'Tópica'>('Subcutânea');
  const [withdrawalDays, setWithdrawalDays] = useState(18);
  const [notes, setNotes] = useState('');

  const activeTreatments = healthTreatments.filter((t) => t.status === 'Em andamento');
  const finishedTreatments = healthTreatments.filter((t) => t.status === 'Concluído');
  const unresolvedAlerts = atypicalAlerts.filter((a) => !a.resolved);

  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === targetAnimalId);
    if (!animal) return;

    const endDate = new Date(Date.now() + withdrawalDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    addHealthTreatment({
      animalId: animal.id,
      earringNumber: animal.earringNumber,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      medicine,
      dosage,
      route,
      withdrawalDays: Number(withdrawalDays),
      withdrawalEndDate: endDate,
      responsible: currentUser?.name || 'Médico Veterinário',
      status: 'Em andamento',
      notes,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-rose-700" />
            Saúde Animal & Protocolo Sanitário
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Acompanhamento clínico, controle de carência para frigorífico e monitoramento de alertas atípicos
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/20"
        >
          <Plus className="w-4 h-4" />
          Novo Atendimento Clínico
        </button>
      </div>

      {/* Atypical Behavior Alerts from Sensors */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">
              Alertas de Comportamento Atípico (Sensores de Cocho & Balança)
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {unresolvedAlerts.length} pendentes
          </span>
        </div>

        {unresolvedAlerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-stone-200">
            Nenhum comportamento atípico detectado nas últimas 24 horas.
          </div>
        ) : (
          <div className="space-y-3">
            {unresolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border border-amber-300 bg-amber-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ⚠️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-900">
                        {alert.earringNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        {alert.type}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">{alert.date}</span>
                    </div>
                    <p className="text-xs text-stone-700 mt-1">{alert.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedAnimalId(alert.animalId)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold"
                  >
                    Ver Animal
                  </button>
                  <button
                    onClick={() => resolveAtypicalAlert(alert.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Resolver Alerta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Treatments in Sick Bay / Quarantine */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-stone-900">
              Animais em Tratamento Clínico & Período de Carência
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {activeTreatments.length} em acompanhamento
          </span>
        </div>

        {activeTreatments.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-stone-200">
            Nenhum animal em tratamento ativo. Rebanho 100% liberado!
          </div>
        ) : (
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3.5">Animal / Brinco</th>
                  <th className="p-3.5">Diagnóstico Clínico</th>
                  <th className="p-3.5">Medicamento & Dose</th>
                  <th className="p-3.5">Data Aplicação</th>
                  <th className="p-3.5">Fim da Carência Abate</th>
                  <th className="p-3.5">Responsável</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {activeTreatments.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50">
                    <td className="p-3.5 font-bold font-mono text-stone-900 text-sm">
                      {t.earringNumber}
                    </td>
                    <td className="p-3.5 font-semibold text-rose-900">{t.diagnosis}</td>
                    <td className="p-3.5 text-stone-700">
                      {t.medicine} ({t.dosage})
                    </td>
                    <td className="p-3.5 text-stone-600">{t.date}</td>
                    <td className="p-3.5 font-bold font-mono text-rose-700">
                      {t.withdrawalEndDate}{' '}
                      <span className="text-[10px] text-stone-500 font-normal">
                        ({t.withdrawalDays} dias)
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-600">{t.responsible}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => completeHealthTreatment(t.id)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs"
                      >
                        Concluir / Alta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Finished Treatments Log */}
      {finishedTreatments.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-stone-900">
            Histórico de Tratamentos Concluídos
          </h3>
          <div className="divide-y divide-stone-200 text-xs">
            {finishedTreatments.map((t) => (
              <div key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-stone-900 mr-2">{t.earringNumber}</span>
                  <span className="text-stone-700 mr-2">{t.diagnosis}</span>
                  <span className="text-stone-500">({t.medicine})</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Liberado
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Treatment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Registrar Atendimento Veterinário
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Lançamento clínico e bloqueio preventivo de carência para abate
            </p>

            <form onSubmit={handleSaveTreatment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Animal Paciente:</label>
                <select
                  value={targetAnimalId}
                  onChange={(e) => setTargetAnimalId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.earringNumber} - {a.breed} ({a.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Diagnóstico Clínico:</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Doença Respiratória Bovina (Pneumonia)"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Medicamento:</label>
                  <input
                    type="text"
                    required
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dosagem:</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Via de Aplicação:</label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Subcutânea">Subcutânea</option>
                    <option value="Intramuscular">Intramuscular</option>
                    <option value="Oral">Oral</option>
                    <option value="Tópica">Tópica</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dias de Carência:</label>
                  <input
                    type="number"
                    required
                    value={withdrawalDays}
                    onChange={(e) => setWithdrawalDays(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Observações do Veterinário:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Evolução, isolamento no curral enfermaria..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl font-bold shadow-md"
                >
                  Confirmar Tratamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
