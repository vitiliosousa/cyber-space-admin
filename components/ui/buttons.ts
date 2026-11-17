import { buttonVariants } from "./button";

/**
 * Classes dos botões, geradas pelo Button do shadcn (pílula, tamanhos e cores da marca).
 * Servem para ligações (<Link>) que têm de parecer botões.
 */

/** Largura total (formulários de conta). */
export const primaryButton = buttonVariants({ size: "lg", className: "w-full text-lg" });

/** Largura do conteúdo (barras de acções e formulários da plataforma). */
export const primaryButtonAuto = buttonVariants({ size: "lg" });
export const outlineButtonAuto = buttonVariants({ variant: "outline", size: "lg" });
