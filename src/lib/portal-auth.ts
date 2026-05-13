import { cookies } from "next/headers";
import { prisma } from "@/shared/database/prisma";

export async function getPortalCliente() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("portal_cliente_id")?.value;
  if (!clienteId) return null;

  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId, portalAtivo: true },
    select: { id: true, nome: true, email: true, tipo: true, cpfCnpj: true },
  });

  return cliente;
}
