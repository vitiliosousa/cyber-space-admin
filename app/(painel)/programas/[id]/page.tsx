import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/platform/back-link";
import { Card } from "@/components/platform/card";
import { ProgramAvatar } from "@/components/platform/program-avatar";
import { Selo } from "@/components/platform/selo";
import { formatDate, formatIntervaloMZN, formatMZN } from "@/lib/format";
import { Abas } from "@/components/platform/abas";
import { correcoesRelatorio, estadosPrograma, estadosRelatorio, gravidadeEstilo, gravidadeLabels, logoDe, politicasDivulgacao } from "@/lib/exemplo";
import { obterPrograma, relatoriosDoProgramaApi } from "@/lib/admin-api";
import Acoes from "./acoes";

export const metadata: Metadata = { title: "Programa" };

export const instant = false;

export default function ProgramaPage({ params }: PageProps<"/programas/[id]">) {
  return <Conteudo params={params} />;
}

async function Conteudo({ params }: Pick<PageProps<"/programas/[id]">, "params">) {
  const { id } = await params;
  const dados = await obterPrograma(id);
  if (!dados || dados.programa.estado === "pendente" || !dados.organizacao) notFound();
  const { programa: p, organizacao: org } = dados;
  const relatorios = await relatoriosDoProgramaApi(p.id);
  const uso = p.orcamento > 0 ? Math.min(100, Math.round((p.pago / p.orcamento) * 100)) : 0;

  return (
    <div className="space-y-4">
      <BackLink href="/programas">Voltar aos programas</BackLink>

      <section aria-labelledby="programa-nome" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <ProgramAvatar logo={logoDe(org.id, org.logoVersao)} nome={org.nome} size="xl" />
          <h2 id="programa-nome" className="text-2xl font-bold md:text-3xl">
            {p.nome}
          </h2>
          <Selo info={estadosPrograma[p.estado]} />
        </div>
        <p className="mt-1 text-muted-foreground">
          <Link href={`/organizacoes/${org.id}`} className="font-medium text-primary-strong hover:underline">
            {org.nome}
          </Link>{" "}
          · {p.tipo === "publico" ? "Público" : "Privado"} · criado a {formatDate(p.criadoEm)}
        </p>
        {p.resumo && <p className="mt-3 max-w-2xl text-lg">{p.resumo}</p>}
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 xl:grid-cols-4">
          {[
            { r: "Relatórios", v: String(p.relatorios) },
            { r: "Pesquisadores", v: String(p.pesquisadores) },
            { r: "Recompensas", v: formatIntervaloMZN(p.recompensa.min, p.recompensa.max) },
            { r: "Pago", v: formatMZN(p.pago) },
          ].map((d) => (
            <div key={d.r} className="min-w-0">
              <dt className="text-sm text-muted-foreground">{d.r}</dt>
              <dd className="mt-0.5 break-words text-lg font-bold">{d.v}</dd>
            </div>
          ))}
        </dl>
        <div role="progressbar" aria-label="Orçamento usado" aria-valuenow={uso} aria-valuemin={0} aria-valuemax={100} className="mt-5 h-2 w-full rounded-full bg-canvas ring-1 ring-line">
          <div className="h-full rounded-full bg-violet-500" style={{ width: `${uso}%` }} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {uso}% de {formatMZN(p.orcamento)} de orçamento
        </p>
      </section>

      <Abas
        nome="Programa"
        abas={[
          {
            id: "geral",
            rotulo: "Visão geral",
            conteudo: (
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="space-y-6">
          {p.foco && (
            <Card title="O que a empresa procura" headingId="foco-titulo">
              <ul className="list-disc space-y-1.5 pl-5">
                {p.foco.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Card>
          )}

          {p.divulgacao && (
            <Card title="Política de divulgação" headingId="divulgacao-titulo">
              <p className="font-semibold">{politicasDivulgacao[p.divulgacao].label}</p>
              <p className="mt-0.5 text-muted-foreground">{politicasDivulgacao[p.divulgacao].texto}</p>
            </Card>
          )}

          <Card title="Ativos" headingId="ativos-titulo" flush>
            <ul className="divide-y divide-line">
              {p.ativos.map((a) => (
                <li key={`${a.identificador}-${a.tipo}`} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium">{a.nome}</p>
                    <p className="break-all font-mono text-sm text-muted-foreground">{a.identificador}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{a.tipo}</span>
                    <Selo info={a.dominioValidado ? { label: "Domínio validado", estilo: "bg-green-50 text-green-800" } : { label: "Por validar", estilo: "bg-rose-50 text-rose-800" }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {p.recompensas && (
            <Card title="Recompensas por gravidade" headingId="recompensas-titulo" flush>
              <ul className="divide-y divide-line">
                {(Object.keys(p.recompensas) as (keyof typeof p.recompensas)[]).map((g) => (
                  <li key={g} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <Selo info={{ label: gravidadeLabels[g], estilo: gravidadeEstilo[g] }} />
                    <p className="font-semibold">{formatIntervaloMZN(p.recompensas![g][0], p.recompensas![g][1])}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {p.desempenho && (
            <Card title="Desempenho" headingId="desempenho-titulo">
              <dl className="grid gap-4 sm:grid-cols-3">
                {[
                  { r: "Eficiência", v: `${p.desempenho.eficiencia}%`, n: "Relatórios respondidos dentro das metas" },
                  { r: "Primeira resposta", v: p.desempenho.primeiraResposta, n: "Em média" },
                  { r: "Até à correção", v: p.desempenho.ateResolucao, n: "Em média" },
                ].map((d) => (
                  <div key={d.r}>
                    <dt className="text-sm text-muted-foreground">{d.r}</dt>
                    <dd className="mt-0.5 text-xl font-bold">{d.v}</dd>
                    <dd className="text-sm text-muted-foreground">{d.n}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
        </div>

        <aside className="xl:sticky xl:top-24">
          <Card title="Ações" headingId="acoes-titulo">
            <Acoes id={p.id} estado={p.estado} />
          </Card>
        </aside>
      </div>
            ),
          },
          {
            id: "relatorios",
            rotulo: `Relatórios (${relatorios.length})`,
            conteudo: (
              <Card title="Relatórios recebidos" headingId="relatorios-titulo" flush>
                {relatorios.length === 0 ? (
                  <p className="p-5 text-muted-foreground">Este programa ainda não recebeu relatórios.</p>
                ) : (
                  <>
                    <p className="border-b border-line px-5 py-3 text-sm text-muted-foreground">
                      {relatorios.length === p.relatorios ? `${relatorios.length} relatórios` : `Os ${relatorios.length} mais recentes de ${p.relatorios}`}. A administração vê só o estado: os detalhes técnicos ficam entre a empresa e o pesquisador.
                    </p>
                    <ul className="divide-y divide-line">
                      {relatorios.map((x) => (
                        <li key={x.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
                          <div className="min-w-0 flex-1 basis-60">
                            <p className="font-semibold">{x.titulo}</p>
                            <p className="text-sm text-muted-foreground">
                              {x.id} ·{" "}
                              <Link href={`/pesquisadores/${x.pesquisador}`} className="hover:text-primary-strong hover:underline">
                                {x.pesquisador}
                              </Link>{" "}
                              · {formatDate(x.data)}
                              {x.recompensa !== null && ` · ${formatMZN(x.recompensa)}`}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Selo info={{ label: gravidadeLabels[x.gravidade], estilo: gravidadeEstilo[x.gravidade] }} />
                            <Selo info={estadosRelatorio[x.estado]} />
                            {x.correcao && <Selo info={correcoesRelatorio[x.correcao]} />}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
