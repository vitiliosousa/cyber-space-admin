"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { FormAlert, PasswordField } from "@/components/auth/fields";
import { primaryButton } from "@/components/ui/buttons";
import { redefinirPalavraPasse, type RedefinirState } from "./actions";

export default function RedefinirForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(redefinirPalavraPasse, {} as RedefinirState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  if (state.feito) {
    return (
      <div role="status" className="space-y-4">
        <p className="rounded-2xl bg-green-50 px-4 py-3 text-green-900">A palavra-passe foi alterada. Por segurança, terminámos as outras sessões abertas.</p>
        <Link href="/login" className={primaryButton}>
          Entrar na administração
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-3">
      <input type="hidden" name="token" value={token} />
      <FormAlert>{state.error}</FormAlert>
      <PasswordField id="password" label="Nova palavra-passe" autoComplete="new-password" error={state.errors?.password} />
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "A guardar…" : "Guardar palavra-passe"}
      </button>
    </form>
  );
}
