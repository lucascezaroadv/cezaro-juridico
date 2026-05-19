"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  tipo: z.enum(["PESSOA_FISICA", "PESSOA_JURIDICA"]),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpfCnpj: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().max(2).optional(),
  cep: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NovoClientePage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: "PESSOA_FISICA" },
  });

  const tipo = watch("tipo");

  const onSubmit = async (data: FormData) => {
    setSalvando(true);
    try {
      const res = await fetch("/api/v1/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let json: Record<string, unknown> = {};
      try { json = await res.json(); } catch { /* resposta não era JSON */ }

      if (!res.ok) {
        toast.error("Erro ao cadastrar cliente", {
          description: (json.error as string) ?? `Código HTTP ${res.status}`,
        });
        return;
      }
      toast.success("Cliente cadastrado com sucesso!");
      router.push(`/clientes/${json.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro de rede", { description: "Não foi possível conectar ao servidor." });
    } finally {
      setSalvando(false);
    }
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      err ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]"
    }`;

  const F = ({ label, err, children, req }: { label: string; err?: string; children: React.ReactNode; req?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label} {req && <span className="text-red-500">*</span>}
      </label>
      {children}
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/clientes" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-sm text-gray-500">Cadastre um novo cliente pessoa física ou jurídica</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errs) => {
        console.error("Erros de validação:", errs);
        toast.error("Preencha os campos obrigatórios", { description: Object.values(errs).map((e) => e?.message).filter(Boolean).join(", ") });
      })} className="space-y-5">
        {/* Tipo */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Tipo de Cliente
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(["PESSOA_FISICA", "PESSOA_JURIDICA"] as const).map((t) => (
              <label
                key={t}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  tipo === t ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <input type="radio" value={t} {...register("tipo")} className="accent-[#c9a84c]" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t === "PESSOA_FISICA" ? "Pessoa Física" : "Pessoa Jurídica"}</p>
                  <p className="text-xs text-gray-400">{t === "PESSOA_FISICA" ? "CPF" : "CNPJ"}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Dados principais */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Dados Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <F label={tipo === "PESSOA_JURIDICA" ? "Razão Social" : "Nome Completo"} err={errors.nome?.message} req>
              <input {...register("nome")} placeholder={tipo === "PESSOA_JURIDICA" ? "Nome da empresa" : "Nome completo"} className={inputCls(errors.nome?.message)} />
            </F>
            <F label={tipo === "PESSOA_JURIDICA" ? "CNPJ" : "CPF"} err={errors.cpfCnpj?.message}>
              <input {...register("cpfCnpj")} placeholder={tipo === "PESSOA_JURIDICA" ? "00.000.000/0000-00" : "000.000.000-00"} className={inputCls(errors.cpfCnpj?.message)} />
            </F>
            <F label="E-mail" err={errors.email?.message}>
              <input type="email" {...register("email")} placeholder="email@exemplo.com" className={inputCls(errors.email?.message)} />
            </F>
            <F label="Telefone" err={errors.telefone?.message}>
              <input {...register("telefone")} placeholder="(00) 00000-0000" className={inputCls(errors.telefone?.message)} />
            </F>
            <F label="WhatsApp" err={errors.whatsapp?.message}>
              <input {...register("whatsapp")} placeholder="(00) 00000-0000" className={inputCls(errors.whatsapp?.message)} />
            </F>
          </div>
        </section>

        {/* Endereço */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Endereço
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <F label="Endereço" err={errors.endereco?.message}>
                <input {...register("endereco")} placeholder="Rua, número, complemento" className={inputCls(errors.endereco?.message)} />
              </F>
            </div>
            <F label="Cidade" err={errors.cidade?.message}>
              <input {...register("cidade")} placeholder="Cidade" className={inputCls(errors.cidade?.message)} />
            </F>
            <F label="Estado (UF)" err={errors.estado?.message}>
              <input {...register("estado")} placeholder="RJ" maxLength={2} className={inputCls(errors.estado?.message)} />
            </F>
            <F label="CEP" err={errors.cep?.message}>
              <input {...register("cep")} placeholder="00000-000" className={inputCls(errors.cep?.message)} />
            </F>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Observações
          </h2>
          <textarea
            {...register("observacoes")}
            rows={3}
            placeholder="Informações adicionais sobre o cliente..."
            className={`${inputCls()} resize-none`}
          />
        </section>

        <div className="flex items-center gap-3 justify-end pb-6">
          <Link href="/clientes" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {salvando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {salvando ? "Salvando..." : "Salvar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}
