import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Animal, AnimalBreed, AnimalStatus, AnimalSex } from '../../types';
import { AnimalDetailModal } from './AnimalDetailModal';
import {
  Beef,
  Search,
  Filter,
  Plus,
  Scale,
  Activity,
  Layers,
  ArrowRightLeft,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export const AnimalsView: React.FC = () => {
  const {
    animals,
    lots,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    transferAnimalLot,
    selectedAnimalId,
    setSelectedAnimalId,
    setIsScaleModalOpen,
    showToast,
  } = useFarm();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [lotFilter, setLotFilter] = useState<string>('todos');
  const [breedFilter, setBreedFilter] = useState<string>('todos');
  const [sexFilter, setSexFilter] = useState<string>('todos');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [transferringAnimal, setTransferringAnimal] = useState<Animal | null>(null);
  const [targetLotId, setTargetLotId] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    earringNumber: '',
    rfidTag: '',
    animalNumber: '',
    breed: 'Nelore' as AnimalBreed,
    sex: 'Macho' as AnimalSex,
    birthDate: '2024-11-01',
    origin: 'Recria Própria - Retiro São Francisco',
    entryDate: new Date().toISOString().split('T')[0],
    entryWeight: 380,
    lotId: lots[0]?.id || '',
    status: 'Confinado' as AnimalStatus,
    notes: '',
  });

  // Filter animals
  const filteredAnimals = animals.filter((animal) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      animal.earringNumber.toLowerCase().includes(term) ||
      animal.animalNumber.includes(term) ||
      animal.rfidTag?.toLowerCase().includes(term) ||
      animal.breed.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'todos' || animal.status === statusFilter;
    const matchesLot = lotFilter === 'todos' || animal.lotId === lotFilter;
    const matchesBreed = breedFilter === 'todos' || animal.breed === breedFilter;
    const matchesSex = sexFilter === 'todos' || animal.sex === sexFilter;

    return matchesSearch && matchesStatus && matchesLot && matchesBreed && matchesSex;
  });

  const handleOpenAddModal = () => {
    const nextNum = animals.length + 1001;
    setFormData({
      earringNumber: `VF-${nextNum}`,
      rfidTag: `982.0001090${nextNum}`,
      animalNumber: String(nextNum),
      breed: 'Nelore',
      sex: 'Macho',
      birthDate: '2024-11-01',
      origin: 'Recria Própria - Retiro São Francisco',
      entryDate: new Date().toISOString().split('T')[0],
      entryWeight: 380,
      lotId: lots[0]?.id || '',
      status: 'Confinado',
      notes: '',
    });
    setEditingAnimal(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (animal: Animal, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAnimal(animal);
    setFormData({
      earringNumber: animal.earringNumber,
      rfidTag: animal.rfidTag || '',
      animalNumber: animal.animalNumber,
      breed: animal.breed,
      sex: animal.sex,
      birthDate: animal.birthDate,
      origin: animal.origin,
      entryDate: animal.entryDate,
      entryWeight: animal.entryWeight,
      lotId: animal.lotId,
      status: animal.status,
      notes: animal.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.earringNumber) {
      showToast('O número do brinco é obrigatório!', 'error');
      return;
    }

    if (editingAnimal) {
      updateAnimal(editingAnimal.id, {
        earringNumber: formData.earringNumber,
        rfidTag: formData.rfidTag,
        breed: formData.breed,
        sex: formData.sex,
        birthDate: formData.birthDate,
        origin: formData.origin,
        lotId: formData.lotId,
        status: formData.status,
        notes: formData.notes,
      });
    } else {
      addAnimal({
        earringNumber: formData.earringNumber,
        rfidTag: formData.rfidTag,
        animalNumber: formData.animalNumber || formData.earringNumber.replace(/\D/g, ''),
        breed: formData.breed,
        sex: formData.sex,
        birthDate: formData.birthDate,
        origin: formData.origin,
        entryDate: formData.entryDate,
        entryWeight: Number(formData.entryWeight),
        currentWeight: Number(formData.entryWeight),
        lotId: formData.lotId,
        status: formData.status,
        notes: formData.notes,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleExecuteTransfer = () => {
    if (!transferringAnimal || !targetLotId) return;
    transferAnimalLot(transferringAnimal.id, targetLotId);
    setTransferringAnimal(null);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Banner & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Beef className="w-7 h-7 text-emerald-800" />
            Controle do Rebanho & Animais
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Gerenciamento individual, rastreabilidade SISBOV/RFID e zootecnia de precisão
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsScaleModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Scale className="w-4 h-4 fill-current" />
            Pesar no Brete
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Novo Animal
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por brinco (VF-1015), RFID, número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="todos">Todos os Status ({animals.length})</option>
              <option value="Confinado">Confinados</option>
              <option value="Em tratamento">Em Tratamento</option>
              <option value="Em observação">Em Observação</option>
              <option value="Vendido">Vendidos</option>
              <option value="Morto">Mortalidade</option>
            </select>
          </div>

          {/* Filter Lot */}
          <div>
            <select
              value={lotFilter}
              onChange={(e) => setLotFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="todos">Todos os Lotes</option>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Breed */}
          <div>
            <select
              value={breedFilter}
              onChange={(e) => setBreedFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="todos">Todas as Raças</option>
              <option value="Nelore">Nelore</option>
              <option value="Angus">Angus</option>
              <option value="Brangus">Brangus</option>
              <option value="Braford">Braford</option>
              <option value="Senepol">Senepol</option>
              <option value="Cruzamento Industrial">Cruzamento Industrial</option>
            </select>
          </div>
        </div>

        {/* Filter Stats Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
          <span>
            Exibindo <strong>{filteredAnimals.length}</strong> de <strong>{animals.length}</strong> animais no sistema
          </span>
          {(searchTerm || statusFilter !== 'todos' || lotFilter !== 'todos' || breedFilter !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setLotFilter('todos');
                setBreedFilter('todos');
                setSexFilter('todos');
              }}
              className="text-emerald-700 hover:underline font-bold"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Main Animals Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3.5">Brinco / SISBOV</th>
                <th className="p-3.5">Raça / Sexo</th>
                <th className="p-3.5">Lote Atual</th>
                <th className="p-3.5">Peso Entrada</th>
                <th className="p-3.5">Peso Atual</th>
                <th className="p-3.5">Ganho Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredAnimals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-stone-400">
                    Nenhum animal encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredAnimals.map((animal) => {
                  const lot = lots.find((l) => l.id === animal.lotId);
                  const gain = animal.currentWeight - animal.entryWeight;

                  return (
                    <tr
                      key={animal.id}
                      onClick={() => setSelectedAnimalId(animal.id)}
                      className="hover:bg-stone-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Brinco & RFID */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center">
                            🐂
                          </div>
                          <div>
                            <span className="font-extrabold text-stone-900 font-mono text-sm group-hover:text-emerald-800">
                              {animal.earringNumber}
                            </span>
                            {animal.rfidTag && (
                              <span className="block text-[10px] text-stone-400 font-mono truncate max-w-[120px]">
                                {animal.rfidTag}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Raça & Sexo */}
                      <td className="p-3.5">
                        <span className="font-medium text-stone-800 block">{animal.breed}</span>
                        <span className="text-[11px] text-stone-500">{animal.sex}</span>
                      </td>

                      {/* Lote */}
                      <td className="p-3.5">
                        <span className="font-semibold text-stone-800 block truncate max-w-[160px]">
                          {lot?.name || 'Sem Lote'}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Curral {lot?.corralNumber || '-'}
                        </span>
                      </td>

                      {/* Peso Entrada */}
                      <td className="p-3.5 font-mono text-stone-600">
                        {animal.entryWeight} kg
                        <span className="block text-[10px] text-stone-400">{animal.entryDate}</span>
                      </td>

                      {/* Peso Atual */}
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-stone-900 text-sm">{animal.currentWeight} kg</span>
                        <span className="block text-[10px] text-stone-500">
                          {(animal.currentWeight / 30).toFixed(1)} @
                        </span>
                      </td>

                      {/* Ganho Total */}
                      <td className="p-3.5 font-mono">
                        <span
                          className={`font-bold ${
                            gain >= 50 ? 'text-emerald-700' : 'text-stone-700'
                          }`}
                        >
                          +{gain} kg
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            animal.status === 'Confinado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : animal.status === 'Em tratamento'
                              ? 'bg-rose-100 text-rose-800'
                              : animal.status === 'Vendido'
                              ? 'bg-sky-100 text-sky-800'
                              : animal.status === 'Em observação'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {animal.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div
                          className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setSelectedAnimalId(animal.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Ver Histórico Completo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setTransferringAnimal(animal);
                              setTargetLotId(animal.lotId);
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50"
                            title="Transferir de Lote"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleOpenEditModal(animal, e)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                            title="Editar Animal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(animal.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Excluir Animal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimalDetailModal
        animalId={selectedAnimalId}
        onClose={() => setSelectedAnimalId(null)}
      />

      {/* Transfer Lot Modal */}
      {transferringAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Transferir Animal de Lote
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Mudar animal <strong>{transferringAnimal.earringNumber}</strong> para outro curral/lote.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Selecione o Novo Lote de Destino:
                </label>
                <select
                  value={targetLotId}
                  onChange={(e) => setTargetLotId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  {lots.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.corralNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setTransferringAnimal(null)}
                  className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteTransfer}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Confirmar Transferência
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 text-center">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
            <h3 className="font-bold text-base text-stone-900">Remover Animal?</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Esta ação removerá o registro do rebanho e todas as suas pesagens associadas. Confirma?
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteAnimal(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Animal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
              <div>
                <h3 className="font-bold text-lg text-stone-900">
                  {editingAnimal ? 'Editar Animal' : 'Cadastrar Novo Animal no Confinamento'}
                </h3>
                <p className="text-xs text-stone-500">
                  Preencha os dados zootécnicos e de identificação SISBOV
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Número do Brinco (SISBOV):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.earringNumber}
                    onChange={(e) => setFormData({ ...formData, earringNumber: e.target.value })}
                    placeholder="ex: VF-1056"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Brinco Eletrônico RFID:
                  </label>
                  <input
                    type="text"
                    value={formData.rfidTag}
                    onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
                    placeholder="ex: 982.00010901056"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Raça:
                  </label>
                  <select
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value as AnimalBreed })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
                  >
                    <option value="Nelore">Nelore</option>
                    <option value="Angus">Angus</option>
                    <option value="Brangus">Brangus</option>
                    <option value="Braford">Braford</option>
                    <option value="Senepol">Senepol</option>
                    <option value="Cruzamento Industrial">Cruzamento Industrial</option>
                    <option value="Tabapuã">Tabapuã</option>
                    <option value="Brahman">Brahman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Sexo:
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as AnimalSex })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Lote de Alocação:
                  </label>
                  <select
                    value={formData.lotId}
                    onChange={(e) => setFormData({ ...formData, lotId: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
                  >
                    {lots.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Status:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AnimalStatus })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
                  >
                    <option value="Confinado">Confinado</option>
                    <option value="Em tratamento">Em tratamento</option>
                    <option value="Em observação">Em observação</option>
                    <option value="Transferido">Transferido</option>
                    <option value="Vendido">Vendido</option>
                    <option value="Morto">Morto</option>
                  </select>
                </div>

                {!editingAnimal && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Peso de Entrada (kg):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.entryWeight}
                      onChange={(e) => setFormData({ ...formData, entryWeight: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Origem / Fazenda de Cria:
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Observações:
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Características corporais, conformação, docilidade..."
                  rows={2}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20"
                >
                  {editingAnimal ? 'Salvar Alterações' : 'Cadastrar Animal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
