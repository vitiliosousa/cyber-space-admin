import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Cliente da API da administração, só para o servidor. O navegador nunca fala com a API nem vê o token:
 * o token da sessão vive num cookie httpOnly desta aplicação e é reenviado à API em cada pedido.
 */
const API_URL = process.env.API_URL ?? "http://localhost:3003";
/** A API só aceita pedidos que mudam dados vindos de origens conhecidas (proteção contra CSRF). */
const ORIGEM = process.env.ADMIN_ORIGIN ?? "http://localhost:3002";
const COOKIE_API = "cs_sessao";
/** Segredo partilhado com a API. Com ele, a API confia no IP que reencaminhamos e o limite de pedidos conta por pessoa. */
const SEGREDO = process.env.API_SEGREDO;
export const COOKIE_SESSAO = "cs_admin";

export type RespostaApi<T = unknown> = {
  /** 0 quando a API não respondeu. */
  status: number;
  ok: boolean;
  dados: T;
  /** Erro geral, pronto a mostrar. */
  message?: string;
  /** Erros por campo, com os nomes da API. */
  errors?: Record<string, string>;
  codigo?: string;
};

type Opcoes = { corpo?: unknown; metodo?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" };

/** Lê `cs_sessao=valor; ... Expires=...` do cabeçalho da API. */
function lerCookie(res: Response): { token: string; expira?: Date } | "limpar" | null {
  for (const linha of res.headers.getSetCookie()) {
    if (!linha.startsWith(`${COOKIE_API}=`)) continue;
    const valor = linha.slice(COOKIE_API.length + 1).split(";")[0];
    const expira = /expires=([^;]+)/i.exec(linha)?.[1];
    const data = expira ? new Date(expira) : undefined;
    if (!valor || (data && data.getTime() <= Date.now())) return "limpar";
    return { token: valor, expira: data };
  }
  return null;
}

/**
 * Faz um pedido à API com a sessão do cookie. Se a API renovar ou terminar a sessão, o cookie acompanha.
 * Só pode mudar cookies numa Server Action ou num Route Handler; em páginas, use `guardarCookie: false`.
 */
export async function chamarApi<T = unknown>(caminho: string, { corpo, metodo }: Opcoes = {}, { guardarCookie = true } = {}): Promise<RespostaApi<T>> {
  const jar = await cookies();
  const token = jar.get(COOKIE_SESSAO)?.value;
  const cabecalhos: Record<string, string> = { Origin: ORIGEM, Accept: "application/json" };
  if (token) cabecalhos.Cookie = `${COOKIE_API}=${token}`;
  if (SEGREDO) {
    // O IP de quem está do outro lado do navegador. `x-real-ip` vem do proxy da frente e não se falsifica; sem ele, o primeiro de `x-forwarded-for`.
    const pedido = await headers();
    const ip = pedido.get("x-real-ip") ?? pedido.get("x-forwarded-for")?.split(",")[0]?.trim();
    cabecalhos["X-CS-Segredo"] = SEGREDO;
    if (ip) cabecalhos["X-CS-IP"] = ip;
  }
  if (corpo !== undefined) cabecalhos["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${API_URL}${caminho}`, { method: metodo ?? (corpo === undefined ? "GET" : "POST"), headers: cabecalhos, body: corpo === undefined ? undefined : JSON.stringify(corpo), cache: "no-store" });
  } catch {
    return { status: 0, ok: false, dados: null as T, message: "Não conseguimos falar com o servidor. Tente outra vez daqui a pouco." };
  }

  if (guardarCookie) {
    const novo = lerCookie(res);
    if (novo === "limpar") jar.delete(COOKIE_SESSAO);
    else if (novo) {
      jar.set(COOKIE_SESSAO, novo.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: novo.expira });
    }
  }

  const texto = await res.text();
  let dados: unknown = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }
  const erro = res.ok ? undefined : (dados as { message?: string; errors?: Record<string, string>; codigo?: string } | null);
  return {
    status: res.status,
    ok: res.ok,
    dados: dados as T,
    message: erro
      ? res.status >= 500
        ? "Algo correu mal do nosso lado. Tente outra vez daqui a pouco."
        : // O limite de pedidos responde com um erro técnico: mostramos uma frase clara.
          res.status === 429 && /throttler/i.test(erro.message ?? "")
          ? "Fez demasiados pedidos seguidos. Espere um minuto e tente outra vez."
          : erro.message ?? "Não foi possível concluir o pedido."
      : undefined,
    errors: erro?.errors,
    codigo: erro?.codigo,
  };
}

/**
 * Leitura para páginas. Falha em voz alta: sem resposta ou erro do servidor lança um erro (a página de erro
 * deixa tentar outra vez) e sessão expirada leva ao início de sessão. Os restantes estados (403, 404…) voltam
 * na resposta, para cada página decidir. Com `redirecionar401: false`, um 401 também volta (quem pergunta “quem sou?”).
 */
export async function lerApi<T = unknown>(caminho: string, { redirecionar401 = true } = {}): Promise<RespostaApi<T>> {
  const r = await chamarApi<T>(caminho, {}, { guardarCookie: false });
  if (r.status === 401 && redirecionar401) redirect("/login");
  if (r.status === 0 || r.status >= 500) throw new Error(r.message ?? "Não foi possível carregar os dados.");
  return r;
}
