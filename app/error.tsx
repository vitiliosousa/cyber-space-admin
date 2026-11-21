"use client";

import { ErroDaPagina } from "@/components/estado/erro-da-pagina";

export default function ErroGeral(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErroDaPagina {...props} />;
}
