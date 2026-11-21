import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/platform/back-link";
import { Card } from "@/components/platform/card";
import { ProgramAvatar } from "@/components/platform/program-avatar";
import { Selo } from "@/components/platform/selo";
import { formatDate } from "@/lib/format";
import { listarProgramas, obterOrganizacao } from "@/lib/admin-api";
import { estadosOrganizacao, estadosPrograma, haDias, logoDe } from "@/lib/exemplo";
import Acoes from "./acoes";

export const metadata: Metadata = { title: "Organização" };

export const instant = false;

export default function OrganizacaoPage({ params }: PageProps<"/organizacoes/[id]">) {
  return <Conteudo params={params} />;
}

async function Conteudo({ params }: Pick<PageProps<"/organizacoes/[id]">, "params">) {
  const { id } = await params;
  const [o, programas] = await Promise.all([obterOrganizacao(id), listarProgramas()]);
  if (!o) notFound();
  const meus = programas.filter((p) => p.organizacaoId === o.id);

  return (
    <div className="space-y-4">
      <BackLink href="/organizacoes">Voltar às organizações</BackLink>

      <section aria-labelledby="org-nome" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <ProgramAvatar logo={logoDe(o.id, o.logoVersao)} nome={o.nome} size="xl" />
          <h2 id="org-nome" className="text-2xl font-bold md:text-3xl">
            {o.nome}
          </h2>
          <Selo info={estadosOrganizacao[o.estado]} />
        </div>
        <p className="mt-1 text-muted-foreground">
          {o.setor} · registada {haDias(o.registadaEm)}
          {o.pedidoEm && ` · pediu a verificação ${haDias(o.pedidoEm)}`}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Risco {o.risco === "alto" ? "alto" : "normal"}: {o.risco === "alto" ? "o sector pede uma prova adicional, além dos documentos habituais." : "a verificação habitual é suficiente."}
        </p>
        {o.nota && <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{o.nota}</p>}
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
          {[
            { r: "NUIT", v: o.nuit },
            { r: "Website", v: o.website },
            { r: "Contacto", v: o.contacto },
            { r: "Representante", v: `${o.representante.nome} (${o.representante.cargo})` },
          ].map((d) => (
            <div key={d.r} className="min-w-0">
              <dt className="text-sm text-muted-foreground">{d.r}</dt>
              <dd className="mt-0.5 break-words font-semibold">{d.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="space-y-6">
          <Card title="Verificação" headingId="verificacao-titulo">
            <ol className="space-y-4">
              {o.passos.map((p) => (
                <li key={p.chave} className="flex items-start gap-3">
                  <span aria-hidden className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${p.feito ? "bg-primary text-white" : "bg-canvas text-muted-foreground ring-1 ring-line"}`}>
                    {p.feito ? "✓" : ""}
                  </span>
                  <div>
                    <p className="font-medium">
                      {p.rotulo}
                      <span className="sr-only">{p.feito ? " (cumprido)" : " (por cumprir)"}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Programas" headingId="programas-titulo" flush>
            {meus.length === 0 ? (
              <p className="p-5 text-muted-foreground">Ainda não tem programas.</p>
            ) : (
              <ul className="divide-y divide-line">
                {meus.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
                    <div className="min-w-0">
                      <Link href={p.estado === "pendente" ? `/aprovacoes/${p.id}` : `/programas/${p.id}`} className="block truncate font-medium hover:text-primary-strong">
                        {p.nome}
                      </Link>
                      <p className="text-sm text-muted-foreground">Criado a {formatDate(p.criadoEm)}</p>
                    </div>
                    <Selo info={estadosPrograma[p.estado]} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside className="xl:sticky xl:top-24">
          <Card title="Ações" headingId="acoes-titulo">
            <Acoes id={o.id} estado={o.estado} passos={o.passos} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
