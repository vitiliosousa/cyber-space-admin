"use server";

import { getPesquisador } from "@/lib/exemplo";

export type ContaState = { errors?: { nota?: string; decisao?: string }; message?: string };

export async function decidirConta(_prev: ContaState, formData: FormData): Promise<ContaState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const p = getPesquisador(String(formData.get("handle") ?? ""));
  if (!p) return { message: "Esta conta já não existe." };
  if (!["verificar", "documento", "suspender", "banir", "reativar"].includes(decisao)) return { errors: { decisao: "Escolha uma ação." } };
  if (decisao === "verificar" && !p.documento) return { message: "Só pode verificar depois de o pesquisador enviar o documento." };
  if ((decisao === "suspender" || decisao === "banir" || decisao === "documento") && nota.length < 10) {
    return { errors: { nota: "Escreva o motivo, com pelo menos 10 caracteres. Fica no registo de auditoria e o pesquisador recebe-o." } };
  }
  // TODO: guardar, avisar o pesquisador, terminar as sessões e registar na auditoria quando houver backend.
  return { message: "A ação ainda não pode ser guardada. Volte a tentar em breve." };
}
