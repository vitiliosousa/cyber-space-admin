"use server";

import { getPrograma } from "@/lib/exemplo";

export type ProgramaState = { errors?: { nota?: string; decisao?: string }; message?: string };

export async function alterarPrograma(_prev: ProgramaState, formData: FormData): Promise<ProgramaState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const p = getPrograma(String(formData.get("id") ?? ""));
  if (!p) return { message: "Este programa já não existe." };
  if (!["pausar", "retomar", "arquivar"].includes(decisao)) return { errors: { decisao: "Escolha uma ação." } };
  if ((decisao === "pausar" || decisao === "arquivar") && nota.length < 10) {
    return { errors: { nota: "Escreva o motivo, com pelo menos 10 caracteres. A organização vê este texto." } };
  }
  // TODO: guardar, avisar a organização e os pesquisadores e registar na auditoria quando houver backend.
  return { message: "A ação ainda não pode ser guardada. Volte a tentar em breve." };
}
