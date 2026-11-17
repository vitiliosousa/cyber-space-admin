import type { ComponentProps } from "react";

/** O interruptor em si: uma caixa de seleção com o aspeto de liga/desliga. Funciona em formulários e com o teclado. */
export function Comutador({ nome, ...input }: Omit<ComponentProps<"input">, "type" | "name"> & { nome: string }) {
  return (
    <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
      <input type="checkbox" role="switch" name={nome} className="peer sr-only" {...input} />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-line transition-colors peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
      />
      <span
        aria-hidden
        className="absolute left-1 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5 motion-reduce:transition-none"
      />
    </span>
  );
}

/** Linha com título, descrição e um interruptor à direita. Clicar em qualquer ponto da linha liga ou desliga. */
export function Interruptor({
  nome,
  titulo,
  descricao,
  className = "",
  ...input
}: Omit<ComponentProps<"input">, "type" | "name" | "title"> & { nome: string; titulo: string; descricao?: string }) {
  return (
    <label className={`flex cursor-pointer items-center justify-between gap-4 py-3 ${className}`}>
      <span className="min-w-0">
        <span className="block font-medium">{titulo}</span>
        {descricao && <span className="block text-sm text-muted-foreground">{descricao}</span>}
      </span>
      <Comutador nome={nome} {...input} />
    </label>
  );
}
