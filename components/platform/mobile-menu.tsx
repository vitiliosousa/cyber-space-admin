"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { BrandMark } from "@/components/auth/brand";
import { NavList } from "./nav";

/** Menu em gaveta para ecrãs pequenos: botão no cabeçalho e painel com a mesma navegação. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = buttonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      // Mantém o foco dentro da gaveta enquanto está aberta
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Abrir menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="-ml-2 flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-primary/5"
      >
        <HugeiconsIcon icon={Menu01Icon} size={24} aria-hidden />
      </button>

      {/* Portal: o cabeçalho tem backdrop-filter, que prenderia um elemento fixo dentro dele */}
      {open &&
        createPortal(
        <div className="fixed inset-0 z-40 md:hidden">
          <div aria-hidden className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-white p-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                aria-label="CyberSpace Admin, ir para a visão geral"
                className="inline-flex min-h-11 items-center rounded-md px-2"
              >
                <BrandMark className="text-2xl" />
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-strong">Admin</span>
              </Link>
              <button
                ref={closeRef}
                type="button"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-primary/5"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} aria-hidden />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>,
          document.body
        )}
    </div>
  );
}
