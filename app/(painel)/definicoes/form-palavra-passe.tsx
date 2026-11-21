"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormAlert, PasswordField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { alterarPalavraPasse, type DefinicaoState } from "./actions";

export default function FormPalavraPasse() {
  const [state, formAction, pending] = useActionState(alterarPalavraPasse, {} as DefinicaoState);
  const ref = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4 sm:max-w-md">
      <FormAlert sucesso={state.ok}>{state.message}</FormAlert>
      <PasswordField id="atual" label="Palavra-passe atual" autoComplete="current-password" error={errors.atual} />
      <PasswordField id="nova" label="Nova palavra-passe" autoComplete="new-password" hint="Pelo menos 12 caracteres." error={errors.nova} />
      <PasswordField id="confirmar" label="Repita a nova palavra-passe" autoComplete="new-password" error={errors.confirmar} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "A guardar…" : "Alterar palavra-passe"}
      </Button>
    </form>
  );
}
