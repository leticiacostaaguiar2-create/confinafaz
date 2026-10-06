import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { InventoryItem } from '../../types';
import {
  Boxes,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  X
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    movements,
    addStockMovement,
    addInventoryItem,
    currentUser,
    showToast,
  } = useFarm();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // Movement Form
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [movementType, setMovementType] = useState<'Entrada' | 'Saída'>('Entrada');
  const [movementQty, setMovementQty] = useState('');
  const [movementReason, setMovementReason] = useState('Recebimento de carga fornecedor');

  // New Item Form
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Milho' as InventoryItem['category'],
    currentStock: 1000,
    unit: 'kg' as InventoryItem['unit'],
    minimumStock: 2000,
    pricePerUnit: 1.2,
    supplier: 'Distribuidora Agro',
    location: 'Galpão 01',
  });

  const lowStockItems = inventory.filter((item) => item.currentStock < item.minimumStock);

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'todos' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(movementQty);
    if (!qty || qty <= 0) {
      showToast('Informe uma quantidade válida!', 'warning');
      return;
    }

    addStockMovement(
      selectedItemId,
      movementType,
      qty,
      currentUser?.name || 'Responsável Almoxarifado',
      movementReason
    );

    setMovementQty('');
    setIsMovementModalOpen(false);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) {
      showToast('Nome do produto é obrigatório!', 'error');
      return;
    }

    addInventoryItem({
      ...newItem,
      currentStock: Number(newItem.currentStock),
      minimumStock: Number(newItem.minimumStock),
      pricePerUnit: Number(newItem.pricePerUnit),
      lastEntryDate: new Date().toISOString().split('T')[0],
      lastExitDate: '-',
    });

    setIsAddItemModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-emerald-800" />
            Controle de Estoque & Insumos
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Gestão de matérias-primas, ração, medicamentos e alertas de reposição mínima
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMovementModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            Movimentar Estoque
          </button>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Novo Insumo
          </button>
        </div>
      </div>

      {/* Critical Stock Warning Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Atenção: {lowStockItems.length} insumos estão abaixo do estoque mínimo de segurança!
            </h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <span
                  key={item.id}
                  className="px-2 py-0.5 rounded-lg bg-amber-200/70 text-amber-900 text-xs font-bold"
                >
                  ⚠️ {item.name}: {item.currentStock.toLocaleString('pt-BR')} {item.unit} (mín: {item.minimumStock.toLocaleString('pt-BR')} {item.unit})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar insumo ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800"
          >
            <option value="todos">Todas Categorias</option>
            <option value="Milho">Milho</option>
            <option value="Soja">Soja</option>
            <option value="Silagem">Silagem</option>
            <option value="Feno">Feno</option>
            <option value="Minerais">Minerais</option>
            <option value="Medicamentos">Medicamentos</option>
            <option value="Vacinas">Vacinas</option>
          </select>
        </div>

        <span className="text-xs text-stone-500 font-mono">
          {filteredItems.length} itens cadastrados
        </span>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3.5">Insumo / Produto</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Estoque Atual</th>
                <th className="p-3.5">Estoque Mínimo</th>
                <th className="p-3.5">Preço Unitário</th>
                <th className="p-3.5">Localização</th>
                <th className="p-3.5">Fornecedor</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredItems.map((item) => {
                const isLow = item.currentStock < item.minimumStock;

                return (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="p-3.5">
                      <span className="font-extrabold text-stone-900 block text-sm">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Última entrada: {item.lastEntryDate}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-700 font-medium">{item.category}</td>
                    <td className="p-3.5 font-mono font-black text-stone-900 text-sm">
                      {item.currentStock.toLocaleString('pt-BR')} {item.unit}
                    </td>
                    <td className="p-3.5 font-mono text-stone-500">
                      {item.minimumStock.toLocaleString('pt-BR')} {item.unit}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-stone-800">
                      R$ {item.pricePerUnit.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-stone-600">{item.location}</td>
                    <td className="p-3.5 text-stone-600 truncate max-w-[150px]">
                      {item.supplier}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          isLow
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLow ? '⚠️ Estoque Crítico' : '✓ Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Movimentar Estoque (Entrada / Saída)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Atualize as quantidades físicas armazenadas
            </p>

            <form onSubmit={handleSaveMovement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Item:</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} (Atual: {i.currentStock} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tipo de Movimento:</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Entrada">Entrada (Compra/Produção)</option>
                    <option value="Saída">Saída (Consumo/Descarte)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quantidade:</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={movementQty}
                    onChange={(e) => setMovementQty(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Motivo / NF-e:</label>
                <input
                  type="text"
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md"
                >
                  Confirmar Movimentação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Cadastrar Novo Insumo no Estoque
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Informe a categoria, estoque de segurança e fornecedor
            </p>

            <form onSubmit={handleSaveNewItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Milho Grão Moído"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Categoria:</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Milho">Milho</option>
                    <option value="Soja">Soja</option>
                    <option value="Ração">Ração</option>
                    <option value="Silagem">Silagem</option>
                    <option value="Feno">Feno</option>
                    <option value="Minerais">Minerais</option>
                    <option value="Medicamentos">Medicamentos</option>
                    <option value="Vacinas">Vacinas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unidade:</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="kg">kg (Quilogramas)</option>
                    <option value="t">t (Toneladas)</option>
                    <option value="sacos">sacos</option>
                    <option value="doses">doses</option>
                    <option value="frascos">frascos</option>
                    <option value="L">L (Litros)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Estoque Inicial:</label>
                  <input
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Estoque Mínimo:</label>
                  <input
                    type="number"
                    value={newItem.minimumStock}
                    onChange={(e) => setNewItem({ ...newItem, minimumStock: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Preço Unitário (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.pricePerUnit}
                    onChange={(e) => setNewItem({ ...newItem, pricePerUnit: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Localização:</label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Fornecedor:</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md"
                >
                  Cadastrar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
