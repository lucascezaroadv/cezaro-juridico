import { cn } from "@/lib/utils";
import type { StatusProcesso, FaseProcessual, NivelUrgencia, EtapaCRM } from "@/shared/types";

const statusConfig: Record<string, { label: string; className: string }> = {
  // Processo status
  ATIVO: { label: "Ativo", className: "bg-green-100 text-green-700" },
  SUSPENSO: { label: "Suspenso", className: "bg-yellow-100 text-yellow-700" },
  ARQUIVADO: { label: "Arquivado", className: "bg-gray-100 text-gray-600" },
  ENCERRADO: { label: "Encerrado", className: "bg-slate-100 text-slate-600" },
  // Fase
  CONHECIMENTO: { label: "Conhecimento", className: "bg-blue-100 text-blue-700" },
  RECURSAL: { label: "Recursal", className: "bg-purple-100 text-purple-700" },
  EXECUCAO: { label: "Execução", className: "bg-orange-100 text-orange-700" },
  CUMPRIMENTO_SENTENCA: { label: "Cumpr. Sentença", className: "bg-indigo-100 text-indigo-700" },
  // Urgência intimação
  CRITICA: { label: "Crítica", className: "bg-red-100 text-red-700 font-bold" },
  ALTA: { label: "Alta", className: "bg-orange-100 text-orange-700" },
  NORMAL: { label: "Normal", className: "bg-blue-100 text-blue-700" },
  BAIXA: { label: "Baixa", className: "bg-gray-100 text-gray-500" },
  // Intimação status
  PENDENTE: { label: "Pendente", className: "bg-amber-100 text-amber-700" },
  LIDA: { label: "Lida", className: "bg-gray-100 text-gray-500" },
  PROCESSADA: { label: "Processada", className: "bg-green-100 text-green-700" },
  // CRM etapas
  RECEBIDO: { label: "Recebido", className: "bg-slate-100 text-slate-600" },
  QUALIFICACAO: { label: "Qualificação", className: "bg-blue-100 text-blue-700" },
  ATENDIMENTO_INICIAL: { label: "Atendimento", className: "bg-indigo-100 text-indigo-700" },
  REUNIAO: { label: "Reunião", className: "bg-purple-100 text-purple-700" },
  PROPOSTA_ENVIADA: { label: "Proposta Enviada", className: "bg-yellow-100 text-yellow-700" },
  NEGOCIACAO: { label: "Negociação", className: "bg-orange-100 text-orange-700" },
  FECHADO: { label: "Fechado ✓", className: "bg-green-100 text-green-700 font-bold" },
  PERDIDO: { label: "Perdido", className: "bg-red-100 text-red-600" },
  // Prioridade
  URGENTE: { label: "Urgente", className: "bg-red-100 text-red-700 font-bold" },
  MEDIA: { label: "Média", className: "bg-yellow-100 text-yellow-700" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
