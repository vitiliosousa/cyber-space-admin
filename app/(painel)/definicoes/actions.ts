"use server";

export type DefinicaoState = { errors?: Record<string, string>; message?: string };

export async function alterarPalavraPasse(_prev: DefinicaoState, formData: FormData): Promise<DefinicaoState> {
  const atual = String(formData.get("atual") ?? "");
  const nova = String(formData.get("nova") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");
  const errors: Record<string, string> = {};
  if (!atual) errors.atual = "Indique a palavra-passe atual.";
  if (nova.length < 12) errors.nova = "A nova palavra-passe tem de ter pelo menos 12 caracteres.";
  else if (nova === atual) errors.nova = "A nova palavra-passe tem de ser diferente da atual.";
  if (!errors.nova && confirmar !== nova) errors.confirmar = "As palavras-passe não coincidem.";
  if (Object.keys(errors).length > 0) return { errors };
  // TODO: alterar a palavra-passe e terminar as outras sessões quando houver backend.
  return { message: "A palavra-passe ainda não pode ser alterada. Volte a tentar em breve." };
}

export async function terminarSessoes(_prev: DefinicaoState, formData: FormData): Promise<DefinicaoState> {
  void formData;
  // TODO: terminar as sessões escolhidas quando houver backend.
  return { message: "As sessões ainda não podem ser terminadas. Volte a tentar em breve." };
}
