"use client";

import { useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";

const EVENTO = "tema-alterado";

function subscrever(aviso: () => void) {
  window.addEventListener(EVENTO, aviso);
  return () => window.removeEventListener(EVENTO, aviso);
}

const escuroAgora = () => document.documentElement.classList.contains("dark");

/** Botão que alterna entre o modo claro e o escuro. A escolha fica guardada no browser. */
export function AlternarTema() {
  const escuro = useSyncExternalStore(subscrever, escuroAgora, () => false);

  const alternar = () => {
    const novo = !escuroAgora();
    document.documentElement.classList.toggle("dark", novo);
    try {
      localStorage.setItem("tema", novo ? "escuro" : "claro");
    } catch {
      // Sem armazenamento (janela privada): o tema só vale nesta visita.
    }
    window.dispatchEvent(new Event(EVENTO));
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={escuro}
      aria-label="Modo escuro"
      title={escuro ? "Mudar para o modo claro" : "Mudar para o modo escuro"}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-primary/5"
    >
      <HugeiconsIcon icon={escuro ? Sun03Icon : Moon02Icon} size={22} aria-hidden />
    </button>
  );
}
