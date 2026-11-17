"use client";

import Link from "next/link";
import { ListaFiltravel, type Filtro } from "@/components/platform/lista-filtravel";
import { Selo } from "@/components/platform/selo";
import { estadosPedido, haDias, type EstadoPedido, type PedidoSuporte } from "@/lib/exemplo";

const filtros: Filtro<PedidoSuporte>[] = [
  {
    id: "estado",
    rotulo: "Estado",
    opcoes: [{ value: "todos", label: "Todos os estados" }, ...(Object.keys(estadosPedido) as EstadoPedido[]).map((e) => ({ value: e, label: estadosPedido[e].label }))],
    combina: (p, v) => p.estado === v,
  },
  {
    id: "origem",
    rotulo: "Quem pediu",
    opcoes: [{ value: "todos", label: "Empresas e pesquisadores" }, { value: "empresa", label: "Empresas" }, { value: "pesquisador", label: "Pesquisadores" }],
    combina: (p, v) => p.de.tipo === v,
  },
];

export default function ListaPedidos({ pedidos }: { pedidos: PedidoSuporte[] }) {
  return (
    <ListaFiltravel
      nome="pedidos"
      placeholder="Pesquisar por assunto ou nome"
      itens={pedidos}
      texto={(p) => `${p.id} ${p.assunto} ${p.de.nome} ${p.categoria}`}
      filtros={filtros}
      linha={(p) => (
        <li key={p.id} className="relative flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-primary/5">
          <div className="min-w-0 flex-1 basis-60">
            <Link href={`/suporte/${p.id}`} className={`block truncate after:absolute after:inset-0 hover:text-primary-strong ${p.estado === "novo" ? "font-bold" : "font-semibold"}`}>
              {p.assunto}
            </Link>
            <p className="text-sm text-muted-foreground">
              {p.id} · {p.de.nome} ({p.de.tipo === "empresa" ? "empresa" : "pesquisador"}) · {p.categoria} · {haDias(p.aberto)}
            </p>
          </div>
          <p className="w-28 text-sm text-muted-foreground">{p.responsavel ?? "Sem responsável"}</p>
          <span className="flex w-24 justify-end">
            <Selo info={estadosPedido[p.estado]} />
          </span>
        </li>
      )}
    />
  );
}
