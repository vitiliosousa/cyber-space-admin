"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Logout01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { Popover } from "./popover";
import { sair } from "@/app/sair/actions";

export function UserMenu({ nome, funcao, iniciais }: { nome: string; funcao: string; iniciais: string }) {
  return (
    <Popover
      label={`Conta de ${nome}`}
      triggerClassName="flex h-11 cursor-pointer items-center gap-2 rounded-full pl-1 pr-2 transition-colors hover:bg-primary/5 sm:pr-3"
      panelClassName="w-64"
      trigger={
        <>
          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary-strong">
            {iniciais}
          </span>
          <span className="hidden text-sm font-medium sm:block">{nome}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={18} aria-hidden className="text-muted-foreground" />
        </>
      }
    >
      {(close) => (
        <>
          <div className="border-b border-line px-4 py-3">
            <p className="font-semibold">{nome}</p>
            <p className="text-sm text-muted-foreground">{funcao}</p>
          </div>
          <ul className="p-2">
            <li>
              <Link href="/definicoes" onClick={close} className="flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium transition-colors hover:bg-primary/5">
                <HugeiconsIcon icon={Settings02Icon} size={20} aria-hidden />
                Definições
              </Link>
            </li>
            <li className="mt-1 border-t border-line pt-1">
              <form action={sair}>
                <button type="submit" className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 font-medium transition-colors hover:bg-primary/5">
                  <HugeiconsIcon icon={Logout01Icon} size={20} aria-hidden />
                  Terminar sessão
                </button>
              </form>
            </li>
          </ul>
        </>
      )}
    </Popover>
  );
}
