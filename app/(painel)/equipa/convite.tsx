"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormAlert, SelectField, TextField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { funcoes } from "@/lib/exemplo";
import { convidarMembro, type ConviteState } from "./actions";

export default function Convite() {
  const [state, formAction, pending] = useActionState(convidarMembro, {} as ConviteState);
  const ref = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4">
      <FormAlert sucesso={state.ok}>{state.message}</FormAlert>
      <TextField id="nome" label="Nome" autoComplete="off" error={errors.nome} />
      <TextField id="email" label="E-mail" type="email" autoComplete="off" placeholder="nome@cyberspace.co.mz" hint="Só e-mails @cyberspace.co.mz." error={errors.email} />
      <SelectField id="funcao" label="Função" placeholder="Escolha a função" options={Object.entries(funcoes).map(([value, f]) => ({ value, label: f.label }))} error={errors.funcao} />
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "A enviar…" : "Enviar convite"}
      </Button>
    </form>
  );
}
