import { formatMZN } from "./format";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export type Mes = { chave: string; label: string };

/** Os `n` meses que terminam no mês de `ref` (AAAA-MM-DD), do mais antigo para o mais recente. */
export function mesesRecentes(n: number, ref: string): Mes[] {
  const [ano, mes] = ref.split("-").map(Number);
  return Array.from({ length: n }, (_, i) => {
    const indice = mes - 1 - (n - 1 - i);
    const a = ano + Math.floor(indice / 12);
    const m = ((indice % 12) + 12) % 12;
    return { chave: `${a}-${String(m + 1).padStart(2, "0")}`, label: MESES[m] };
  });
}

/** Escala "redonda" para o eixo: o topo e o passo entre linhas de grelha (1, 2 ou 5 × 10^k). */
export function escala(maximo: number, intervalos = 4) {
  const bruto = Math.max(maximo, 1) / intervalos;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const passo = [1, 2, 5, 10].map((f) => f * potencia).find((p) => p >= bruto) ?? potencia * 10;
  const topo = Math.ceil(Math.max(maximo, 1) / passo) * passo;
  const marcas = Array.from({ length: Math.round(topo / passo) + 1 }, (_, i) => i * passo);
  return { topo, marcas };
}

/** 50000 -> "50 mil", 1500000 -> "1,5 M", 0 -> "0". Para as marcas do eixo. */
export function abreviar(n: number) {
  if (n === 0) return "0";
  if (n >= 1_000_000) return `${String(n / 1_000_000).replace(".", ",")} M`;
  if (n >= 1000) return `${String(n / 1000).replace(".", ",")} mil`;
  return String(n);
}

export type Formato = "mzn" | "relatorios" | "pesquisadores" | "programas";

/** Texto de um valor do gráfico. Vive aqui para o gráfico (cliente) receber só dados simples. */
export function formatar(valor: number, formato: Formato) {
  if (formato === "mzn") return formatMZN(valor);
  if (formato === "pesquisadores") return valor === 1 ? "1 pesquisador" : `${valor} pesquisadores`;
  if (formato === "programas") return valor === 1 ? "1 programa" : `${valor} programas`;
  return valor === 1 ? "1 relatório" : `${valor} relatórios`;
}
