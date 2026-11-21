"use server";

import { chamarApi } from "@/lib/api";
/** A administração pede mais do que as outras áreas. */
const MIN_PASSWORD_LENGTH = 12;

export type RedefinirState = { error?: string; errors?: { password?: string }; feito?: boolean };

export async function redefinirPalavraPasse(_prev: RedefinirState, formData: FormData): Promise<RedefinirState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < MIN_PASSWORD_LENGTH) return { errors: { password: `A palavra-passe precisa de pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` } };
  if (!token) return { error: "A ligação não é válida. Peça outra." };
  const r = await chamarApi("/auth/redefinir", { corpo: { token, password } });
  if (!r.ok) return { error: r.errors?.token ?? r.errors?.password ?? r.message, errors: r.errors?.password ? { password: r.errors.password } : undefined };
  return { feito: true };
}
