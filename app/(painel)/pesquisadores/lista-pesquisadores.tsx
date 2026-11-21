"use client";

import Link from "next/link";
import { ListaFiltravel, type Filtro } from "@/components/platform/lista-filtravel";
import { Selo } from "@/components/platform/selo";
import { estadosConta, type EstadoConta, type Pesquisador } from "@/lib/exemplo";

export default function ListaPesquisadores({ pesquisadores }: { pesquisadores: Pesquisador[] }) {
  const comPais = pesquisadores.some((p) => !p.daApi);
  const paises = [...new Set(pesquisadores.map((p) => p.pais))].toSorted();
  const filtros: Filtro<Pesquisador>[] = [
    {
      id: "estado",
      rotulo: "Estado",
      opcoes: [{ value: "todos", label: "Todos os estados" }, ...(Object.keys(estadosConta) as EstadoConta[]).map((e) => ({ value: e, label: estadosConta[e].label }))],
      combina: (p, v) => p.estado === v,
    },
    ...(comPais
      ? [
          {
            id: "pais",
            rotulo: "País",
            opcoes: [{ value: "todos", label: "Todos os países" }, ...paises.map((p) => ({ value: p, label: p }))],
            combina: (p: Pesquisador, v: string) => p.pais === v,
          },
        ]
      : []),
  ];

  return (
    <ListaFiltravel
      nome="pesquisadores"
      placeholder="Pesquisar por nome"
      itens={pesquisadores}
      texto={(p) => p.nome ?? p.handle}
      filtros={filtros}
      linha={(p) => (
        <li key={p.handle} className="relative flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-primary/5">
          <div className="min-w-0 flex-1 basis-56">
            <Link href={`/pesquisadores/${p.handle}`} className="block truncate font-semibold after:absolute after:inset-0 hover:text-primary-strong">
              {p.nome ?? p.handle}
            </Link>
            <p className="text-sm text-muted-foreground">{p.daApi ? (p.documento ? `Pediu a verificação (${p.documento.tipo})` : "Conta registada") : `${p.nivel} · ${p.pais}`}</p>
          </div>
          <p className="w-32 text-sm text-muted-foreground">
            {p.validos} válidos de {p.relatorios}
          </p>
          {!p.daApi && (
            <p className="w-20 text-sm text-muted-foreground">
              {p.avisos} {p.avisos === 1 ? "aviso" : "avisos"}
            </p>
          )}
          <span className="flex w-28 justify-end">
            <Selo info={estadosConta[p.estado]} />
          </span>
        </li>
      )}
    />
  );
}
