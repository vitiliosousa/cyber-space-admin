import type { Metadata } from "next";
import { CheckmarkCircle02Icon, Clock01Icon, Message01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/platform/card";
import { pedidos } from "@/lib/exemplo";
import ListaPedidos from "./lista-pedidos";

export const metadata: Metadata = { title: "Suporte" };

const ordem = { novo: 0, "em-curso": 1, resolvido: 2 } as const;

export default function SuportePage() {
  const conta = (e: string) => pedidos.filter((p) => p.estado === e).length;
  const semResponsavel = pedidos.filter((p) => p.estado !== "resolvido" && !p.responsavel).length;
  const deEmpresas = pedidos.filter((p) => p.estado !== "resolvido" && p.de.tipo === "empresa").length;
  const abertos = conta("novo") + conta("em-curso");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Pedidos abertos" value={String(abertos)} hint={`${deEmpresas} de empresas, ${abertos - deEmpresas} de pesquisadores`} icon={Message01Icon} />
        <StatCard label="Novos" value={String(conta("novo"))} hint="Ainda sem resposta" icon={Clock01Icon} />
        <StatCard label="Sem responsável" value={String(semResponsavel)} hint={semResponsavel ? "Ninguém da equipa os tem" : "Todos têm responsável"} icon={UserIcon} />
        <StatCard label="Resolvidos" value={String(conta("resolvido"))} hint={`${conta("em-curso")} em curso`} icon={CheckmarkCircle02Icon} />
      </div>
      <ListaPedidos pedidos={pedidos.toSorted((a, b) => ordem[a.estado] - ordem[b.estado] || b.aberto.localeCompare(a.aberto))} />
    </div>
  );
}
