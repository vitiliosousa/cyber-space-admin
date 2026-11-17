import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Building03Icon, Message01Icon, Target02Icon, UserIcon, Wallet01Icon, File02Icon } from "@hugeicons/core-free-icons";
import { Card, StatCard } from "@/components/platform/card";
import { BarList } from "@/components/platform/charts/bar-list";
import { ColumnChart } from "@/components/platform/charts/column-chart";
import { formatDate, formatMZN } from "@/lib/format";
import { mesesRecentes } from "@/lib/graficos";
import { auditoria, disputas, estadosPrograma, faturas, filaTriagem, HOJE, organizacoes, pagamentos, pedidos, pesquisadores, programas } from "@/lib/exemplo";

export const metadata: Metadata = { title: "Visão geral" };

export default function VisaoGeralPage() {
  const orgsVerificadas = organizacoes.filter((o) => o.estado === "verificada").length;
  const programasAtivos = programas.filter((p) => p.estado === "ativo").length;
  const pesquisadoresAtivos = pesquisadores.filter((p) => p.estado === "ativo").length;
  const relatorios = programas.reduce((t, p) => t + p.relatorios, 0);
  const porProcessar = pagamentos.filter((p) => p.estado === "pendente");
  const valorPorProcessar = porProcessar.reduce((t, p) => t + p.valor, 0);
  const pedidosNovos = pedidos.filter((p) => p.estado === "novo").length;

  const atencao = [
    { n: programas.filter((p) => p.estado === "pendente" || p.pedidoPublicacaoEm).length, rotulo: "programas por aprovar ou abrir ao público", href: "/aprovacoes", icone: Target02Icon },
    { n: organizacoes.filter((o) => o.estado === "em-analise").length, rotulo: "organizações em análise", href: "/organizacoes", icone: Building03Icon },
    { n: disputas.filter((d) => d.estado !== "resolvida").length, rotulo: "disputas abertas", href: "/relatorios", icone: File02Icon },
    { n: filaTriagem.filter((t) => t.estado === "na-fila").length, rotulo: "relatórios na fila de triagem", href: "/relatorios", icone: File02Icon },
    { n: pagamentos.filter((p) => p.estado === "falhado").length, rotulo: "pagamentos que falharam", href: "/financeiro", icone: Wallet01Icon },
    { n: faturas.filter((f) => f.estado === "atrasada").length, rotulo: "faturas atrasadas", href: "/financeiro", icone: Wallet01Icon },
    { n: pedidosNovos, rotulo: "pedidos de suporte novos", href: "/suporte", icone: Message01Icon },
    { n: pesquisadores.filter((p) => p.estado === "por-verificar").length, rotulo: "pesquisadores por verificar", href: "/pesquisadores", icone: UserIcon },
  ].filter((a) => a.n > 0);

  const meses = mesesRecentes(6, HOJE);
  const novosPorMes = meses.map((m) => ({ label: m.label, value: pesquisadores.filter((p) => p.desde.startsWith(m.chave)).length }));

  const porEstado = (Object.keys(estadosPrograma) as (keyof typeof estadosPrograma)[])
    .map((e) => ({ label: estadosPrograma[e].label, value: programas.filter((p) => p.estado === e).length, cor: e === "pendente" ? "bg-blue-500" : e === "ativo" ? "bg-green-500" : e === "pausado" ? "bg-amber-500" : "bg-violet-500" }))
    .filter((b) => b.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <StatCard label="Organizações verificadas" value={`${orgsVerificadas} de ${organizacoes.length}`} hint={`${organizacoes.filter((o) => o.estado === "em-analise").length} em análise`} icon={Building03Icon} />
        <StatCard label="Programas ativos" value={String(programasAtivos)} hint={`${programas.filter((p) => p.estado === "pendente").length} por aprovar`} icon={Target02Icon} />
        <StatCard label="Pesquisadores ativos" value={String(pesquisadoresAtivos)} hint={`${pesquisadores.length} contas no total`} icon={UserIcon} />
        <StatCard label="Relatórios recebidos" value={String(relatorios)} hint="Em todos os programas" icon={File02Icon} />
        <StatCard label="Pagamentos por processar" value={formatMZN(valorPorProcessar)} hint={`${porProcessar.length} pagamentos à espera`} icon={Wallet01Icon} />
        <StatCard label="Suporte" value={String(pedidosNovos)} hint="Pedidos novos por responder" icon={Message01Icon} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <Card title="Precisam da sua atenção" headingId="atencao-titulo" flush>
          {atencao.length === 0 ? (
            <p className="p-5 text-muted-foreground">Não há nada à espera.</p>
          ) : (
            <ul className="divide-y divide-line">
              {atencao.map((a) => (
                <li key={a.rotulo}>
                  <Link href={a.href} className="flex min-h-14 items-center gap-4 px-5 py-3 transition-colors hover:bg-primary/5">
                    <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-strong">
                      <HugeiconsIcon icon={a.icone} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-semibold tabular-nums">{a.n}</span> {a.rotulo}
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden className="shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Atividade recente da equipa" headingId="atividade-titulo" action={<Link href="/auditoria" className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-2 text-sm font-medium text-primary-strong hover:underline">Ver tudo</Link>}>
          <ol className="space-y-4">
            {auditoria.slice(0, 5).map((e) => (
              <li key={e.id}>
                <p>
                  <span className="font-medium">{e.quem}</span> {e.acao.charAt(0).toLowerCase() + e.acao.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {e.alvo} · {formatDate(e.quando.slice(0, 10))}, {e.quando.slice(11)}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <Card title="Novos pesquisadores por mês" headingId="novos-titulo" action={<span className="shrink-0 text-sm text-muted-foreground">Últimos 6 meses</span>}>
          <ColumnChart data={novosPorMes} nome="Novos pesquisadores por mês" formato="pesquisadores" />
        </Card>
        <Card title="Programas por estado" headingId="programas-estado-titulo">
          <BarList bars={porEstado} nome="Programas por estado" formato="programas" />
        </Card>
      </div>
    </div>
  );
}
