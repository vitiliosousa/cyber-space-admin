import type { Metadata } from "next";
import { Alert02Icon, File02Icon, UserGroupIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/platform/card";
import { listarAuditoria } from "@/lib/admin-api";
import { diasDesde } from "@/lib/exemplo";
import ListaAuditoria from "./lista-auditoria";

export const metadata: Metadata = { title: "Auditoria" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default async function AuditoriaPage() {
  const auditoria = await listarAuditoria();
  const recentes = auditoria.filter((e) => diasDesde(e.quando.slice(0, 10)) <= 7);
  const hoje = auditoria.filter((e) => diasDesde(e.quando.slice(0, 10)) === 0).length;
  const pessoas = new Set(recentes.map((e) => e.quem)).size;
  const financeiras = recentes.filter((e) => e.tipo === "financeiro").length;
  const sensiveis = recentes.filter((e) => e.tipo === "conta" || e.tipo === "configuracao").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Ações nos últimos 7 dias" value={String(recentes.length)} hint={`${hoje} hoje`} icon={File02Icon} />
        <StatCard label="Pessoas ativas" value={String(pessoas)} hint="Fizeram pelo menos uma ação" icon={UserGroupIcon} />
        <StatCard label="Ações financeiras" value={String(financeiras)} hint="Pagamentos e faturas" icon={Wallet01Icon} />
        <StatCard label="Contas e configuração" value={String(sensiveis)} hint="Suspensões, funções e acessos" icon={Alert02Icon} />
      </div>
      <p className="max-w-3xl text-muted-foreground">Cada ação da equipa fica aqui, com a pessoa, a hora e o endereço de rede. O registo só se lê: ninguém o pode apagar ou alterar, nem os super-administradores.</p>
      <ListaAuditoria eventos={auditoria.toSorted((a, b) => b.quando.localeCompare(a.quando))} />
    </div>
  );
}
