"use server";

import { disputas, filaTriagem } from "@/lib/exemplo";

export type DisputaState = { errors?: { nota?: string; decisao?: string }; message?: string };

export async function resolverDisputa(_prev: DisputaState, formData: FormData): Promise<DisputaState> {
  const id = String(formData.get("id") ?? "");
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get(`nota-${id}`) ?? "").trim();
  const d = disputas.find((x) => x.id === id);
  if (!d) return { message: "Esta disputa já não existe." };
  if (d.estado === "resolvida") return { message: "Esta disputa já foi resolvida." };
  if (!["pesquisador", "empresa", "informacao"].includes(decisao)) return { errors: { decisao: "Escolha uma decisão." } };
  if (nota.length < 10) return { errors: { nota: "Explique a decisão às duas partes, com pelo menos 10 caracteres." } };
  // TODO: guardar a decisão, avisar as duas partes e registar na auditoria quando houver backend.
  return { message: "A decisão ainda não pode ser guardada. Volte a tentar em breve." };
}

export type TriagemState = { errors?: { gravidade?: string; nota?: string }; message?: string };

export async function devolverTriagem(_prev: TriagemState, formData: FormData): Promise<TriagemState> {
  const id = String(formData.get("id") ?? "");
  // Os campos levam o código do pedido no nome, porque há vários formulários na mesma página.
  const gravidade = String(formData.get(`gravidade-${id}`) ?? "");
  const nota = String(formData.get(`nota-${id}`) ?? "").trim();
  const t = filaTriagem.find((x) => x.id === id);
  if (!t) return { message: "Este pedido já não existe." };
  const errors: NonNullable<TriagemState["errors"]> = {};
  if (!["critica", "alta", "media", "baixa"].includes(gravidade)) errors.gravidade = "Escolha a gravidade.";
  if (nota.length < 10) errors.nota = "Escreva a análise para a empresa, com pelo menos 10 caracteres.";
  if (Object.keys(errors).length > 0) return { errors };
  // TODO: devolver o relatório triado à empresa quando houver backend.
  return { message: "A triagem ainda não pode ser devolvida. Volte a tentar em breve." };
}
