"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Edit2, Bell, CalendarDays, FileText,
  CheckSquare, Zap, Plus, Clock, User, Gavel
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AREA_JURIDICA_LABELS, FASE_LABELS } from "@/shared/types";
import { formatarData, formatarDataHora, formatarMoeda } from "@/shared/utils/formatters";

type Processo = {
  id: string;
  numero: string;
  areaJuridica: string;
  fase: string;
  status: string;
  assunto: string | null;
  tribunal: string | null;
  vara: string | null;
  comarca: string | null;
  uf: string | null;
  poloAtivo: string | null;
  poloPassivo: string | null;
  valorCausa: number | null;
  honorarios: number | null;
  percentualExito: number | null;
  dataDistribuicao: string | null;
  observacoes: string | null;
  atualizadoEm: string;
  cliente: { id: string; nome: string; telefone: string | null; email: string | null };
  advogado: { id: string; nome: string } | null;
  movimentacoes: { id: string; data: string; descricao: string; resumoIA: string | null }[];
  intimacoes: { id: string; titulo: string; dataPublicacao: string; urgencia: string; status: string }[];
  prazos: { id: string; titulo: string; dataVencimento: string; tipo: string; status: string }[];
  tarefas: { id: string; titulo: string; prazo: string | null; prioridade: string; status: string }[];
  audiencias: { id: string; tipo: string; data: string; local: string | null; status: string }[];
  diligencias: { id: string; tipo: string; data: string; resultado: string; observacoes: string | null }[];
};

type AbaId = "timeline" | "intimacoes" | "prazos" | "tarefas" | "audiencias" | "diligencias";

export default function ProcessoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState<AbaId>("timeline");

  useEffect(() => {
    fetch(`/api/v1/processos/${id}`)
      .then((r) => r.json())
      .then((d) => setProcesso(d))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-40 bg-white rounded-xl border border-gray-100" />
    </div>
  );

  if (!processo) return (
    <div className="text-center py-24 text-gray-400">
      <Gavel size={40} className="mx-auto mb-3 opacity-30" />
      <p>Processo não encontrado.</p>
      <Link href="/processos" className="text-[#c9a84c] text-sm mt-2 inline-block hover:underline">← Voltar</Link>
    </div>
  );

  const abas: { id: AbaId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "timeline", label: "Movimentações", icon: Clock, count: processo.movimentacoes.length },
    { id: "intimacoes", label: "Intimações", icon: Bell, count: processo.intimacoes.length },
    { id: "prazos", label: "Prazos", icon: CalendarDays, count: processo.prazos.length },
    { id: "tarefas", label: "Tarefas", icon: CheckSquare, count: processo.tarefas.length },
    { id: "audiencias", label: "Audiências", icon: Gavel, count: processo.audiencias.length },
    { id: "diligencias", label: "Diligências", icon: Zap, count: processo.diligencias.length },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/processos" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-colors mt-1">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-mono text-lg font-bold text-gray-900">{processo.numero}</h1>
            <StatusBadge status={processo.status} />
            <StatusBadge status={processo.fase} />
          </div>
          {processo.assunto && <p className="text-sm text-gray-500 mt-0.5">{processo.assunto}</p>}
        </div>
        <Link
          href={`/processos/${id}/editar`}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-colors"
        >
          <Edit2 size={14} />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sidebar esquerda — dados do processo */}
        <div className="lg:col-span-1 space-y-4">
          {/* Partes */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Partes</h3>
            <div className="space-y-3">
              {processo.poloAtivo && (
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Polo Ativo</span>
                  <p className="text-sm text-gray-800 mt-0.5">{processo.poloAtivo}</p>
                </div>
              )}
              {processo.poloPassivo && (
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Polo Passivo</span>
                  <p className="text-sm text-gray-800 mt-0.5">{processo.poloPassivo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Localização</h3>
            <dl className="space-y-2.5 text-sm">
              {[
                ["Tribunal", processo.tribunal],
                ["Vara", processo.vara],
                ["Comarca", processo.comarca],
                ["UF", processo.uf],
                ["Área", AREA_JURIDICA_LABELS[processo.areaJuridica as keyof typeof AREA_JURIDICA_LABELS]],
                ["Distribuição", processo.dataDistribuicao ? formatarData(processo.dataDistribuicao) : null],
              ].map(([k, v]) => v ? (
                <div key={String(k)} className="flex justify-between gap-2">
                  <dt className="text-gray-400 shrink-0">{k}</dt>
                  <dd className="text-gray-800 text-right">{v}</dd>
                </div>
              ) : null)}
            </dl>
          </div>

          {/* Financeiro */}
          {(processo.valorCausa || processo.honorarios || processo.percentualExito) && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Financeiro</h3>
              <dl className="space-y-2.5 text-sm">
                {processo.valorCausa && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Valor da Causa</dt>
                    <dd className="font-semibold text-gray-800">{formatarMoeda(processo.valorCausa)}</dd>
                  </div>
                )}
                {processo.honorarios && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Honorários</dt>
                    <dd className="font-semibold text-gray-800">{formatarMoeda(processo.honorarios)}</dd>
                  </div>
                )}
                {processo.percentualExito && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">% Êxito</dt>
                    <dd className="font-semibold text-gray-800">{processo.percentualExito}%</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Cliente */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Cliente</h3>
            <Link href={`/clientes/${processo.cliente.id}`} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#c9a84c] transition-colors">
                  {processo.cliente.nome}
                </p>
                {processo.cliente.telefone && (
                  <p className="text-xs text-gray-400">{processo.cliente.telefone}</p>
                )}
              </div>
            </Link>
          </div>

          {/* Advogado */}
          {processo.advogado && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Advogado Responsável</h3>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#060d1a]/10 flex items-center justify-center">
                  <Gavel size={16} className="text-[#060d1a]" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{processo.advogado.nome}</p>
              </div>
            </div>
          )}

          {processo.observacoes && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Observações</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{processo.observacoes}</p>
            </div>
          )}
        </div>

        {/* Conteúdo principal — abas */}
        <div className="lg:col-span-2 space-y-4">
          {/* Abas */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {abas.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAba(a.id)}
                    className={`flex items-center gap-2 px-4 py-3.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                      aba === a.id
                        ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/5"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={14} />
                    {a.label}
                    {a.count !== undefined && a.count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        aba === a.id ? "bg-[#c9a84c]/20 text-[#c9a84c]" : "bg-gray-100 text-gray-500"
                      }`}>
                        {a.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-5">
              {/* Timeline de Movimentações */}
              {aba === "timeline" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-500">{processo.movimentacoes.length} movimentações</p>
                    <button className="inline-flex items-center gap-1.5 text-xs text-[#c9a84c] font-medium hover:underline">
                      <Plus size={12} /> Registrar
                    </button>
                  </div>
                  {processo.movimentacoes.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Nenhuma movimentação registrada</div>
                  ) : (
                    <ol className="relative border-l border-gray-200 space-y-6 ml-3">
                      {processo.movimentacoes.map((m) => (
                        <li key={m.id} className="ml-6">
                          <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-[#c9a84c]/20 border-2 border-[#c9a84c] flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                          </span>
                          <time className="text-[10px] text-gray-400 font-medium">{formatarDataHora(m.data)}</time>
                          <p className="text-sm text-gray-800 mt-1 leading-snug">{m.descricao}</p>
                          {m.resumoIA && (
                            <div className="mt-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
                              <span className="font-bold">IA: </span>{m.resumoIA}
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}

              {/* Intimações */}
              {aba === "intimacoes" && (
                <div className="space-y-3">
                  {processo.intimacoes.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">Nenhuma intimação registrada</p>
                  ) : processo.intimacoes.map((int) => (
                    <div key={int.id} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#c9a84c]/30 transition-colors">
                      <Bell size={15} className="text-[#c9a84c] mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{int.titulo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={int.urgencia} />
                          <StatusBadge status={int.status} />
                          <span className="text-xs text-gray-400">{formatarData(int.dataPublicacao)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Prazos */}
              {aba === "prazos" && (
                <div className="space-y-3">
                  {processo.prazos.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">Nenhum prazo pendente</p>
                  ) : processo.prazos.map((p) => {
                    const vencimento = new Date(p.dataVencimento);
                    const hoje = new Date();
                    const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / 86400000);
                    return (
                      <div key={p.id} className={`flex items-center gap-3 p-3.5 rounded-lg border transition-colors ${
                        diasRestantes <= 0 ? "bg-red-50 border-red-200" :
                        diasRestantes <= 3 ? "bg-orange-50 border-orange-200" :
                        "bg-gray-50 border-gray-100"
                      }`}>
                        <CalendarDays size={15} className={
                          diasRestantes <= 0 ? "text-red-500" :
                          diasRestantes <= 3 ? "text-orange-500" : "text-gray-400"
                        } />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{p.titulo}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatarData(p.dataVencimento)}</p>
                        </div>
                        <span className={`text-xs font-bold ${
                          diasRestantes <= 0 ? "text-red-600" :
                          diasRestantes <= 3 ? "text-orange-600" : "text-gray-500"
                        }`}>
                          {diasRestantes <= 0 ? "Vencido" : `${diasRestantes}d`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tarefas */}
              {aba === "tarefas" && (
                <div className="space-y-2.5">
                  {processo.tarefas.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">Nenhuma tarefa pendente</p>
                  ) : processo.tarefas.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <input type="checkbox" className="accent-[#c9a84c]" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{t.titulo}</p>
                        {t.prazo && <p className="text-xs text-gray-400 mt-0.5">{formatarData(t.prazo)}</p>}
                      </div>
                      <StatusBadge status={t.prioridade} />
                    </div>
                  ))}
                </div>
              )}

              {/* Audiências */}
              {aba === "audiencias" && (
                <div className="space-y-3">
                  {processo.audiencias.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">Nenhuma audiência registrada</p>
                  ) : processo.audiencias.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                      <Gavel size={15} className="text-[#c9a84c] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{a.tipo}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatarDataHora(a.data)}</p>
                        {a.local && <p className="text-xs text-gray-400">{a.local}</p>}
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
                </div>
              )}

              {/* Diligências */}
              {aba === "diligencias" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-gray-500">{processo.diligencias.length} diligências realizadas</p>
                    <button className="inline-flex items-center gap-1.5 text-xs text-[#c9a84c] font-medium hover:underline">
                      <Plus size={12} /> Nova Diligência
                    </button>
                  </div>
                  {processo.diligencias.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">Nenhuma diligência registrada</p>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-100">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-2.5 font-semibold text-gray-500">Data</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-gray-500">Medida</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-gray-500">Resultado</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-gray-500">Observação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {processo.diligencias.map((d) => (
                            <tr key={d.id} className="hover:bg-gray-50/50">
                              <td className="px-4 py-2.5 text-gray-600">{formatarData(d.data)}</td>
                              <td className="px-4 py-2.5 font-semibold text-gray-800">{d.tipo}</td>
                              <td className="px-4 py-2.5"><StatusBadge status={d.resultado} /></td>
                              <td className="px-4 py-2.5 text-gray-500">{d.observacoes ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Sugestão IA */}
                  <div className="mt-4 p-4 bg-[#060d1a] rounded-xl border border-[#c9a84c]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={14} className="text-[#c9a84c]" />
                      <span className="text-xs font-bold text-[#c9a84c]">Sugestão Estratégica da IA</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Analise o histórico de diligências para identificar lacunas. Clique em &ldquo;Gerar Análise&rdquo; para que a IA sugira as próximas medidas executivas.
                    </p>
                    <button className="mt-3 px-3 py-1.5 bg-[#c9a84c] text-[#060d1a] text-xs font-bold rounded-lg hover:bg-[#d4b85a] transition-colors">
                      Gerar Análise
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
