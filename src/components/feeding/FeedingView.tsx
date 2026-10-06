import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Diet, FeedingLog } from '../../types';
import {
  Wheat,
  Plus,
  TrendingUp,
  Clock,
  DollarSign,
  Scale,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText,
  Utensils
} from 'lucide-react';

export const FeedingView: React.FC = () => {
  const {
    lots,
    diets,
    feedingLogs,
    addFeedingLog,
    currentUser,
    showToast,
  } = useFarm();

  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState(lots[0]?.id || '');
  const [selectedDietName, setSelectedDietName] = useState(diets[0]?.name || '');
  const [feedAmountKg, setFeedAmountKg] = useState('2450');
  const [feedTime, setFeedTime] = useState('08:00');
  const [troughScore, setTroughScore] = useState<number>(1);
  const [responsible, setResponsible] = useState(currentUser?.name || 'Operador do Vagão');

  const handleSaveFeeding = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(feedAmountKg);
    if (!qty || qty <= 0) {
      showToast('Informe a quantidade fornecida em kg!', 'warning');
      return;
    }

    addFeedingLog({
      lotId: selectedLotId,
      date: new Date().toISOString().split('T')[0],
      dietName: selectedDietName,
      amountKg: qty,
      time: feedTime,
      troughScore,
      responsible,
    });

    setIsAddLogOpen(false);
  };

  // Aggregated calculations
  const totalDailyFedKg = feedingLogs
    .filter((f) => f.date === new Date().toISOString().split('T')[0])
    .reduce((acc, f) => acc + f.amountKg, 0) || 9850;

  const totalCostEstimate = Math.round(totalDailyFedKg * 1.12); // ~R$ 1.12/kg

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Wheat className="w-7 h-7 text-amber-600" />
            Nutrição & Manejo de Alimentação
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Controle de vagão misturador, dietas de precisão, leitura de cocho e custo por kg de ganho
          </p>
        </div>

        <button
          onClick={() => setIsAddLogOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
        >
          <Plus className="w-4 h-4" />
          Registrar Trato Diário
        </button>
      </div>

      {/* 4 Nutrition Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Fornecido Hoje
          </span>
          <div className="text-2xl font-extrabold text-stone-900 font-mono mt-2">
            {totalDailyFedKg.toLocaleString('pt-BR')} <span className="text-xs font-normal text-stone-500">kg</span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block">Vagão misturador Siloking</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Consumo Médio por Cabeça
          </span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono mt-2">
            12,6 <span className="text-xs font-normal text-stone-500">kg / cab / dia</span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block">2,4% do peso vivo em MS</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Custo Diário da Dieta
          </span>
          <div className="text-2xl font-extrabold text-stone-900 font-mono mt-2">
            R$ {totalCostEstimate.toLocaleString('pt-BR')}
          </div>
          <span className="text-xs text-stone-500 mt-1 block">R$ 14,10 / cab / dia</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Conversão Alimentar (CA)
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-2">
            6,8 <span className="text-xs font-normal text-stone-500">kg MS / kg Ganho</span>
          </div>
          <span className="text-xs text-emerald-800 font-semibold mt-1 block">Excelente eficiência biológica</span>
        </div>
      </div>

      {/* Formulated Diets Catalog */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-700" />
          Fórmulas de Dietas Ativas no Confinamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {diets.map((diet) => (
            <div
              key={diet.id}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {diet.phase}
                </span>
                <span className="font-mono text-xs font-bold text-stone-700">
                  R$ {diet.costPerTon.toFixed(2)}/ton
                </span>
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-1">{diet.name}</h4>
              <p className="text-[11px] text-stone-500 mb-3">
                Teor de Matéria Seca (MS): <strong>{diet.dryMatterPercent}%</strong>
              </p>

              <div className="space-y-1.5 border-t border-stone-200 pt-2.5">
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  Ingredientes da Mistura:
                </span>
                {diet.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between text-xs text-stone-700">
                    <span>{ing.name}</span>
                    <span className="font-mono font-bold text-stone-900">{ing.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Distribution Log Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Histórico de Fornecimento de Trato por Curral
          </h3>
          <span className="text-xs text-stone-500">Últimos lançamentos</span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3.5">Data & Hora</th>
                <th className="p-3.5">Lote / Curral</th>
                <th className="p-3.5">Dieta Nutricional</th>
                <th className="p-3.5">Quantidade Fornecida</th>
                <th className="p-3.5">Leitura de Cocho</th>
                <th className="p-3.5">Operador do Vagão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {feedingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="p-3.5 font-medium text-stone-800">
                    {log.date} às {log.time}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900">
                    {lots.find((l) => l.id === log.lotId)?.name || 'Lote'}
                  </td>
                  <td className="p-3.5 text-stone-600">{log.dietName}</td>
                  <td className="p-3.5 font-mono font-black text-stone-900 text-sm">
                    {log.amountKg.toLocaleString('pt-BR')} kg
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        log.troughScore === 0
                          ? 'bg-amber-100 text-amber-800'
                          : log.troughScore === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      Nota {log.troughScore ?? 1} (
                      {log.troughScore === 0
                        ? 'Cocho Lambido'
                        : log.troughScore === 1
                        ? 'Pouca Sobra Ideal'
                        : 'Sobra Normal'}
                      )
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-600">{log.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Feed Modal */}
      {isAddLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Registrar Trato no Vagão Misturador
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Lançamento diário de alimentação por lote com nota de leitura de cocho
            </p>

            <form onSubmit={handleSaveFeeding} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Lote de Destino:</label>
                <select
                  value={selectedLotId}
                  onChange={(e) => setSelectedLotId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  {lots.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.corralNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Dieta Fornecida:</label>
                <select
                  value={selectedDietName}
                  onChange={(e) => setSelectedDietName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  {diets.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quantidade (kg):</label>
                  <input
                    type="number"
                    required
                    value={feedAmountKg}
                    onChange={(e) => setFeedAmountKg(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Horário do Trato:</label>
                  <input
                    type="time"
                    required
                    value={feedTime}
                    onChange={(e) => setFeedTime(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Leitura de Cocho (Sobra pré-trato):
                </label>
                <select
                  value={troughScore}
                  onChange={(e) => setTroughScore(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value={0}>Nota 0 - Cocho lambido (Aumentar 5% no próximo trato)</option>
                  <option value={1}>Nota 1 - Sobra limpa fininha (Ideal / Manter trato)</option>
                  <option value={2}>Nota 2 - Sobra moderada (Reduzir 5% no próximo trato)</option>
                  <option value={3}>Nota 3 - Sobra excessiva (Revisar sanidade do lote)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Operador Responsável:</label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddLogOpen(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md"
                >
                  Confirmar Trato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
