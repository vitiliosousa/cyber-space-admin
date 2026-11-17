"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FieldError, FormAlert, TextAreaField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import type { EstadoPrograma } from "@/lib/exemplo";
import { alterarPrograma, type ProgramaState } from "../actions";

const todas = [
  { value: "pausar", titulo: "Pausar", texto: "Deixa de receber relatórios novos. Os que existem continuam.", para: ["ativo"], pedeNota: true },
  { value: "retomar", titulo: "Retomar", texto: "Volta a receber relatórios.", para: ["pausado"], pedeNota: false },
  { value: "arquivar", titulo: "Arquivar", texto: "Sai da lista dos pesquisadores. Os relatórios ficam guardados.", para: ["ativo", "pausado", "concluido"], pedeNota: true },
] as const;

export default function Acoes({ id, estado }: { id: string; estado: EstadoPrograma }) {
  const [state, formAction, pending] = useActionState(alterarPrograma, {} as ProgramaState);
  const [decisao, setDecisao] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  const opcoes = todas.filter((o) => (o.para as readonly string[]).includes(estado));
  const escolhida = opcoes.find((o) => o.value === decisao);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  if (opcoes.length === 0) return <p className="text-muted-foreground">Não há ações possíveis neste estado.</p>;

  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="decisao" value={decisao} />
      <FormAlert>{state.message}</FormAlert>
      <fieldset>
        <legend className="sr-only">Ação</legend>
        <div className="grid gap-2">
          {opcoes.map((o) => (
            <label key={o.value} className="cursor-pointer">
              <input type="radio" value={o.value} checked={decisao === o.value} onChange={() => setDecisao(o.value)} className="peer sr-only" />
              <span className="block rounded-2xl border border-line p-3 transition-colors peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                <span className="block font-semibold">{o.titulo}</span>
                <span className="block text-sm text-muted-foreground">{o.texto}</span>
              </span>
            </label>
          ))}
        </div>
        <FieldError id="decisao-error">{errors.decisao}</FieldError>
      </fieldset>
      {escolhida?.pedeNota && <TextAreaField id="nota" label="Motivo" required className="min-h-24" hint="A organização vê este texto." error={errors.nota} />}
      <Button type="submit" size="lg" disabled={pending || !decisao} className="w-full">
        {pending ? "A guardar…" : "Confirmar"}
      </Button>
    </form>
  );
}
