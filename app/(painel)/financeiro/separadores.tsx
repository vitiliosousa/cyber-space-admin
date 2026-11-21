"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { ListaFiltravel, type Filtro } from "@/components/platform/lista-filtravel";
import { Selo } from "@/components/platform/selo";
import { Button } from "@/components/ui/button";
import { formatDate, formatMZN } from "@/lib/format";
import { estadosFatura, estadosPagamento, nomeOrganizacao, type EstadoPagamento, type Fatura, type PagamentoPesquisador } from "@/lib/exemplo";
import { BotaoAcao } from "./botao-acao";

const filtros: Filtro<PagamentoPesquisador>[] = [
  {
    id: "estado",
    rotulo: "Estado",
    opcoes: [{ value: "todos", label: "Todos os estados" }, ...(Object.keys(estadosPagamento) as EstadoPagamento[]).map((e) => ({ value: e, label: estadosPagamento[e].label }))],
    combina: (p, v) => p.estado === v,
  },
  {
    id: "metodo",
    rotulo: "Método",
    opcoes: [{ value: "todos", label: "Todos os métodos" }, { value: "M-Pesa", label: "M-Pesa" }, { value: "e-Mola", label: "e-Mola" }, { value: "Transferência", label: "Transferência" }],
    combina: (p, v) => p.metodo === v,
  },
];

/** Exporta os pagamentos para um ficheiro CSV (só o que a equipa financeira precisa; sem números de pagamento). */
function exportar(pagamentos: PagamentoPesquisador[]) {
  const celula = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;
  const linhas = [
    ["Pagamento", "Pesquisador", "Relatório", "Organização", "Valor (MZN)", "Método", "Estado", "Data"],
    ...pagamentos.map((p) => [p.codigo ?? p.id, p.pesquisador, p.relatorioId, p.organizacaoNome ?? nomeOrganizacao(p.organizacaoId), p.valor, p.metodo, estadosPagamento[p.estado].label, p.data]),
  ];
  const blob = new Blob(["﻿" + linhas.map((l) => l.map(celula).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pagamentos.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Separadores({ pagamentos, faturas }: { pagamentos: PagamentoPesquisador[]; faturas: Fatura[] }) {
  const [aba, setAba] = useState<"pagamentos" | "faturas">("pagamentos");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Financeiro" className="flex flex-wrap gap-2">
          {[
            { v: "pagamentos" as const, t: "Pagamentos a pesquisadores" },
            { v: "faturas" as const, t: "Faturas às empresas" },
          ].map((o) => (
            <button
              key={o.v}
              role="tab"
              type="button"
              id={`aba-${o.v}`}
              aria-selected={aba === o.v}
              aria-controls="painel-financeiro"
              onClick={() => setAba(o.v)}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 font-medium transition-colors ${aba === o.v ? "bg-primary/15 text-primary-strong" : "bg-white text-muted-foreground ring-1 ring-line hover:bg-primary/5 hover:text-ink"}`}
            >
              {o.t}
            </button>
          ))}
        </div>
        {aba === "pagamentos" && (
          <Button type="button" variant="outline" size="sm" onClick={() => exportar(pagamentos)} className="h-9 gap-2 px-4">
            <HugeiconsIcon icon={Download01Icon} size={16} aria-hidden />
            Exportar CSV
          </Button>
        )}
      </div>

      <div role="tabpanel" id="painel-financeiro" aria-labelledby={`aba-${aba}`}>
        {aba === "pagamentos" ? (
          <ListaFiltravel
            nome="pagamentos"
            placeholder="Pesquisar por pesquisador, relatório ou organização"
            itens={pagamentos}
            texto={(p) => `${p.codigo ?? p.id} ${p.pesquisador} ${p.relatorioId} ${p.organizacaoNome ?? nomeOrganizacao(p.organizacaoId)}`}
            filtros={filtros}
            linha={(p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
                <div className="min-w-0 flex-1 basis-56">
                  <Link href={`/pesquisadores/${p.pesquisador}`} className="block truncate font-semibold hover:text-primary-strong">
                    {p.pesquisador}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {p.codigo ?? p.id} · {p.relatorioId} · {p.organizacaoNome ?? nomeOrganizacao(p.organizacaoId)} · {formatDate(p.data)}
                  </p>
                  {p.erro && <p className="text-sm text-danger">{p.erro}</p>}
                </div>
                <p className="w-24 text-sm text-muted-foreground">{p.metodo}</p>
                <p className="w-28 text-right font-semibold tabular-nums">{formatMZN(p.valor)}</p>
                <span className="flex w-28 justify-end">
                  <Selo info={estadosPagamento[p.estado]} />
                </span>
                <span className="flex w-32 justify-end">
                  {p.estado === "pendente" && <BotaoAcao acao="processar" id={p.id} rotulo="Processar" nome={p.codigo ?? p.id} variante="default" />}
                  {p.estado === "falhado" && <BotaoAcao acao="repetir" id={p.id} rotulo="Tentar de novo" nome={p.codigo ?? p.id} />}
                </span>
              </li>
            )}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,22,37,0.06)]">
            <ul className="divide-y divide-line">
              {faturas.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
                  <div className="min-w-0 flex-1 basis-56">
                    <Link href={`/organizacoes/${f.organizacaoId}`} className="block truncate font-semibold hover:text-primary-strong">
                      {f.organizacaoNome ?? nomeOrganizacao(f.organizacaoId)}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {f.codigo ?? f.id} · {f.descricao} · vence a {formatDate(f.vence)}
                    </p>
                  </div>
                  <p className="w-28 text-right font-semibold tabular-nums">{formatMZN(f.valor)}</p>
                  <span className="flex w-28 justify-end">
                    <Selo info={estadosFatura[f.estado]} />
                  </span>
                  <span className="flex w-32 justify-end">{f.estado !== "paga" && <BotaoAcao acao={f.estado === "atrasada" ? "lembrar" : "paga"} id={f.id} rotulo={f.estado === "atrasada" ? "Enviar lembrete" : "Marcar como paga"} nome={f.id} />}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
