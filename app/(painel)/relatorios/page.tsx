import type { Metadata } from "next";
import { disputas, filaTriagem } from "@/lib/exemplo";
import Separadores from "./separadores";

export const metadata: Metadata = { title: "Relatórios" };

export default function RelatoriosPage() {
  return <Separadores fila={filaTriagem} disputas={disputas} />;
}
