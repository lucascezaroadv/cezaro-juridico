"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, TrendingUp, TrendingDown, Plus, RefreshCw, X, Loader2 } from "lucide-react";
import { formatarMoeda, formatarData } from "@/shared/utils/formatters";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type Lancamento = {
  id: string;
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  valor: number;
  vencimento: string;
  categoria: string | null;
};

type Resumo = { receitas: number; despesas: number; saldo: number };

const novoSchema = z.object({
  tipo: z.enum(["RECEITA", "DESPESA"]),
  descricao: z.string().min(1, "Descrição obrigatória"),
  valor: z.number().positive("Valor deve ser positivo"),
  vencimento: z.string().min(1, "Data obrigatória"),
  categoria: z.string().optional(),
  observacoes: z.string().optional(),
});

type NovoForm = z.infer<typeof novoSchema>;

const mesAtual = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [resumo, setResumo] = useState<Resumo>({ receitas: 0, despesas: 0, saldo: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(mesAtual());
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [modal, setModal] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NovoForm>({
    resolver: zodResolver(novoSchema),
    defaultValues: { tipo: "RECEITA", vencimento: new Date().toISOString().slice(0, 10) },
  });

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ mes });
      if (tipoFiltro) params.set("tipo", tipoFiltro);
      const res = await fetch(`/api/v1/financeiro/lancamentos?${params.toString()}`);
      const data = await res.json();
      setLancamentos(data.lancamentos ?? []);
      setResumo(data.resumo ?? { receitas: 0, despesas: 0, saldo: 0 });
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [mes, tipoFiltro]);

  useEffect(() => { buscar(); }, [buscar]);

  const criar = async (data: NovoForm) => {
    setSalvando(true);
    try {
      const res = await fetch("/api/v1/financeiro/lancamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { toast.error("Erro ao criar lançamento"); return; }
      toast.success("Lançamento criado!");
      reset({ tipo: "RECEITA", vencimento: new Date().toISOString().slice(0, 10) });
      setModal(false);
      buscar();
    } finally {
      setSalvando(false);
    }
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      err ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]"
    }`;

  // Months navigation
  const mudarMes = (delta: number) => {
    const [y, m] = mes.split("-").map(Number);
    const d = new Date(y, m - 1 + delta);
    setMes(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const nomeMes = new Date(`${mes}-01`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={20} className="text-[#c9a84c]" />
            Financeiro
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{nomeMes}</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo Lançamento
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={15} className="text-green-500" />
            <span className="text-xs font-semibold text-gray-500">Receitas</span>
          </div>
          <p className="text-xl font-bold text-green-600">{formatarMoeda(resumo.receitas)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={15} className="text-red-500" />
            <span className="text-xs font-semibold text-gray-500">Despesas</span>
          </div>
          <p className="text-xl font-bold text-red-600">{formatarMoeda(resumo.despesas)}</p>
        </div>
        <div className={`rounded-xl border p-5 ${resumo.saldo >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={15} className={resumo.saldo >= 0 ? "text-green-500" : "text-red-500"} />
            <span className="text-xs font-semibold text-gray-500">Saldo</span>
          </div>
          <p className={`text-xl font-bold ${resumo.saldo >= 0 ? "text-green-700" : "text-red-700"}`}>{formatarMoeda(resumo.saldo)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => mudarMes(-1)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors text-sm font-bold">←</button>
          <span className="text-sm font-semibold text-gray-700 min-w-36 text-center capitalize">{nomeMes}</span>
          <button onClick={() => mudarMes(1)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors text-sm font-bold">→</button>
        </div>

        <div className="flex rounded-lg border border-gray-200 overflow-hidden ml-4">
          {[{ value: "", label: "Todos" }, { value: "RECEITA", label: "Receitas" }, { value: "DESPESA", label: "Despesas" }].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTipoFiltro(opt.value)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${tipoFiltro === opt.value ? "bg-[#060d1a] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button onClick={buscar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
              <div className="h-2.5 w-1/4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : lancamentos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
          <DollarSign size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum lançamento neste período</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {lancamentos.map((l, i) => (
            <div
              key={l.id}
              className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${l.tipo === "RECEITA" ? "bg-green-400" : "bg-red-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{l.descricao}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                  <span>{formatarData(l.vencimento)}</span>
                  {l.categoria && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">{l.categoria}</span>}
                </div>
              </div>
              <p className={`text-sm font-bold shrink-0 ${l.tipo === "RECEITA" ? "text-green-600" : "text-red-600"}`}>
                {l.tipo === "DESPESA" ? "-" : "+"}{formatarMoeda(l.valor)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Novo Lançamento</h2>
              <button onClick={() => setModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(criar)} className="p-5 space-y-4">
              {/* Tipo toggle */}
              <div className="grid grid-cols-2 gap-2">
                {(["RECEITA", "DESPESA"] as const).map(t => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" value={t} {...register("tipo")} className="sr-only" />
                    <div className={`text-center py-2.5 rounded-lg border-2 text-xs font-bold transition-all ${
                      t === "RECEITA"
                        ? "peer-checked:border-green-500 [&:has(input:checked)]:border-green-500 [&:has(input:checked)]:bg-green-50 [&:has(input:checked)]:text-green-700 border-gray-200 text-gray-500"
                        : "peer-checked:border-red-500 [&:has(input:checked)]:border-red-500 [&:has(input:checked)]:bg-red-50 [&:has(input:checked)]:text-red-700 border-gray-200 text-gray-500"
                    }`}>
                      {t === "RECEITA" ? "Receita" : "Despesa"}
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Descrição <span className="text-red-500">*</span></label>
                <input {...register("descricao")} placeholder="Honorários, aluguel..." className={inputCls(errors.descricao?.message)} />
                {errors.descricao && <p className="text-xs text-red-500 mt-1">{errors.descricao.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Valor (R$) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" {...register("valor", { valueAsNumber: true })} placeholder="0,00" className={inputCls(errors.valor?.message)} />
                  {errors.valor && <p className="text-xs text-red-500 mt-1">{errors.valor.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Vencimento <span className="text-red-500">*</span></label>
                  <input type="date" {...register("vencimento")} className={inputCls(errors.vencimento?.message)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Categoria</label>
                <select {...register("categoria")} className={inputCls()}>
                  <option value="">Selecionar</option>
                  <option value="Honorários">Honorários</option>
                  <option value="Custas processuais">Custas processuais</option>
                  <option value="Consultoria">Consultoria</option>
                  <option value="Aluguel">Aluguel</option>
                  <option value="Salários">Salários</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-[#060d1a] text-white text-sm font-medium rounded-lg hover:bg-[#0d1b2a] transition-colors disabled:opacity-60">
                  {salvando ? <Loader2 size={14} className="animate-spin" /> : null}
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
