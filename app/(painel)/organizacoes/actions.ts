"use server";

import { getOrganizacao } from "@/lib/exemplo";

export type OrganizacaoState = { errors?: { nota?: string; decisao?: string }; message?: string };

export async function decidirOrganizacao(_prev: OrganizacaoState, formData: FormData): Promise<OrganizacaoState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const org = getOrganizacao(String(formData.get("id") ?? ""));
  if (!org) return { message: "Esta organização já não existe." };
  if (!["verificar", "informacao", "rejeitar", "suspender", "reativar"].includes(decisao)) return { errors: { decisao: "Escolha uma ação." } };

  if (decisao === "verificar" && org.passos.some((p) => !p.feito)) return { message: "Só pode verificar quando todos os passos estiverem cumpridos." };
  if (["informacao", "rejeitar", "suspender"].includes(decisao) && nota.length < 10) {
    return { errors: { nota: "Escreva o motivo, com pelo menos 10 caracteres. A organização vê este texto." } };
  }

  // TODO: guardar, avisar a organização e registar na auditoria quando houver backend.
  return { message: "A ação ainda não pode ser guardada. Volte a tentar em breve." };
}
