"use server";

import { faturas, pagamentos } from "@/lib/exemplo";

export type AcaoFinanceiraState = { message?: string };

/** Uma só ação para os botões de pagamentos e faturas; o campo `acao` diz qual. */
export async function acaoFinanceira(_prev: AcaoFinanceiraState, formData: FormData): Promise<AcaoFinanceiraState> {
  const acao = String(formData.get("acao") ?? "");
  const id = String(formData.get("id") ?? "");

  if (acao === "processar" || acao === "repetir") {
    const p = pagamentos.find((x) => x.id === id);
    if (!p) return { message: "Este pagamento já não existe." };
    if (p.estado === "processado") return { message: "Este pagamento já foi processado." };
    // TODO: enviar o pagamento pelo método do pesquisador quando houver backend.
    return { message: "O pagamento ainda não pode ser enviado. Volte a tentar em breve." };
  }

  if (acao === "lembrar" || acao === "paga") {
    const f = faturas.find((x) => x.id === id);
    if (!f) return { message: "Esta fatura já não existe." };
    if (f.estado === "paga") return { message: "Esta fatura já está paga." };
    return { message: "Esta ação ainda não está disponível. Volte a tentar em breve." };
  }

  return { message: "Ação desconhecida." };
}
