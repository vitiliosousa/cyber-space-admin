"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FieldError, FormAlert, TextAreaField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { decidirPrograma, type DecisaoState } from "../actions";

const opcoesNovo = [
  { value: "aprovar", titulo: "Aprovar e publicar", texto: "O programa fica ativo e visível aos pesquisadores." },
  { value: "informacao", titulo: "Pedir mais informação", texto: "A organização recebe a nota e pode voltar a submeter." },
  { value: "rejeitar", titulo: "Rejeitar", texto: "O programa volta a rascunho e a organização é avisada do motivo." },
] as const;

export default function Decisao({ id, pronto }: { id: string; pronto: boolean }) {
  const [state, formAction, pending] = useActionState(decidirPrograma, {} as DecisaoState);
  const opcoes = opcoesNovo;
  const [decisao, setDecisao] = useState<string>("");
  const ref = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="id" value={id} />
      {/* O valor vai num campo escondido: o React limpa os campos de um formulário depois de o enviar. */}
      <input type="hidden" name="decisao" value={decisao} />
      <FormAlert sucesso={state.ok}>{state.message}</FormAlert>
      {!pronto && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Ainda não pode aprovar: há verificações por cumprir.</p>}

      <fieldset>
        <legend className="sr-only">Decisão</legend>
        <div className="grid gap-2">
          {opcoes.map((o) => (
            <label key={o.value} className="cursor-pointer">
              <input type="radio" value={o.value} checked={decisao === o.value} onChange={() => setDecisao(o.value)} disabled={o.value === "aprovar" && !pronto} className="peer sr-only" />
              <span className="block rounded-2xl border border-line p-3 transition-colors peer-checked:border-primary peer-checked:bg-primary/5 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                <span className="block font-semibold">{o.titulo}</span>
                <span className="block text-sm text-muted-foreground">{o.texto}</span>
              </span>
            </label>
          ))}
        </div>
        <FieldError id="decisao-error">{errors.decisao}</FieldError>
      </fieldset>

      {(decisao === "informacao" || decisao === "rejeitar") && (
        <TextAreaField id="nota" label={decisao === "rejeitar" ? "Motivo da rejeição" : "O que falta"} required className="min-h-24" error={errors.nota} hint="A organização vê este texto." />
      )}

      <Button type="submit" size="lg" disabled={pending || !decisao} className="w-full">
        {pending ? "A guardar…" : "Confirmar decisão"}
      </Button>
    </form>
  );
}
