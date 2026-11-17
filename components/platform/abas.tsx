"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export type Aba = { id: string; rotulo: string; conteudo: ReactNode };

/** Separadores simples: o conteúdo de cada um é desenhado no servidor e só a escolha acontece no cliente. */
export function Abas({ abas, nome }: { abas: Aba[]; nome: string }) {
  const [ativa, setAtiva] = useState(abas[0].id);
  const atual = abas.find((a) => a.id === ativa) ?? abas[0];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label={nome} className="flex flex-wrap gap-2">
        {abas.map((a) => (
          <button
            key={a.id}
            role="tab"
            type="button"
            id={`aba-${a.id}`}
            aria-selected={a.id === atual.id}
            aria-controls={`painel-${a.id}`}
            onClick={() => setAtiva(a.id)}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 font-medium transition-colors ${a.id === atual.id ? "bg-primary/15 text-primary-strong" : "bg-white text-muted-foreground ring-1 ring-line hover:bg-primary/5 hover:text-ink"}`}
          >
            {a.rotulo}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`painel-${atual.id}`} aria-labelledby={`aba-${atual.id}`}>
        {atual.conteudo}
      </div>
    </div>
  );
}
