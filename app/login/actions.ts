"use server";

import { redirect } from "next/navigation";

export type LoginState = {
  passo?: "codigo";
  errors?: { email?: string; password?: string; codigo?: string };
  message?: string;
  /** Devolvemos só o e-mail, para o mostrar no segundo passo. Nunca a palavra-passe. */
  email?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Primeiro passo: e-mail e palavra-passe. Segundo passo: código de 6 dígitos da aplicação de autenticação. */
export async function iniciarSessao(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const passo = String(formData.get("passo") ?? "credenciais");

  if (passo === "credenciais") {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const errors: NonNullable<LoginState["errors"]> = {};
    if (!email) errors.email = "Indique o seu e-mail.";
    else if (!EMAIL.test(email)) errors.email = "Indique um e-mail válido.";
    if (!password) errors.password = "Indique a sua palavra-passe.";
    if (errors.email || errors.password) return { errors, email };

    // TODO: verificar as credenciais, limitar tentativas e exigir que o e-mail seja da equipa quando houver backend.
    return { passo: "codigo", email };
  }

  const email = String(formData.get("email") ?? "");
  const codigo = String(formData.get("codigo") ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(codigo)) {
    return { passo: "codigo", email, errors: { codigo: "O código tem 6 dígitos. Confira a aplicação de autenticação." } };
  }

  // TODO: verificar o código (TOTP) e criar a sessão quando o backend existir. Sem backend, entra em modo de demonstração.
  redirect("/");
}
