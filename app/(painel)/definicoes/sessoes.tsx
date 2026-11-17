"use client";

import { useActionState } from "react";
import { FormAlert } from "@/components/auth/fields";
import { Button } from "@/components/ui/button";
import { terminarSessoes, type DefinicaoState } from "./actions";

const sessoes = [
  { id: "s1", dispositivo: "Chrome no macOS", local: "Maputo, Moçambique", ultimo: "Agora", atual: true },
  { id: "s2", dispositivo: "Safari no iPhone", local: "Maputo, Moçambique", ultimo: "Há 2 dias", atual: false },
];

export default function Sessoes() {
  const [state, formAction, pending] = useActionState(terminarSessoes, {} as DefinicaoState);
  return (
    <form action={formAction}>
      {state.message && (
        <div className="px-5 pt-4">
          <FormAlert>{state.message}</FormAlert>
        </div>
      )}
      <ul className="divide-y divide-line">
        {sessoes.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
            <div>
              <p className="font-medium">
                {s.dispositivo}
                {s.atual && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-strong">Esta sessão</span>}
              </p>
              <p className="text-sm text-muted-foreground">
                {s.local} · {s.ultimo}
              </p>
            </div>
            {!s.atual && (
              <Button type="submit" name="sessao" value={s.id} size="sm" variant="outline" disabled={pending} className="h-9 px-4">
                Terminar<span className="sr-only"> {s.dispositivo}</span>
              </Button>
            )}
          </li>
        ))}
      </ul>
      <div className="border-t border-line p-5">
        <Button type="submit" name="sessao" value="todas" variant="outline" size="lg" disabled={pending}>
          Terminar todas as outras sessões
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">A sessão expira sozinha ao fim de 30 minutos sem atividade.</p>
      </div>
    </form>
  );
}
