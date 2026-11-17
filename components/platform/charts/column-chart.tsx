"use client";

import { useState } from "react";
import { abreviar, escala, formatar, type Formato } from "@/lib/graficos";

export type Ponto = { label: string; value: number };

/**
 * Colunas com uma só série (roxo, o último mês em tom mais escuro).
 * O gráfico em si é uma imagem para os leitores de ecrã, que têm a tabela com os valores.
 */
export function ColumnChart({
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
  const { topo, marcas } = escala(Math.max(...data.map((d) => d.value)), 4);
  const ultimo = data.length - 1;

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

          <div className="absolute inset-0 flex gap-2 px-1 sm:gap-4">
            {data.map((d, i) => {
              const pct = (d.value / topo) * 100;
              return (
                <div key={d.label} className={`relative flex-1 rounded-md transition-colors ${ativo === i ? "bg-primary/10" : ""}`} onMouseEnter={() => setAtivo(i)}>
                  <div
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-12 rounded-t-md transition-opacity ${
                      i === ultimo ? "bg-violet-700" : "bg-violet-500"
                    } ${ativo !== null && ativo !== i ? "opacity-40" : ""}`}
                    style={{ height: `${pct}%` }}
                  />
                  {ativo === i ? (
                    <div
                      aria-hidden
                      className="absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-sm text-canvas shadow-lg ring-1 ring-canvas/20"
                      style={{ bottom: `calc(${pct}% + 8px)` }}
                    >
                      <span className="opacity-70">{d.label}</span> {formatValue(d.value)}
                    </div>
                  ) : (
                    ativo === null &&
                    i === ultimo && (
                      <span
                        aria-hidden
                        className="absolute right-0 whitespace-nowrap text-sm font-semibold"
                        style={{ bottom: `calc(${pct}% + 6px)` }}
                      >
                        {formatValue(d.value)}
                      </span>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div aria-hidden className="ml-14 mt-2 flex gap-2 px-1 sm:gap-4">
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
