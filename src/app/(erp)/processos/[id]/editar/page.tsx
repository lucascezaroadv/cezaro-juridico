"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    onChange([...partes, nome].join(" | "));
    setNovo("");
  };

  const remover = (i: number) => onChange(partes.filter((_, idx) => idx !== i).join(" | "));
  const editar = (i: number, val: string) => {
    const novas = [...partes];
    novas[i] = val;
    onChange(novas.join(" | "));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700">
        <span className="flex items-center gap-1.5"><Icon size={12} />{label}</span>
      </label>
      {partes.length > 0 && (
        <div className="space-y-1.5">
          {partes.map((p, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${cor}`}>
              <span className="w-4 h-4 rounded-full bg-white/70 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
              <input value={p} onChange={e => editar(i, e.target.value)} className="flex-1 bg-transparent outline-none text-xs font-medium" />
              <button type="button" onClick={() => remover(i)} className="shrink-0 opacity-50 hover:opacity-100"><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={novo}
          onChange={e => setNovo(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); adicionar(); } }}
          placeholder={`Adicionar ${polo === "ativo" ? "autor/reclamante" : "réu/reclamado"}...`}
          className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10"
        />
        <button type="button" onClick={adicionar} disabled={!novo.trim()}
          className={`px-3 py-2 text-white text-xs font-semibold rounded-lg disabled:opacity-30 transition-colors flex items-center gap-1 ${corBtn}`}>
          <Plus size={12} />Add
        </button>
      </div>
      {partes.length === 0 && <p className="text-[10px] text-gray-400">Pressione Enter ou Add para incluir cada parte.</p>}
    </div>
  );
}

const schema = z.object({
  numero: z.string().min(1, "Número do processo é obrigatório"),
  clienteId: z.string().min(1, "Selecione um cliente"),
  areaJuridica: z.enum([
    "TRABALHISTA","EMPRESARIAL","EXECUCAO_CREDITO","LGPD",
    "CONSULTORIA","CONTRATOS","COMPLIANCE","CIVIL","TRIBUTARIO","PREVIDENCIARIO","OUTRO"
  ]),
  tribunal: z.string().optional(),
  vara: z.string().optional(),
  comarca: z.string().optional(),
  uf: z.string().max(2).optional(),
  assunto: z.string().optional(),
  fase: z.enum(["CONHECIMENTO","RECURSAL","EXECUCAO","CUMPRIMENTO_SENTENCA","ARQUIVADO"]).optional(),
  valorCausa: z.string().optional(),
  honorarios: z.string().optional(),
  percentualExito: z.string().optional(),
  dataDistribuicao: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Cliente = { id: string; nome: string; cpfCnpj: string | null };

export default function EditarProcessoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [poloAtivo, setPoloAtivo] = useState("");
  const [poloPassivo, setPoloPassivo] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/processos/${id}`).then(r => r.json()),
      fetch("/api/v1/clientes?limit=200").then(r => r.json()),
    ]).then(([processo, clientesData]) => {
      setClientes(clientesData.clientes ?? []);
      setPoloAtivo(processo.poloAtivo ?? "");
      setPoloPassivo(processo.poloPassivo ?? "");
      reset({
        numero: processo.numero ?? "",
        clienteId: processo.clienteId ?? "",
        areaJuridica: processo.areaJuridica,
        tribunal: processo.tribunal ?? "",
        vara: processo.vara ?? "",
        comarca: processo.comarca ?? "",
        uf: processo.uf ?? "",
        assunto: processo.assunto ?? "",
        fase: processo.fase,
        valorCausa: processo.valorCausa != null ? String(processo.valorCausa) : "",
        honorarios: processo.honorarios != null ? String(processo.honorarios) : "",
        percentualExito: processo.percentualExito != null ? String(processo.percentualExito) : "",
        dataDistribuicao: processo.dataDistribuicao ? processo.dataDistribuicao.slice(0, 10) : "",
        observacoes: processo.observacoes ?? "",
      });
      setCarregando(false);
    }).catch(() => {
      toast.error("Erro ao carregar dados do processo");
      setCarregando(false);
    });
  }, [id, reset]);

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

      const res = await fetch(`/api/v1/processos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let json: { error?: string } = {};
      try { json = await res.json(); } catch { /* ignore */ }

      if (!res.ok) {
        toast.error("Erro ao salvar", { description: json.error ?? `HTTP ${res.status}` });
        return;
      }

      toast.success("Processo atualizado com sucesso!");
      router.push(`/processos/${id}`);
    } catch (e) {
      toast.error("Erro inesperado", { description: String(e) });
    } finally {
      setSalvando(false);
    }
  };

  const Field = ({ label, error, children, required }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) => (
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
      error ? "border-red-300 focus:ring-red-100 focus:border-red-400"
             : "border-gray-200 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]"
    }`;

  if (carregando) return (
    <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-gray-400" size={28} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/processos/${id}`} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Editar Processo</h1>
          <p className="text-sm text-gray-500">Atualize os dados do processo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errs) => {
        const first = Object.values(errs)[0];
        toast.error("Verifique os campos obrigatórios", { description: first?.message as string });
      })} className="space-y-5">

        {/* Identificação */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />Identificação do Processo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Número do Processo" error={errors.numero?.message} required>
              <input {...register("numero")} placeholder="0000000-00.0000.0.00.0000" className={inputCls(errors.numero?.message)} />
            </Field>

            <Field label="Cliente" error={errors.clienteId?.message} required>
              <select {...register("clienteId")} className={inputCls(errors.clienteId?.message)}>
                <option value="">Selecione o cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}{c.cpfCnpj ? ` — ${c.cpfCnpj}` : ""}</option>
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

            <Field label="Fase Processual">
              <select {...register("fase")} className={inputCls()}>
                <option value="CONHECIMENTO">Conhecimento</option>
                <option value="RECURSAL">Recursal</option>
                <option value="EXECUCAO">Execução</option>
                <option value="CUMPRIMENTO_SENTENCA">Cumprimento de Sentença</option>
                <option value="ARQUIVADO">Arquivado</option>
              </select>
            </Field>

            <Field label="Assunto">
              <input {...register("assunto")} placeholder="Ex: Horas extras..." className={inputCls()} />
            </Field>

            <Field label="Data de Distribuição">
              <input type="date" {...register("dataDistribuicao")} className={inputCls()} />
            </Field>
          </div>
        </section>

        {/* Localização */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />Localização Judicial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Tribunal">
              <input {...register("tribunal")} placeholder="Ex: TRT 1ª Região" className={inputCls()} />
            </Field>
            <Field label="Vara">
              <input {...register("vara")} placeholder="Ex: 5ª Vara do Trabalho" className={inputCls()} />
            </Field>
            <Field label="Comarca">
              <input {...register("comarca")} placeholder="Ex: Capital" className={inputCls()} />
            </Field>
            <div className="md:col-span-3 grid md:grid-cols-2 gap-6 mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <PartesInput label="Polo Ativo — Autor(es) / Reclamante(s)" polo="ativo" value={poloAtivo} onChange={setPoloAtivo} />
              <PartesInput label="Polo Passivo — Réu(s) / Reclamado(s)" polo="passivo" value={poloPassivo} onChange={setPoloPassivo} />
            </div>
            <Field label="UF">
              <input {...register("uf")} placeholder="RJ" maxLength={2} className={inputCls()} />
            </Field>
          </div>
        </section>

        {/* Financeiro */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />Informações Financeiras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Valor da Causa (R$)">
              <input type="number" step="0.01" {...register("valorCausa")} placeholder="0,00" className={inputCls()} />
            </Field>
            <Field label="Honorários (R$)">
              <input type="number" step="0.01" {...register("honorarios")} placeholder="0,00" className={inputCls()} />
            </Field>
            <Field label="% de Êxito">
              <input type="number" step="0.01" {...register("percentualExito")} placeholder="20" className={inputCls()} />
            </Field>
          </div>
        </section>

        {/* Observações */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />Observações
          </h2>
          <textarea {...register("observacoes")} rows={4} placeholder="Informações adicionais..." className={`${inputCls()} resize-none`} />
        </section>

        {/* Ações */}
        <div className="flex items-center gap-3 justify-end pb-6">
          <Link href={`/processos/${id}`} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={salvando}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
            {salvando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
