"use server";

import { getPedido } from "@/lib/exemplo";

export type RespostaState = { errors?: { texto?: string }; message?: string };

export async function responderPedido(_prev: RespostaState, formData: FormData): Promise<RespostaState> {
  const pedido = getPedido(String(formData.get("id") ?? ""));
  const texto = String(formData.get("texto") ?? "").trim();
  const resolver = formData.get("resolver") === "on";
  if (!pedido) return { message: "Este pedido já não existe." };
  if (texto.length < 5) return { errors: { texto: "Escreva a resposta, com pelo menos 5 caracteres." } };
  void resolver;
  // TODO: enviar a resposta, mudar o estado e registar na auditoria quando houver backend.
  return { message: "A resposta ainda não pode ser enviada. Volte a tentar em breve." };
}
