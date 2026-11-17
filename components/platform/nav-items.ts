import type { IconSvgElement } from "@hugeicons/react";
import {
  Building03Icon,
  CheckmarkBadge01Icon,
  File02Icon,
  Home01Icon,
  Message01Icon,
  Search01Icon,
  Settings02Icon,
  Target02Icon,
  UserGroupIcon,
  UserIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export type NavItem = { label: string; icon: IconSvgElement; href: string; exact?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

/** Menu da administração da Cyber Space. */
export const navGroups: NavGroup[] = [
  {
    label: "Geral",
    items: [
      { label: "Visão geral", icon: Home01Icon, href: "/", exact: true },
      { label: "Aprovações", icon: CheckmarkBadge01Icon, href: "/aprovacoes" },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { label: "Organizações", icon: Building03Icon, href: "/organizacoes" },
      { label: "Pesquisadores", icon: UserIcon, href: "/pesquisadores" },
      { label: "Programas", icon: Target02Icon, href: "/programas" },
      { label: "Relatórios", icon: File02Icon, href: "/relatorios" },
    ],
  },
  {
    label: "Operações",
    items: [
      { label: "Financeiro", icon: Wallet01Icon, href: "/financeiro" },
      { label: "Suporte", icon: Message01Icon, href: "/suporte" },
    ],
  },
  {
    label: "Administração",
    items: [
      { label: "Auditoria", icon: Search01Icon, href: "/auditoria" },
      { label: "Equipa", icon: UserGroupIcon, href: "/equipa" },
      { label: "Definições", icon: Settings02Icon, href: "/definicoes" },
    ],
  },
];

