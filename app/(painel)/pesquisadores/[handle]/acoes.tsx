"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FieldError, FormAlert, TextAreaField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import type { EstadoConta } from "@/lib/exemplo";
import { decidirConta, type ContaState } from "../actions";

const todas = [
  { value: "verificar", titulo: "Verificar conta", texto: "Confirma que é uma pessoa real.", para: ["por-verificar"], pedeNota: false },
  { value: "documento", titulo: "Pedir novo documento", texto: "A fotografia não se lê ou não coincide com o nome.", para: ["por-verificar"], pedeNota: true },
  { value: "suspender", titulo: "Suspender", texto: "Não pode enviar relatórios. Pode ser revertido.", para: ["ativo", "por-verificar"], pedeNota: true },
  { value: "banir", titulo: "Banir", texto: "Perde o acesso e as recompensas por pagar ficam em revisão.", para: ["ativo", "suspenso", "por-verificar"], pedeNota: true },
  { value: "reativar", titulo: "Reativar", texto: "A conta volta a estar ativa.", para: ["suspenso", "banido"], pedeNota: false },
] as const;

export default function Acoes({ handle, estado }: { handle: string; estado: EstadoConta }) {
  const [state, formAction, pending] = useActionState(decidirConta, {} as ContaState);
  const [decisao, setDecisao] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  const opcoes = todas.filter((o) => (o.para as readonly string[]).includes(estado));
  const escolhida = opcoes.find((o) => o.value === decisao);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="handle" value={handle} />
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
      {escolhida?.pedeNota && <TextAreaField id="nota" label="Motivo" required className="min-h-24" hint="Fica no registo de auditoria e o pesquisador recebe-o." error={errors.nota} />}
      <Button type="submit" size="lg" variant={decisao === "banir" ? "destructive" : "default"} disabled={pending || !decisao} className="w-full">
        {pending ? "A guardar…" : "Confirmar"}
      </Button>
    </form>
  );
}
