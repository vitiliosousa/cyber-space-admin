"use client";

import { useActionState } from "react";
import { Selo } from "@/components/platform/selo";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { funcoes, type MembroInterno } from "@/lib/exemplo";
import { alterarMembro, type MembroState } from "./actions";

const estados = {
  ativo: { label: "Ativo", estilo: "bg-green-50 text-green-800" },
  convidado: { label: "Convite enviado", estilo: "bg-blue-50 text-blue-800" },
  desativado: { label: "Desativado", estilo: "bg-slate-100 text-slate-700" },
} as const;

function Acoes({ m }: { m: MembroInterno }) {
  const [state, formAction, pending] = useActionState(alterarMembro, {} as MembroState);
  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={m.id ?? ""} />
      <div className="flex flex-wrap justify-end gap-2">
        {m.estado === "ativo" && !m.doisPassos && (
          <Button type="submit" name="acao" value="repor" size="sm" variant="outline" disabled={pending} className="h-9 px-4">
            Repor dois passos<span className="sr-only"> de {m.nome}</span>
          </Button>
        )}
        <Button type="submit" name="acao" value={m.estado === "desativado" ? "reativar" : "desativar"} size="sm" variant="outline" disabled={pending} className={`h-9 px-4 ${m.estado === "desativado" ? "" : "text-danger"}`}>
          {m.estado === "desativado" ? "Reativar" : "Desativar"}
          <span className="sr-only"> {m.nome}</span>
        </Button>
      </div>
      {state.message && (
        <p role={state.ok ? "status" : "alert"} className="max-w-64 text-right text-sm text-muted-foreground">
          {state.message}
        </p>
      )}
    </form>
  );
}

export default function ListaMembros({ membros }: { membros: MembroInterno[] }) {
  return (
    <section aria-labelledby="membros-titulo" className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,22,37,0.06)]">
      <h2 id="membros-titulo" className="border-b border-line px-5 py-3 text-lg font-bold">
        Membros
      </h2>
      <ul className="divide-y divide-line">
        {membros.map((m) => (
          <li key={m.email} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
            <div className="flex min-w-0 flex-1 basis-60 items-center gap-3">
              <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary-strong">
                {m.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{m.nome}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {funcoes[m.funcao].label} · {m.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {m.estado === "convidado" || !m.ultimoAcesso ? "Ainda não entrou" : `Último acesso ${formatDate(m.ultimoAcesso.slice(0, 10))}, ${m.ultimoAcesso.slice(11)}`}
                  {m.estado === "ativo" && !m.doisPassos && <span className="font-medium text-danger"> · sem dois passos</span>}
                </p>
              </div>
            </div>
            <Selo info={estados[m.estado]} />
            <Acoes m={m} />
          </li>
        ))}
      </ul>
    </section>
  );
}
