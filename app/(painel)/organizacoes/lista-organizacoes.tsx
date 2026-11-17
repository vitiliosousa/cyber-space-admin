"use client";

import Link from "next/link";
import { ListaFiltravel, type Filtro } from "@/components/platform/lista-filtravel";
import { ProgramAvatar } from "@/components/platform/program-avatar";
import { Selo } from "@/components/platform/selo";
import { estadosOrganizacao, haDias, logoDe, type EstadoOrganizacao, type Organizacao } from "@/lib/exemplo";

const filtros: Filtro<Organizacao>[] = [
  {
    id: "estado",
    rotulo: "Estado",
    opcoes: [{ value: "todos", label: "Todos os estados" }, ...(Object.keys(estadosOrganizacao) as EstadoOrganizacao[]).map((e) => ({ value: e, label: estadosOrganizacao[e].label }))],
    combina: (o, v) => o.estado === v,
  },
];

export default function ListaOrganizacoes({ organizacoes }: { organizacoes: Organizacao[] }) {
  return (
    <ListaFiltravel
      nome="organizacoes"
      placeholder="Pesquisar por nome ou sector"
      itens={organizacoes}
      texto={(o) => `${o.nome} ${o.setor}`}
      filtros={filtros}
      linha={(o) => (
        <li key={o.id} className="relative flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-primary/5">
          <ProgramAvatar logo={logoDe(o.id)} />
          <div className="min-w-0 flex-1 basis-52">
            <Link href={`/organizacoes/${o.id}`} className="block truncate font-semibold after:absolute after:inset-0 hover:text-primary-strong">
              {o.nome}
            </Link>
            <p className="text-sm text-muted-foreground">
              {o.setor} · registada {haDias(o.registadaEm)}
            </p>
          </div>
          <p className="w-24 text-sm text-muted-foreground">
            {o.programas} {o.programas === 1 ? "programa" : "programas"}
          </p>
          <p className="w-24 text-sm text-muted-foreground">
            {o.passos.filter((p) => p.feito).length} de {o.passos.length} passos
          </p>
          <span className="flex w-28 justify-end"><Selo info={estadosOrganizacao[o.estado]} /></span>
        </li>
      )}
    />
  );
}
