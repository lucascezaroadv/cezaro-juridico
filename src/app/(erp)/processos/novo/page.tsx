"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Plus, X, User, Building2 } from "lucide-react";
import Link from "next/link";
import { AREA_JURIDICA_LABELS } from "@/shared/types";

// ── Componente de múltiplas partes ─────────────────────────────────────────────
function PartesInput({
  label, polo, value, onChange,
}: {
  label: string;
  polo: "ativo" | "passivo";
  value: string;
  onChange: (v: string) => void;
}) {
  const cor = polo === "ativo" ? "text-blue-600 bg-blue-50 border-blue-200" : "text-red-600 bg-red-50 border-red-200";
  const corBtn = polo === "ativo" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700";
  const Icon = polo === "ativo" ? User : Building2;

  const partes = value ? value.split(" | ").filter(Boolean) : [];
  const [novo, setNovo] = useState("");

  const adicionar = () => {
    const nome = novo.trim();
    if (!nome) return;
    const novas = [...partes, nome];
    onChange(novas.join(" | "));
    setNovo("");
  };

  const remover = (i: number) => {
    const novas = partes.filter((_, idx) => idx !== i);
    onChange(novas.join(" | "));
  };

  const editar = (i: number, val: string) => {
    const novas = [...partes];
    novas[i] = val;
    onChange(novas.join(" | "));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700">
        <span className="flex items-center gap-1.5">
          <Icon size={12} />
          {label}
        </span>
      </label>

      {/* Lista de partes já adicionadas */}
      {partes.length > 0 && (
        <div className="space-y-1.5">
          {partes.map((p, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${cor}`}>
              <span className="w-4 h-4 rounded-full bg-white/70 flex items-center justify-center text-[9px] font-bold shrink-0">
                {i + 1}
              </span>
              <input
                value={p}
                onChange={e => editar(i, e.target.value)}
                className="flex-1 bg-transparent outline-none text-xs font-medium placeholder:opacity-50"
                placeholder="Nome da parte..."
              />
              <button type="button" onClick={() => remover(i)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Campo para nova parte */}
      <div className="flex gap-2">
        <input
          value={novo}
          onChange={e => setNovo(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); adicionar(); } }}
          placeholder={`Adicionar ${polo === "ativo" ? "autor/reclamante" : "réu/reclamado"}...`}
          className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10"
        />
        <button
          type="button"
          onClick={adicionar}
          disabled={!novo.trim()}
          className={`px-3 py-2 text-white text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors flex items-center gap-1 ${corBtn}`}
        >
          <Plus size={12} />
          Add
        </button>
      </div>
      {partes.length === 0 && (
        <p className="text-[10px] text-gray-400">Pressione Enter ou clique em Add para incluir cada parte separadamente.</p>
      )}
    </div>
  );
}

const schema = z.object({
  numero: z.string().min(1, "Número do processo é obrigatório"),
  clienteId: z.string().min(1, "Selecione um cliente"),
  areaJuridica: z.enum([
    "TRABALHISTA","EMPRESARIAL","EXECUCAO_CREDITO","LGPD",
    "CONSULTORIA","CONTRATOS","COMPLIANCE","CIVIL","TRIBUTARIO","PREVIDENCIARIO","OUTRO"
  ], { error: "Selecione a área jurídica" }),
  tribunal: z.string().optional(),
  vara: z.string().optional(),
  comarca: z.string().optional(),
  uf: z.string().max(2).optional(),
  assunto: z.string().optional(),
  fase: z.enum(["CONHECIMENTO","RECURSAL","EXECUCAO","CUMPRIMENTO_SENTENCA","ARQUIVADO"]).optional(),
  poloAtivo: z.string().optional(),
  poloPassivo: z.string().optional(),
  valorCausa: z.string().optional(),
  honorarios: z.string().optional(),
  percentualExito: z.string().optional(),
  dataDistribuicao: z.string().optional(),
  advogadoId: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Cliente = { id: string; nome: string; cpfCnpj: string | null };

export default function NovoProcessoPageWrapper() {
  return (
    <Suspense>
      <NovoProcessoPage />
    </Suspense>
  );
}

function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteIdParam = searchParams.get("clienteId") ?? "";
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [poloAtivo, setPoloAtivo] = useState("");
  const [poloPassivo, setPoloPassivo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clienteId: clienteIdParam },
  });

  useEffect(() => {
    fetch("/api/v1/clientes?limit=200")
      .then((r) => r.json())
      .then((d) => setClientes(d.clientes ?? []));
  }, []);

  const onSubmit = async (data: FormData) => {
    setSalvando(true);
    try {
      const payload = {
        ...data,
        poloAtivo: poloAtivo || undefined,
        poloPassivo: poloPassivo || undefined,
        valorCausa: data.valorCausa ? Number(data.valorCausa) : undefined,
        honorarios: data.honorarios ? Number(data.honorarios) : undefined,
        percentualExito: data.percentualExito ? Number(data.percentualExito) : undefined,
      };

      const res = await fetch("/api/v1/processos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error("Erro ao cadastrar processo", { description: err.error });
        return;
      }

      const processo = await res.json();
      toast.success("Processo cadastrado com sucesso!");
      router.push(`/processos/${processo.id}`);
    } finally {
      setSalvando(false);
    }
  };

  const Field = ({
    label, error, children, required,
  }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (error?: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      error
        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
        : "border-gray-200 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]"
    }`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/processos"
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Novo Processo</h1>
          <p className="text-sm text-gray-500">Cadastre um novo processo judicial ou administrativo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Identificação */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Identificação do Processo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Número do Processo" error={errors.numero?.message} required>
              <input
                {...register("numero")}
                placeholder="0000000-00.0000.0.00.0000"
                className={inputCls(errors.numero?.message)}
              />
            </Field>

            <Field label="Cliente" error={errors.clienteId?.message} required>
              <select {...register("clienteId")} className={inputCls(errors.clienteId?.message)}>
                <option value="">Selecione o cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}{c.cpfCnpj ? ` — ${c.cpfCnpj}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Área Jurídica" error={errors.areaJuridica?.message} required>
              <select {...register("areaJuridica")} className={inputCls(errors.areaJuridica?.message)}>
                <option value="">Selecione...</option>
                {Object.entries(AREA_JURIDICA_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </Field>

            <Field label="Fase Processual" error={errors.fase?.message}>
              <select {...register("fase")} className={inputCls(errors.fase?.message)}>
                <option value="CONHECIMENTO">Conhecimento</option>
                <option value="RECURSAL">Recursal</option>
                <option value="EXECUCAO">Execução</option>
                <option value="CUMPRIMENTO_SENTENCA">Cumprimento de Sentença</option>
                <option value="ARQUIVADO">Arquivado</option>
              </select>
            </Field>

            <Field label="Assunto" error={errors.assunto?.message}>
              <input
                {...register("assunto")}
                placeholder="Ex: Horas extras, Adicional de insalubridade..."
                className={inputCls(errors.assunto?.message)}
              />
            </Field>

            <Field label="Data de Distribuição" error={errors.dataDistribuicao?.message}>
              <input
                type="date"
                {...register("dataDistribuicao")}
                className={inputCls(errors.dataDistribuicao?.message)}
              />
            </Field>
          </div>
        </section>

        {/* Localização */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Localização Judicial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Tribunal" error={errors.tribunal?.message}>
              <input {...register("tribunal")} placeholder="Ex: TRT 1ª Região" className={inputCls(errors.tribunal?.message)} />
            </Field>
            <Field label="Vara" error={errors.vara?.message}>
              <input {...register("vara")} placeholder="Ex: 5ª Vara do Trabalho" className={inputCls(errors.vara?.message)} />
            </Field>
            <Field label="Comarca" error={errors.comarca?.message}>
              <input {...register("comarca")} placeholder="Ex: Capital" className={inputCls(errors.comarca?.message)} />
            </Field>
            <div className="md:col-span-3 grid md:grid-cols-2 gap-6 mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <PartesInput
                label="Polo Ativo — Autor(es) / Reclamante(s)"
                polo="ativo"
                value={poloAtivo}
                onChange={setPoloAtivo}
              />
              <PartesInput
                label="Polo Passivo — Réu(s) / Reclamado(s)"
                polo="passivo"
                value={poloPassivo}
                onChange={setPoloPassivo}
              />
            </div>
            <Field label="UF" error={errors.uf?.message}>
              <input {...register("uf")} placeholder="RJ" maxLength={2} className={inputCls(errors.uf?.message)} />
            </Field>
          </div>
        </section>

        {/* Financeiro */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Informações Financeiras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Valor da Causa (R$)" error={errors.valorCausa?.message}>
              <input type="number" step="0.01" {...register("valorCausa")} placeholder="0,00" className={inputCls(errors.valorCausa?.message)} />
            </Field>
            <Field label="Honorários (R$)" error={errors.honorarios?.message}>
              <input type="number" step="0.01" {...register("honorarios")} placeholder="0,00" className={inputCls(errors.honorarios?.message)} />
            </Field>
            <Field label="% de Êxito" error={errors.percentualExito?.message}>
              <input type="number" step="0.01" {...register("percentualExito")} placeholder="20" className={inputCls(errors.percentualExito?.message)} />
            </Field>
          </div>
        </section>

        {/* Observações */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Observações
          </h2>
          <textarea
            {...register("observacoes")}
            rows={4}
            placeholder="Informações adicionais sobre o processo..."
            className={`${inputCls(errors.observacoes?.message)} resize-none`}
          />
        </section>

        {/* Ações */}
        <div className="flex items-center gap-3 justify-end pb-6">
          <Link
            href="/processos"
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {salvando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {salvando ? "Salvando..." : "Salvar Processo"}
          </button>
        </div>
      </form>
    </div>
  );
}
