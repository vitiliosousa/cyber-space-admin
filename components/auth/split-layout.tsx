import Link from "next/link";
import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { BrandMark } from "./brand";

type PanelProps = {
  title: string;
  points: string[];
};

/**
 * Ecrã dividido: painel de marca (só em ecrãs largos) e a zona do formulário
 * a ocupar a outra metade, sem cartão. Em mobile fica só o formulário.
 */
export function SplitLayout({
  panel,
  topLink,
  children,
}: {
  panel: PanelProps;
  /** Atalho no canto superior direito, por exemplo "Já tem conta? Entrar". */
  topLink?: { label: string; href: string; text: string };
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[5fr_6fr]">
      <aside
        className="relative hidden overflow-hidden bg-primary-strong p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16"
      >
        {/* Anel decorativo, o mesmo motivo da landing */}
        <div
          aria-hidden
          className="absolute -bottom-40 -right-40 size-[34rem] rounded-full opacity-60 blur-[4px]"
          style={{
            background:
              "conic-gradient(from 210deg, #c4b5fd, #93c5fd 35%, #8b5cf6 65%, #c4b5fd)",
            WebkitMask:
              "radial-gradient(closest-side, transparent 82%, #000 90%, transparent 100%)",
            mask: "radial-gradient(closest-side, transparent 82%, #000 90%, transparent 100%)",
          }}
        />

        <Link
          href="/login"
          aria-label="CyberSpace Admin, ir para o início de sessão"
          className="relative inline-flex min-h-11 w-fit items-center rounded-md"
        >
          <span className="text-3xl font-bold tracking-tight">
            Cyber<span className="text-purple-200">Space</span>
            <span className="ml-3 rounded-full bg-white/15 px-2.5 py-0.5 align-middle text-xs font-semibold uppercase tracking-wide">Admin</span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-4xl font-bold leading-tight xl:text-5xl">{panel.title}</p>
          <ul className="mt-8 space-y-4">
            {panel.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-lg text-purple-50">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={24}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-purple-200"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-purple-100">
          Uso interno. Todas as ações ficam registadas.
        </p>
      </aside>

      <main className="flex flex-col bg-white px-6 py-6 sm:px-12 lg:px-16 xl:px-24">
        <header className="flex items-center justify-between gap-4">
          {/* A marca só aparece aqui em mobile; em ecrãs largos está no painel */}
          <Link
            href="/login"
            aria-label="CyberSpace Admin, ir para o início de sessão"
            className="inline-flex min-h-11 items-center rounded-md lg:invisible"
          >
            <BrandMark className="text-2xl" />
          </Link>
          {topLink && (
            <p className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">{topLink.text} </span>
              <Link
                href={topLink.href}
                className="inline-flex min-h-11 items-center rounded-md px-1 font-semibold text-primary-strong hover:underline"
              >
                {topLink.label}
              </Link>
            </p>
          )}
        </header>

        <div className="flex flex-1 items-center py-8">
          <div className="mx-auto w-full max-w-xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
