"use client";

import { useState } from "react";
import { abreviar, formatar, type Formato } from "@/lib/graficos";

export type Segmento = {
  label: string;
  value: number;
  /** Classes Tailwind da cor: `stroke-*` para o anel e `bg-*` para a legenda. */
  stroke: string;
  dot: string;
};

/**
 * Anel com a distribuição de um total e a legenda ao lado, com o valor e a
 * percentagem de cada parte. Ao passar o rato num arco (ou numa linha da legenda)
 * a parte fica em destaque e o centro mostra o seu valor.
 */
export function DonutChart({
  segments,
  nome,
  centro,
  formato,
}: {
  segments: Segmento[];
  nome: string;
  centro: string;
  /** Como mostrar os valores. Sem isto, mostra o número tal como está. */
  formato?: Formato;
}) {
  const texto = (n: number) => (formato ? formatar(n, formato) : String(n));
  const curto = (n: number) => (formato === "mzn" ? abreviar(n) : String(n));
  const [ativo, setAtivo] = useState<number | null>(null);
  const total = segments.reduce((soma, s) => soma + s.value, 0);
  const R = 15.9155; // circunferência de 100, para o comprimento de cada arco ser em %
  const folga = segments.length > 1 ? 0.8 : 0;
  // Onde começa cada arco, em % da circunferência
  const inicios = segments.reduce<number[]>((acc, _s, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + (segments[i - 1].value / total) * 100);
    return acc;
  }, []);

  const parte = ativo !== null ? segments[ativo] : null;

  return (
    <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10 lg:flex-col lg:gap-6 2xl:flex-row">
      <div
        role="img"
        aria-label={`${nome}. ${segments.map((s) => `${s.label}: ${texto(s.value)}`).join("; ")}`}
        className="relative size-44 shrink-0"
        onMouseLeave={() => setAtivo(null)}
      >
        <svg aria-hidden viewBox="0 0 36 36" className="size-full -rotate-90">
          <circle cx="18" cy="18" r={R} fill="none" strokeWidth="4" className="stroke-canvas" />
          {segments.map((s, i) => {
            const arco = Math.max((s.value / total) * 100 - folga, 0);
            return (
              <circle
                key={s.label}
                cx="18"
                cy="18"
                r={R}
                fill="none"
                strokeWidth={ativo === i ? 5 : 4}
                strokeDasharray={`${arco} ${100 - arco}`}
                strokeDashoffset={-inicios[i]}
                className={`${s.stroke} cursor-pointer transition-all ${
                  ativo !== null && ativo !== i ? "opacity-30" : ""
                }`}
                onMouseEnter={() => setAtivo(i)}
              />
            );
          })}
        </svg>
        <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold">{curto(parte ? parte.value : total)}</span>
          <span className="max-w-24 text-sm text-muted-foreground">{parte ? parte.label : centro}</span>
        </div>
      </div>

      <ul className="w-full max-w-xs space-y-1" onMouseLeave={() => setAtivo(null)}>
        {segments.map((s, i) => (
          <li
            key={s.label}
            onMouseEnter={() => setAtivo(i)}
            className={`flex cursor-default items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors ${
              ativo === i ? "bg-canvas" : ""
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden className={`size-3 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <span className="tabular-nums">
              <span className="font-semibold">{texto(s.value)}</span>
              <span className="ml-2 text-sm text-muted-foreground">{Math.round((s.value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
