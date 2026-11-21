"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type OrganizacaoState = { errors?: { nota?: string; decisao?: string }; message?: string; ok?: boolean };

export async function decidirOrganizacao(_prev: OrganizacaoState, formData: FormData): Promise<OrganizacaoState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const id = String(formData.get("id") ?? "");
  if (!["verificar", "informacao", "rejeitar", "suspender", "reativar"].includes(decisao)) return { errors: { decisao: "Escolha uma ação." } };
  if (["informacao", "rejeitar", "suspender"].includes(decisao) && nota.length < 10) {
    return { errors: { nota: "Escreva o motivo, com pelo menos 10 caracteres. A organização vê este texto." } };
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { message: "Esta organização já não existe." };

  // A API aplica as regras: estados permitidos, passos da verificação e o aviso à organização.
  const passos = formData.getAll("passo").map(String);
  const r = await chamarApi(`/admin/organizacoes/${id}/decisao`, { corpo: { decisao, nota: nota || undefined, passos: decisao === "verificar" ? passos : undefined } });
  if (!r.ok) return { errors: r.errors?.nota ? { nota: r.errors.nota } : undefined, message: r.errors?.nota ? undefined : r.message };
  revalidatePath(`/organizacoes/${id}`);
  revalidatePath("/organizacoes");
  return { ok: true, message: "Decisão guardada. A organização foi avisada." };
}
