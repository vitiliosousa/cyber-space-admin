"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FieldError, FormAlert, SelectField, TextAreaField } from "@/components/auth/fields";
import { Selo } from "@/components/platform/selo";
import { Button } from "@/components/ui/button";
import { formatMZN } from "@/lib/format";
import { estadosDisputa, gravidadeEstilo, gravidadeLabels, haDias, nomeOrganizacao, type Disputa, type PedidoTriagem } from "@/lib/exemplo";
import { devolverTriagem, resolverDisputa, type DisputaState, type TriagemState } from "./actions";

const estadoTriagem = {
  "na-fila": { label: "Na fila", estilo: "bg-amber-50 text-amber-900" },
  "em-triagem": { label: "Em triagem", estilo: "bg-blue-50 text-blue-800" },
  devolvido: { label: "Devolvido à empresa", estilo: "bg-green-50 text-green-800" },
} as const;

function FormTriagem({ t }: { t: PedidoTriagem }) {
  const [state, formAction, pending] = useActionState(devolverTriagem, {} as TriagemState);
  const ref = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);
  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4 border-t border-line bg-canvas/50 px-5 py-4">
      <input type="hidden" name="id" value={t.id} />
      <FormAlert>{state.message}</FormAlert>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id={`gravidade-${t.id}`} label="Gravidade final" placeholder="Escolha a gravidade" defaultValue={t.gravidadeSugerida} options={Object.entries(gravidadeLabels).map(([value, label]) => ({ value, label }))} error={errors.gravidade} />
      </div>
      <TextAreaField id={`nota-${t.id}`} label="Análise para a empresa" required className="min-h-24" hint="Reproduziu a falha? O que recomenda?" error={errors.nota} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "A devolver…" : "Devolver à empresa"}
      </Button>
    </form>
  );
}

function FormDisputa({ d }: { d: Disputa }) {
  const [state, formAction, pending] = useActionState(resolverDisputa, {} as DisputaState);
  const [decisao, setDecisao] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);
  return (
    <form ref={ref} action={formAction} noValidate className="space-y-4 border-t border-line bg-canvas/50 px-5 py-4">
      <input type="hidden" name="id" value={d.id} />
      <input type="hidden" name="decisao" value={decisao} />
      <FormAlert>{state.message}</FormAlert>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Decisão</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { v: "pesquisador", t: "A favor do pesquisador" },
            { v: "empresa", t: "A favor da empresa" },
            { v: "informacao", t: "Pedir mais informação" },
          ].map((o) => (
            <label key={o.v} className="cursor-pointer">
              <input type="radio" value={o.v} checked={decisao === o.v} onChange={() => setDecisao(o.v)} className="peer sr-only" />
              <span className="flex min-h-11 items-center rounded-2xl border border-line bg-white px-3 font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">{o.t}</span>
            </label>
          ))}
        </div>
        <FieldError id={`decisao-error-${d.id}`}>{errors.decisao}</FieldError>
      </fieldset>
      <TextAreaField id={`nota-${d.id}`} label="Explicação às duas partes" required className="min-h-24" error={errors.nota} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "A guardar…" : "Registar decisão"}
      </Button>
    </form>
  );
}

export default function Separadores({ fila, disputas }: { fila: PedidoTriagem[]; disputas: Disputa[] }) {
  const [aba, setAba] = useState<"triagem" | "disputas">("triagem");
  const abertas = disputas.filter((d) => d.estado !== "resolvida").length;
  const naFila = fila.filter((t) => t.estado !== "devolvido").length;

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Relatórios" className="flex flex-wrap gap-2">
        {[
          { v: "triagem" as const, t: `Fila de triagem (${naFila})` },
          { v: "disputas" as const, t: `Disputas (${abertas})` },
        ].map((o) => (
          <button
            key={o.v}
            role="tab"
            type="button"
            id={`aba-${o.v}`}
            aria-selected={aba === o.v}
            aria-controls="painel-relatorios"
            onClick={() => setAba(o.v)}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 font-medium transition-colors ${aba === o.v ? "bg-primary/15 text-primary-strong" : "bg-white text-muted-foreground ring-1 ring-line hover:bg-primary/5 hover:text-ink"}`}
          >
            {o.t}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="painel-relatorios" aria-labelledby={`aba-${aba}`} className="space-y-3">
        {aba === "triagem" ? (
          <>
            <p className="max-w-3xl text-muted-foreground">Relatórios de empresas que contrataram a triagem. A equipa reproduz a falha, define a gravidade e devolve o relatório já avaliado.</p>
            {fila.map((t) => (
              <details key={t.id} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,22,37,0.06)]">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 marker:hidden hover:bg-primary/5 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0 flex-1 basis-60">
                    <p className="font-semibold">{t.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.relatorioId} · {nomeOrganizacao(t.organizacaoId)} · recebido {haDias(t.recebidoEm)}
                      {t.analista && ` · ${t.analista}`}
                    </p>
                  </div>
                  <Selo info={{ label: gravidadeLabels[t.gravidadeSugerida], estilo: gravidadeEstilo[t.gravidadeSugerida] }} />
                  <Selo info={estadoTriagem[t.estado]} />
                </summary>
                {t.estado !== "devolvido" ? <FormTriagem t={t} /> : <p className="border-t border-line bg-canvas/50 px-5 py-4 text-muted-foreground">Já foi devolvido à empresa.</p>}
              </details>
            ))}
          </>
        ) : (
          <>
            <p className="max-w-3xl text-muted-foreground">Quando o pesquisador e a empresa não chegam a acordo, a equipa decide e explica às duas partes.</p>
            {disputas.map((d) => (
              <details key={d.id} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,22,37,0.06)]">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 marker:hidden hover:bg-primary/5 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0 flex-1 basis-60">
                    <p className="font-semibold">{d.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.id} · {nomeOrganizacao(d.organizacaoId)} · {d.pesquisador} · aberta {haDias(d.abertaEm)}
                      {d.valor && ` · ${formatMZN(d.valor)}`}
                    </p>
                  </div>
                  <Selo info={estadosDisputa[d.estado]} />
                </summary>
                <p className="border-t border-line px-5 py-3 text-sm">
                  <span className="font-medium">Aberta pelo {d.aberta}:</span> {d.motivo}
                </p>
                {d.estado !== "resolvida" ? <FormDisputa d={d} /> : <p className="border-t border-line bg-canvas/50 px-5 py-4 text-muted-foreground">Resolvida{d.responsavel ? ` por ${d.responsavel}` : ""}.</p>}
              </details>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
