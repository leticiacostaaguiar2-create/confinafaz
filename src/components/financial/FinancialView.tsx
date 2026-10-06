import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { FinancialTransaction } from '../../types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Trash2,
  Calendar,
  CreditCard,
  PieChart,
  Layers,
  X
} from 'lucide-react';

export const FinancialView: React.FC = () => {
  const {
    transactions,
    addFinancialTransaction,
    deleteFinancialTransaction,
    currentUser,
    showToast,
  } = useFarm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'Todos' | 'Receita' | 'Despesa'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formType, setFormType] = useState<'Receita' | 'Despesa'>('Despesa');
  const [formCategory, setFormCategory] = useState<FinancialTransaction['category']>('Alimentação');
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formMethod, setFormMethod] = useState<FinancialTransaction['paymentMethod']>('Transferência Bancária');

  // Aggregations
  const totalReceitas = transactions
    .filter((t) => t.type === 'Receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDespesas = transactions
    .filter((t) => t.type === 'Despesa')
    .reduce((acc, t) => acc + t.amount, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'Todos' || t.type === filterType;
    const matchesSearch =
      !searchTerm ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (!amountNum || amountNum <= 0) {
      showToast('Informe um valor monetário válido!', 'warning');
      return;
    }

    addFinancialTransaction({
      date: formDate,
      type: formType,
      category: formCategory,
      description: formDesc,
      amount: amountNum,
      status: 'Pago',
      paymentMethod: formMethod,
    });

    setFormDesc('');
    setFormAmount('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-emerald-800" />
            Controle Financeiro do Confinamento
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Fluxo de caixa, diária alimentar por cabeça, margem bruta por lote e rentabilidade da arroba
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
        >
          <Plus className="w-4 h-4" />
          Novo Lançamento Financeiro
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-stone-500 uppercase">
            <span>Receitas Realizadas</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-2">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Abates e subprodutos</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-stone-500 uppercase">
            <span>Despesas Operacionais</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono mt-2">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Alimentação e insumos</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-stone-500 uppercase">
            <span>Resultado Atual do Caixa</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div
            className={`text-2xl font-black font-mono mt-2 ${
              saldoLiquido >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Faturamento vs Custos</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-stone-500 uppercase">
            <span>Custo da Diária / Cabeça</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono mt-2">
            R$ 15,20 <span className="text-xs font-normal text-stone-500">/ cab / dia</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Meta zootécnica &lt; R$ 16,50</span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800"
              />
            </div>

            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
              {(['Todos', 'Receita', 'Despesa'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    filterType === type
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-stone-500 font-mono">
            {filteredTransactions.length} lançamentos encontrados
          </span>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3.5">Data</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Descrição</th>
                <th className="p-3.5">Forma Pagamento</th>
                <th className="p-3.5 text-right">Valor</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50">
                  <td className="p-3.5 font-medium text-stone-800">{t.date}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        t.type === 'Receita'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-stone-800">{t.category}</td>
                  <td className="p-3.5 text-stone-600">{t.description}</td>
                  <td className="p-3.5 text-stone-500">{t.paymentMethod}</td>
                  <td
                    className={`p-3.5 font-mono font-black text-right text-sm ${
                      t.type === 'Receita' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {t.type === 'Receita' ? '+' : '-'} R${' '}
                    {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => deleteFinancialTransaction(t.id)}
                      className="p-1 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-700"
                      title="Excluir Lançamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              Novo Lançamento Financeiro
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Registre despesas do confinamento ou receitas de vendas
            </p>

            <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tipo:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Despesa">Despesa (Saída)</option>
                    <option value="Receita">Receita (Entrada)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Categoria:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Alimentação">Alimentação</option>
                    <option value="Compra de Animais">Compra de Animais</option>
                    <option value="Medicamentos e Sanidade">Medicamentos e Sanidade</option>
                    <option value="Funcionários e Folha">Funcionários e Folha</option>
                    <option value="Combustível e Energia">Combustível e Energia</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Transporte e Frete">Transporte e Frete</option>
                    <option value="Venda de Animais">Venda de Animais</option>
                    <option value="Venda de Subprodutos">Venda de Subprodutos</option>
                    <option value="Outros Custos">Outros Custos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Descrição:</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Aquisição Milho Moído Grão"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Valor (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Data:</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Forma de Pagamento:</label>
                <select
                  value={formMethod}
                  onChange={(e) => setFormMethod(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Transferência Bancária">Transferência Bancária</option>
                  <option value="PIX">PIX</option>
                  <option value="Boleto">Boleto Bancário</option>
                  <option value="A prazo">A Prazo / Frigorífico</option>
                </select>
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
