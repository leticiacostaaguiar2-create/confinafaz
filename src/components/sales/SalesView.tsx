import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { SaleRecord } from '../../types';
import {
  ShoppingCart,
  Plus,
  Scale,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const {
    sales,
    lots,
    animals,
    recordSale,
    showToast,
  } = useFarm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState(lots[0]?.id || '');
  const [animalCount, setAnimalCount] = useState('30');
  const [avgWeightKg, setAvgWeightKg] = useState('545');
  const [pricePerArroba, setPricePerArroba] = useState('240');
  const [carcassYield, setCarcassYield] = useState('55.0');
  const [buyer, setBuyer] = useState('Frigorífico JBS Unidade Goiânia');
  const [invoiceNumber, setInvoiceNumber] = useState('NF-e 006.120/2026');
  const [notes, setNotes] = useState('Lote abatido com bonificação de rastreabilidade SISBOV.');

  // Calculation helpers
  const countNum = parseInt(animalCount) || 0;
  const avgW = parseFloat(avgWeightKg) || 0;
  const totalW = countNum * avgW;
  const priceArr = parseFloat(pricePerArroba) || 0;
  const yieldPct = parseFloat(carcassYield) || 55;

  // Carcass @ calculation: Total weight * (yield / 100) / 15kg
  const totalArrobasCarcass = (totalW * (yieldPct / 100)) / 15;
  const totalAmountCalc = Math.round(totalArrobasCarcass * priceArr * 100) / 100;

  const totalSoldAnimals = sales.reduce((acc, s) => acc + s.animalCount, 0);
  const totalRevenueSales = sales.reduce((acc, s) => acc + s.totalAmount, 0);

  const handleSaveSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (countNum <= 0 || totalAmountCalc <= 0) {
      showToast('Preencha os valores da venda corretamente!', 'warning');
      return;
    }

    recordSale({
      lotId: selectedLotId,
      animalCount: countNum,
      animalEarrings: ['VF-LoteVenda', '...e demais cabeças'],
      saleDate: new Date().toISOString().split('T')[0],
      totalWeightKg: totalW,
      avgWeightKg: avgW,
      pricePerArroba: priceArr,
      carcassYieldPercent: yieldPct,
      totalAmount: totalAmountCalc,
      buyer,
      invoiceNumber,
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
            <ShoppingCart className="w-7 h-7 text-emerald-800" />
            Controle de Vendas & Abate de Bovinos
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Comercialização para frigoríficos, rendimento de carcaça e faturamento por arroba (@)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
        >
          <Plus className="w-4 h-4" />
          Registrar Novo Abate / Venda
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Total de Animais Comercializados
          </span>
          <div className="text-2xl font-black text-stone-900 font-mono mt-2">
            {totalSoldAnimals} <span className="text-xs font-normal text-stone-500">cabeças abatidas</span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block">Rastreabilidade completa SISBOV</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Faturamento Bruto de Vendas
          </span>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-2">
            R$ {totalRevenueSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-stone-500 mt-1 block">Pagamento direto de frigorífico</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Média de Preço Pago / @
          </span>
          <div className="text-2xl font-black text-amber-700 font-mono mt-2">
            R$ 238,50 <span className="text-xs font-normal text-stone-500">/@ carcaça</span>
          </div>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">Bonificação Farol da Qualidade</span>
        </div>
      </div>

      {/* Sales History Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Histórico de Romaneios e Abates
          </h3>
          <span className="text-xs text-stone-500">{sales.length} vendas registradas</span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3.5">Data Abate</th>
                <th className="p-3.5">Frigorífico / Comprador</th>
                <th className="p-3.5">NF-e</th>
                <th className="p-3.5">Quantidade</th>
                <th className="p-3.5">Peso Médio Vivo</th>
                <th className="p-3.5">Rend. Carcaça</th>
                <th className="p-3.5">Preço / @</th>
                <th className="p-3.5 text-right">Valor Total Faturado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-stone-50">
                  <td className="p-3.5 font-medium text-stone-800">{sale.saleDate}</td>
                  <td className="p-3.5 font-bold text-stone-900">{sale.buyer}</td>
                  <td className="p-3.5 font-mono text-stone-600">{sale.invoiceNumber}</td>
                  <td className="p-3.5 font-mono font-bold text-stone-900">
                    {sale.animalCount} cab
                  </td>
                  <td className="p-3.5 font-mono text-stone-700">{sale.avgWeightKg} kg</td>
                  <td className="p-3.5 font-mono text-emerald-700 font-bold">
                    {sale.carcassYieldPercent}%
                  </td>
                  <td className="p-3.5 font-mono text-stone-800">
                    R$ {sale.pricePerArroba.toFixed(2)}
                  </td>
                  <td className="p-3.5 font-mono font-black text-right text-emerald-800 text-sm">
                    R$ {sale.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Registrar Abate e Romaneio Frigorífico
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Informe a pesagem e o cálculo de arrobas para fechamento financeiro
            </p>

            <form onSubmit={handleSaveSale} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Lote de Origem:</label>
                  <select
                    value={selectedLotId}
                    onChange={(e) => setSelectedLotId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    {lots.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quantidade de Animais:</label>
                  <input
                    type="number"
                    required
                    value={animalCount}
                    onChange={(e) => setAnimalCount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Peso Médio (kg):</label>
                  <input
                    type="number"
                    required
                    value={avgWeightKg}
                    onChange={(e) => setAvgWeightKg(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Rendimento (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={carcassYield}
                    onChange={(e) => setCarcassYield(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Preço / @ (R$):</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={pricePerArroba}
                    onChange={(e) => setPricePerArroba(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Automatic Calculation Preview Box */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800">
                  Cálculo Zootécnico Automático:
                </span>
                <div className="flex justify-between text-xs text-stone-700">
                  <span>Peso Total Vivo:</span>
                  <span className="font-mono font-bold">{totalW.toLocaleString('pt-BR')} kg</span>
                </div>
                <div className="flex justify-between text-xs text-stone-700">
                  <span>Arrobas de Carcaça:</span>
                  <span className="font-mono font-bold">{totalArrobasCarcass.toFixed(1)} @</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-900 border-t border-emerald-200 pt-1 mt-1">
                  <span>Valor Total da Venda:</span>
                  <span className="font-mono font-black text-base">
                    R$ {totalAmountCalc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Frigorífico Comprador:</label>
                <input
                  type="text"
                  required
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Número NF-e:</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Observações:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Concluir Venda & Faturar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
