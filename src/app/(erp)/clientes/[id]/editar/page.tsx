"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  tipo: z.enum(["PESSOA_FISICA", "PESSOA_JURIDICA"]),
  nome: z.string().min(2, "Nome é obrigatório"),
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

export default function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const tipo = watch("tipo");

  useEffect(() => {
    fetch(`/api/v1/clientes/${id}`)
      .then((r) => r.json())
      .then((cliente) => {
        reset({
          tipo: cliente.tipo,
          nome: cliente.nome,
          cpfCnpj: cliente.cpfCnpj ?? "",
          email: cliente.email ?? "",
          telefone: cliente.telefone ?? "",
          whatsapp: cliente.whatsapp ?? "",
          endereco: cliente.endereco ?? "",
          cidade: cliente.cidade ?? "",
          estado: cliente.estado ?? "",
          cep: cliente.cep ?? "",
          observacoes: cliente.observacoes ?? "",
        });
        setCarregando(false);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados do cliente");
        setCarregando(false);
      });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setSalvando(true);
    try {
      const payload = {
        ...data,
        cpfCnpj: data.cpfCnpj || undefined,
        email: data.email || undefined,
        telefone: data.telefone || undefined,
        whatsapp: data.whatsapp || undefined,
        endereco: data.endereco || undefined,
        cidade: data.cidade || undefined,
        estado: data.estado || undefined,
        cep: data.cep || undefined,
        observacoes: data.observacoes || undefined,
      };

      const res = await fetch(`/api/v1/clientes/${id}`, {
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

      toast.success("Cliente atualizado com sucesso!");
      router.push(`/clientes/${id}`);
    } catch (e) {
      toast.error("Erro inesperado", { description: String(e) });
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

  if (carregando) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/clientes/${id}`}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-sm text-gray-500">Atualize os dados do cadastro</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errs) => {
        const first = Object.values(errs)[0];
        toast.error("Verifique os campos obrigatórios", { description: first?.message as string });
      })} className="space-y-5">
        {/* Tipo e Nome */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Identificação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tipo de Pessoa" required>
              <select {...register("tipo")} className={inputCls(errors.tipo?.message)}>
                <option value="PESSOA_FISICA">Pessoa Física</option>
                <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
              </select>
            </Field>

            <Field label="Nome Completo / Razão Social" error={errors.nome?.message} required>
              <input
                {...register("nome")}
                placeholder="Nome do cliente..."
                className={inputCls(errors.nome?.message)}
              />
            </Field>

            <Field label={tipo === "PESSOA_JURIDICA" ? "CNPJ" : "CPF"} error={errors.cpfCnpj?.message}>
              <input
                {...register("cpfCnpj")}
                placeholder={tipo === "PESSOA_JURIDICA" ? "00.000.000/0000-00" : "000.000.000-00"}
                className={inputCls(errors.cpfCnpj?.message)}
              />
            </Field>
          </div>
        </section>

        {/* Contato */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
            Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="E-mail" error={errors.email?.message}>
              <input
                type="email"
                {...register("email")}
                placeholder="cliente@email.com"
                className={inputCls(errors.email?.message)}
              />
            </Field>

            <Field label="Telefone" error={errors.telefone?.message}>
              <input
                {...register("telefone")}
                placeholder="(00) 00000-0000"
                className={inputCls(errors.telefone?.message)}
              />
            </Field>

            <Field label="WhatsApp" error={errors.whatsapp?.message}>
              <input
                {...register("whatsapp")}
                placeholder="(00) 00000-0000"
                className={inputCls(errors.whatsapp?.message)}
              />
            </Field>
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
              <Field label="Endereço" error={errors.endereco?.message}>
                <input
                  {...register("endereco")}
                  placeholder="Rua, número, complemento..."
                  className={inputCls(errors.endereco?.message)}
                />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="CEP" error={errors.cep?.message}>
                <input {...register("cep")} placeholder="00000-000" className={inputCls(errors.cep?.message)} />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Cidade" error={errors.cidade?.message}>
                <input {...register("cidade")} placeholder="Cidade" className={inputCls(errors.cidade?.message)} />
              </Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Estado (UF)" error={errors.estado?.message}>
                <input {...register("estado")} placeholder="RJ" maxLength={2} className={inputCls(errors.estado?.message)} />
              </Field>
            </div>
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
            placeholder="Notas internas, informações adicionais..."
            className={`${inputCls(errors.observacoes?.message)} resize-none`}
          />
        </section>

        {/* Ações */}
        <div className="flex items-center gap-3 justify-end pb-6">
          <Link
            href={`/clientes/${id}`}
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
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
