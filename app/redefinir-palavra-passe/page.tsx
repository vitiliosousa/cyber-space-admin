import type { Metadata } from "next";
import { SplitLayout } from "@/components/auth/split-layout";
import RedefinirForm from "./redefinir-form";

export const metadata: Metadata = { title: "Nova palavra-passe", robots: { index: false } };

// Lê o endereço (?token=): a rota é dinâmica e responde de imediato, sem <Suspense>.
export const instant = false;

export default function RedefinirPalavraPassePage({ searchParams }: PageProps<"/redefinir-palavra-passe">) {
  return <Conteudo searchParams={searchParams} />;
}

async function Conteudo({ searchParams }: Pick<PageProps<"/redefinir-palavra-passe">, "searchParams">) {
  const { token } = await searchParams;
  const valor = typeof token === "string" ? token : "";
  return (
    <SplitLayout panel={{ title: "Administração da plataforma.", points: ["A ligação vale 30 minutos e só funciona uma vez", "No primeiro acesso, ativa os dois passos", "Tudo o que faz fica registado"] }}>
      <h1 className="text-3xl font-bold md:text-4xl">Escolha a sua palavra-passe</h1>
      {valor ? (
        <>
          <p className="mt-2 text-lg text-muted-foreground">Use pelo menos 12 caracteres e uma que não use em mais nenhum sítio.</p>
          <div className="mt-8">
            <RedefinirForm token={valor} />
          </div>
        </>
      ) : (
        <p className="mt-2 text-lg text-muted-foreground">Esta ligação não é válida. Peça a um super-administrador que o convide outra vez.</p>
      )}
    </SplitLayout>
  );
}
