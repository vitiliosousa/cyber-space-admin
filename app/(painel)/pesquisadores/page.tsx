import type { Metadata } from "next";
import { Alert02Icon, CheckmarkCircle02Icon, Clock01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/platform/card";
import { pesquisadores } from "@/lib/exemplo";
import ListaPesquisadores from "./lista-pesquisadores";

export const metadata: Metadata = { title: "Pesquisadores" };

const ordem = { "por-verificar": 0, suspenso: 1, ativo: 2, banido: 3 } as const;

export default function PesquisadoresPage() {
  const conta = (e: string) => pesquisadores.filter((p) => p.estado === e).length;
  const validos = pesquisadores.reduce((t, p) => t + p.validos, 0);
  const total = pesquisadores.reduce((t, p) => t + p.relatorios, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Contas" value={String(pesquisadores.length)} hint={`${new Set(pesquisadores.map((p) => p.pais)).size} países`} icon={UserGroupIcon} />
        <StatCard label="Ativos" value={String(conta("ativo"))} hint={`${validos} de ${total} relatórios válidos`} icon={CheckmarkCircle02Icon} />
        <StatCard label="Por verificar" value={String(conta("por-verificar"))} hint="Contas novas à espera" icon={Clock01Icon} />
        <StatCard label="Suspensos ou banidos" value={String(conta("suspenso") + conta("banido"))} hint={`${conta("suspenso")} suspensos, ${conta("banido")} banidos`} icon={Alert02Icon} />
      </div>
      <ListaPesquisadores pesquisadores={pesquisadores.toSorted((a, b) => ordem[a.estado] - ordem[b.estado] || b.pontos - a.pontos)} />
    </div>
  );
}
