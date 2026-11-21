"use server";

import QRCode from "qrcode";
import { redirect } from "next/navigation";
import { chamarApi } from "@/lib/api";

export type LoginState = {
  /** "codigo": já tem os dois passos. "configurar": é o primeiro acesso e falta ligar a aplicação de autenticação. */
  passo?: "codigo" | "configurar";
  errors?: { email?: string; password?: string; codigo?: string };
  message?: string;
  /** Devolvemos só o e-mail, para o mostrar no segundo passo. Nunca a palavra-passe. */
  email?: string;
  /** Só no primeiro acesso: o segredo e o QR para ligar a aplicação de autenticação. */
  segredo?: string;
  qr?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVALIDO = "E-mail ou palavra-passe incorretos.";

async function qrDe(url: string) {
  return QRCode.toDataURL(url, { margin: 1, width: 192, color: { dark: "#1A1625", light: "#FFFFFF" } });
}

/** Primeiro passo: e-mail e palavra-passe. Segundo passo: código de 6 dígitos da aplicação de autenticação. */
export async function iniciarSessao(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const passo = String(formData.get("passo") ?? "credenciais");
  const email = String(formData.get("email") ?? "").trim();

  if (passo === "credenciais") {
    const password = String(formData.get("password") ?? "");
    const errors: NonNullable<LoginState["errors"]> = {};
    if (!email) errors.email = "Indique o seu e-mail.";
    else if (!EMAIL.test(email)) errors.email = "Indique um e-mail válido.";
    if (!password) errors.password = "Indique a sua palavra-passe.";
    if (errors.email || errors.password) return { errors, email };

    const r = await chamarApi<{ passo: string; utilizador: { papel: string } }>("/auth/login", { corpo: { email, password } });
    if (!r.ok) return { message: r.message, email };
    // Esta entrada é só da equipa. Quem não é termina a sessão e recebe a mesma resposta de uma palavra-passe errada.
    if (r.dados.utilizador.papel !== "admin") {
      await chamarApi("/auth/logout", { corpo: {} });
      return { message: INVALIDO, email };
    }
    if (r.dados.passo === "codigo") return { passo: "codigo", email };
    if (r.dados.passo === "configurar-dois-passos") {
      const d = await chamarApi<{ segredo: string; otpauthUrl: string }>("/auth/dois-passos/iniciar", { corpo: {} });
      if (!d.ok) return { message: d.message, email };
      return { passo: "configurar", email, segredo: d.dados.segredo, qr: await qrDe(d.dados.otpauthUrl) };
    }
    redirect("/");
  }

  const codigo = String(formData.get("codigo") ?? "").trim().replace(/^(\d[\d\s]*)$/, (m) => m.replace(/\s/g, ""));
  const segredo = passo === "configurar" ? String(formData.get("segredo") ?? "") : undefined;
  // Quem erra o código no primeiro acesso continua com o mesmo segredo, para não ter de ler outro QR.
  const mesmoSegredo = async () => (segredo ? { segredo, qr: await qrDe(`otpauth://totp/CyberSpace:${encodeURIComponent(email)}?secret=${segredo}&issuer=CyberSpace&digits=6&period=30`) } : {});
  const tipo = passo === "configurar" ? "configurar" : "codigo";

  // No segundo passo do início de sessão aceita-se também um código de recuperação. Ao ativar os dois passos, só o código da aplicação.
  const valido = tipo === "codigo" ? /^(\d{6}|[a-z0-9]{5}-?[a-z0-9]{5})$/i.test(codigo) : /^\d{6}$/.test(codigo);
  if (!valido) {
    return { passo: tipo, email, errors: { codigo: "O código tem 6 dígitos. Confira a aplicação de autenticação." }, ...(await mesmoSegredo()) };
  }
  const r = passo === "configurar" ? await chamarApi("/auth/dois-passos/confirmar", { corpo: { codigo } }) : await chamarApi("/auth/login/codigo", { corpo: { codigo } });
  if (!r.ok) {
    if (r.status === 401) return { message: "A sessão expirou. Entre outra vez.", email };
    return { passo: tipo, email, errors: { codigo: r.errors?.codigo ?? r.message }, ...(await mesmoSegredo()) };
  }
  redirect("/");
}
