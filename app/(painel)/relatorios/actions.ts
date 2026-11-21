"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type DisputaState = { errors?: { nota?: string; decisao?: string }; message?: string; ok?: boolean };

const ID = /^[0-9a-f-]{36}$/i;

/** O que cada escolha da equipa quer dizer para a API: dar razão à empresa mantém a decisão; dar razão ao pesquisador reabre o relatório. */
const DECISOES = { empresa: "manter", pesquisador: "reabrir" } as const;

export async function resolverDisputa(_prev: DisputaState, formData: FormData): Promise<DisputaState> {
  const id = String(formData.get("id") ?? "");
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get(`nota-${id}`) ?? "").trim();
  if (!["pesquisador", "empresa", "informacao"].includes(decisao)) return { errors: { decisao: "Escolha uma decisão." } };
  if (nota.length < 10) return { errors: { nota: "Explique a decisão às duas partes, com pelo menos 10 caracteres." } };
  if (!ID.test(id)) return { message: "Esta disputa já não existe." };

  // Pedir mais informação não resolve: a disputa passa a "em análise", com a pessoa como responsável.
  if (decisao === "informacao") {
    const r = await chamarApi(`/admin/disputas/${id}/assumir`, { corpo: {} });
    if (!r.ok) return { message: r.message };
    revalidatePath("/relatorios");
    return { ok: true, message: "Disputa assumida. Está em análise." };
  }

  // A disputa tem de ser assumida antes de ser resolvida; se já é desta pessoa, a API aceita.
  const assumir = await chamarApi(`/admin/disputas/${id}/assumir`, { corpo: {} });
  if (!assumir.ok && assumir.status !== 400) return { message: assumir.message };
  const r = await chamarApi(`/admin/disputas/${id}/resolver`, { corpo: { decisao: DECISOES[decisao as keyof typeof DECISOES], nota } });
  if (!r.ok) return { errors: r.errors?.nota ? { nota: r.errors.nota } : undefined, message: r.errors?.nota ? undefined : r.message };
  revalidatePath("/relatorios");
  return { ok: true, message: "Disputa resolvida. As duas partes foram avisadas." };
}

export type TriagemState = { errors?: { gravidade?: string; nota?: string }; message?: string; ok?: boolean };

export async function devolverTriagem(_prev: TriagemState, formData: FormData): Promise<TriagemState> {
  const id = String(formData.get("id") ?? "");
  // Os campos levam o código do pedido no nome, porque há vários formulários na mesma página.
  const gravidade = String(formData.get(`gravidade-${id}`) ?? "");
  const nota = String(formData.get(`nota-${id}`) ?? "").trim();
  const errors: NonNullable<TriagemState["errors"]> = {};
  if (!["critica", "alta", "media", "baixa"].includes(gravidade)) errors.gravidade = "Escolha a gravidade.";
  if (nota.length < 10) errors.nota = "Escreva a análise para a empresa, com pelo menos 10 caracteres.";
  if (Object.keys(errors).length > 0) return { errors };
  if (!ID.test(id)) return { message: "Este pedido já não existe." };

  // Assumir e devolver: um analista só devolve o que assumiu.
  const assumir = await chamarApi(`/admin/triagem/${id}/assumir`, { corpo: {} });
  if (!assumir.ok) return { message: assumir.message };
  const r = await chamarApi(`/admin/triagem/${id}/devolver`, { corpo: { nota, gravidadeSugerida: gravidade } });
  if (!r.ok) return { errors: r.errors?.nota ? { nota: r.errors.nota } : undefined, message: r.errors?.nota ? undefined : r.message };
  revalidatePath("/relatorios");
  return { ok: true, message: "Devolvido à empresa. Só a organização vê a sua análise." };
}
