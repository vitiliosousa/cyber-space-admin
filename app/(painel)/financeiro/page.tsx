import type { Metadata } from "next";
import { CheckmarkCircle02Icon, Clock01Icon, Coins01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/platform/card";
import { formatMZN } from "@/lib/format";
import { COMISSAO, faturas, pagamentos } from "@/lib/exemplo";
import Separadores from "./separadores";

export const metadata: Metadata = { title: "Financeiro" };

export default function FinanceiroPage() {
  const porProcessar = pagamentos.filter((p) => p.estado === "pendente" || p.estado === "falhado");
  const processado = pagamentos.filter((p) => p.estado === "processado").reduce((t, p) => t + p.valor, 0);
  const aCobrar = faturas.filter((f) => f.estado !== "paga");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Por pagar a pesquisadores" value={formatMZN(porProcessar.reduce((t, p) => t + p.valor, 0))} hint={`${porProcessar.length} pagamentos, ${pagamentos.filter((p) => p.estado === "falhado").length} falhou`} icon={Clock01Icon} />
        <StatCard label="Pago este mês" value={formatMZN(processado)} hint="A pesquisadores" icon={CheckmarkCircle02Icon} />
        <StatCard label="Comissão da plataforma" value={`${COMISSAO * 100}%`} hint={`Sobre cada recompensa paga: ${formatMZN(Math.round(processado * COMISSAO))} este mês`} icon={Coins01Icon} />
        <StatCard label="Por cobrar às empresas" value={formatMZN(aCobrar.reduce((t, f) => t + f.valor, 0))} hint={`${aCobrar.length} faturas, ${faturas.filter((f) => f.estado === "atrasada").length} atrasada`} icon={Wallet01Icon} />
      </div>
      <Separadores pagamentos={pagamentos} faturas={faturas} />
    </div>
  );
}
