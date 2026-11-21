"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FieldError, FormAlert, TextAreaField } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import type { EstadoOrganizacao, PassoVerificacao } from "@/lib/exemplo";
import { decidirOrganizacao, type OrganizacaoState } from "../actions";

const todas = [
  { value: "verificar", titulo: "Verificar", texto: "Confirma a organização. Pode publicar programas.", para: ["em-analise", "por-verificar", "rejeitada"], pedeNota: false },
  { value: "informacao", titulo: "Pedir mais informação", texto: "Diz à organização o que falta.", para: ["em-analise", "por-verificar"], pedeNota: true },
  { value: "rejeitar", titulo: "Rejeitar", texto: "A verificação não é aceite.", para: ["em-analise", "por-verificar"], pedeNota: true },
  { value: "suspender", titulo: "Suspender", texto: "Os programas ficam pausados e deixa de poder publicar.", para: ["verificada"], pedeNota: true },
  { value: "reativar", titulo: "Reativar", texto: "A organização volta ao estado verificada.", para: ["suspensa"], pedeNota: false },
] as const;

export default function Acoes({ id, estado, passos }: { id: string; estado: EstadoOrganizacao; passos: PassoVerificacao[] }) {
  const [state, formAction, pending] = useActionState(decidirOrganizacao, {} as OrganizacaoState);
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
      <FormAlert sucesso={state.ok}>{state.message}</FormAlert>
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
      {decisao === "verificar" && (
        <fieldset className="space-y-1">
          <legend className="mb-1 text-sm font-medium">Passos confirmados</legend>
          {passos.map((p) => (
            <label key={p.chave} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-1 py-2 hover:bg-primary/5">
              {/* A prova adicional é a declaração da própria organização: a equipa não a marca, só vê se foi feita. */}
              <input type="checkbox" name="passo" value={p.chave} defaultChecked={p.feito} disabled={p.chave === "prova-adicional"} className="size-5 shrink-0 accent-primary" />
              <span>
                {p.rotulo}
                {p.chave === "prova-adicional" && <span className="text-muted-foreground"> · {p.feito ? "declaração feita pela organização" : "ainda sem declaração"}</span>}
              </span>
            </label>
          ))}
        </fieldset>
      )}
      {escolhida?.pedeNota && <TextAreaField id="nota" label="Motivo" required className="min-h-24" hint="A organização vê este texto." error={errors.nota} />}
      <Button type="submit" size="lg" disabled={pending || !decisao} className="w-full">
        {pending ? "A guardar…" : "Confirmar"}
      </Button>
    </form>
  );
}
