"use server";

import { revalidatePath } from "next/cache";
import { chamarApi } from "@/lib/api";

export type AcaoFinanceiraState = { message?: string; ok?: boolean };

const ID = /^[0-9a-f-]{36}$/i;

/** Uma só ação para os botões de pagamentos e faturas; o campo `acao` diz qual. */
export async function acaoFinanceira(_prev: AcaoFinanceiraState, formData: FormData): Promise<AcaoFinanceiraState> {
  const acao = String(formData.get("acao") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!ID.test(id)) return { message: "Este registo já não existe." };

  if (acao === "processar" || acao === "repetir") {
    // A API envia o pagamento pelo método do pesquisador. Cada pagamento só se envia uma vez de cada vez.
    const r = await chamarApi<{ estado: string; erro: string | null }>(`/admin/pagamentos/${id}/processar`, { corpo: {} });
    if (!r.ok) return { message: r.message };
    revalidatePath("/financeiro");
    return r.dados.estado === "processado" ? { ok: true, message: "Pagamento enviado." } : { message: r.dados.erro ?? "O envio falhou." };
  }

  if (acao === "paga") {
    const r = await chamarApi(`/admin/faturas/${id}/pagar`, { corpo: {} });
    if (!r.ok) return { message: r.message };
    revalidatePath("/financeiro");
    return { ok: true, message: "Fatura marcada como paga." };
  }

  if (acao === "lembrar") return { message: "Os lembretes ainda não estão disponíveis. A fatura pode ser marcada como paga quando o pagamento chegar." };
  return { message: "Ação desconhecida." };
}
