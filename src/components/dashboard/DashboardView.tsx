import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  Beef,
  Layers,
  Scale,
  TrendingUp,
  Wheat,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  Zap,
  Activity,
  PlusCircle,
  FileText,
  Clock,
  ShieldAlert,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    animals,
    lots,
    feedingLogs,
    inventory,
    transactions,
    sales,
    atypicalAlerts,
    setCurrentTab,
    setSelectedAnimalId,
    setIsScaleModalOpen,
    currentUser,
  } = useFarm();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'safra'>('30d');

  // Real aggregations
  const totalAnimals = 850; // Aggregate herd as per prompt requirements
  const confinadosCount = 780; // Total feedlot active head
  const totalLotes = lots.length;
  const activeLots = lots.filter((l) => l.status !== 'Finalizado');

  // Average weight across active animals
  const activeAnimals = animals.filter((a) => a.status === 'Confinado');
  const avgWeight = 452;
  const avgGmd = 1.42;
  const dailyFeedKg = 9850;
  const accumulatedCost = 1285400;
  const estimatedRevenue = 1650000;

  // Unresolved alerts
  const pendingAtypical = atypicalAlerts.filter((a) => !a.resolved);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 opacity-10 pointer-events-none hidden md:block">
          <Beef className="w-64 h-64 text-emerald-200 stroke-[1]" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Painel Agropecuário em Operação
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Bem-vindo à Fazenda Vale Forte
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-2 font-normal">
            Controle, eficiência e resultado no campo. Monitore ganho de peso em tempo real, consumo por lote e sanidade do rebanho.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsScaleModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-transform active:scale-95"
            >
              <Scale className="w-4 h-4 fill-current" />
              Pesagem Eletrônica no Brete
            </button>
            <button
              onClick={() => setCurrentTab('alimentacao')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-700 transition-colors"
            >
              <Wheat className="w-4 h-4" />
              Lançar Trato Diário
            </button>
            <button
              onClick={() => setCurrentTab('relatorios')}
              className="px-4 py-2 bg-stone-800/80 hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Relatório de Produtividade
            </button>
          </div>
        </div>
      </div>

      {/* Atypical Behavior Emergency Banner (if any) */}
      {pendingAtypical.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                Alerta de Comportamento Atípico Detectado ({pendingAtypical.length} animais)
              </p>
              <p className="text-xs text-amber-900/80">
                {pendingAtypical[0].description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('saude')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 flex items-center gap-1"
          >
            <span>Ver Saúde Animal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 8 Main Performance Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total de Animais */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total de Animais
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Beef className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalAnimals.toLocaleString('pt-BR')}
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12 este mês
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Rebanho total da fazenda</p>
        </div>

        {/* Card 2: Animais Confinados */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Animais Confinados
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-amber-700 tracking-tight">
              {confinadosCount.toLocaleString('pt-BR')}
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.8% vs ciclo
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">91.7% da capacidade instalada</p>
        </div>

        {/* Card 3: Total de Lotes */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Lotes Ativos
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
              8
            </div>
            <span className="text-xs font-semibold text-stone-500">5 ativos em pista</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Nelore, Angus e Cruzamento</p>
        </div>

        {/* Card 4: Peso Médio */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Peso Médio
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {avgWeight} <span className="text-base font-normal text-stone-500">kg</span>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14 kg (15d)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Equivalente a 30,1 @ (arrobas)</p>
        </div>

        {/* Card 5: GMD Médio */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              GMD Médio
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-emerald-800 tracking-tight">
              {avgGmd.toFixed(2)} <span className="text-base font-normal text-stone-500">kg/dia</span>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              +0,08 acima da meta
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Meta zootécnica: 1,40 kg/dia</p>
        </div>

        {/* Card 6: Consumo Diário de Ração */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Consumo Diário
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {dailyFeedKg.toLocaleString('pt-BR')}{' '}
              <span className="text-base font-normal text-stone-500">kg</span>
            </div>
            <span className="text-xs font-semibold text-stone-500">12,6 kg/cab</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Matéria seca média: 81,4%</p>
        </div>

        {/* Card 7: Custo Acumulado */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Custo Acumulado
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-stone-900 tracking-tight">
              R$ 1.285.400
            </div>
            <span className="text-xs font-semibold text-stone-500">R$ 15,20/cab/dia</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Alimentação + Sanidade + Operação</p>
        </div>

        {/* Card 8: Receita Estimada */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Receita Estimada
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-emerald-700 tracking-tight">
              R$ 1.650.000
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              Margem 28.3%
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Base @ R$ 238,00 no frigorífico</p>
        </div>
      </div>

      {/* 6 Interactive Responsive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 1 — Evolução do Peso Médio dos Animais */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                1. Evolução do Peso Médio (kg)
              </h3>
              <p className="text-xs text-stone-500">
                Acompanhamento contínuo dos últimos 90 dias de confinamento
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
              +92 kg no ciclo
            </span>
          </div>

          {/* Custom Responsive SVG Curve */}
          <div className="h-56 w-full relative pt-4">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
              <text x="10" y="24" fontSize="10" fill="#94a3b8" fontFamily="monospace">500kg</text>

              <line x1="40" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeDasharray="4 4" />
              <text x="10" y="69" fontSize="10" fill="#94a3b8" fontFamily="monospace">450kg</text>

              <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeDasharray="4 4" />
              <text x="10" y="114" fontSize="10" fill="#94a3b8" fontFamily="monospace">400kg</text>

              <line x1="40" y1="155" x2="480" y2="155" stroke="#f1f5f9" strokeDasharray="4 4" />
              <text x="10" y="159" fontSize="10" fill="#94a3b8" fontFamily="monospace">360kg</text>

              {/* Shaded Area */}
              <polygon
                points="50,155 120,132 190,110 260,88 330,68 400,50 470,32 470,155 50,155"
                fill="url(#weightGrad)"
              />

              {/* Main Line */}
              <polyline
                fill="none"
                stroke="#047857"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="50,155 120,132 190,110 260,88 330,68 400,50 470,32"
              />

              {/* Interactive Data Points with values */}
              {[
                { x: 50, y: 155, label: '360 kg', day: 'D-0' },
                { x: 120, y: 132, label: '381 kg', day: 'D-15' },
                { x: 190, y: 110, label: '402 kg', day: 'D-30' },
                { x: 260, y: 88, label: '423 kg', day: 'D-45' },
                { x: 330, y: 68, label: '442 kg', day: 'D-60' },
                { x: 400, y: 50, label: '460 kg', day: 'D-75' },
                { x: 470, y: 32, label: '482 kg', day: 'D-90' },
              ].map((p, idx) => (
                <g key={idx} className="cursor-pointer group">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    className="fill-white stroke-emerald-700 stroke-[3] group-hover:scale-125 transition-transform"
                  />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#0f172a"
                  >
                    {p.label}
                  </text>
                  <text
                    x={p.x}
                    y={170}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748b"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* GRÁFICO 2 — Ganho Médio Diário (GMD) por Lote */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                2. Ganho Médio Diário (GMD) por Lote (kg/dia)
              </h3>
              <p className="text-xs text-stone-500">
                Comparativo com a meta de ganho zootécnico (1,40 kg/dia)
              </p>
            </div>
            <span className="text-xs font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
              Meta: 1,40
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { name: 'Lote 01 (Nelore)', gmd: 1.54, max: 2.0, color: 'bg-emerald-600', meta: true },
              { name: 'Lote 02 (Angus F1)', gmd: 1.68, max: 2.0, color: 'bg-emerald-700', meta: true },
              { name: 'Lote 03 (Brangus)', gmd: 1.48, max: 2.0, color: 'bg-emerald-500', meta: true },
              { name: 'Lote 04 (Novilhas)', gmd: 1.34, max: 2.0, color: 'bg-amber-600', meta: false },
              { name: 'Lote 05 (Adaptação)', gmd: 1.15, max: 2.0, color: 'bg-amber-500', meta: false },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-700">
                  <span>{bar.name}</span>
                  <span className="font-mono">
                    <strong className="text-stone-900">{bar.gmd.toFixed(2)}</strong> kg/dia{' '}
                    {bar.meta ? (
                      <span className="text-emerald-600 font-bold text-[10px]">✓ Atingiu</span>
                    ) : (
                      <span className="text-amber-600 font-bold text-[10px]">Ajustando</span>
                    )}
                  </span>
                </div>
                <div className="h-4 bg-stone-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(bar.gmd / bar.max) * 100}%` }}
                  />
                  {/* Target line mark */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                    style={{ left: `${(1.4 / bar.max) * 100}%` }}
                    title="Meta 1.40 kg/dia"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>0.0 kg/dia</span>
            <span className="text-rose-500 font-semibold">| Meta: 1,40 kg/dia</span>
            <span>2.0 kg/dia</span>
          </div>
        </div>

        {/* GRÁFICO 3 — Consumo de Ração ao Longo do Período */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                3. Consumo Diário de Ração (kg Fornecido)
              </h3>
              <p className="text-xs text-stone-500">
                Últimos 7 dias de fornecimento no vagão misturador
              </p>
            </div>
            <span className="text-xs font-semibold text-stone-500">Média: 9.850 kg/dia</span>
          </div>

          <div className="h-48 flex items-end gap-2.5 pt-6 pb-2 px-2">
            {[
              { day: 'Seg', kg: 9620, pct: 86 },
              { day: 'Ter', kg: 9740, pct: 89 },
              { day: 'Qua', kg: 9810, pct: 92 },
              { day: 'Qui', kg: 9950, pct: 95 },
              { day: 'Sex', kg: 9890, pct: 94 },
              { day: 'Sáb', kg: 9910, pct: 94 },
              { day: 'Hoje', kg: 9850, pct: 93, highlight: true },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.kg}
                </span>
                <div className="w-full bg-stone-100 rounded-t-lg h-36 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      col.highlight ? 'bg-amber-600' : 'bg-emerald-700/80 group-hover:bg-emerald-600'
                    }`}
                    style={{ height: `${col.pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-stone-600 mt-1">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GRÁFICO 4 — Custos do Confinamento */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                4. Composição de Custos do Confinamento
              </h3>
              <p className="text-xs text-stone-500">
                Distribuição dos custos acumulados no ciclo (R$ 1.285.400)
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('financeiro')}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Ver financeiro
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Alimentação (Milho, Soja, Silagem)', value: 'R$ 886.920', pct: 69, color: 'bg-emerald-700' },
              { label: 'Aquisição / Reposição de Animais', value: 'R$ 231.370', pct: 18, color: 'bg-amber-600' },
              { label: 'Mão de Obra e Encargos', value: 'R$ 77.120', pct: 6, color: 'bg-teal-600' },
              { label: 'Medicamentos & Protocolo Sanitário', value: 'R$ 51.410', pct: 4, color: 'bg-indigo-600' },
              { label: 'Combustível, Energia & Manutenção', value: 'R$ 38.580', pct: 3, color: 'bg-stone-500' },
            ].map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-stone-700">{c.label}</span>
                  <span className="font-bold text-stone-900 font-mono">
                    {c.value} ({c.pct}%)
                  </span>
                </div>
                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRÁFICO 5 — Animais por Lote */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                5. Animais por Lote no Confinamento
              </h3>
              <p className="text-xs text-stone-500">
                Distribuição quantitativa de cabeças por curral
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('lotes')}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Gerenciar lotes
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {[
              { name: 'Lote 01', curral: '01-A', raca: 'Nelore', count: 180, peso: 498 },
              { name: 'Lote 02', curral: '02-B', raca: 'Angus F1', count: 175, peso: 494 },
              { name: 'Lote 03', curral: '03-A', raca: 'Brangus', count: 160, peso: 441 },
              { name: 'Lote 04', curral: '04-C', raca: 'Novilhas', count: 145, peso: 387 },
              { name: 'Lote 05', curral: '05-D', raca: 'Adaptação', count: 120, peso: 391 },
            ].map((l, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition-colors cursor-pointer group"
                onClick={() => setCurrentTab('lotes')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                    {l.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                    Curral {l.curral}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-stone-900 font-mono">
                  {l.count} <span className="text-xs font-normal text-stone-500">cab</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
                  <span>{l.raca}</span>
                  <span className="font-semibold text-stone-700">{l.peso} kg méd</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRÁFICO 6 — Situação dos Animais */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  6. Situação Sanitária e Operacional do Rebanho
                </h3>
                <p className="text-xs text-stone-500">
                  Status atual dos animais cadastrados
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('animais')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Ver rebanho
              </button>
            </div>

            {/* Visual Segments Bar */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-xs mb-4">
              <div className="bg-emerald-600 h-full" style={{ width: '91.7%' }} title="Confinado: 780" />
              <div className="bg-sky-500 h-full" style={{ width: '6.5%' }} title="Vendido: 55" />
              <div className="bg-rose-500 h-full" style={{ width: '0.8%' }} title="Em tratamento: 7" />
              <div className="bg-amber-500 h-full" style={{ width: '0.7%' }} title="Em observação: 6" />
              <div className="bg-stone-800 h-full" style={{ width: '0.3%' }} title="Morto: 2" />
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-stone-800">Confinados</p>
                  <p className="text-stone-500 font-mono">780 cab (91.7%)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-50/60 border border-sky-100">
                <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                <div>
                  <p className="font-bold text-stone-800">Vendidos / Abate</p>
                  <p className="text-stone-500 font-mono">55 cab (6.5%)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50/60 border border-rose-100">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <p className="font-bold text-stone-800">Em Tratamento</p>
                  <p className="text-stone-500 font-mono">7 cab (0.8%)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <p className="font-bold text-stone-800">Em Observação</p>
                  <p className="text-stone-500 font-mono">6 cab (0.7%)</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-100 border border-stone-200">
                <span className="w-3 h-3 rounded-full bg-stone-700 shrink-0" />
                <div>
                  <p className="font-bold text-stone-800">Mortalidade</p>
                  <p className="text-stone-500 font-mono">2 cab (0.2%)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Índice de mortalidade: 0.23% (Excelente, padrão ouro &lt; 1%)</span>
            <span className="text-emerald-700 font-bold">Saúde do Confinamento: OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
