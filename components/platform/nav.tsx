"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { navGroups } from "./nav-items";

/** Lista de grupos e ligações. Os itens sem destino aparecem como "Em breve". */
export function NavList({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.label}>
          {collapsed ? (
            <hr aria-hidden className="mx-3 border-line first:hidden" />
          ) : (
            <p className="px-4 text-sm font-medium text-muted-foreground">{group.label}</p>
          )}
          <ul className="mt-1 space-y-1">
            {group.items.map((item) => {
              const content = (
                <>
                  <HugeiconsIcon icon={item.icon} size={24} aria-hidden className="shrink-0" />
                  <span className={collapsed ? "sr-only" : ""}>{item.label}</span>
                </>
              );

              if (!item.href) {
                return (
                  <li key={item.label}>
                    <span
                      title={collapsed ? `${item.label} (em breve)` : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-full font-medium text-muted-foreground ${
                        collapsed ? "justify-center px-0" : "px-4"
                      }`}
                    >
                      {content}
                      <span
                        className={
                          collapsed
                            ? "sr-only"
                            : "ml-auto whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-sm font-normal text-slate-700"
                        }
                      >
                        Em breve
                      </span>
                    </span>
                  </li>
                );
              }

              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-full font-medium transition-colors ${
                      collapsed ? "justify-center px-0" : "px-4"
                    } ${
                      active ? "bg-primary/10 text-primary-strong" : "text-ink hover:bg-primary/5"
                    }`}
                  >
                    {content}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
