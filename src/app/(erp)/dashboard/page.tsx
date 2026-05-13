import {
  FolderOpen,
  Bell,
  CalendarDays,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

const kpis = [
  {
    label: "Processos Ativos",
    valor: "47",
    delta: "+3 este mês",
    icon: FolderOpen,
    cor: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    label: "Intimações Pendentes",
    valor: "8",
    delta: "2 urgentes",
    icon: Bell,
    cor: "#f59e0b",
    bg: "#fffbeb",
    alerta: true,
  },
  {
    label: "Prazos Esta Semana",
    valor: "5",
    delta: "1 vence hoje",
    icon: CalendarDays,
    cor: "#ef4444",
    bg: "#fef2f2",
    alerta: true,
  },
  {
    label: "Tarefas Pendentes",
    valor: "12",
    delta: "4 atribuídas a mim",
    icon: CheckSquare,
    cor: "#8b5cf6",
    bg: "#f5f3ff",
  },
];

const prazosHoje = [
  { processo: "0001234-56.2024.5.01.0001", tipo: "Contestação", prazo: "Hoje 23:59", urgente: true },
  { processo: "0007891-23.2023.8.19.0001", tipo: "Recurso Ordinário", prazo: "Amanhã", urgente: false },
  { processo: "0003456-78.2025.5.02.0032", tipo: "Impugnação", prazo: "13/05", urgente: false },
];

const intimacoesRecentes = [
  {
    titulo: "Intimação para apresentação de documentos",
    processo: "0001234-56.2024.5.01.0001",
    data: "Hoje, 09:15",
    urgencia: "CRITICA",
  },
  {
    titulo: "Despacho — conclusos para julgamento",
    processo: "0005678-90.2023.4.03.6100",
    data: "Hoje, 08:30",
    urgencia: "NORMAL",
  },
  {
    titulo: "Designação de audiência",
    processo: "0009012-34.2024.5.15.0144",
    data: "Ontem",
    urgencia: "ALTA",
  },
];

const tarefasPendentes = [
  { titulo: "Protocolar contestação trabalhista", prazo: "Hoje", prioridade: "URGENTE" },
  { titulo: "Elaborar proposta de honorários — Empresa XYZ", prazo: "Amanhã", prioridade: "ALTA" },
  { titulo: "Revisar contrato de prestação de serviços", prazo: "15/05", prioridade: "MEDIA" },
  { titulo: "Pesquisa patrimonial — SISBAJUD", prazo: "16/05", prioridade: "MEDIA" },
];

const urgenciaColors: Record<string, string> = {
  CRITICA: "bg-red-100 text-red-700",
  ALTA: "bg-orange-100 text-orange-700",
  NORMAL: "bg-blue-100 text-blue-700",
};

const prioridadeColors: Record<string, string> = {
  URGENTE: "bg-red-100 text-red-700",
  ALTA: "bg-orange-100 text-orange-700",
  MEDIA: "bg-yellow-100 text-yellow-700",
  BAIXA: "bg-gray-100 text-gray-600",
};

export default function DashboardPage() {
  const agora = new Date();
  const hora = agora.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{saudacao} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/processos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Novo Processo
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: kpi.bg }}
                >
                  <Icon size={18} style={{ color: kpi.cor }} />
                </div>
                {kpi.alerta && (
                  <AlertTriangle size={14} className="text-amber-500" />
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{kpi.valor}</div>
                <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
                <div
                  className="text-xs font-medium mt-1"
                  style={{ color: kpi.alerta ? "#ef4444" : "#6b7280" }}
                >
                  {kpi.delta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Prazos */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#c9a84c]" />
              <h2 className="text-sm font-semibold text-gray-900">Prazos Próximos</h2>
            </div>
            <Link href="/agenda" className="text-xs text-[#c9a84c] font-medium hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={11} />
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {prazosHoje.map((p, i) => (
              <li key={i} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">{p.tipo}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5 truncate">{p.processo}</div>
                  </div>
                  <span
                    className={`text-xs font-bold shrink-0 ${
                      p.urgente ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {p.prazo}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Intimações */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#c9a84c]" />
              <h2 className="text-sm font-semibold text-gray-900">Intimações Recentes</h2>
            </div>
            <Link href="/intimacoes" className="text-xs text-[#c9a84c] font-medium hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={11} />
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {intimacoesRecentes.map((int, i) => (
              <li key={i} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                      {int.titulo}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${urgenciaColors[int.urgencia]}`}>
                        {int.urgencia}
                      </span>
                      <span className="text-xs text-gray-400">{int.data}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tarefas */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-[#c9a84c]" />
              <h2 className="text-sm font-semibold text-gray-900">Tarefas Pendentes</h2>
            </div>
            <button className="text-xs text-[#c9a84c] font-medium hover:underline">+ Nova</button>
          </div>
          <ul className="divide-y divide-gray-50">
            {tarefasPendentes.map((t, i) => (
              <li key={i} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <input type="checkbox" className="mt-0.5 accent-[#c9a84c] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-gray-800 leading-snug">{t.titulo}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${prioridadeColors[t.prioridade]}`}>
                          {t.prioridade}
                        </span>
                        <span className="text-xs text-gray-400">{t.prazo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Métricas resumo */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-[#c9a84c]" />
            <h2 className="text-sm font-semibold text-gray-900">Métricas do Escritório</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Taxa de Êxito", valor: "94%", sub: "Últimos 12 meses" },
              { label: "Processos Encerrados", valor: "23", sub: "Este ano" },
              { label: "Clientes Ativos", valor: "67", sub: "Total cadastrado" },
            ].map((m) => (
              <div key={m.label} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{m.valor}</div>
                <div className="text-xs font-medium text-gray-700 mt-0.5">{m.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Execuções estratégicas */}
        <div className="bg-[#060d1a] rounded-xl border border-[#c9a84c]/20 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#c9a84c]" />
              <h2 className="text-sm font-semibold text-white">Execuções Estratégicas</h2>
            </div>
            <Link href="/execucao" className="text-xs text-[#c9a84c] font-medium hover:underline flex items-center gap-1">
              Ver módulo <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Em aberto", valor: "14", cor: "text-white" },
              { label: "Recuperado", valor: "R$ 87K", cor: "text-[#c9a84c]" },
              { label: "Frustradas", valor: "3", cor: "text-red-400" },
            ].map((e) => (
              <div key={e.label} className="bg-white/5 rounded-lg p-3 text-center">
                <div className={`text-lg font-bold ${e.cor}`}>{e.valor}</div>
                <div className="text-white/40 text-xs mt-0.5">{e.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] mt-1.5 shrink-0" />
              <div>
                <div className="text-white text-xs font-medium">Sugestão da IA</div>
                <div className="text-white/50 text-xs mt-0.5">
                  3 execuções sem diligência há +60 dias. Considerar pesquisa SNIPER e proteção SERP.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
