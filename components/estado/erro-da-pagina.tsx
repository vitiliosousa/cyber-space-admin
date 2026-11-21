"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";

/** Quando a API não responde ou falha, mostramos isto em vez de listas vazias que parecem “sem dados”. */
export function ErroDaPagina({ error, reset, inicio = "/", compacto = false }: { error: Error & { digest?: string }; reset: () => void; inicio?: string; compacto?: boolean }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className={`flex flex-col items-center justify-center px-6 text-center ${compacto ? "py-20" : "min-h-svh py-12"}`}>
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary-strong">
        <HugeiconsIcon icon={Alert02Icon} size={30} aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-bold">Não foi possível carregar os dados</h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">O servidor não respondeu como esperado. Os dados não foram alterados. Tente outra vez; se continuar, volte ao início.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" onClick={reset}>
          Tentar outra vez
        </Button>
        <Link href={inicio} className={buttonVariants({ size: "lg", variant: "outline" })}>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
