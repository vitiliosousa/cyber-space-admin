"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormAlert, TextAreaField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { Comutador } from "@/components/ui/interruptor";
import { responderPedido, type RespostaState } from "../actions";

export default function Resposta({ id, resolvido }: { id: string; resolvido: boolean }) {
  const [state, formAction, pending] = useActionState(responderPedido, {} as RespostaState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <FormAlert>{state.message}</FormAlert>
      <TextAreaField id="texto" label="Resposta" required className="min-h-28" error={state.errors?.texto} />
      {!resolvido && (
        <label className="flex items-center justify-between gap-4">
          <span className="font-medium">Marcar como resolvido</span>
          <Comutador nome="resolver" />
        </label>
      )}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "A enviar…" : "Enviar resposta"}
      </Button>
    </form>
  );
}
