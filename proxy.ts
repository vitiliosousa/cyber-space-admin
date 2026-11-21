import { NextResponse, type NextRequest } from "next/server";

/**
 * Filtro rápido: sem cookie de sessão, só se chega ao início de sessão e à escolha da palavra-passe.
 * Só olha para o cookie. Quem valida a sessão de verdade é a API (ver `lib/sessao.ts`).
 */
export default function proxy(req: NextRequest) {
  if (!req.cookies.get("cs_admin")) return NextResponse.redirect(new URL("/login", req.nextUrl));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!login|redefinir-palavra-passe|_next/static|_next/image|favicon.ico).*)"] };
