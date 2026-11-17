"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, GridViewIcon, ListViewIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { ProgramAvatar } from "@/components/platform/program-avatar";
import { Selo } from "@/components/platform/selo";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { estadosPrograma, logoDe, nomeOrganizacao, organizacoes, type EstadoPrograma, type Programa } from "@/lib/exemplo";
import { formatIntervaloMZN, formatMZN } from "@/lib/format";

type Vista = "cartoes" | "lista";

const CHAVE_VISTA = "cyberspace-admin:vista-programas";
const EVENTO_VISTA = "cyberspace-admin:vista-programas";

function lerVista(): Vista {
  try {
    return localStorage.getItem(CHAVE_VISTA) === "lista" ? "lista" : "cartoes";
  } catch {
    return "cartoes";
  }
}

function subscreverVista(aviso: () => void) {
  window.addEventListener(EVENTO_VISTA, aviso);
  window.addEventListener("storage", aviso);
  return () => {
    window.removeEventListener(EVENTO_VISTA, aviso);
    window.removeEventListener("storage", aviso);
  };
}

function guardarVista(v: Vista) {
  try {
    localStorage.setItem(CHAVE_VISTA, v);
  } catch {
    // sem armazenamento: a vista só muda enquanto a página estiver aberta
  }
  window.dispatchEvent(new Event(EVENTO_VISTA));
}

const estados = [{ value: "todos", label: "Todos os estados" }, ...(Object.keys(estadosPrograma) as EstadoPrograma[]).map((e) => ({ value: e, label: estadosPrograma[e].label }))];
const tipos = [
  { value: "todos", label: "Todos os tipos" },
  { value: "publico", label: "Públicos" },
  { value: "privado", label: "Privados" },
];
/** Que tipos de alvo cabem em cada grupo do filtro "Alvos". */
const gruposDeAlvo: Record<string, string[]> = {
  web: ["Aplicação web", "Domínio com wildcard", "Domínio"],
  api: ["API"],
  movel: ["Android", "iOS"],
};
const alvos = [
  { value: "todos", label: "Todos os alvos" },
  { value: "web", label: "Aplicações web" },
  { value: "api", label: "APIs" },
  { value: "movel", label: "Aplicações móveis" },
];
const recompensas = [
  { value: "todas", label: "Qualquer recompensa" },
  { value: "100000", label: "Até 100 000 MZN ou mais" },
  { value: "150000", label: "Até 150 000 MZN ou mais" },
];

const orgs = [{ value: "todos", label: "Todas as organizações" }, ...organizacoes.map((o) => ({ value: o.id, label: o.nome }))];

function FiltroSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const destino = (p: Programa) => (p.estado === "pendente" ? `/aprovacoes/${p.id}` : `/programas/${p.id}`);

export default function ListaProgramas({ programas }: { programas: Programa[] }) {
  const vista = useSyncExternalStore(subscreverVista, lerVista, () => "cartoes" as Vista);
  const [pesquisa, setPesquisa] = useState("");
  const [estado, setEstado] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [org, setOrg] = useState("todos");
  const [alvo, setAlvo] = useState("todos");
  const [recompensa, setRecompensa] = useState("todas");

  const visiveis = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    return programas.filter(
      (p) =>
        (estado === "todos" || p.estado === estado) &&
        (tipo === "todos" || p.tipo === tipo) &&
        (org === "todos" || p.organizacaoId === org) &&
        (alvo === "todos" || p.ativos.some((a) => gruposDeAlvo[alvo]?.includes(a.tipo))) &&
        (recompensa === "todas" || p.recompensa.max >= Number(recompensa)) &&
        (!termo || `${p.nome} ${nomeOrganizacao(p.organizacaoId)}`.toLowerCase().includes(termo))
    );
  }, [programas, pesquisa, estado, tipo, org, alvo, recompensa]);

  const filtrado = pesquisa !== "" || estado !== "todos" || tipo !== "todos" || org !== "todos" || alvo !== "todos" || recompensa !== "todas";
  const limpar = () => {
    setPesquisa("");
    setEstado("todos");
    setTipo("todos");
    setOrg("todos");
    setAlvo("todos");
    setRecompensa("todas");
  };

  return (
    <div className="space-y-5">
      <div className="@container space-y-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div className="relative">
            <label htmlFor="pesquisa-programas" className="sr-only">
              Pesquisar programas
            </label>
            <HugeiconsIcon icon={Search01Icon} size={20} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="pesquisa-programas" type="search" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Pesquisar por programa ou organização" className="pl-12" />
          </div>

          <div role="group" aria-label="Ver programas como" className="grid h-12 grid-cols-2 gap-1 rounded-2xl border border-input bg-white p-1">
            {[
              { value: "cartoes" as Vista, label: "Cartões", icone: GridViewIcon },
              { value: "lista" as Vista, label: "Lista", icone: ListViewIcon },
            ].map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={vista === o.value}
                onClick={() => guardarVista(o.value)}
                aria-label={o.label}
                title={o.label}
                className={`inline-flex min-w-0 cursor-pointer items-center justify-center rounded-xl px-4 transition-colors ${vista === o.value ? "bg-primary/15 text-primary-strong" : "text-muted-foreground hover:bg-primary/5 hover:text-ink"}`}
              >
                <HugeiconsIcon icon={o.icone} size={20} aria-hidden />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 @xl:grid-cols-3 @4xl:grid-cols-5">
          <FiltroSelect label="Estado do programa" value={estado} onChange={setEstado} options={estados} />
          <FiltroSelect label="Tipo de programa" value={tipo} onChange={setTipo} options={tipos} />
          <FiltroSelect label="Organização" value={org} onChange={setOrg} options={orgs} />
          <FiltroSelect label="Alvos" value={alvo} onChange={setAlvo} options={alvos} />
          <FiltroSelect label="Recompensa" value={recompensa} onChange={setRecompensa} options={recompensas} />
        </div>
      </div>

      {filtrado && (
        <div className="flex min-h-11 items-center justify-between gap-4">
          <p className="text-muted-foreground" role="status">
            {visiveis.length === 1 ? "1 programa com estes filtros" : `${visiveis.length} programas com estes filtros`}
          </p>
          <button type="button" onClick={limpar} className="min-h-11 cursor-pointer rounded-full px-3 text-sm font-medium text-primary-strong hover:underline">
            Limpar filtros
          </button>
        </div>
      )}

      {visiveis.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary-strong">
            <HugeiconsIcon icon={Search01Icon} size={26} aria-hidden />
          </span>
          <p className="mt-4 text-lg font-semibold">Nenhum programa encontrado</p>
          <p className="mt-1 max-w-sm text-muted-foreground">Experimente outra pesquisa ou retire alguns filtros.</p>
          <button type="button" onClick={limpar} className={`mt-5 ${buttonVariants({ variant: "outline", size: "lg" })}`}>
            Limpar filtros
          </button>
        </div>
      ) : vista === "lista" ? (
        <div className="@container overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,22,37,0.06)]">
          <ul className="divide-y divide-line @3xl:hidden">
            {visiveis.map((p) => (
              <li key={p.id} className="relative flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-primary/5">
                <ProgramAvatar logo={logoDe(p.organizacaoId)} />
                <div className="min-w-0 flex-1">
                  <Link href={destino(p)} className="block truncate font-medium after:absolute after:inset-0">
                    {p.nome}
                  </Link>
                  <p className="truncate text-sm text-muted-foreground">{nomeOrganizacao(p.organizacaoId)}</p>
                </div>
                <Selo info={estadosPrograma[p.estado]} />
              </li>
            ))}
          </ul>

          <table className="hidden w-full text-left @3xl:table">
            <caption className="sr-only">Programas</caption>
            <thead className="bg-canvas text-sm text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Programa</th>
                <th scope="col" className="px-3 py-3 font-medium">Estado</th>
                <th scope="col" className="px-3 py-3 font-medium">Tipo</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Relatórios</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Pesquisadores</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visiveis.map((p) => (
                <tr key={p.id} className="relative transition-colors hover:bg-primary/5">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-3">
                      <ProgramAvatar logo={logoDe(p.organizacaoId)} />
                      <span className="min-w-0">
                        <Link href={destino(p)} className="block font-medium after:absolute after:inset-0 hover:text-primary-strong">
                          {p.nome}
                        </Link>
                        <span className="block text-sm text-muted-foreground">{nomeOrganizacao(p.organizacaoId)}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3"><Selo info={estadosPrograma[p.estado]} /></td>
                  <td className="px-3 py-3">{p.tipo === "publico" ? "Público" : "Privado"}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.relatorios}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.pesquisadores}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-medium">{formatMZN(p.pago)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="@container">
          <ul className="grid gap-4 @3xl:grid-cols-2 @6xl:grid-cols-3">
            {visiveis.map((p) => (
              <li key={p.id}>
                <Link
                  href={destino(p)}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] transition-all hover:border-primary/40 hover:shadow-[0_6px_20px_rgba(26,22,37,0.1)]"
                >
                  <div className="flex items-start gap-4">
                    <ProgramAvatar logo={logoDe(p.organizacaoId)} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold leading-snug">{p.nome}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{nomeOrganizacao(p.organizacaoId)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Selo info={estadosPrograma[p.estado]} />
                    {p.fase === "controlado" && <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-sm font-medium text-sky-800">Lançamento controlado</span>}
                    <span className="rounded-full bg-canvas px-2.5 py-0.5 text-sm font-medium text-muted-foreground ring-1 ring-line">{p.tipo === "publico" ? "Público" : "Privado"}</span>
                  </div>

                  {p.resumo && <p className="mt-3 flex-1 text-muted-foreground">{p.resumo}</p>}

                  <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 @md:grid-cols-4">
                    {[
                      { r: "Relatórios", v: String(p.relatorios) },
                      { r: "Pesquisadores", v: String(p.pesquisadores) },
                      { r: "Eficiência", v: p.desempenho ? `${p.desempenho.eficiencia}%` : "-" },
                      { r: "1.ª resposta", v: p.desempenho?.primeiraResposta ?? "-" },
                    ].map((d) => (
                      <div key={d.r}>
                        <dt className="text-sm text-muted-foreground">{d.r}</dt>
                        <dd className="mt-0.5 font-semibold tabular-nums">{d.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{formatIntervaloMZN(p.recompensa.min, p.recompensa.max)}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.ativos.length} {p.ativos.length === 1 ? "ativo" : "ativos"} · {formatMZN(p.pago)} pagos de {formatMZN(p.orcamento)}
                      </p>
                    </div>
                    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-strong transition-colors group-hover:bg-primary group-hover:text-white">
                      <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
