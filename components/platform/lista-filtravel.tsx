"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paginacao } from "./paginacao";

type Opcao = { value: string; label: string };
// Classes completas, para o Tailwind as encontrar: a pesquisa ocupa o resto e cada filtro tem 12,5 rem.
const COLUNAS: Record<number, string> = {
  1: "@3xl:grid-cols-[minmax(12rem,1fr)_12.5rem]",
  2: "@3xl:grid-cols-[minmax(12rem,1fr)_12.5rem_12.5rem]",
  3: "@3xl:grid-cols-[minmax(12rem,1fr)_12.5rem_12.5rem_12.5rem]",
};

export type Filtro<T> = { id: string; rotulo: string; opcoes: Opcao[]; combina: (item: T, valor: string) => boolean };

/**
 * Lista com pesquisa, filtros e paginação, para as listas da administração.
 * `linha` desenha cada item; `texto` diz em que texto se pesquisa. Quando a pesquisa e os filtros não
 * deixam nada, mostra um estado vazio com "Limpar filtros".
 */
export function ListaFiltravel<T>({
  itens,
  texto,
  filtros,
  linha,
  cabecalho,
  nome,
  placeholder,
  porPagina = 10,
}: {
  itens: T[];
  texto: (item: T) => string;
  filtros: Filtro<T>[];
  linha: (item: T) => ReactNode;
  /** Cabeçalho da tabela, para ecrãs largos (opcional). */
  cabecalho?: ReactNode;
  nome: string;
  placeholder: string;
  porPagina?: number;
}) {
  const [pesquisa, setPesquisa] = useState("");
  const [valores, setValores] = useState<Record<string, string>>(() => Object.fromEntries(filtros.map((f) => [f.id, "todos"])));
  const [pagina, setPagina] = useState(1);

  const visiveis = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    return itens.filter((i) => filtros.every((f) => valores[f.id] === "todos" || f.combina(i, valores[f.id])) && (!termo || texto(i).toLowerCase().includes(termo)));
  }, [itens, pesquisa, valores, filtros, texto]);

  const total = Math.max(1, Math.ceil(visiveis.length / porPagina));
  const atual = Math.min(pagina, total);
  const pagina_ = visiveis.slice((atual - 1) * porPagina, atual * porPagina);
  const filtrado = pesquisa !== "" || Object.values(valores).some((v) => v !== "todos");

  const limpar = () => {
    setPesquisa("");
    setValores(Object.fromEntries(filtros.map((f) => [f.id, "todos"])));
    setPagina(1);
  };

  return (
    <div className="space-y-4">
      <div className="@container">
        <div className={`grid gap-3 ${COLUNAS[filtros.length] ?? ""}`}>
          <div className="relative">
            <label htmlFor={`pesquisa-${nome}`} className="sr-only">
              {placeholder}
            </label>
            <HugeiconsIcon icon={Search01Icon} size={20} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={`pesquisa-${nome}`}
              type="search"
              value={pesquisa}
              onChange={(e) => {
                setPesquisa(e.target.value);
                setPagina(1);
              }}
              placeholder={placeholder}
              className="pl-12"
            />
          </div>
          {filtros.map((f) => (
            <Select
              key={f.id}
              value={valores[f.id]}
              onValueChange={(v) => {
                setValores((x) => ({ ...x, [f.id]: v }));
                setPagina(1);
              }}
            >
              <SelectTrigger aria-label={f.rotulo} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {f.opcoes.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {filtrado && (
        <div className="flex min-h-11 items-center justify-between gap-4">
          <p className="text-muted-foreground" role="status">
            {visiveis.length === 1 ? "1 resultado com estes filtros" : `${visiveis.length} resultados com estes filtros`}
          </p>
          <button type="button" onClick={limpar} className="min-h-11 cursor-pointer rounded-full px-3 text-sm font-medium text-primary-strong hover:underline">
            Limpar filtros
          </button>
        </div>
      )}

      {visiveis.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
          <p className="text-lg font-semibold">Nada encontrado</p>
          <p className="mt-1 text-muted-foreground">Experimente outra pesquisa ou retire alguns filtros.</p>
          <button type="button" onClick={limpar} className={`mt-5 ${buttonVariants({ variant: "outline", size: "lg" })}`}>
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="@container overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,22,37,0.06)]">
          {cabecalho}
          <ul className="divide-y divide-line">{pagina_.map((i) => linha(i))}</ul>
          <Paginacao atual={atual} totalItens={visiveis.length} porPagina={porPagina} onChange={setPagina} />
        </div>
      )}
    </div>
  );
}
