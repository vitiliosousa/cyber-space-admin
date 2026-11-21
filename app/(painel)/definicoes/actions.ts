"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type DefinicaoState = { errors?: Record<string, string>; message?: string; ok?: boolean };

export async function alterarPalavraPasse(_prev: DefinicaoState, formData: FormData): Promise<DefinicaoState> {
  const atual = String(formData.get("atual") ?? "");
  const nova = String(formData.get("nova") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");
  const errors: Record<string, string> = {};
  if (!atual) errors.atual = "Indique a palavra-passe atual.";
  if (nova.length < 12) errors.nova = "A nova palavra-passe tem de ter pelo menos 12 caracteres.";
  else if (nova === atual) errors.nova = "A nova palavra-passe tem de ser diferente da atual.";
  if (!errors.nova && confirmar !== nova) errors.confirmar = "As palavras-passe não coincidem.";
  if (Object.keys(errors).length > 0) return { errors };
  // A API confere a atual, termina as outras sessões e avisa por e-mail.
  const r = await chamarApi("/auth/palavra-passe", { corpo: { atual, nova } });
  if (!r.ok) return { errors: r.errors, message: r.errors ? undefined : r.message };
  revalidatePath("/definicoes");
  return { ok: true, message: "Palavra-passe alterada. Terminámos as outras sessões abertas." };
}

export async function terminarSessoes(_prev: DefinicaoState, formData: FormData): Promise<DefinicaoState> {
  const sessao = String(formData.get("sessao") ?? "");
  const r = sessao === "todas" ? await chamarApi("/auth/sessoes/terminar-outras", { corpo: {} }) : /^[0-9a-f-]{36}$/i.test(sessao) ? await chamarApi(`/auth/sessoes/${sessao}/terminar`, { corpo: {} }) : null;
  if (!r) return { message: "Esta sessão já não existe." };
  if (!r.ok) return { message: r.message };
  revalidatePath("/definicoes");
  return { ok: true, message: sessao === "todas" ? "As outras sessões terminaram." : "Sessão terminada." };
}
