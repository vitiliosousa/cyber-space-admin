import type { Metadata } from "next";
import { listarDisputas, listarTriagem } from "@/lib/admin-api";
import Separadores from "./separadores";

export const metadata: Metadata = { title: "Relatórios" };

// Lê a sessão: a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default async function RelatoriosPage() {
  const [fila, disputas] = await Promise.all([listarTriagem(), listarDisputas()]);
  return <Separadores fila={fila} disputas={disputas} />;
}
