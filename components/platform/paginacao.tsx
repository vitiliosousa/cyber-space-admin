"use client";

const botao = "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full font-medium transition-colors";

/** Números de página a mostrar: a primeira, a última e as vizinhas da atual, com reticências entre saltos. */
function paginasVisiveis(atual: number, total: number): (number | null)[] {
  const base = new Set([1, total, atual - 1, atual, atual + 1].filter((n) => n >= 1 && n <= total));
  const ordem = [...base].toSorted((a, b) => a - b);
  return ordem.flatMap((n, i) => (i > 0 && n - ordem[i - 1] > 1 ? [null, n] : [n]));
}

/** Paginação com "Anterior", números de página, "Seguinte" e o intervalo mostrado. Não aparece com uma só página. */
export function Paginacao({
  atual,
  totalItens,
  porPagina,
  onChange,
}: {
  atual: number;
  totalItens: number;
  porPagina: number;
  onChange: (pagina: number) => void;
}) {
  const total = Math.max(1, Math.ceil(totalItens / porPagina));
  if (total <= 1) return null;

  return (
    <nav aria-label="Páginas" className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {(atual - 1) * porPagina + 1} a {Math.min(atual * porPagina, totalItens)} de {totalItens}
      </p>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => onChange(atual - 1)}
            disabled={atual === 1}
            className={`${botao} px-4 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Anterior
          </button>
        </li>
        {paginasVisiveis(atual, total).map((n, i) =>
          n === null ? (
            <li key={`e${i}`} aria-hidden className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={n}>
              <button
                type="button"
                onClick={() => onChange(n)}
                aria-label={`Página ${n}`}
                aria-current={n === atual ? "page" : undefined}
                className={`${botao} min-w-11 ${n === atual ? "bg-primary text-white" : "hover:bg-primary/5"}`}
              >
                {n}
              </button>
            </li>
          )
        )}
        <li>
          <button
            type="button"
            onClick={() => onChange(atual + 1)}
            disabled={atual === total}
            className={`${botao} px-4 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Seguinte
          </button>
        </li>
      </ul>
    </nav>
  );
}
