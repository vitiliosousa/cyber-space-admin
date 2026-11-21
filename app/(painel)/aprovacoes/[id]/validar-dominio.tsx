"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { validarDominio, type DecisaoState } from "../actions";

/** A equipa confirma (ou retira a confirmação de) que a organização controla o domínio de um ativo. */
export default function ValidarDominio({ programa, ativo, validado, nome }: { programa: string; ativo: string; validado: boolean; nome: string }) {
  const [state, formAction, pending] = useActionState(validarDominio, {} as DecisaoState);
  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="programa" value={programa} />
      <input type="hidden" name="ativo" value={ativo} />
      <input type="hidden" name="validado" value={validado ? "nao" : "sim"} />
      <Button type="submit" size="sm" variant="outline" disabled={pending} className="h-9 px-4">
        {pending ? "A guardar…" : validado ? "Retirar validação" : "Validar domínio"}
        <span className="sr-only"> de {nome}</span>
      </Button>
      {state.message && <p role="alert" className="max-w-52 text-right text-sm text-danger">{state.message}</p>}
    </form>
  );
}
