import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(data: Date | string, pattern = "dd/MM/yyyy"): string {
  return format(new Date(data), pattern, { locale: ptBR });
}

export function formatarDataHora(data: Date | string): string {
  return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatarCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export function formatarTelefone(tel: string): string {
  const num = tel.replace(/\D/g, "");
  if (num.length === 11) return num.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return num.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

export function formatarNumeroProcesso(numero: string): string {
  const n = numero.replace(/\D/g, "");
  if (n.length === 20) {
    return `${n.slice(0, 7)}-${n.slice(7, 9)}.${n.slice(9, 13)}.${n.slice(13, 14)}.${n.slice(14, 16)}.${n.slice(16)}`;
  }
  return numero;
}

export function iniciais(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}
