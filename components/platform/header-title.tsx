"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

const paginas: { base: string; title: string; description: string }[] = [
  { base: "/aprovacoes", title: "Aprovações", description: "Programas à espera de validação antes de serem publicados." },
  { base: "/organizacoes", title: "Organizações", description: "Empresas registadas e a verificação de cada uma." },
  { base: "/pesquisadores", title: "Pesquisadores", description: "Contas de pesquisadores, estado e conduta." },
  { base: "/programas", title: "Programas", description: "Todos os programas de bug bounty da plataforma." },
  { base: "/relatorios", title: "Relatórios", description: "Triagem como serviço e disputas entre empresas e pesquisadores." },
  { base: "/financeiro", title: "Financeiro", description: "Pagamentos a pesquisadores, comissões e faturação às empresas." },
  { base: "/suporte", title: "Suporte", description: "Pedidos de ajuda de empresas e pesquisadores." },
  { base: "/auditoria", title: "Auditoria", description: "Registo de tudo o que a equipa fez na administração." },
  { base: "/equipa", title: "Equipa", description: "Quem tem acesso à administração e com que função." },
  { base: "/definicoes", title: "Definições", description: "Segurança da conta e preferências." },
];

/** Título da página e o caminho até ela, calculados a partir do endereço. */
export function HeaderTitle() {
  const pathname = usePathname();
  const pagina = paginas.find((p) => pathname === p.base || pathname.startsWith(`${p.base}/`));
  const emDetalhe = pagina && pathname !== pagina.base;

  const title = pagina ? (emDetalhe ? "Detalhe" : pagina.title) : "Visão geral";
  const description = pagina ? (emDetalhe ? pagina.description : pagina.description) : "O estado da plataforma e o que precisa da sua atenção.";

  return (
    <div className="min-w-0">
      {emDetalhe && pagina && (
        <nav aria-label="Caminho" className="hidden md:block">
          <ol className="flex items-center gap-1 text-sm">
            <li className="flex items-center gap-1">
              <Link href={pagina.base} className="inline-flex min-h-6 items-center rounded px-0.5 text-muted-foreground hover:text-ink hover:underline">
                {pagina.title}
              </Link>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} aria-hidden className="text-muted-foreground" />
            </li>
          </ol>
        </nav>
      )}
      <h1 className="truncate text-lg font-bold leading-tight md:text-xl">{title}</h1>
      {description && <p className="truncate text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
