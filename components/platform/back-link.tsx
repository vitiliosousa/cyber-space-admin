"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

/** Ligação para voltar à página anterior da hierarquia. Visível em todos os tamanhos de ecrã. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-3 inline-flex min-h-11 items-center gap-1 rounded-full px-3 font-medium text-primary-strong transition-colors hover:bg-primary/5"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} size={20} aria-hidden />
      {children}
    </Link>
  );
}
