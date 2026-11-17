import type { Metadata } from "next";
import { Card } from "@/components/platform/card";
import { funcoes, membros } from "@/lib/exemplo";
import Convite from "./convite";
import ListaMembros from "./lista-membros";

export const metadata: Metadata = { title: "Equipa" };

export default function EquipaPage() {
  const semDoisPassos = membros.filter((m) => m.estado === "ativo" && !m.doisPassos);
  return (
    <div className="space-y-6">
      {semDoisPassos.length > 0 && (
        <p role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950">
          <span className="font-semibold">{semDoisPassos.length === 1 ? "1 pessoa ainda não ativou" : `${semDoisPassos.length} pessoas ainda não ativaram`} a verificação em dois passos:</span> {semDoisPassos.map((m) => m.nome).join(", ")}. Sem ela, não conseguem entrar.
        </p>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <ListaMembros membros={membros} />
        <aside className="space-y-6">
          <Card title="Convidar" headingId="convidar-titulo">
            <Convite />
          </Card>
          <Card title="Funções" headingId="funcoes-titulo">
            <dl className="space-y-3">
              {Object.values(funcoes).map((f) => (
                <div key={f.label}>
                  <dt className="font-semibold">{f.label}</dt>
                  <dd className="text-sm text-muted-foreground">{f.descricao}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}
