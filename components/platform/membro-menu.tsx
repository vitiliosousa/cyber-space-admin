import { exigirMembro, iniciaisDe } from "@/lib/sessao";
import { funcoes } from "@/lib/exemplo";
import { UserMenu } from "./user-menu";

/** Verifica a sessão de verdade e mostra quem está ligado. Fica dentro de <Suspense>, para o resto da página não esperar. */
export async function MembroMenu() {
  const m = await exigirMembro();
  const funcao = m.funcaoInterna ? funcoes[m.funcaoInterna].label : "Equipa";
  return <UserMenu nome={m.nome} funcao={funcao} iniciais={iniciaisDe(m.nome)} />;
}

export function MembroMenuAEsperar() {
  return <div aria-hidden className="h-11 w-28 animate-pulse rounded-full bg-primary/5" />;
}
