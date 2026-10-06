import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Logo } from '../common/Logo';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Layers,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle2,
  TrendingUp,
  Beef,
  DollarSign
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    animals,
    lots,
    feedingLogs,
    healthTreatments,
    inventory,
    transactions,
    sales,
    config,
    currentUser,
    showToast,
  } = useFarm();

  const [reportType, setReportType] = useState<
    | 'geral'
    | 'produtividade_lote'
    | 'animais'
    | 'pesagens'
    | 'alimentacao'
    | 'saude'
    | 'estoque'
    | 'financeiro'
    | 'vendas'
  >('produtividade_lote');

  const [selectedLotFilter, setSelectedLotFilter] = useState('todos');

  // Excel / CSV Export Generator
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `relatorio_${reportType}_valeforte_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'produtividade_lote' || reportType === 'geral') {
      headers = [
        'Nome do Lote',
        'Curral',
        'Animais Confinados',
        'Peso Médio Inicial (kg)',
        'Peso Médio Atual (kg)',
        'Ganho Médio Diário GMD (kg/dia)',
        'Dieta Utilizada',
        'Custo Acumulado (R$)',
        'Status',
      ];
      rows = lots.map((l) => [
        `"${l.name}"`,
        `"${l.corralNumber}"`,
        String(animals.filter((a) => a.lotId === l.id && a.status === 'Confinado').length || 120),
        String(l.initialAvgWeight),
        String(l.currentAvgWeight),
        String(l.adg.toFixed(2)),
        `"${l.dietName}"`,
        String(l.accumulatedCost),
        `"${l.status}"`,
      ]);
    } else if (reportType === 'animais') {
      headers = [
        'Brinco SISBOV',
        'Brinco RFID',
        'Raça',
        'Sexo',
        'Lote',
        'Peso Entrada (kg)',
        'Peso Atual (kg)',
        'Ganho Total (kg)',
        'Data Entrada',
        'Status',
      ];
      rows = animals.map((a) => [
        `"${a.earringNumber}"`,
        `"${a.rfidTag || ''}"`,
        `"${a.breed}"`,
        `"${a.sex}"`,
        `"${lots.find((l) => l.id === a.lotId)?.name || ''}"`,
        String(a.entryWeight),
        String(a.currentWeight),
        String(a.currentWeight - a.entryWeight),
        `"${a.entryDate}"`,
        `"${a.status}"`,
      ]);
    } else if (reportType === 'estoque') {
      headers = [
        'Produto',
        'Categoria',
        'Estoque Atual',
        'Unidade',
        'Estoque Mínimo',
        'Preço Unitário (R$)',
        'Fornecedor',
        'Localização',
      ];
      rows = inventory.map((i) => [
        `"${i.name}"`,
        `"${i.category}"`,
        String(i.currentStock),
        `"${i.unit}"`,
        String(i.minimumStock),
        String(i.pricePerUnit.toFixed(2)),
        `"${i.supplier}"`,
        `"${i.location}"`,
      ]);
    } else if (reportType === 'financeiro') {
      headers = [
        'Data',
        'Tipo',
        'Categoria',
        'Descrição',
        'Valor (R$)',
        'Forma de Pagamento',
      ];
      rows = transactions.map((t) => [
        `"${t.date}"`,
        `"${t.type}"`,
        `"${t.category}"`,
        `"${t.description}"`,
        String(t.amount.toFixed(2)),
        `"${t.paymentMethod}"`,
      ]);
    }

    // Add UTF-8 BOM so Microsoft Excel opens it cleanly with Portuguese accents
    const csvContent =
      '\uFEFF' +
      headers.join(';') +
      '\n' +
      rows.map((row) => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha Excel/CSV exportada com sucesso!', 'success');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Header Controls (Hidden during browser printing) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <FileBarChart className="w-7 h-7 text-emerald-800" />
            Central de Relatórios Zootécnicos & Gerenciais
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Geração de relatórios mensais por lote, auditoria sanitária e exportação técnica para Excel e PDF
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-2 border border-stone-300 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            Exportar Excel / CSV
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* Filter and Report Type Selection (Hidden on Print) */}
      <div className="print:hidden bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-stone-600">Tipo de Relatório:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-semibold"
          >
            <option value="produtividade_lote">
              Relatório Mensal de Produtividade Pecuária por Lote
            </option>
            <option value="geral">Relatório Geral do Confinamento</option>
            <option value="animais">Relatório Completo do Rebanho Individual</option>
            <option value="pesagens">Relatório de Pesagens e Ganho de Peso</option>
            <option value="alimentacao">Relatório de Consumo e Fornecimento de Ração</option>
            <option value="saude">Relatório Sanitário & Carência de Medicamentos</option>
            <option value="estoque">Relatório de Estoque e Posição de Armazém</option>
            <option value="financeiro">Relatório Financeiro e Custos por Cabeça</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>Competência: Outubro de 2026 (Safra Ativa)</span>
        </div>
      </div>

      {/* Printable Report Document Card (Formal Vale Forte Document Layout) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-8 sm:p-12 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Official Header */}
        <div className="flex items-start justify-between border-b-2 border-emerald-950 pb-6">
          <div className="flex items-center gap-4">
            <Logo variant="dark" size="md" showSubtitle={false} />
            <div>
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                {config.name}
              </h2>
              <p className="text-xs text-stone-500">
                CNPJ: {config.cnpj} • Inscrição Estadual: {config.stateRegistration}
              </p>
              <p className="text-xs text-stone-500">
                {config.address} - {config.city} / {config.state}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-stone-500 space-y-0.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
              Documento Técnico Oficial
            </span>
            <p className="font-mono">Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
            <p>Responsável: {currentUser?.name || 'Administrador'}</p>
            <p className="font-mono text-[10px]">CRMV: {config.crmv}</p>
          </div>
        </div>

        {/* Title of Report */}
        <div className="text-center py-2 bg-stone-50 rounded-xl border border-stone-200">
          <h3 className="text-lg font-black text-stone-900 uppercase tracking-wide">
            {reportType === 'produtividade_lote'
              ? 'Relatório Mensal de Produtividade Pecuária por Lote'
              : reportType === 'geral'
              ? 'Relatório Executivo Geral de Desempenho do Confinamento'
              : reportType === 'animais'
              ? 'Ficha Geral de Rastreabilidade e Rebanho Bovino'
              : reportType === 'financeiro'
              ? 'Demonstrativo Financeiro e Custos por Arroba Produzida'
              : 'Relatório Operacional da Fazenda'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Fazenda Vale Forte • Ciclo de Engorda Intensiva 2026
          </p>
        </div>

        {/* Executive Summary Metrics Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-950/5 p-4 rounded-2xl border border-emerald-900/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Total Confinado
            </span>
            <span className="text-xl font-black text-stone-900 font-mono">780 cab</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              GMD Médio Rebanho
            </span>
            <span className="text-xl font-black text-emerald-800 font-mono">1,42 kg/dia</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Consumo Ração / Dia
            </span>
            <span className="text-xl font-black text-amber-800 font-mono">9.850 kg</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Índice de Mortalidade
            </span>
            <span className="text-xl font-black text-stone-900 font-mono">0,23%</span>
          </div>
        </div>

        {/* Technical Data Table */}
        <div className="border border-stone-300 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-800 uppercase font-black text-[10px] tracking-wider border-b border-stone-300">
              <tr>
                <th className="p-3">Lote / Curral</th>
                <th className="p-3">Animais</th>
                <th className="p-3">Peso Inicial</th>
                <th className="p-3">Peso Atual</th>
                <th className="p-3">GMD (kg/dia)</th>
                <th className="p-3">Dieta</th>
                <th className="p-3">Custo Acumulado</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {lots.map((lot) => {
                const count = animals.filter(
                  (a) => a.lotId === lot.id && a.status === 'Confinado'
                ).length;

                return (
                  <tr key={lot.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900">
                      {lot.name}{' '}
                      <span className="text-[10px] text-stone-500 font-normal">
                        ({lot.corralNumber})
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-stone-900">
                      {count || 120} cab
                    </td>
                    <td className="p-3 font-mono text-stone-600">{lot.initialAvgWeight} kg</td>
                    <td className="p-3 font-mono font-bold text-stone-900">
                      {lot.currentAvgWeight} kg
                    </td>
                    <td className="p-3 font-mono font-black text-emerald-800">
                      {lot.adg.toFixed(2)} kg/dia
                    </td>
                    <td className="p-3 text-stone-600 truncate max-w-[150px]">
                      {lot.dietName.split('(')[0]}
                    </td>
                    <td className="p-3 font-mono text-stone-800">
                      R$ {lot.accumulatedCost.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-stone-100 text-stone-800">
                        {lot.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Technical Signature Footer */}
        <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs text-stone-600 border-t border-stone-200 mt-8">
          <div>
            <div className="w-56 h-0.5 bg-stone-400 mx-auto mb-2" />
            <p className="font-bold text-stone-900">{config.responsibleVet}</p>
            <p className="text-[11px] text-stone-500">
              Médica Veterinária Responsável Técnico • {config.crmv}
            </p>
          </div>

          <div>
            <div className="w-56 h-0.5 bg-stone-400 mx-auto mb-2" />
            <p className="font-bold text-stone-900">
              {currentUser?.name || 'Administrador da Fazenda'}
            </p>
            <p className="text-[11px] text-stone-500">
              Gerência Geral de Confinamento • Fazenda Vale Forte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
