import React, { useState, useEffect, useRef } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  Search,
  X,
  Compass,
  ArrowRight,
  Boxes,
  Users,
  Activity,
  Layers,
  Scale
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    animals,
    lots,
    inventory,
    employees,
    sales,
    setCurrentTab,
    setSelectedAnimalId,
    setSelectedLotId,
  } = useFarm();

  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const term = searchTerm.trim().toLowerCase();

  const matchedAnimals = term
    ? animals
        .filter(
          (a) =>
            a.earringNumber.toLowerCase().includes(term) ||
            a.rfidTag?.toLowerCase().includes(term) ||
            a.breed.toLowerCase().includes(term) ||
            a.animalNumber.includes(term)
        )
        .slice(0, 5)
    : [];

  const matchedLots = term
    ? lots
        .filter(
          (l) =>
            l.name.toLowerCase().includes(term) ||
            l.corralNumber.toLowerCase().includes(term)
        )
        .slice(0, 3)
    : [];

  const matchedInventory = term
    ? inventory
        .filter((i) => i.name.toLowerCase().includes(term) || i.category.toLowerCase().includes(term))
        .slice(0, 3)
    : [];

  const matchedEmployees = term
    ? employees
        .filter((e) => e.name.toLowerCase().includes(term) || e.role.toLowerCase().includes(term))
        .slice(0, 3)
    : [];

  const totalResults =
    matchedAnimals.length +
    matchedLots.length +
    matchedInventory.length +
    matchedEmployees.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 gap-3 bg-stone-50/70">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por brinco (ex: VF-1015), lote, produto, funcionário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 focus:outline-none text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded border border-stone-300 text-stone-500 hover:bg-stone-200 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!searchTerm && (
            <div className="text-center py-10 text-stone-400">
              <Compass className="w-10 h-10 mx-auto mb-2 text-stone-300 stroke-[1.5]" />
              <p className="text-sm">Digite para pesquisar em todo o rebanho e confinamento.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSearchTerm('VF-1015')}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg"
                >
                  Brinco VF-1015
                </button>
                <button
                  onClick={() => setSearchTerm('Nelore')}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg"
                >
                  Raça Nelore
                </button>
                <button
                  onClick={() => setSearchTerm('Lote 01')}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg"
                >
                  Lote 01
                </button>
                <button
                  onClick={() => setSearchTerm('Milho')}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg"
                >
                  Estoque Milho
                </button>
              </div>
            </div>
          )}

          {searchTerm && totalResults === 0 && (
            <div className="text-center py-8 text-stone-400">
              <p className="text-sm">Nenhum resultado encontrado para "{searchTerm}".</p>
            </div>
          )}

          {/* Cattle Results */}
          {matchedAnimals.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Animais ({matchedAnimals.length})
              </div>
              <div className="space-y-1">
                {matchedAnimals.map((animal) => (
                  <button
                    key={animal.id}
                    onClick={() => {
                      setSelectedAnimalId(animal.id);
                      setCurrentTab('animais');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        🐂
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-900 group-hover:text-emerald-800">
                          {animal.earringNumber}{' '}
                          <span className="text-xs font-normal text-stone-500">
                            • {animal.breed} ({animal.sex})
                          </span>
                        </div>
                        <div className="text-xs text-stone-500">
                          Peso: {animal.currentWeight} kg • Lote: {lots.find((l) => l.id === animal.lotId)?.name || 'Sem lote'} • Status: {animal.status}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-700 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lots Results */}
          {matchedLots.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Lotes ({matchedLots.length})
              </div>
              <div className="space-y-1">
                {matchedLots.map((lot) => (
                  <button
                    key={lot.id}
                    onClick={() => {
                      setSelectedLotId(lot.id);
                      setCurrentTab('lotes');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900 group-hover:text-amber-800">
                        {lot.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        Curral: {lot.corralNumber} • Peso Médio: {lot.currentAvgWeight} kg • GMD: {lot.adg} kg/dia
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-700 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Results */}
          {matchedInventory.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-teal-600" />
                Estoque & Insumos ({matchedInventory.length})
              </div>
              <div className="space-y-1">
                {matchedInventory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab('estoque');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-100 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        {item.name}{' '}
                        <span className="text-xs font-medium text-stone-500">
                          ({item.category})
                        </span>
                      </div>
                      <div className="text-xs text-stone-500">
                        Estoque: {item.currentStock.toLocaleString('pt-BR')} {item.unit} • Mínimo: {item.minimumStock} {item.unit}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Employees Results */}
          {matchedEmployees.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Equipe ({matchedEmployees.length})
              </div>
              <div className="space-y-1">
                {matchedEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setCurrentTab('funcionarios');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        {emp.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        Cargo: {emp.role} • {emp.email}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-indigo-700" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-stone-100 px-4 py-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
          <span>Fazenda Vale Forte • Pesquisa Rápida Integrada</span>
          <div className="flex gap-2">
            <span>Navegue com setas ou clique</span>
          </div>
        </div>
      </div>
    </div>
  );
};
