import type { Metadata } from "next";
import { Card } from "@/components/platform/card";
import { funcoes } from "@/lib/exemplo";
import { lerApi } from "@/lib/api";
import { exigirMembro } from "@/lib/sessao";
import FormPalavraPasse from "./form-palavra-passe";
import Sessoes, { type SessaoAberta } from "./sessoes";

type SessaoApi = { id: string; ultimoUso: string; ip: string | null; dispositivo: string | null; atual: boolean };

/** "Chrome no macOS" a partir do agente do navegador. */
function dispositivoDe(ua: string | null) {
  if (!ua) return "Dispositivo desconhecido";
  const navegador = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Navegador";
  const sistema = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "outro sistema";
  return `${navegador} em ${sistema}`;
}

function haQuanto(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  return min < 2 ? "Agora" : min < 60 ? `Há ${min} min` : min < 1440 ? `Há ${Math.round(min / 60)} h` : `Há ${Math.round(min / 1440)} dias`;
}

export const metadata: Metadata = { title: "Definições" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default async function DefinicoesPage() {
  const membro = await exigirMembro();
  const r = await lerApi<SessaoApi[]>("/auth/sessoes");
  const sessoes: SessaoAberta[] = (r.ok ? r.dados : []).map((x) => ({ id: x.id, dispositivo: dispositivoDe(x.dispositivo), ip: x.ip ?? "IP desconhecido", ultimo: haQuanto(x.ultimoUso), atual: x.atual }));
  return (
    <div className="mx-auto max-w-full space-y-6">
      <Card title="Conta" headingId="conta-titulo">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Nome</dt>
            <dd className="font-semibold">{membro.nome}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Função</dt>
            <dd className="font-semibold">{membro.funcaoInterna ? funcoes[membro.funcaoInterna].label : "Equipa"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">E-mail</dt>
            <dd className="break-all font-semibold">{membro.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Verificação em dois passos</dt>
            <dd className={membro.doisPassos ? "font-semibold text-green-800" : "font-semibold text-rose-800"}>{membro.doisPassos ? "Ativa" : "Desativada"}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">O nome e a função só mudam por um super-administrador, em Equipa.</p>
      </Card>

      <Card title="Palavra-passe" headingId="palavra-passe-titulo">
        <FormPalavraPasse />
      </Card>

      <Card title="Sessões ativas" headingId="sessoes-titulo" flush>
        <Sessoes sessoes={sessoes} />
      </Card>
    </div>
  );
}
