import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import { ProgramAvatar } from "@/components/platform/program-avatar";
import { Selo } from "@/components/platform/selo";
import { TypeLabel } from "@/components/platform/type-label";
import { listarAlteracoes, listarOrganizacoes, listarProgramas } from "@/lib/admin-api";
import { estadosOrganizacao, haDias, logoDe } from "@/lib/exemplo";

export const metadata: Metadata = { title: "Aprovações" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default async function AprovacoesPage() {
  const [programas, organizacoes, alteracoes] = await Promise.all([listarProgramas(), listarOrganizacoes(), listarAlteracoes()]);
  const getOrganizacao = (id: string) => organizacoes.find((o) => o.id === id);
  const novos = programas.filter((p) => p.estado === "pendente").toSorted((a, b) => (a.submetidoEm ?? "").localeCompare(b.submetidoEm ?? ""));
  const pendentes = novos;

  if (novos.length === 0 && alteracoes.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary-strong">
          <HugeiconsIcon icon={CheckmarkBadge01Icon} size={26} aria-hidden />
        </span>
        <p className="mt-4 text-lg font-semibold">Não há programas à espera</p>
        <p className="mt-1 text-muted-foreground">Quando uma empresa submeter um programa, ou alterar o escopo de um que já está ativo, aparece aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-muted-foreground">Antes de um programa ficar visível aos pesquisadores, confirmamos que a organização está verificada, que controla os domínios e que pode autorizar os testes. Os mais antigos aparecem primeiro.</p>
      <h2 className="text-lg font-bold">Novos programas ({novos.length})</h2>
      {novos.length === 0 && <p className="text-muted-foreground">Nenhum programa novo à espera.</p>}
      <ul className="space-y-3">
        {pendentes.map((p) => {
          const org = getOrganizacao(p.organizacaoId)!;
          const porValidar = p.ativos.filter((a) => !a.dominioValidado).length;
          const bloqueado = org.estado !== "verificada" || porValidar > 0;
          return (
            <li key={p.id} className="relative rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] transition-colors hover:border-primary/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-4">
                  <ProgramAvatar logo={logoDe(org.id, org.logoVersao)} nome={org.nome} size="lg" />
                  <div className="min-w-0">
                  <Link href={`/aprovacoes/${p.id}`} className="text-lg font-semibold after:absolute after:inset-0 hover:text-primary-strong">
                    {p.nome}
                  </Link>
                  <p className="text-muted-foreground">
                    {org.nome} · <TypeLabel tipo={p.tipo} /> · submetido {haDias(p.submetidoEm!)}
                  </p>
                  </div>
                </div>
                <Selo info={estadosOrganizacao[org.estado]} />
              </div>
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Ativos</dt>
                  <dd className="font-semibold">{p.ativos.length}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Domínios por validar</dt>
                  <dd className={`font-semibold ${porValidar > 0 ? "text-danger" : ""}`}>{porValidar}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Pronto para aprovar</dt>
                  <dd className="font-semibold">{bloqueado ? "Ainda não" : "Sim"}</dd>
                </div>
              </dl>
              {p.alertas && (
                <ul className="mt-3 space-y-1 text-sm text-amber-900">
                  {p.alertas.map((a) => (
                    <li key={a}>⚠ {a}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {alteracoes.length > 0 && (
        <>
          <h2 className="pt-4 text-lg font-bold">Alterações ao escopo de programas ativos ({alteracoes.length})</h2>
          <p className="max-w-3xl text-muted-foreground">O texto, as regras e as recompensas a empresa altera logo. O escopo e abrir o programa a mais pesquisadores precisam de aprovação, como antes de publicar: até decidir, o programa continua como está.</p>
          <ul className="space-y-3">
            {alteracoes.map((a) => {
              const org = getOrganizacao(a.organizacaoId);
              return (
                <li key={a.id} className="relative rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(26,22,37,0.06)] transition-colors hover:border-primary/40">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-4">
                      <ProgramAvatar logo={org ? logoDe(org.id, org.logoVersao) : ""} nome={a.organizacao} size="lg" />
                      <div className="min-w-0">
                        <Link href={`/aprovacoes/alteracoes/${a.id}`} className="text-lg font-semibold after:absolute after:inset-0 hover:text-primary-strong">
                          {a.programa}
                        </Link>
                        <p className="text-muted-foreground">
                          {a.organizacao} · proposta {haDias(a.criadaEm.slice(0, 10))}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary-strong">Alterações</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
