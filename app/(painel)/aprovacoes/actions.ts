"use server";

import { criteriosDeLancamento, getOrganizacao, getPrograma } from "@/lib/exemplo";

export type DecisaoState = { errors?: { nota?: string; decisao?: string }; message?: string };

/** Decisão sobre um programa pendente: aprovar, pedir mais informação ou rejeitar. */
export async function decidirPrograma(_prev: DecisaoState, formData: FormData): Promise<DecisaoState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const programa = getPrograma(String(formData.get("id") ?? ""));
  if (!programa || programa.estado !== "pendente") return { message: "Este programa já não está à espera de aprovação." };
  if (!["aprovar", "informacao", "rejeitar"].includes(decisao)) return { errors: { decisao: "Escolha uma decisão." } };

  if (decisao === "aprovar") {
    // A regra vale no servidor: o cliente nunca é de confiança.
    const org = getOrganizacao(programa.organizacaoId);
    if (org?.estado !== "verificada") return { message: "Só pode aprovar programas de organizações verificadas." };
    if (programa.ativos.some((a) => !a.dominioValidado)) return { message: "Valide todos os domínios antes de aprovar." };
    if (!programa.declaracaoAutoridade) return { message: "A organização ainda não declarou ter autoridade sobre os ativos." };
  } else if (nota.length < 10) {
    return { errors: { nota: decisao === "rejeitar" ? "Explique o motivo da rejeição, com pelo menos 10 caracteres." : "Diga o que falta, com pelo menos 10 caracteres." } };
  }

  // TODO: guardar a decisão, avisar a organização e registar na auditoria quando houver backend.
  return { message: "A decisão ainda não pode ser guardada. Volte a tentar em breve." };
}

/** Decisão sobre a passagem de um programa a público: abrir a todos ou manter em lançamento controlado. */
export async function decidirPublicacao(_prev: DecisaoState, formData: FormData): Promise<DecisaoState> {
  const decisao = String(formData.get("decisao") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();
  const programa = getPrograma(String(formData.get("id") ?? ""));
  if (!programa || !programa.pedidoPublicacaoEm) return { message: "Este programa já não está à espera de passar a público." };
  if (!["publicar", "manter"].includes(decisao)) return { errors: { decisao: "Escolha uma decisão." } };

  if (decisao === "publicar") {
    // A regra vale no servidor: só se abre a todos com os critérios cumpridos e a organização verificada.
    const falta = criteriosDeLancamento(programa).filter((c) => !c.cumprido);
    if (falta.length > 0) return { message: `Ainda não cumpre: ${falta.map((c) => c.rotulo.toLowerCase()).join(", ")}.` };
    if (getOrganizacao(programa.organizacaoId)?.estado !== "verificada") return { message: "Só pode abrir programas de organizações verificadas." };
  } else if (nota.length < 10) {
    return { errors: { nota: "Diga o que falta, com pelo menos 10 caracteres. A organização vê este texto." } };
  }

  // TODO: guardar a decisão, avisar a organização e os pesquisadores e registar na auditoria quando houver backend.
  return { message: "A decisão ainda não pode ser guardada. Volte a tentar em breve." };
}
