import type { Metadata } from "next";
import { Alert02Icon, CheckmarkCircle02Icon, Clock01Icon, Target02Icon } from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/platform/card";
import { formatMZN } from "@/lib/format";
import { listarProgramas } from "@/lib/admin-api";
import ListaProgramas from "./lista-programas";

export const metadata: Metadata = { title: "Programas" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default async function ProgramasPage() {
  const programas = await listarProgramas();
  const conta = (e: string) => programas.filter((p) => p.estado === e).length;
  const pago = programas.reduce((t, p) => t + p.pago, 0);
  const relatorios = programas.reduce((t, p) => t + p.relatorios, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Programas" value={String(programas.length)} hint={`${relatorios} relatórios, ${formatMZN(pago)} pagos`} icon={Target02Icon} />
        <StatCard label="Ativos" value={String(conta("ativo"))} hint={`${programas.filter((p) => p.estado === "ativo" && p.tipo === "privado").length} privados`} icon={CheckmarkCircle02Icon} />
        <StatCard label="Por aprovar" value={String(conta("pendente"))} hint="À espera de validação" icon={Clock01Icon} />
        <StatCard label="Pausados" value={String(conta("pausado"))} hint="Não recebem relatórios novos" icon={Alert02Icon} />
      </div>
      <ListaProgramas programas={programas.toSorted((a, b) => b.criadoEm.localeCompare(a.criadoEm))} />
    </div>
  );
}
