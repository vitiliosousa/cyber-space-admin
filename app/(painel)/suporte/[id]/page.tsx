import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/platform/back-link";
import { Card } from "@/components/platform/card";
import { Selo } from "@/components/platform/selo";
import { formatDate } from "@/lib/format";
import { obterPedido } from "@/lib/admin-api";
import { estadosPedido } from "@/lib/exemplo";
import Resposta from "./resposta";

export const metadata: Metadata = { title: "Pedido de suporte" };

export const instant = false;

export default function PedidoPage({ params }: PageProps<"/suporte/[id]">) {
  return <Conteudo params={params} />;
}

async function Conteudo({ params }: Pick<PageProps<"/suporte/[id]">, "params">) {
  const { id } = await params;
  const p = await obterPedido(id);
  if (!p) notFound();

  return (
    <div className="space-y-4">
      <BackLink href="/suporte">Voltar ao suporte</BackLink>

      <section aria-labelledby="pedido-assunto" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] md:p-6">
        <p className="text-sm text-muted-foreground">{p.codigo ?? p.id}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 id="pedido-assunto" className="text-2xl font-bold md:text-3xl">
            {p.assunto}
          </h2>
          <Selo info={estadosPedido[p.estado]} />
        </div>
        <p className="mt-1 text-muted-foreground">
          {p.de.nome} ({p.de.tipo === "empresa" ? "empresa" : "pesquisador"}) · {p.categoria} · aberto a {formatDate(p.aberto)}
          {p.responsavel && ` · ${p.responsavel}`}
        </p>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <Card title="Conversa" headingId="conversa-titulo" flush>
          <ol className="divide-y divide-line">
            {p.mensagens.map((m, i) => (
              <li key={i} className={`px-5 py-4 ${m.autor === "equipa" ? "bg-primary/5" : ""}`}>
                <p className="text-sm">
                  <span className="font-semibold">{m.nome}</span> <span className="text-muted-foreground">· {formatDate(m.data)}{m.autor === "equipa" ? " · equipa" : ""}</span>
                </p>
                <p className="mt-1 max-w-3xl">{m.texto}</p>
              </li>
            ))}
          </ol>
        </Card>

        <aside className="xl:sticky xl:top-24">
          <Card title="Responder" headingId="responder-titulo">
            <Resposta id={p.id} resolvido={p.estado === "resolvido"} />
          </Card>
          <p className="mt-3 text-sm text-muted-foreground">Não peça palavras-passe nem códigos de verificação. A equipa nunca os pede.</p>
        </aside>
      </div>
    </div>
  );
}
