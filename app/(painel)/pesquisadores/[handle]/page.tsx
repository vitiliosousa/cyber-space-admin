import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/platform/back-link";
import { Card } from "@/components/platform/card";
import { Selo } from "@/components/platform/selo";
import { formatDate } from "@/lib/format";
import { disputas, estadosConta, getPesquisador, nomeOrganizacao, pagamentos, pesquisadores } from "@/lib/exemplo";
import Acoes from "./acoes";

export function generateStaticParams() {
  return pesquisadores.map((p) => ({ handle: p.handle }));
}

export const metadata: Metadata = { title: "Pesquisador" };

export const instant = false;

export default function PesquisadorPage({ params }: PageProps<"/pesquisadores/[handle]">) {
  return <Conteudo params={params} />;
}

async function Conteudo({ params }: Pick<PageProps<"/pesquisadores/[handle]">, "params">) {
  const { handle } = await params;
  const p = getPesquisador(handle);
  if (!p) notFound();
  const minhasDisputas = disputas.filter((d) => d.pesquisador === p.handle);
  const meusPagamentos = pagamentos.filter((x) => x.pesquisador === p.handle);

  return (
    <div className="space-y-4">
      <BackLink href="/pesquisadores">Voltar aos pesquisadores</BackLink>

      <section aria-labelledby="pesq-nome" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 id="pesq-nome" className="text-2xl font-bold md:text-3xl">
            {p.handle}
          </h2>
          <Selo info={estadosConta[p.estado]} />
        </div>
        <p className="mt-1 text-muted-foreground">
          {p.nivel} · {p.pais} · na plataforma desde {formatDate(p.desde)}
        </p>
        {p.motivo && <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Motivo registado: {p.motivo}</p>}
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
          {[
            { r: "Pontos", v: String(p.pontos) },
            { r: "Relatórios", v: String(p.relatorios) },
            { r: "Válidos", v: String(p.validos) },
            { r: "Avisos de conduta", v: String(p.avisos) },
          ].map((d) => (
            <div key={d.r}>
              <dt className="text-sm text-muted-foreground">{d.r}</dt>
              <dd className="mt-0.5 text-xl font-bold tabular-nums">{d.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="space-y-6">
          {p.estado === "por-verificar" && (
            <Card title="Pedido de verificação" headingId="verificacao-titulo">
              {p.documento ? (
                <>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Documento</dt>
                      <dd className="font-semibold">{p.documento.tipo}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Enviado</dt>
                      <dd className="font-semibold">{formatDate(p.documento.enviadoEm)}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-muted-foreground">A fotografia do documento só se abre com um motivo, e cada abertura fica no registo de auditoria. Depois de verificar, o documento é apagado.</p>
                </>
              ) : (
                <p className="text-muted-foreground">O pesquisador ainda não enviou nenhum documento.</p>
              )}
            </Card>
          )}

          <Card title="Disputas" headingId="disputas-titulo" flush>
            {minhasDisputas.length === 0 ? (
              <p className="p-5 text-muted-foreground">Sem disputas.</p>
            ) : (
              <ul className="divide-y divide-line">
                {minhasDisputas.map((d) => (
                  <li key={d.id} className="px-5 py-3.5">
                    <p className="font-medium">{d.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.id} · {nomeOrganizacao(d.organizacaoId)} · {d.motivo}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Pagamentos recentes" headingId="pagamentos-titulo" flush>
            {meusPagamentos.length === 0 ? (
              <p className="p-5 text-muted-foreground">Sem pagamentos.</p>
            ) : (
              <ul className="divide-y divide-line">
                {meusPagamentos.map((x) => (
                  <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
                    <p>
                      <span className="font-medium">{x.relatorioId}</span> <span className="text-muted-foreground">· {nomeOrganizacao(x.organizacaoId)} · {formatDate(x.data)}</span>
                    </p>
                    <p className="font-semibold tabular-nums">{x.valor.toLocaleString("pt-PT")} MZN</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside className="xl:sticky xl:top-24">
          <Card title="Ações" headingId="acoes-titulo">
            <Acoes handle={p.handle} estado={p.estado} />
          </Card>
          <p className="mt-3 text-sm text-muted-foreground">Dados pessoais, como o e-mail e os números de pagamento, não aparecem aqui. Só o suporte, com um pedido registado, os pode consultar.</p>
        </aside>
      </div>
    </div>
  );
}
