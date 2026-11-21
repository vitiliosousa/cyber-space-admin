import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/platform/back-link";
import { Card } from "@/components/platform/card";
import { formatMZN } from "@/lib/format";
import { obterAlteracao, type AtivoDaAlteracao, type DadosDoPrograma } from "@/lib/admin-api";
import DecisaoAlteracao from "./decisao-alteracao";

export const metadata: Metadata = { title: "Rever alterações" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

const gravidades = { critica: "Crítica", alta: "Alta", media: "Média", baixa: "Baixa" } as const;
const divulgacoes: Record<string, string> = { coordenada: "Coordenada", "apos-correcao": "Depois de corrigido", nao: "Não permitida" };
const acessos: Record<string, string> = { publico: "Público", privado: "Privado, com candidatura", convidados: "Só convidados" };

type Campo = { chave: keyof DadosDoPrograma; rotulo: string; texto: (d: DadosDoPrograma) => string };

const lista = (v?: string[] | null) => (v && v.length ? v.join("; ") : "—");
const ativoTexto = (a: AtivoDaAlteracao) => `${a.identificador} (${a.tipo}, até ${gravidades[a.gravidadeMax as keyof typeof gravidades]?.toLowerCase() ?? a.gravidadeMax})`;

const campos: Campo[] = [
  { chave: "nome", rotulo: "Nome", texto: (d) => d.nome || "—" },
  { chave: "resumo", rotulo: "Resumo", texto: (d) => d.resumo || "—" },
  { chave: "objetivos", rotulo: "Objetivos", texto: (d) => d.objetivos || "—" },
  { chave: "inicio", rotulo: "Início", texto: (d) => d.inicio || "—" },
  { chave: "fim", rotulo: "Fim", texto: (d) => d.fim || "—" },
  { chave: "ativos", rotulo: "Ativos", texto: (d) => (d.ativos?.length ? d.ativos.map(ativoTexto).join("\n") : "—") },
  { chave: "foraDeEscopo", rotulo: "Fora do escopo", texto: (d) => d.foraDeEscopo || "—" },
  { chave: "permitidas", rotulo: "Técnicas permitidas", texto: (d) => lista(d.permitidas) },
  { chave: "proibidas", rotulo: "Técnicas proibidas", texto: (d) => lista(d.proibidas) },
  { chave: "regras", rotulo: "Condições de participação", texto: (d) => d.regras || "—" },
  { chave: "divulgacao", rotulo: "Divulgação", texto: (d) => (d.divulgacao ? (divulgacoes[d.divulgacao] ?? d.divulgacao) : "—") },
  { chave: "recompensas", rotulo: "Recompensas", texto: (d) => (d.recompensas ? (Object.keys(gravidades) as (keyof typeof gravidades)[]).map((g) => `${gravidades[g]}: ${formatMZN(d.recompensas![g].min)} a ${formatMZN(d.recompensas![g].max)}`).join("\n") : "—") },
  { chave: "elegibilidade", rotulo: "Elegibilidade", texto: (d) => d.elegibilidade || "—" },
  { chave: "acesso", rotulo: "Quem pode participar", texto: (d) => (d.acesso ? (acessos[d.acesso] ?? d.acesso) : "—") },
  { chave: "declaracaoAutoridade", rotulo: "Declaração de autoridade", texto: (d) => (d.declaracaoAutoridade ? "Feita" : "Não feita") },
];

export default function RverAlteracaoPage({ params }: PageProps<"/aprovacoes/alteracoes/[id]">) {
  return <Conteudo params={params} />;
}

async function Conteudo({ params }: Pick<PageProps<"/aprovacoes/alteracoes/[id]">, "params">) {
  const { id } = await params;
  const a = await obterAlteracao(id);
  if (!a || a.estado !== "pendente") notFound();
  // A proposta só traz o que precisa de aprovação: o resto já entrou logo.
  const mudadas = campos.filter((c) => c.chave in a.proposta && c.texto(a.programa) !== c.texto(a.proposta));

  return (
    <div className="space-y-4">
      <BackLink href="/aprovacoes">Voltar às aprovações</BackLink>

      <section aria-labelledby="alteracao-titulo" className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] md:p-6">
        <h2 id="alteracao-titulo" className="text-2xl font-bold md:text-3xl">
          {a.programa.nome}
        </h2>
        <p className="mt-1 text-muted-foreground">{a.organizacao} · alterações ao escopo de um programa {a.programa.estado === "pausado" ? "pausado" : "ativo"}</p>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        <Card title={`O que muda (${mudadas.length})`} headingId="muda-titulo">
          {mudadas.length === 0 ? (
            <p className="text-muted-foreground">Não há diferenças em relação ao programa atual.</p>
          ) : (
            <ul className="space-y-5">
              {mudadas.map((c) => (
                <li key={c.rotulo}>
                  <h3 className="font-semibold">{c.rotulo}</h3>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <div className="rounded-xl bg-canvas p-3">
                      <p className="text-sm font-medium text-muted-foreground">Agora</p>
                      <p className="mt-0.5 whitespace-pre-line break-words">{c.texto(a.programa)}</p>
                    </div>
                    <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
                      <p className="text-sm font-medium text-primary-strong">Proposta</p>
                      <p className="mt-0.5 whitespace-pre-line break-words">{c.texto(a.proposta)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {a.ativosNovos.length > 0 && (
            <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Ativos novos: {a.ativosNovos.join(", ")}. Confirme o controlo do domínio de cada um ao aprovar.</p>
          )}
        </Card>

        <aside className="xl:sticky xl:top-24">
          <Card title="Decisão" headingId="decisao-titulo">
            <DecisaoAlteracao id={a.id} ativosNovos={a.ativosNovos} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
