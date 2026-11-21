"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type RespostaState = { errors?: { texto?: string }; message?: string; ok?: boolean };

export async function responderPedido(_prev: RespostaState, formData: FormData): Promise<RespostaState> {
  const id = String(formData.get("id") ?? "");
  const texto = String(formData.get("texto") ?? "").trim();
  const resolver = formData.get("resolver") === "on";
  if (texto.length < 5) return { errors: { texto: "Escreva a resposta, com pelo menos 5 caracteres." } };
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { message: "Este pedido já não existe." };
  // A API assume o pedido, envia a resposta por e-mail e como notificação, e regista na auditoria.
  const r = await chamarApi(`/admin/suporte/${id}/responder`, { corpo: { texto, resolver } });
  if (!r.ok) return { errors: r.errors?.texto ? { texto: r.errors.texto } : undefined, message: r.errors?.texto ? undefined : r.message };
  revalidatePath(`/suporte/${id}`);
  revalidatePath("/suporte");
  return { ok: true, message: resolver ? "Resposta enviada. O pedido ficou resolvido." : "Resposta enviada." };
}
