"use client";

import { useState } from "react";
import { abreviar, escala, formatar, type Formato } from "@/lib/graficos";
import type { Ponto } from "./column-chart";

/** Linha com área para uma série ao longo do tempo, com marcadores e dica ao passar o rato. */
export function LineChart({
  data,
  nome,
  formato,
}: {
  data: Ponto[];
  nome: string;
  formato: Formato;
}) {
  const formatValue = (n: number) => formatar(n, formato);
  const [ativo, setAtivo] = useState<number | null>(null);
  const { topo, marcas } = escala(Math.max(...data.map((d) => d.value)), 3);
  const n = data.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (v: number) => 100 - (v / topo) * 100;

  const linha = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(d.value)}`).join(" ");
  const area = `${linha} L${x(n - 1)} 100 L${x(0)} 100 Z`;

  return (
    <figure className="flex h-full flex-col">
      <div className="flex flex-1 flex-col" role="img" aria-label={`${nome}. ${data.map((d) => `${d.label}: ${formatValue(d.value)}`).join("; ")}`}>
        <div className="relative ml-14 mt-4 min-h-56 flex-1" onMouseLeave={() => setAtivo(null)}>
          {marcas.map((m) => (
            <div
              key={m}
              aria-hidden
              className="absolute inset-x-0 border-t border-line"
              style={{ bottom: `${(m / topo) * 100}%` }}
            >
              <span className="absolute right-full top-0 mr-3 -translate-y-1/2 whitespace-nowrap text-sm text-muted-foreground">
                {abreviar(m)}
              </span>
            </div>
          ))}

          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <path d={area} className="fill-violet-500/10" />
            <path
              d={linha}
              fill="none"
              className="stroke-violet-600"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {ativo !== null && (
            <span
              aria-hidden
              className="absolute inset-y-0 w-px bg-violet-300"
              style={{ left: `${x(ativo)}%` }}
            />
          )}

          {data.map((d, i) => (
            <span
              key={d.label}
              aria-hidden
              className={`absolute rounded-full bg-violet-700 ring-2 ring-[var(--surface)] transition-all ${
                ativo === i ? "size-4" : "size-3"
              }`}
              style={{
                left: `${x(i)}%`,
                bottom: `${(d.value / topo) * 100}%`,
                transform: "translate(-50%, 50%)",
              }}
            />
          ))}

          {/* Zonas de rato: uma coluna inteira por ponto, bem maior do que o marcador */}
          <div className="absolute inset-0 flex">
            {data.map((d, i) => (
              <div key={d.label} className="relative flex-1" onMouseEnter={() => setAtivo(i)}>
                {ativo === i && (
                  <div
                    aria-hidden
                    className="absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-sm text-canvas shadow-lg ring-1 ring-canvas/20"
                    style={{ bottom: `calc(${(d.value / topo) * 100}% + 14px)` }}
                  >
                    <span className="opacity-70">{d.label}</span> {formatValue(d.value)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div aria-hidden className="ml-14 mt-2 flex">
          {data.map((d) => (
            <span key={d.label} className="flex-1 text-center text-sm text-muted-foreground">
              {d.label}
            </span>
          ))}
        </div>
      </div>

      <table className="sr-only">
        <caption>{nome}</caption>
        <thead>
          <tr>
            <th scope="col">Mês</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{formatValue(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
