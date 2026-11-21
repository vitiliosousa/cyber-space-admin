import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { lerApi } from "./api";

export type FuncaoInterna = "super-admin" | "triagem" | "financeiro" | "suporte";

export type Membro = {
  id: string;
  nome: string;
  email: string;
  papel: "pesquisador" | "empresa" | "admin";
  funcaoInterna: FuncaoInterna | null;
  doisPassos: boolean;
};

/** Pergunta à API quem está ligado. Só devolve alguém com a sessão completa (dois passos confirmados). */
export const obterMembro = cache(async (): Promise<Membro | null> => {
  const r = await lerApi<{ utilizador: Membro }>("/auth/eu", { redirecionar401: false });
  return r.ok && r.dados.utilizador.papel === "admin" ? r.dados.utilizador : null;
});

/** A verificação real da sessão. A da `proxy.ts` só vê se há cookie; a API volta a verificar em cada pedido. */
export async function exigirMembro() {
  const m = await obterMembro();
  if (!m) redirect("/login");
  return m;
}

export function iniciaisDe(nome: string) {
  const partes = nome.split(/\s+/).filter(Boolean);
  return ((partes[0]?.[0] ?? "") + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}
