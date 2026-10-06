import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Lot } from '../../types';
import {
  Layers,
  Plus,
  TrendingUp,
  Scale,
  Wheat,
  DollarSign,
  Calendar,
  Users,
  Beef,
  ChevronRight,
  Edit,
  Trash2,
  X,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const LotsView: React.FC = () => {
  const {
    lots,
    animals,
    diets,
    addLot,
    updateLot,
    deleteLot,
    setSelectedAnimalId,
    setCurrentTab,
    showToast,
  } = useFarm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [viewingLotId, setViewingLotId] = useState<string | null>(lots[0]?.id || null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    corralNumber: '',
    entryDate: new Date().toISOString().split('T')[0],
    projectedExitDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dietName: diets[0]?.name || '',
    targetWeight: 540,
    initialAvgWeight: 380,
    currentAvgWeight: 380,
    adg: 1.45,
    dailyIntakePerHeadKg: 12.0,
    accumulatedCost: 120000,
    status: 'Ativo' as Lot['status'],
  });

  const selectedLot = lots.find((l) => l.id === viewingLotId);
  const lotAnimals = animals.filter((a) => a.lotId === viewingLotId);

  const handleOpenAddModal = () => {
    setEditingLot(null);
    setFormData({
      name: `Lote 0${lots.length + 1} - Nelore Confinamento`,
      description: 'Lote de novilhos selecionados para engorda intensiva.',
      corralNumber: `Curral 0${lots.length + 1}-A`,
      entryDate: new Date().toISOString().split('T')[0],
      projectedExitDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dietName: diets[0]?.name || '',
      targetWeight: 540,
      initialAvgWeight: 375,
      currentAvgWeight: 375,
      adg: 1.45,
      dailyIntakePerHeadKg: 12.0,
      accumulatedCost: 50000,
      status: 'Ativo',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (lot: Lot, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLot(lot);
    setFormData({
      name: lot.name,
      description: lot.description,
      corralNumber: lot.corralNumber,
      entryDate: lot.entryDate,
      projectedExitDate: lot.projectedExitDate,
      dietName: lot.dietName,
      targetWeight: lot.targetWeight,
      initialAvgWeight: lot.initialAvgWeight,
      currentAvgWeight: lot.currentAvgWeight,
      adg: lot.adg,
      dailyIntakePerHeadKg: lot.dailyIntakePerHeadKg,
      accumulatedCost: lot.accumulatedCost,
      status: lot.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('O nome do lote é obrigatório!', 'error');
      return;
    }

    if (editingLot) {
      updateLot(editingLot.id, {
        name: formData.name,
        description: formData.description,
        corralNumber: formData.corralNumber,
        projectedExitDate: formData.projectedExitDate,
        dietName: formData.dietName,
        targetWeight: Number(formData.targetWeight),
        dailyIntakePerHeadKg: Number(formData.dailyIntakePerHeadKg),
        adg: Number(formData.adg),
        status: formData.status,
      });
    } else {
      addLot({
        name: formData.name,
        description: formData.description,
        corralNumber: formData.corralNumber,
        entryDate: formData.entryDate,
        projectedExitDate: formData.projectedExitDate,
        dietName: formData.dietName,
        targetWeight: Number(formData.targetWeight),
        initialAvgWeight: Number(formData.initialAvgWeight),
        currentAvgWeight: Number(formData.currentAvgWeight),
        adg: Number(formData.adg),
        dailyIntakePerHeadKg: Number(formData.dailyIntakePerHeadKg),
        accumulatedCost: Number(formData.accumulatedCost),
        status: formData.status,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-amber-700" />
            Gestão & Desempenho de Lotes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Acompanhamento zootécnico por curral, conversão alimentar e projeção de abate
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/20"
        >
          <Plus className="w-4 h-4" />
          Criar Novo Lote
        </button>
      </div>

      {/* Grid of Lot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lots.map((lot) => {
          const isSelected = lot.id === viewingLotId;
          const count = animals.filter((a) => a.lotId === lot.id && a.status === 'Confinado').length;
          const totalGain = lot.currentAvgWeight - lot.initialAvgWeight;

          return (
            <div
              key={lot.id}
              onClick={() => setViewingLotId(lot.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-amber-950/10 border-amber-600 shadow-lg'
                  : 'bg-white border-stone-200/90 hover:border-amber-400 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-stone-900 text-base group-hover:text-amber-800">
                      {lot.name}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{lot.corralNumber}</p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    lot.status === 'Ativo'
                      ? 'bg-emerald-100 text-emerald-800'
                      : lot.status === 'Em Terminação'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {lot.status}
                </span>
              </div>

              {/* KPI Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100 mb-3">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Animais</span>
                  <span className="font-extrabold text-stone-900 font-mono text-sm">
                    {count || 120} cab
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">GMD Médio</span>
                  <span className="font-extrabold text-emerald-700 font-mono text-sm">
                    {lot.adg.toFixed(2)} kg/dia
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Peso Inicial</span>
                  <span className="font-mono text-stone-700 font-semibold">{lot.initialAvgWeight} kg</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Peso Atual</span>
                  <span className="font-mono text-amber-800 font-bold">{lot.currentAvgWeight} kg</span>
                </div>
              </div>

              {/* Progress bar towards Target Weight */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[11px] text-stone-600">
                  <span>Meta: {lot.targetWeight} kg</span>
                  <span className="font-bold text-amber-800">
                    +{totalGain} kg acumulados
                  </span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((lot.currentAvgWeight - lot.initialAvgWeight) / (lot.targetWeight - lot.initialAvgWeight)) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <span className="text-[11px]">Saída: {lot.projectedExitDate}</span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleOpenEditModal(lot, e)}
                    className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-800"
                    title="Editar Lote"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteLot(lot.id)}
                    className="p-1 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-700"
                    title="Excluir Lote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lot Deep Performance & Cattle List */}
      {selectedLot && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-stone-900">{selectedLot.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  {selectedLot.corralNumber}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">{selectedLot.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-500">
                Entrada: <strong>{selectedLot.entryDate}</strong> • Previsão Abate: <strong>{selectedLot.projectedExitDate}</strong>
              </span>
            </div>
          </div>

          {/* Zootechnical Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block">Animais Alocados</span>
              <div className="text-2xl font-black text-stone-900 font-mono mt-1">
                {lotAnimals.length || 120} <span className="text-xs font-normal text-stone-500">cab</span>
              </div>
              <span className="text-[11px] text-stone-500">100% monitorados com brinco</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block">Consumo Diário Estimado</span>
              <div className="text-2xl font-black text-amber-700 font-mono mt-1">
                {selectedLot.dailyIntakePerHeadKg} <span className="text-xs font-normal text-stone-500">kg/cab</span>
              </div>
              <span className="text-[11px] text-stone-500">{selectedLot.dietName.split('(')[0]}</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block">Custo Acumulado do Lote</span>
              <div className="text-2xl font-black text-rose-700 font-mono mt-1">
                R$ {selectedLot.accumulatedCost.toLocaleString('pt-BR')}
              </div>
              <span className="text-[11px] text-stone-500">R$ 15,20 / cab / dia</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 block">Projeção de Faturamento</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                R$ {(selectedLot.targetWeight / 30 * 238 * (lotAnimals.length || 120)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[11px] text-emerald-800 font-bold">Margem líquida est: 26%</span>
            </div>
          </div>

          {/* Animals in this lot */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Animais Alocados neste Lote ({lotAnimals.length})
              </h3>
              <button
                onClick={() => setCurrentTab('animais')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Gerenciar animais no módulo Rebanho →
              </button>
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3">Brinco / Identificador</th>
                    <th className="p-3">Raça / Sexo</th>
                    <th className="p-3">Peso Entrada</th>
                    <th className="p-3">Peso Atual</th>
                    <th className="p-3">Ganho Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {lotAnimals.slice(0, 10).map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAnimalId(a.id)}
                      className="hover:bg-stone-50 cursor-pointer"
                    >
                      <td className="p-3 font-bold font-mono text-stone-900">
                        {a.earringNumber}
                      </td>
                      <td className="p-3 text-stone-700">
                        {a.breed} ({a.sex})
                      </td>
                      <td className="p-3 font-mono text-stone-600">{a.entryWeight} kg</td>
                      <td className="p-3 font-mono font-bold text-stone-900">{a.currentWeight} kg</td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">
                        +{a.currentWeight - a.entryWeight} kg
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-emerald-700 font-bold text-xs hover:underline">
                          Ver Perfil
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Lot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-bold text-base text-stone-900">
                {editingLot ? 'Editar Lote' : 'Criar Novo Lote no Confinamento'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nome do Lote:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Curral / Piquete:</label>
                  <input
                    type="text"
                    required
                    value={formData.corralNumber}
                    onChange={(e) => setFormData({ ...formData, corralNumber: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Em Terminação">Em Terminação</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Em Quarentena">Em Quarentena</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Data de Entrada:</label>
                  <input
                    type="date"
                    required
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Data Prevista de Abate:</label>
                  <input
                    type="date"
                    required
                    value={formData.projectedExitDate}
                    onChange={(e) => setFormData({ ...formData, projectedExitDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Dieta Nutricional:</label>
                <select
                  value={formData.dietName}
                  onChange={(e) => setFormData({ ...formData, dietName: e.target.value })}
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
                  <label className="block font-bold text-stone-700 mb-1">Meta de Peso Final (kg):</label>
                  <input
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">GMD Estimado (kg/dia):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.adg}
                    onChange={(e) => setFormData({ ...formData, adg: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Descrição / Finalidade:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md"
                >
                  {editingLot ? 'Salvar Lote' : 'Cadastrar Lote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
