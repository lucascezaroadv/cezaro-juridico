export type AreaJuridica =
  | "TRABALHISTA"
  | "EMPRESARIAL"
  | "EXECUCAO_CREDITO"
  | "LGPD"
  | "CONSULTORIA"
  | "CONTRATOS"
  | "COMPLIANCE"
  | "CIVIL"
  | "TRIBUTARIO"
  | "PREVIDENCIARIO"
  | "OUTRO";

export type FaseProcessual =
  | "CONHECIMENTO"
  | "RECURSAL"
  | "EXECUCAO"
  | "CUMPRIMENTO_SENTENCA"
  | "ARQUIVADO";

export type StatusProcesso = "ATIVO" | "SUSPENSO" | "ARQUIVADO" | "ENCERRADO";

export type NivelUrgencia = "CRITICA" | "ALTA" | "NORMAL" | "BAIXA";

export type StatusIntimacao = "PENDENTE" | "LIDA" | "PROCESSADA" | "ARQUIVADA";

export type EtapaCRM =
  | "RECEBIDO"
  | "QUALIFICACAO"
  | "ATENDIMENTO_INICIAL"
  | "REUNIAO"
  | "PROPOSTA_ENVIADA"
  | "NEGOCIACAO"
  | "FECHADO"
  | "PERDIDO";

export type Prioridade = "URGENTE" | "ALTA" | "MEDIA" | "BAIXA";

export type TipoDiligencia =
  | "SISBAJUD"
  | "RENAJUD"
  | "INFOJUD"
  | "SNIPER"
  | "SERP"
  | "CNIB"
  | "CCS"
  | "IDPJ"
  | "PROTESTO"
  | "OUTRO";

export const AREA_JURIDICA_LABELS: Record<AreaJuridica, string> = {
  TRABALHISTA: "Direito do Trabalho",
  EMPRESARIAL: "Direito Empresarial",
  EXECUCAO_CREDITO: "Execução e Recuperação de Crédito",
  LGPD: "LGPD",
  CONSULTORIA: "Consultoria Preventiva",
  CONTRATOS: "Contratos",
  COMPLIANCE: "Compliance",
  CIVIL: "Direito Civil",
  TRIBUTARIO: "Direito Tributário",
  PREVIDENCIARIO: "Previdenciário",
  OUTRO: "Outro",
};

export const FASE_LABELS: Record<FaseProcessual, string> = {
  CONHECIMENTO: "Conhecimento",
  RECURSAL: "Recursal",
  EXECUCAO: "Execução",
  CUMPRIMENTO_SENTENCA: "Cumprimento de Sentença",
  ARQUIVADO: "Arquivado",
};

export const STATUS_PROCESSO_LABELS: Record<StatusProcesso, string> = {
  ATIVO: "Ativo",
  SUSPENSO: "Suspenso",
  ARQUIVADO: "Arquivado",
  ENCERRADO: "Encerrado",
};

export const URGENCIA_LABELS: Record<NivelUrgencia, string> = {
  CRITICA: "Crítica",
  ALTA: "Alta",
  NORMAL: "Normal",
  BAIXA: "Baixa",
};

export const ETAPA_CRM_LABELS: Record<EtapaCRM, string> = {
  RECEBIDO: "Lead Recebido",
  QUALIFICACAO: "Qualificação",
  ATENDIMENTO_INICIAL: "Atendimento Inicial",
  REUNIAO: "Reunião",
  PROPOSTA_ENVIADA: "Proposta Enviada",
  NEGOCIACAO: "Negociação",
  FECHADO: "Fechado ✓",
  PERDIDO: "Perdido",
};

export const DILIGENCIA_LABELS: Record<TipoDiligencia, string> = {
  SISBAJUD: "SISBAJUD",
  RENAJUD: "RENAJUD",
  INFOJUD: "INFOJUD",
  SNIPER: "SNIPER",
  SERP: "SERP",
  CNIB: "CNIB",
  CCS: "CCS",
  IDPJ: "IDPJ",
  PROTESTO: "Protesto Judicial",
  OUTRO: "Outro",
};
