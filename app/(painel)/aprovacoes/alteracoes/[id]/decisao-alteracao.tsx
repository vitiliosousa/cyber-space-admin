"use client";

import { useActionState, useState } from "react";
import { FieldError, FormAlert, TextAreaField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { decidirAlteracao, type DecisaoState } from "../../actions";

/** Aprovar (confirmando o controlo dos domínios novos) ou recusar com o motivo. */
export default function DecisaoAlteracao({ id, ativosNovos }: { id: string; ativosNovos: string[] }) {
  const [state, formAction, pending] = useActionState(decidirAlteracao, {} as DecisaoState);
  const [decisao, setDecisao] = useState("");
  const errors = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="decisao" value={decisao} />
      <FormAlert sucesso={state.ok}>{state.message}</FormAlert>

      <fieldset>
        <legend className="sr-only">Decisão</legend>
        <div className="grid gap-2">
          {[
            { value: "aprovar", titulo: "Aprovar", texto: "As alterações entram em vigor já. Quem participa no programa é avisado." },
            { value: "rejeitar", titulo: "Recusar", texto: "O programa fica como está e a organização recebe o motivo." },
          ].map((o) => (
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

      {decisao === "aprovar" && ativosNovos.length > 0 && (
        <fieldset className="space-y-1">
          <legend className="mb-1 text-sm font-medium">Ativos novos: confirme o controlo do domínio</legend>
          {ativosNovos.map((a) => (
            <label key={a} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-1 py-2 hover:bg-primary/5">
              <input type="checkbox" name="dominio" value={a} className="size-5 shrink-0 accent-primary" />
              <span className="break-all">
                A organização controla <span className="font-mono text-sm font-semibold">{a}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      {decisao === "rejeitar" && <TextAreaField id="nota" label="Motivo" required className="min-h-24" error={errors.nota} hint="A organização vê este texto." />}
      {decisao === "aprovar" && <TextAreaField id="nota" label="Nota (opcional)" className="min-h-20" />}

      <Button type="submit" size="lg" disabled={pending || !decisao} className="w-full">
        {pending ? "A guardar…" : "Confirmar decisão"}
      </Button>
    </form>
  );
}
