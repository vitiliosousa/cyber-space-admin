"use server";

export type ConviteState = { errors?: { email?: string; funcao?: string }; message?: string };

const FUNCOES = ["super-admin", "triagem", "financeiro", "suporte"];

export async function convidarMembro(_prev: ConviteState, formData: FormData): Promise<ConviteState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const funcao = String(formData.get("funcao") ?? "");
  const errors: NonNullable<ConviteState["errors"]> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Indique um e-mail válido.";
  // A regra vale no servidor: só e-mails da própria CyberSpace entram na administração.
  else if (!email.endsWith("@cyberspace.co.mz")) errors.email = "Só e-mails @cyberspace.co.mz podem ter acesso à administração.";
  if (!FUNCOES.includes(funcao)) errors.funcao = "Escolha a função.";
  if (Object.keys(errors).length > 0) return { errors };
  // TODO: enviar o convite com ligação de uso único e exigir a configuração dos dois passos quando houver backend.
  return { message: "O convite ainda não pode ser enviado. Volte a tentar em breve." };
}

export type MembroState = { message?: string };

export async function alterarMembro(_prev: MembroState, formData: FormData): Promise<MembroState> {
  const acao = String(formData.get("acao") ?? "");
  if (!["desativar", "reativar", "repor"].includes(acao)) return { message: "Ação desconhecida." };
  // TODO: desativar termina logo todas as sessões da pessoa; "repor" apaga os dois passos para ela os configurar de novo.
  return { message: "Esta ação ainda não está disponível. Volte a tentar em breve." };
}
