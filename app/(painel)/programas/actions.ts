"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type ProgramaState = { errors?: { nota?: string; decisao?: string }; message?: string; ok?: boolean };

export async function alterarPrograma(_prev: ProgramaState, formData: FormData): Promise<ProgramaState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const id = String(formData.get("id") ?? "");
  if (!["pausar", "retomar", "arquivar"].includes(decisao)) return { errors: { decisao: "Escolha uma ação." } };
  if ((decisao === "pausar" || decisao === "arquivar") && nota.length < 10) {
    return { errors: { nota: "Escreva o motivo, com pelo menos 10 caracteres. A organização vê este texto." } };
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { message: "Este programa já não existe." };
  const r = await chamarApi(`/admin/programas/${id}/decisao`, { corpo: { decisao, nota: nota || undefined } });
  if (!r.ok) return { errors: r.errors?.nota ? { nota: r.errors.nota } : undefined, message: r.errors?.nota ? undefined : r.message };
  revalidatePath(`/programas/${id}`);
  revalidatePath("/programas");
  return { ok: true, message: "Ação guardada. A organização foi avisada." };
}
