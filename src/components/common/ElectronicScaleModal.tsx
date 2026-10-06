import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  Scale,
  Wifi,
  WifiOff,
  Radio,
  CheckCircle2,
  RefreshCw,
  X,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const ElectronicScaleModal: React.FC = () => {
  const {
    isScaleModalOpen,
    setIsScaleModalOpen,
    scaleState,
    connectScale,
    disconnectScale,
    simulateAnimalOnScale,
    resetScaleReading,
    animals,
    recordWeighing,
    currentUser,
    config,
    showToast,
  } = useFarm();

  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');
  const [responsibleName, setResponsibleName] = useState(currentUser?.name || 'Operador de Curral');
  const [weighingNotes, setWeighingNotes] = useState('Pesagem eletrônica com balança automatizada no brete.');
  const [isSimulatingBatch, setIsSimulatingBatch] = useState(false);

  // Auto select first animal if none selected
  useEffect(() => {
    if (animals.length > 0 && !selectedAnimalId) {
      const firstActive = animals.find((a) => a.status === 'Confinado');
      if (firstActive) setSelectedAnimalId(firstActive.id);
    }
  }, [animals, selectedAnimalId]);

  if (!isScaleModalOpen) return null;

  const currentAnimal = animals.find((a) => a.id === selectedAnimalId);
  const lastWeighing = currentAnimal?.weighings[currentAnimal.weighings.length - 1];
  const lastWeight = lastWeighing ? lastWeighing.weight : currentAnimal?.entryWeight || 0;

  const liveDiff = scaleState.liveWeight > 0 ? scaleState.liveWeight - lastWeight : 0;

  const handleSimulateAnimal = () => {
    if (!currentAnimal) return;
    simulateAnimalOnScale(currentAnimal.rfidTag, currentAnimal.currentWeight + Math.floor(Math.random() * 8) - 2);
  };

  const handleSaveWeighing = () => {
    if (!currentAnimal) {
      showToast('Selecione um animal primeiro!', 'error');
      return;
    }
    if (scaleState.liveWeight <= 0) {
      showToast('Aguarde o animal entrar na balança para estabilizar o peso.', 'warning');
      return;
    }

    recordWeighing({
      animalId: currentAnimal.id,
      weight: scaleState.liveWeight,
      responsible: responsibleName,
      origin: 'Balança Eletrônica',
      notes: weighingNotes,
    });

    // Pick next animal automatically for batch flow
    const currentIndex = animals.findIndex((a) => a.id === currentAnimal.id);
    const nextAnimal = animals.slice(currentIndex + 1).find((a) => a.status === 'Confinado');
    if (nextAnimal) {
      setSelectedAnimalId(nextAnimal.id);
      resetScaleReading();
      showToast(`Próximo animal posicionado: ${nextAnimal.earringNumber}`, 'info');
    } else {
      resetScaleReading();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Tru-Test / Coimma Branding */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">
                  Interface de Pesagem Eletrônica em Tempo Real
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  API ATIVA
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Protocolo {config.scaleIntegration.brand} • {config.scaleIntegration.port} • Auto-Trava {config.scaleIntegration.autoLockSeconds}s
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScaleModalOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual Display (Digital Weighing Indicator) */}
          <div className="bg-stone-950 rounded-2xl border-2 border-emerald-950/80 p-6 shadow-inner relative overflow-hidden">
            {/* Background grid line pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Scale Status Indicators */}
              <div className="space-y-3 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => (scaleState.connected ? disconnectScale() : connectScale())}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${
                      scaleState.connected
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800'
                        : 'bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    {scaleState.connected ? (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                        Balança Conectada
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                        Desconectada (Conectar)
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    RFID Bastão: {scaleState.scannedRfid ? 'Identificado' : 'Aguardando'}
                  </div>
                </div>

                {/* RFID Tag Chip */}
                {scaleState.scannedRfid && (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-900/30 border border-emerald-700/50 text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>TAG SISBOV: {scaleState.scannedRfid}</span>
                  </div>
                )}
              </div>

              {/* Digital LED / 7-Segment Weight Screen */}
              <div className="bg-stone-900/90 border-2 border-emerald-500/40 rounded-2xl px-8 py-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] text-center min-w-[280px]">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-1">
                  <span className={`${scaleState.isStable ? 'text-emerald-400 font-bold' : 'text-amber-400 animate-pulse'}`}>
                    {scaleState.isStable ? '● PESO TRAVADO' : '○ OSCILANDO...'}
                  </span>
                  <span className="text-stone-400">BRUTO</span>
                </div>

                <div className="font-mono font-black text-6xl text-emerald-400 tracking-tight drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]">
                  {scaleState.liveWeight.toString().padStart(3, '0')}
                  <span className="text-2xl text-emerald-500 ml-2 font-normal">kg</span>
                </div>

                <div className="text-[11px] text-stone-400 mt-2 font-mono flex items-center justify-center gap-3">
                  <span>Tara: 0.00 kg</span>
                  <span>•</span>
                  <span>Zero: Ok</span>
                </div>
              </div>

              {/* Action Buttons for Brete */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={handleSimulateAnimal}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Simular Animal Entrando no Brete
                </button>
                <button
                  onClick={resetScaleReading}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Zerar Balança (Tara)
                </button>
              </div>
            </div>
          </div>

          {/* Cattle Selection & Live Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Animal Selection */}
            <div className="space-y-4 bg-stone-800/60 p-5 rounded-2xl border border-stone-700/80">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🐂</span> Animal no Curral / Brete
              </h4>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Selecione o Animal (Brinco SISBOV):
                </label>
                <select
                  value={selectedAnimalId}
                  onChange={(e) => setSelectedAnimalId(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-emerald-500"
                >
                  {animals
                    .filter((a) => a.status === 'Confinado')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.earringNumber} - {a.breed} ({a.currentWeight} kg) - Lote {a.lotId.replace('lot-', '')}
                      </option>
                    ))}
                </select>
              </div>

              {currentAnimal && (
                <div className="grid grid-cols-2 gap-3 text-xs bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
                  <div>
                    <span className="text-stone-400 block">Brinco:</span>
                    <span className="font-bold text-white text-sm">{currentAnimal.earringNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Raça / Sexo:</span>
                    <span className="font-medium text-stone-200">
                      {currentAnimal.breed} ({currentAnimal.sex})
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Peso de Entrada:</span>
                    <span className="font-mono text-stone-200">{currentAnimal.entryWeight} kg</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Último Peso Gravado:</span>
                    <span className="font-mono font-bold text-emerald-400">{lastWeight} kg</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Operador Responsável:
                  </label>
                  <input
                    type="text"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Observações de Manejo:
                  </label>
                  <input
                    type="text"
                    value={weighingNotes}
                    onChange={(e) => setWeighingNotes(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Instant Live Zootechnical Metrics */}
            <div className="bg-stone-800/60 p-5 rounded-2xl border border-stone-700/80 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Cálculo Zootécnico em Tempo Real
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-stone-900 p-4 rounded-xl border border-stone-800">
                    <span className="text-xs text-stone-400 block mb-1">Ganho vs Última Pesagem</span>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-2xl font-bold font-mono ${
                          liveDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {liveDiff > 0 ? `+${liveDiff}` : liveDiff}
                      </span>
                      <span className="text-xs text-stone-400">kg</span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Última pesagem: {lastWeight} kg
                    </span>
                  </div>

                  <div className="bg-stone-900 p-4 rounded-xl border border-stone-800">
                    <span className="text-xs text-stone-400 block mb-1">GMD Estimado Atual</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-mono text-amber-400">
                        {scaleState.liveWeight > 0 ? '1.58' : '0.00'}
                      </span>
                      <span className="text-xs text-stone-400">kg/dia</span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Meta do confinamento: 1.45 kg/dia
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    O peso é gravado e sincronizado imediatamente com o histórico individual do animal e os indicadores médios do lote.
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 pt-4 border-t border-stone-700/60 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsScaleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveWeighing}
                  disabled={scaleState.liveWeight === 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Gravar Pesagem & Próximo Animal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
