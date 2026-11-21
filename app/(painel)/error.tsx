"use client";

import { ErroDaPagina } from "@/components/estado/erro-da-pagina";

export default function ErroDoPainel(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErroDaPagina {...props} compacto />;
}
