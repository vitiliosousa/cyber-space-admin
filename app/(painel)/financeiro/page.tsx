import type { Metadata } from "next";
import { CheckmarkCircle02Icon, Clock01Icon, Coins01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/platform/card";
import { formatMZN } from "@/lib/format";
import { listarFaturas, listarPagamentos } from "@/lib/admin-api";
import { COMISSAO } from "@/lib/exemplo";
import Separadores from "./separadores";

export const metadata: Metadata = { title: "Financeiro" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default async function FinanceiroPage() {
  const [pagamentos, faturas] = await Promise.all([listarPagamentos(), listarFaturas()]);
  const porProcessar = pagamentos.filter((p) => p.estado === "pendente" || p.estado === "falhado");
  const processado = pagamentos.filter((p) => p.estado === "processado").reduce((t, p) => t + p.valor, 0);
  const aCobrar = faturas.filter((f) => f.estado !== "paga");
  const falhados = pagamentos.filter((p) => p.estado === "falhado").length;
  const atrasadas = faturas.filter((f) => f.estado === "atrasada").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Por pagar a pesquisadores" value={formatMZN(porProcessar.reduce((t, p) => t + p.valor, 0))} hint={`${porProcessar.length} pagamentos, ${falhados} falhados`} icon={Clock01Icon} />
        <StatCard label="Pago a pesquisadores" value={formatMZN(processado)} hint="Total já processado" icon={CheckmarkCircle02Icon} />
        <StatCard label="Comissão da plataforma" value={`${COMISSAO * 100}%`} hint={`Sobre cada recompensa paga: ${formatMZN(Math.round(processado * COMISSAO))} no total`} icon={Coins01Icon} />
        <StatCard label="Por cobrar às empresas" value={formatMZN(aCobrar.reduce((t, f) => t + f.valor, 0))} hint={`${aCobrar.length} faturas, ${atrasadas} atrasadas`} icon={Wallet01Icon} />
      </div>
      <Separadores pagamentos={pagamentos} faturas={faturas} />
    </div>
  );
}
