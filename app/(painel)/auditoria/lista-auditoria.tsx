"use client";

import { ListaFiltravel, type Filtro } from "@/components/platform/lista-filtravel";
import { Selo } from "@/components/platform/selo";
import { formatDate } from "@/lib/format";
import type { EventoAuditoria } from "@/lib/exemplo";

const tipos: Record<EventoAuditoria["tipo"], { label: string; estilo: string }> = {
  aprovacao: { label: "Aprovações", estilo: "bg-violet-50 text-violet-800" },
  conta: { label: "Contas", estilo: "bg-blue-50 text-blue-800" },
  financeiro: { label: "Financeiro", estilo: "bg-green-50 text-green-800" },
  acesso: { label: "Acessos", estilo: "bg-slate-100 text-slate-800" },
  configuracao: { label: "Configuração", estilo: "bg-amber-50 text-amber-900" },
};

export default function ListaAuditoria({ eventos }: { eventos: EventoAuditoria[] }) {
  const pessoas = [...new Set(eventos.map((e) => e.quem))].toSorted();
  const filtros: Filtro<EventoAuditoria>[] = [
    {
      id: "tipo",
      rotulo: "Tipo",
      opcoes: [{ value: "todos", label: "Todos os tipos" }, ...(Object.keys(tipos) as EventoAuditoria["tipo"][]).map((t) => ({ value: t, label: tipos[t].label }))],
      combina: (e, v) => e.tipo === v,
    },
    {
      id: "quem",
      rotulo: "Pessoa",
      opcoes: [{ value: "todos", label: "Toda a equipa" }, ...pessoas.map((p) => ({ value: p, label: p }))],
      combina: (e, v) => e.quem === v,
    },
  ];

  return (
    <ListaFiltravel
      nome="auditoria"
      placeholder="Pesquisar por ação ou alvo"
      itens={eventos}
      texto={(e) => `${e.acao} ${e.alvo} ${e.quem}`}
      filtros={filtros}
      linha={(e) => (
        <li key={e.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
          <div className="min-w-0 flex-1 basis-64">
            <p>
              <span className="font-semibold">{e.quem}</span> {e.acao.charAt(0).toLowerCase() + e.acao.slice(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              {e.alvo} · {formatDate(e.quando.slice(0, 10))}, {e.quando.slice(11)} · {e.ip}
            </p>
          </div>
          <Selo info={tipos[e.tipo]} />
        </li>
      )}
    />
  );
}
