import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/platform/back-link";
import { Card } from "@/components/platform/card";
import { ProgramAvatar } from "@/components/platform/program-avatar";
import { Selo } from "@/components/platform/selo";
import { formatDate, formatIntervaloMZN, formatMZN } from "@/lib/format";
import { criteriosDeLancamento, estadosOrganizacao, getOrganizacao, getPrograma, haDias, logoDe, politicasDivulgacao, programas } from "@/lib/exemplo";
import Decisao from "./decisao";

export function generateStaticParams() {
  return programas.filter((p) => p.estado === "pendente" || p.pedidoPublicacaoEm).map((p) => ({ id: p.id }));
}

export const metadata: Metadata = { title: "Rever programa" };

// Sem <Suspense>, como na aplicação: os dados são locais e a rota pode bloquear sem custo.
export const instant = false;

export default function RverProgramaPage({ params }: PageProps<"/aprovacoes/[id]">) {
  return <Conteudo params={params} />;
}

async function Conteudo({ params }: Pick<PageProps<"/aprovacoes/[id]">, "params">) {
  const { id } = await params;
  const p = getPrograma(id);
  const publicacao = !!p && p.estado !== "pendente" && !!p.pedidoPublicacaoEm;
  if (!p || (p.estado !== "pendente" && !publicacao)) notFound();
  const org = getOrganizacao(p.organizacaoId)!;
  const porValidar = p.ativos.filter((a) => !a.dominioValidado);

  const verificacoes = publicacao
    ? [
        ...criteriosDeLancamento(p).map((c) => ({ ok: c.cumprido, texto: c.rotulo, detalhe: `${c.texto}. ${c.detalhe}` })),
        { ok: org.estado === "verificada", texto: "Organização verificada", detalhe: org.estado === "verificada" ? org.nome : `${org.nome}: ${estadosOrganizacao[org.estado].label.toLowerCase()}` },
      ]
    : [
    { ok: org.estado === "verificada", texto: "Organização verificada", detalhe: org.estado === "verificada" ? org.nome : `${org.nome}: ${estadosOrganizacao[org.estado].label.toLowerCase()}` },
    { ok: porValidar.length === 0, texto: "Domínios validados", detalhe: porValidar.length === 0 ? "Todos os ativos têm domínio confirmado" : `Falta validar ${porValidar.map((a) => a.identificador).join(", ")}` },
    { ok: p.declaracaoAutoridade, texto: "Declaração de autoridade", detalhe: p.declaracaoAutoridade ? "A organização declarou poder autorizar os testes" : "Não declarou" },
      ];
  const pronto = verificacoes.every((v) => v.ok);

  return (
    <div className="space-y-4">
      <BackLink href="/aprovacoes">Voltar às aprovações</BackLink>

      <section aria-labelledby="programa-nome" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <ProgramAvatar logo={logoDe(org.id)} size="xl" />
          <h2 id="programa-nome" className="text-2xl font-bold md:text-3xl">
            {p.nome}
          </h2>
          <Selo info={estadosOrganizacao[org.estado]} />
        </div>
        <p className="mt-1 text-muted-foreground">
          {org.nome} · {p.tipo === "publico" ? "Público" : "Privado"} · {publicacao ? `pediu para passar a público ${haDias(p.pedidoPublicacaoEm!)}` : `submetido ${haDias(p.submetidoEm!)} (${formatDate(p.submetidoEm!)})`}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">Recompensas</dt>
            <dd className="mt-0.5 font-semibold">{formatIntervaloMZN(p.recompensa.min, p.recompensa.max)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Orçamento</dt>
            <dd className="mt-0.5 font-semibold">{formatMZN(p.orcamento)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Ativos</dt>
            <dd className="mt-0.5 font-semibold">{p.ativos.length}</dd>
          </div>
        </dl>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="space-y-6">
          <Card title="Verificações" headingId="verificacoes-titulo">
            <ul className="space-y-3">
              {verificacoes.map((v) => (
                <li key={v.texto} className="flex items-start gap-3">
                  <span aria-hidden className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${v.ok ? "bg-primary text-white" : "bg-rose-50 text-rose-800"}`}>
                    {v.ok ? "✓" : "!"}
                  </span>
                  <div>
                    <p className="font-medium">
                      {v.texto}
                      <span className="sr-only">{v.ok ? " (cumprido)" : " (por cumprir)"}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{v.detalhe}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {p.divulgacao && (
            <Card title="Política de divulgação" headingId="divulgacao-titulo">
              <p className="font-semibold">{politicasDivulgacao[p.divulgacao].label}</p>
              <p className="mt-0.5 text-muted-foreground">{politicasDivulgacao[p.divulgacao].texto}</p>
              {p.divulgacao === "nao" && <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Esta política é a mais restritiva. Confirme que a organização a quer assim: alguns pesquisadores evitam programas que proíbem toda a divulgação.</p>}
            </Card>
          )}

          <Card title="Ativos a testar" headingId="ativos-titulo" flush>
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
        </div>

        <aside className="xl:sticky xl:top-24">
          <Card title="Decisão" headingId="decisao-titulo">
            <Decisao id={p.id} pronto={pronto} modo={publicacao ? "publicacao" : "novo"} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
