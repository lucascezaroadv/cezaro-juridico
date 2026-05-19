"use client";

import { useEffect, useState } from "react";
import {
  FolderOpen, Bell, CalendarDays, CheckSquare,
  TrendingUp, AlertTriangle, Clock, ArrowRight,
  Zap, DollarSign, Users,
} from "lucide-react";
import Link from "next/link";
import { formatarMoeda, formatarData } from "@/shared/utils/formatters";

type DashData = {
  kpis: {
    processosAtivos: number; intimacoesPendentes: number; intimacoesCriticas: number;
    prazosProximos: number; prazoVenceHoje: number; tarefasPendentes: number;
    clientes: number; processosEncerrados: number;
  };
  financeiro: { receitas: number; despesas: number };
  intimacoesRecentes: { id: string; titulo: string; urgencia: string; dataPublicacao: string; processo: { id: string; numero: string } | null }[];
  prazosLista: { id: string; titulo: string; dataVencimento: string; processo: { id: string; numero: string } | null }[];
  tarefasLista: { id: string; titulo: string; prazo: string | null; prioridade: string; processo: { id: string; numero: string } | null }[];
};

const urgenciaColors: Record<string, string> = {
  CRITICA: "bg-red-100 text-red-700",
  ALTA: "bg-orange-100 text-orange-700",
  NORMAL: "bg-blue-100 text-blue-700",
  BAIXA: "bg-gray-100 text-gray-500",
};

const prioridadeColors: Record<string, string> = {
  URGENTE: "bg-red-100 text-red-700",
  ALTA: "bg-orange-100 text-orange-700",
  MEDIA: "bg-yellow-100 text-yellow-700",
  BAIXA: "bg-gray-100 text-gray-600",
};

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gray-100" />
      </div>
      <div className="h-7 w-12 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-24 bg-gray-100 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/dashboard")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const agora = new Date();
  const hora = agora.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const getDiasRestantes = (data: string) =>
    Math.ceil((new Date(data).getTime() - Date.now()) / 86400000);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{saudacao}</h1>
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
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : data ? (
          [
            {
              label: "Processos Ativos", valor: data.kpis.processosAtivos,
              delta: `${data.kpis.processosEncerrados} encerrados este mês`,
              icon: FolderOpen, cor: "#3b82f6", bg: "#eff6ff", href: "/processos",
            },
            {
              label: "Intimações Pendentes", valor: data.kpis.intimacoesPendentes,
              delta: `${data.kpis.intimacoesCriticas} críticas`,
              icon: Bell, cor: "#f59e0b", bg: "#fffbeb",
              alerta: data.kpis.intimacoesCriticas > 0, href: "/intimacoes",
            },
            {
              label: "Prazos Esta Semana", valor: data.kpis.prazosProximos,
              delta: data.kpis.prazoVenceHoje > 0 ? `${data.kpis.prazoVenceHoje} vence hoje!` : "Nenhum hoje",
              icon: CalendarDays, cor: "#ef4444", bg: "#fef2f2",
              alerta: data.kpis.prazoVenceHoje > 0, href: "/agenda",
            },
            {
              label: "Tarefas Pendentes", valor: data.kpis.tarefasPendentes,
              delta: `${data.kpis.clientes} clientes cadastrados`,
              icon: CheckSquare, cor: "#8b5cf6", bg: "#f5f3ff", href: "/clientes",
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={kpi.label}
                href={kpi.href}
                className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-sm hover:border-gray-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                    <Icon size={18} style={{ color: kpi.cor }} />
                  </div>
                  {kpi.alerta && <AlertTriangle size={14} className="text-amber-500" />}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{kpi.valor}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
                  <div className={`text-xs font-medium mt-1 ${kpi.alerta ? "text-red-600" : "text-gray-400"}`}>
                    {kpi.delta}
                  </div>
                </div>
              </Link>
            );
          })
        ) : null}
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
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (data?.prazosLista ?? []).length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-400">Nenhum prazo próximo</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {(data?.prazosLista ?? []).map(p => {
                const dias = getDiasRestantes(p.dataVencimento);
                return (
                  <li key={p.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{p.titulo}</div>
                        {p.processo && (
                          <div className="text-xs text-gray-400 font-mono mt-0.5 truncate">{p.processo.numero}</div>
                        )}
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${dias <= 0 ? "text-red-600" : dias <= 2 ? "text-orange-600" : "text-gray-500"}`}>
                        {dias <= 0 ? "Vencido" : dias === 0 ? "Hoje" : `${dias}d`}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
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
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (data?.intimacoesRecentes ?? []).length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-400">Nenhuma intimação pendente</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {(data?.intimacoesRecentes ?? []).map(int => (
                <li key={int.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 mb-1.5">{int.titulo}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${urgenciaColors[int.urgencia] ?? ""}`}>
                      {int.urgencia}
                    </span>
                    {int.processo && (
                      <span className="text-[10px] text-gray-400 font-mono truncate">{int.processo.numero}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tarefas */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-[#c9a84c]" />
              <h2 className="text-sm font-semibold text-gray-900">Tarefas Pendentes</h2>
            </div>
          </div>
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (data?.tarefasLista ?? []).length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-400">Nenhuma tarefa pendente</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {(data?.tarefasLista ?? []).map(t => (
                <li key={t.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <input type="checkbox" className="mt-0.5 accent-[#c9a84c] shrink-0" readOnly />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 leading-snug">{t.titulo}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${prioridadeColors[t.prioridade] ?? ""}`}>
                          {t.prioridade}
                        </span>
                        {t.prazo && <span className="text-xs text-gray-400">{formatarData(t.prazo)}</span>}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Métricas financeiras */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={16} className="text-[#c9a84c]" />
            <h2 className="text-sm font-semibold text-gray-900">Financeiro — Mês Atual</h2>
            <Link href="/financeiro" className="ml-auto text-xs text-[#c9a84c] hover:underline flex items-center gap-1">
              Ver detalhes <ArrowRight size={11} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-base font-bold text-green-700">{formatarMoeda(data?.financeiro.receitas ?? 0)}</div>
                <div className="text-xs text-green-600 mt-0.5 font-medium">Receitas</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-base font-bold text-red-700">{formatarMoeda(data?.financeiro.despesas ?? 0)}</div>
                <div className="text-xs text-red-600 mt-0.5 font-medium">Despesas</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${(data?.financeiro.receitas ?? 0) >= (data?.financeiro.despesas ?? 0) ? "bg-blue-50" : "bg-amber-50"}`}>
                <div className={`text-base font-bold ${(data?.financeiro.receitas ?? 0) >= (data?.financeiro.despesas ?? 0) ? "text-blue-700" : "text-amber-700"}`}>
                  {formatarMoeda((data?.financeiro.receitas ?? 0) - (data?.financeiro.despesas ?? 0))}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 font-medium">Saldo</div>
              </div>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{data?.kpis.clientes ?? "—"}</div>
              <div className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                <Users size={11} /> Clientes cadastrados
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{data?.kpis.processosAtivos ?? "—"}</div>
              <div className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                <TrendingUp size={11} /> Processos ativos
              </div>
            </div>
          </div>
        </div>

        {/* Execuções IA */}
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
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Intimações Críticas", valor: data?.kpis.intimacoesCriticas ?? "—", cor: "text-red-400" },
              { label: "Prazos Esta Semana", valor: data?.kpis.prazosProximos ?? "—", cor: "text-amber-400" },
              { label: "Tarefas Pendentes", valor: data?.kpis.tarefasPendentes ?? "—", cor: "text-white" },
              { label: "Processos Encerrados", valor: data?.kpis.processosEncerrados ?? "—", cor: "text-[#c9a84c]" },
            ].map((e) => (
              <div key={e.label} className="bg-white/5 rounded-lg p-3 text-center">
                <div className={`text-lg font-bold ${e.cor}`}>{e.valor}</div>
                <div className="text-white/40 text-xs mt-0.5">{e.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] mt-1.5 shrink-0 animate-pulse" />
              <div>
                <div className="text-white text-xs font-medium mb-0.5">IA Jurídica</div>
                <div className="text-white/50 text-xs leading-relaxed">
                  Configure sua chave OpenAI em <span className="text-[#c9a84c] font-mono text-[10px]">.env</span> para ativar análise automática de intimações e sugestões estratégicas de execução.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
