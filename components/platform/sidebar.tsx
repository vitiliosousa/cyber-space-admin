"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SidebarLeftIcon, SidebarRightIcon } from "@hugeicons/core-free-icons";
import { BrandMark } from "@/components/auth/brand";
import { NavList } from "./nav";

const CHAVE = "cyberspace-admin:menu-recolhido";
const EVENTO = "cyberspace-admin:menu";

function ler() {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

function subscrever(aviso: () => void) {
  window.addEventListener(EVENTO, aviso);
  window.addEventListener("storage", aviso);
  return () => {
    window.removeEventListener(EVENTO, aviso);
    window.removeEventListener("storage", aviso);
  };
}

function guardar(valor: boolean) {
  try {
    localStorage.setItem(CHAVE, valor ? "1" : "0");
  } catch {
    // sem armazenamento: o menu só muda enquanto a página estiver aberta
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Menu lateral que se pode recolher para mostrar só os ícones. A escolha fica guardada no navegador. */
export function Sidebar() {
  const recolhido = useSyncExternalStore(subscrever, ler, () => false);
  // A transição só vale depois de um clique, para o menu não "encolher" sozinho ao carregar a página.
  const [animar, setAnimar] = useState(false);

  const alternar = () => {
    setAnimar(true);
    guardar(!recolhido);
  };

  const botao = (
    <button
      type="button"
      onClick={alternar}
      aria-expanded={!recolhido}
      aria-controls="menu-lateral"
      aria-label="Recolher o menu"
      title="Recolher o menu"
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/5 hover:text-ink"
    >
      <HugeiconsIcon icon={SidebarLeftIcon} size={22} aria-hidden />
    </button>
  );

  return (
    <aside
      id="menu-lateral"
      className={`hidden h-svh flex-col gap-6 overflow-y-auto overflow-x-hidden border-r border-line bg-white p-4 md:flex ${
        animar ? "transition-[width] duration-200 motion-reduce:transition-none" : ""
      } ${
        recolhido ? "w-[4.5rem] items-center px-3" : "w-[17rem]"
      }`}
    >
      {recolhido ? (
        // Recolhido: o logótipo é o botão; ao passar o rato (ou com o foco), dá lugar ao símbolo de expandir.
        <button
          type="button"
          onClick={alternar}
          aria-expanded={false}
          aria-controls="menu-lateral"
          aria-label="Expandir o menu"
          title="Expandir o menu"
          className="group relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-primary/5"
        >
          <span aria-hidden className="text-2xl font-bold tracking-tight group-hover:opacity-0 group-focus-visible:opacity-0">
            C<span className="text-primary">S</span>
          </span>
          <HugeiconsIcon
            icon={SidebarRightIcon}
            size={22}
            aria-hidden
            className="absolute text-primary-strong opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </button>
      ) : (
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            aria-label="CyberSpace Admin, ir para a visão geral"
            className="inline-flex min-h-11 items-center rounded-md px-2"
          >
            <BrandMark className="text-2xl" />
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-strong">Admin</span>
          </Link>
          {botao}
        </div>
      )}
      <div className="w-full">
        <NavList collapsed={recolhido} />
      </div>
    </aside>
  );
}
