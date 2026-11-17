import type { Metadata } from "next";
import { Card } from "@/components/platform/card";
import { equipaAtual } from "@/lib/exemplo";
import FormPalavraPasse from "./form-palavra-passe";
import Sessoes from "./sessoes";

export const metadata: Metadata = { title: "Definições" };

export default function DefinicoesPage() {
  return (
    <div className="mx-auto max-w-full space-y-6">
      <Card title="Conta" headingId="conta-titulo">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Nome</dt>
            <dd className="font-semibold">{equipaAtual.nome}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Função</dt>
            <dd className="font-semibold">{equipaAtual.funcao}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">E-mail</dt>
            <dd className="break-all font-semibold">{equipaAtual.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Verificação em dois passos</dt>
            <dd className="font-semibold text-green-800">Ativa</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">O nome e a função só mudam por um super-administrador, em Equipa.</p>
      </Card>

      <Card title="Palavra-passe" headingId="palavra-passe-titulo">
        <FormPalavraPasse />
      </Card>

      <Card title="Sessões ativas" headingId="sessoes-titulo" flush>
        <Sessoes />
      </Card>
    </div>
  );
}
