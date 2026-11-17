const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-11-12" -> "12 nov 2026". Sem Date para o resultado ser igual no servidor e no cliente. */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** 150000 -> "150 000 MZN" (espaço não separável entre os milhares). */
export function formatMZN(value: number) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MZN`;
}

/** 2000 e 150000 -> "2 000 a 150 000 MZN". */
export function formatIntervaloMZN(min: number, max: number) {
  const n = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${n(min)} a ${n(max)} MZN`;
}

/** "2025-03-18" -> "mar 2025". */
export function formatMesAno(iso: string) {
  const [ano, mes] = iso.split("-").map(Number);
  return `${MONTHS[mes - 1]} ${ano}`;
}
