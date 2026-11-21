"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { chamarApi, COOKIE_SESSAO } from "@/lib/api";

/** Termina a sessão na API e apaga o cookie, mesmo que a API não responda. */
export async function sair() {
  await chamarApi("/auth/logout", { corpo: {} });
  (await cookies()).delete(COOKIE_SESSAO);
  redirect("/login");
}
