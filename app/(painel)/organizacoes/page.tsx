import type { Metadata } from "next";
import { Alert02Icon, Building03Icon, CheckmarkCircle02Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { StatCard } from "@/components/platform/card";
import { listarOrganizacoes } from "@/lib/admin-api";
import ListaOrganizacoes from "./lista-organizacoes";

export const metadata: Metadata = { title: "Organizações" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default async function OrganizacoesPage() {
  const organizacoes = await listarOrganizacoes();
  const conta = (e: string) => organizacoes.filter((o) => o.estado === e).length;
  const comProgramas = organizacoes.filter((o) => o.programas > 0).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Organizações" value={String(organizacoes.length)} hint={`${comProgramas} com programas`} icon={Building03Icon} />
        <StatCard label="Verificadas" value={String(conta("verificada"))} hint="Podem publicar programas" icon={CheckmarkCircle02Icon} />
        <StatCard label="À espera de verificação" value={String(conta("em-analise") + conta("por-verificar"))} hint={`${conta("em-analise")} em análise, ${conta("por-verificar")} por começar`} icon={Clock01Icon} />
        <StatCard label="Suspensas ou rejeitadas" value={String(conta("suspensa") + conta("rejeitada"))} hint={conta("suspensa") ? "Programas pausados" : "Nenhuma"} icon={Alert02Icon} />
      </div>
      <ListaOrganizacoes organizacoes={organizacoes.toSorted((a, b) => (b.pedidoEm ?? "").localeCompare(a.pedidoEm ?? "") || a.nome.localeCompare(b.nome))} />
    </div>
  );
}
