"use client";

import { useState } from "react";
import { formatar, type Formato } from "@/lib/graficos";

export type Barra = {
  label: string;
  value: number;
  /** Classe Tailwind `bg-*` da barra. */
  cor: string;
};

/**
 * Barras horizontais, uma por linha: o nome, a barra e o valor, alinhados.
 * Ao passar o rato numa linha, as outras esbatem-se e aparece o valor e a percentagem do total.
 */
export function BarList({ bars, nome, formato }: { bars: Barra[]; nome: string; formato: Formato }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const maximo = Math.max(...bars.map((b) => b.value), 1);
  const total = bars.reduce((soma, b) => soma + b.value, 0);

  return (
    <ul aria-label={nome} className="space-y-1" onMouseLeave={() => setAtivo(null)}>
      {bars.map((b, i) => {
        const largura = (b.value / maximo) * 100;
        return (
          <li
            key={b.label}
            onMouseEnter={() => setAtivo(i)}
            className={`relative rounded-lg px-2 py-2 transition-opacity ${
              ativo !== null && ativo !== i ? "opacity-40" : ""
            } ${ativo === i ? "bg-primary/10" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium">{b.label}</span>
              <span className="font-semibold tabular-nums">{b.value}</span>
            </div>
            <div aria-hidden className="mt-1.5 h-3 w-full rounded-full bg-white ring-1 ring-line">
              <div className={`h-full rounded-full ${b.cor}`} style={{ width: `${largura}%` }} />
            </div>
            {ativo === i && (
              <div
                aria-hidden
                className="absolute bottom-full z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-sm text-canvas shadow-lg ring-1 ring-canvas/20"
                style={{ left: `clamp(4rem, calc(${largura}% + 0.5rem), calc(100% - 4rem))` }}
              >
                {formatar(b.value, formato)} · {Math.round((b.value / total) * 100)}%
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
