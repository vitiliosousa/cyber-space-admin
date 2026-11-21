"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type ContaState = { errors?: { nota?: string; decisao?: string }; message?: string; ok?: boolean };

export async function decidirConta(_prev: ContaState, formData: FormData): Promise<ContaState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const id = String(formData.get("handle") ?? "");
  if (!["verificar", "documento", "suspender", "banir", "reativar"].includes(decisao)) return { errors: { decisao: "Escolha uma ação." } };
  if ((decisao === "suspender" || decisao === "banir" || decisao === "documento") && nota.length < 10) {
    return { errors: { nota: "Escreva o motivo, com pelo menos 10 caracteres. Fica no registo de auditoria e o pesquisador recebe-o." } };
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { message: "Esta conta já não existe." };
  // A API aplica as regras, termina as sessões de quem é suspenso ou banido, avisa o pesquisador e regista na auditoria.
  const r = await chamarApi(`/admin/pesquisadores/${id}/decisao`, { corpo: { decisao, nota: nota || undefined } });
  if (!r.ok) return { errors: r.errors?.nota ? { nota: r.errors.nota } : undefined, message: r.errors?.nota ? undefined : r.message };
  revalidatePath(`/pesquisadores/${id}`);
  revalidatePath("/pesquisadores");
  return { ok: true, message: "Ação guardada. O pesquisador foi avisado." };
}
