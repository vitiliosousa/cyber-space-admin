"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { acaoFinanceira, type AcaoFinanceiraState } from "./actions";

/** Botão pequeno que corre uma ação financeira e mostra o resultado por baixo. */
export function BotaoAcao({ acao, id, rotulo, nome, variante = "outline" }: { acao: string; id: string; rotulo: string; nome: string; variante?: "outline" | "default" }) {
  const [state, formAction, pending] = useActionState(acaoFinanceira, {} as AcaoFinanceiraState);
  return (
    <form action={formAction} className="relative z-10 flex flex-col items-end gap-1">
      <input type="hidden" name="acao" value={acao} />
      <input type="hidden" name="id" value={id} />
      <Button type="submit" size="sm" variant={variante} disabled={pending} className="h-9 px-4">
        {pending ? "A enviar…" : rotulo}
        <span className="sr-only"> {nome}</span>
      </Button>
      {state.message && (
        <p role="alert" className="max-w-52 text-right text-sm text-muted-foreground">
          {state.message}
        </p>
      )}
    </form>
  );
}
