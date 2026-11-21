"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { chamarApi } from "@/lib/api";

export type DecisaoState = { errors?: { nota?: string; decisao?: string }; message?: string; ok?: boolean };

const ID = /^[0-9a-f-]{36}$/i;

function atualizar(id: string) {
  revalidatePath(`/aprovacoes/${id}`);
  revalidatePath("/aprovacoes");
  revalidatePath("/programas");
}

/** Decisão sobre um programa pendente: aprovar, pedir mais informação ou rejeitar. */
export async function decidirPrograma(_prev: DecisaoState, formData: FormData): Promise<DecisaoState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const id = String(formData.get("id") ?? "");
  if (!["aprovar", "informacao", "rejeitar"].includes(decisao)) return { errors: { decisao: "Escolha uma decisão." } };
  if (decisao !== "aprovar" && nota.length < 10) return { errors: { nota: decisao === "rejeitar" ? "Explique o motivo da rejeição, com pelo menos 10 caracteres." : "Diga o que falta, com pelo menos 10 caracteres." } };
  if (!ID.test(id)) return { message: "Este programa já não existe." };

  // A API aplica as regras: organização verificada, domínios validados e o aviso à organização.
  const r = await chamarApi(`/admin/programas/${id}/decisao`, { corpo: { decisao, nota: nota || undefined } });
  if (!r.ok) return { errors: r.errors?.nota ? { nota: r.errors.nota } : undefined, message: r.errors?.nota ? undefined : r.message };
  atualizar(id);
  // O programa deixa de estar à espera: volta-se à lista.
  redirect("/aprovacoes");
}

/** Confirma ou retira a validação do domínio de um ativo. */
export async function validarDominio(_prev: DecisaoState, formData: FormData): Promise<DecisaoState> {
  const programa = String(formData.get("programa") ?? "");
  const ativo = String(formData.get("ativo") ?? "");
  if (!ID.test(programa) || !ID.test(ativo)) return { message: "Este ativo já não existe." };
  const r = await chamarApi(`/admin/programas/${programa}/ativos/${ativo}/validacao`, { corpo: { validado: String(formData.get("validado")) === "sim" } });
  if (!r.ok) return { message: r.message };
  atualizar(programa);
  return { ok: true };
}

/** Decisão sobre alterações propostas a um programa ativo: aprovar (confirmando os domínios novos) ou recusar. */
export async function decidirAlteracao(_prev: DecisaoState, formData: FormData): Promise<DecisaoState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const id = String(formData.get("id") ?? "");
  const dominios = formData.getAll("dominio").map(String);
  if (!["aprovar", "rejeitar"].includes(decisao)) return { errors: { decisao: "Escolha uma decisão." } };
  if (decisao === "rejeitar" && nota.length < 10) return { errors: { nota: "Explique o motivo, com pelo menos 10 caracteres. A organização vê este texto." } };
  if (!ID.test(id)) return { message: "Esta alteração já não existe." };

  const r = await chamarApi(`/admin/alteracoes/${id}/decisao`, { corpo: { decisao, nota: nota || undefined, dominios: decisao === "aprovar" ? dominios : undefined } });
  if (!r.ok) return { errors: r.errors?.nota ? { nota: r.errors.nota } : undefined, message: r.errors?.nota ? undefined : r.message };
  revalidatePath("/aprovacoes");
  revalidatePath("/programas");
  redirect("/aprovacoes");
}
