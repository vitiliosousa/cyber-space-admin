"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type ConviteState = { errors?: { nome?: string; email?: string; funcao?: string }; message?: string; ok?: boolean };

const FUNCOES = ["super-admin", "triagem", "financeiro", "suporte"];

export async function convidarMembro(_prev: ConviteState, formData: FormData): Promise<ConviteState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const funcao = String(formData.get("funcao") ?? "");
  const errors: NonNullable<ConviteState["errors"]> = {};
  if (nome.length < 2) errors.nome = "Indique o nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Indique um e-mail válido.";
  if (!FUNCOES.includes(funcao)) errors.funcao = "Escolha a função.";
  if (Object.keys(errors).length > 0) return { errors };
  // A regra do domínio vale na API. A pessoa recebe uma ligação para escolher a palavra-passe e ativa os dois passos no primeiro acesso.
  const r = await chamarApi("/admin/equipa/convites", { corpo: { nome, email, funcao } });
  if (!r.ok) return { errors: r.errors, message: r.errors ? undefined : r.message };
  revalidatePath("/equipa");
  return { ok: true, message: `Convite enviado para ${email}. A ligação vale 30 minutos.` };
}

export type MembroState = { message?: string; ok?: boolean };

const ACOES: Record<string, string> = { desativar: "desativar", reativar: "reativar", repor: "repor-dois-passos" };

export async function alterarMembro(_prev: MembroState, formData: FormData): Promise<MembroState> {
  const acao = String(formData.get("acao") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!ACOES[acao]) return { message: "Ação desconhecida." };
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { message: "Este membro já não existe." };
  // Desativar termina logo todas as sessões da pessoa; repor apaga os dois passos para ela os configurar de novo.
  const r = await chamarApi(`/admin/equipa/${id}/${ACOES[acao]}`, { corpo: {} });
  if (!r.ok) return { message: r.message };
  revalidatePath("/equipa");
  return { ok: true, message: "Feito." };
}
