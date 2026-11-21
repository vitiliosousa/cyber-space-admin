const API_URL = process.env.API_URL ?? "http://localhost:3003";

/**
 * O logótipo de uma organização, servido por esta aplicação (o navegador não fala com a API).
 * A versão vai no endereço: quando o logótipo muda, o endereço muda, por isso a cache pode ser longa.
 */
export async function GET(_pedido: Request, { params }: { params: Promise<{ id: string; versao: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response(null, { status: 404 });
  const r = await fetch(`${API_URL}/organizacoes/${id}/logo`, { cache: "no-store" }).catch(() => null);
  const tipo = r?.headers.get("content-type") ?? "";
  if (!r?.ok || !/^image\/(png|jpeg|webp)$/.test(tipo)) return new Response(null, { status: 404 });
  return new Response(await r.arrayBuffer(), {
    headers: {
      "Content-Type": tipo,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
