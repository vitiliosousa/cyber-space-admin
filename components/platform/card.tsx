import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

const surface = "rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,22,37,0.06)]";

/** Cartão com cabeçalho (título e acção) e corpo. */
export function Card({
  title,
  headingId,
  action,
  children,
  className = "",
  flush = false,
}: {
  title: string;
  headingId: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Sem margem interior, para tabelas e listas que vão de lado a lado. */
  flush?: boolean;
}) {
  return (
    <section aria-labelledby={headingId} className={`${surface} flex flex-col ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 id={headingId} className="text-lg font-bold">
          {title}
        </h2>
        {action}
      </div>
      <div className={`flex-1 ${flush ? "" : "p-5"}`}>{children}</div>
    </section>
  );
}

/** Métrica com ícone: o que é, o valor e uma linha de contexto. */
export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: IconSvgElement;
}) {
  return (
    <div className={`${surface} p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground sm:text-base">{label}</p>
        <HugeiconsIcon icon={icon} size={22} aria-hidden className="shrink-0 text-primary-strong" />
      </div>
      <p className="mt-2 text-xl font-bold sm:mt-3 sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
