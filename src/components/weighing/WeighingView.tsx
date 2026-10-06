import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  Scale,
  Plus,
  TrendingUp,
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Zap,
  Clock,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export const WeighingView: React.FC = () => {
  const {
    animals,
    lots,
    recordWeighing,
    setIsScaleModalOpen,
    setSelectedAnimalId,
    currentUser,
    config,
    showToast,
  } = useFarm();

  const [searchTerm, setSearchTerm] = useState('');
  const [lotFilter, setLotFilter] = useState('todos');
  const [selectedAnimalForManual, setSelectedAnimalForManual] = useState(animals[0]?.id || '');
  const [manualWeight, setManualWeight] = useState('');
  const [manualResponsible, setManualResponsible] = useState(currentUser?.name || 'Operador de Curral');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualNotes, setManualNotes] = useState('');

  // Collect all weighings across all animals sorted by date desc
  const allWeighings = animals.flatMap((animal) =>
    animal.weighings.map((w) => ({
      ...w,
      earringNumber: animal.earringNumber,
      breed: animal.breed,
      lotId: animal.lotId,
      rfidTag: animal.rfidTag,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredWeighings = allWeighings.filter((w) => {
    const matchesSearch =
      !searchTerm ||
      w.earringNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.rfidTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.responsible.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLot = lotFilter === 'todos' || w.lotId === lotFilter;
    return matchesSearch && matchesLot;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(manualWeight);
    if (!weightNum || weightNum <= 0) {
      showToast('Informe um peso válido!', 'warning');
      return;
    }
    const target = animals.find((a) => a.id === selectedAnimalForManual);
    if (!target) return;

    recordWeighing({
      animalId: target.id,
      weight: weightNum,
      responsible: manualResponsible,
      origin: 'Manual',
      notes: manualNotes || 'Pesagem manual registrada.',
    });

    setManualWeight('');
    setManualNotes('');
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header with Tru-Test Balança status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-emerald-800" />
            Pesagens & Balança Eletrônica
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Captura contínua de peso via balança digital, cálculo instantâneo de GMD e evolução corporal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScaleModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/20 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            Abrir Balança Eletrônica Tru-Test
          </button>
        </div>
      </div>

      {/* Quick Interactive Weighing Station Widget */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Interface Eletrônica Conectada: {config.scaleIntegration.brand}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Pesagem Rápida no Brete com RFID
          </h3>
          <p className="text-xs text-stone-300">
            A balança estabiliza o peso do bovino em menos de 3 segundos, lê o brinco RFID automaticamente e calcula o GMD em tempo real.
          </p>
        </div>

        {/* Quick manual entry form inline */}
        <form
          onSubmit={handleManualSubmit}
          className="bg-stone-900/90 border border-stone-700/80 p-4 rounded-2xl flex flex-wrap items-end gap-3 w-full md:w-auto"
        >
          <div>
            <label className="block text-[11px] font-bold text-stone-300 mb-1">
              Animal (Brinco):
            </label>
            <select
              value={selectedAnimalForManual}
              onChange={(e) => setSelectedAnimalForManual(e.target.value)}
              className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white max-w-[160px]"
            >
              {animals
                .filter((a) => a.status === 'Confinado')
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.earringNumber} ({a.currentWeight}kg)
                  </option>
                ))}
            </select>
          </div>

          <div className="w-28">
            <label className="block text-[11px] font-bold text-stone-300 mb-1">
              Peso (kg):
            </label>
            <input
              type="number"
              step="0.5"
              required
              placeholder="ex: 485"
              value={manualWeight}
              onChange={(e) => setManualWeight(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Lançar Peso
          </button>
        </form>
      </div>

      {/* Filter and Table of Weighings */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar brinco ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800"
              />
            </div>

            <select
              value={lotFilter}
              onChange={(e) => setLotFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800"
            >
              <option value="todos">Todos os Lotes</option>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-stone-500 font-mono">
            Total de {filteredWeighings.length} pesagens registradas
          </span>
        </div>

        {/* Weighing Log Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Brinco SISBOV</th>
                <th className="p-3">Lote</th>
                <th className="p-3">Peso Gravado</th>
                <th className="p-3">Ganho vs Anterior</th>
                <th className="p-3">GMD (kg/dia)</th>
                <th className="p-3">Dispositivo</th>
                <th className="p-3">Responsável</th>
                <th className="p-3">Obs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredWeighings.slice(0, 20).map((w) => (
                <tr
                  key={w.id}
                  onClick={() => setSelectedAnimalId(w.animalId)}
                  className="hover:bg-stone-50 cursor-pointer"
                >
                  <td className="p-3 font-medium text-stone-700">{w.date}</td>
                  <td className="p-3 font-bold font-mono text-stone-900 text-sm">
                    {w.earringNumber}
                  </td>
                  <td className="p-3 text-stone-600">
                    {lots.find((l) => l.id === w.lotId)?.name || 'Lote'}
                  </td>
                  <td className="p-3 font-mono font-extrabold text-stone-900 text-sm">
                    {w.weight} kg
                  </td>
                  <td className="p-3 font-mono">
                    {w.weightGain && w.weightGain > 0 ? (
                      <span className="text-emerald-700 font-bold">+{w.weightGain} kg</span>
                    ) : (
                      <span className="text-stone-400">-</span>
                    )}
                  </td>
                  <td className="p-3 font-mono">
                    {w.adg && w.adg > 0 ? (
                      <span className="text-amber-800 font-bold">{w.adg} kg/dia</span>
                    ) : (
                      <span className="text-stone-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      {w.origin}
                    </span>
                  </td>
                  <td className="p-3 text-stone-600">{w.responsible}</td>
                  <td className="p-3 text-stone-500 italic max-w-[150px] truncate">
                    {w.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
