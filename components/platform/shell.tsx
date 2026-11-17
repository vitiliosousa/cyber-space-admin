import type { ReactNode } from "react";
import { AlternarTema } from "./alternar-tema";
import { HeaderTitle } from "./header-title";
import { MobileMenu } from "./mobile-menu";
import { Sidebar } from "./sidebar";
import { UserMenu } from "./user-menu";

/** Estrutura da administração: menu lateral fixo, cabeçalho com título e conteúdo que desliza. */
// `relative` prende os elementos de posição absoluta (como o texto só para leitores de ecrã) a este
// contentor, para não alargarem o scroll da janela.
export function PlatformShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh md:grid md:h-svh md:grid-cols-[auto_1fr] md:overflow-clip">
      <a
        href="#conteudo"
        className="absolute left-2 top-2 z-50 -translate-y-20 rounded-full bg-white px-4 py-3 font-medium text-primary-strong shadow focus:translate-y-0"
      >
        Saltar para o conteúdo
      </a>

      <Sidebar />

      <div className="flex min-w-0 flex-col md:h-svh md:overflow-y-auto md:overscroll-contain">
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between gap-4 border-b border-line bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <MobileMenu />
            <HeaderTitle />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <AlternarTema />
            <UserMenu />
          </div>
        </header>

        <main id="conteudo" className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[100rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
