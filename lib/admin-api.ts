import "server-only";
import { lerApi } from "./api";
import type {
  Disputa,
  EstadoPrograma,
  EventoAuditoria,
  Fatura,
  FasePrograma,
  FuncaoInterna,
  MembroInterno,
  Organizacao,
  PagamentoPesquisador,
  PassoVerificacao,
  PedidoSuporte,
  PedidoTriagem,
  Pesquisador,
  Programa,
  RelatorioPrograma,
} from "./exemplo";

const dia = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : undefined);

/** A hora de Maputo, no formato AAAA-MM-DDTHH:MM, para os registos mostrarem a hora de quem os lê. */
const horaLocal = (iso: string) => new Date(iso).toLocaleString("sv-SE", { timeZone: "Africa/Maputo" }).slice(0, 16).replace(" ", "T");

async function ler<T>(caminho: string, vazio: T): Promise<T> {
  const r = await lerApi<T>(caminho);
  return r.ok ? r.dados : vazio;
}

/* ------------------------------------------------------------------ Organizações */

type OrganizacaoApi = {
  id: string;
  logoVersao: number | null;
  nome: string;
  estado: Organizacao["estado"];
  setor: string | null;
  nuit: string | null;
  website: string | null;
  contacto: string | null;
  representante: { nome: string | null; cargo: string | null };
  risco: "normal" | "alto";
  registadaEm: string;
  pedidoEm: string | null;
  nota: string | null;
  passos: PassoVerificacao[];
  programas?: number;
};

function daOrganizacao(o: OrganizacaoApi): Organizacao {
  return {
    id: o.id,
    logoVersao: o.logoVersao,
    nome: o.nome,
    setor: o.setor ?? "Sector por indicar",
    estado: o.estado,
    registadaEm: dia(o.registadaEm)!,
    pedidoEm: dia(o.pedidoEm),
    risco: o.risco,
    nuit: o.nuit ?? "-",
    website: o.website ?? "-",
    contacto: o.contacto ?? "-",
    representante: { nome: o.representante.nome ?? "-", cargo: o.representante.cargo ?? "-" },
    programas: o.programas ?? 0,
    passos: o.passos,
    nota: o.nota ?? undefined,
  };
}

export async function listarOrganizacoes(): Promise<Organizacao[]> {
  return (await ler<OrganizacaoApi[]>("/admin/organizacoes", [])).map(daOrganizacao);
}

export async function obterOrganizacao(id: string): Promise<Organizacao | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await lerApi<OrganizacaoApi>(`/admin/organizacoes/${id}`);
  return r.ok ? daOrganizacao(r.dados) : null;
}

/* ---------------------------------------------------------------------- Programas */

type ProgramaApi = {
  id: string;
  logoVersao: number | null;
  organizacaoId: string;
  organizacao: string;
  nome: string;
  estado: EstadoPrograma;
  fase: FasePrograma | null;
  tipo: "publico" | "privado";
  resumo: string;
  ativos: { id: string; nome: string; identificador: string; tipo: string; dominioValidado: boolean }[];
  recompensas: Record<"critica" | "alta" | "media" | "baixa", { min: number; max: number }> | null;
  recompensa: { min: number; max: number };
  orcamento: number;
  declaracaoAutoridade: boolean;
  submetidoEm: string | null;
  divulgacao: Programa["divulgacao"] | null;
  criadoEm: string;
  medidas: { relatoriosTratados: number; pesquisadores: number; respostaDias: number | null };
  relatorios: { total: number };
  pago: number;
};

function doPrograma(p: ProgramaApi, orgEstado?: Organizacao["estado"]): Programa {
  const r = p.recompensas;
  const alertas: string[] = [];
  if (orgEstado && orgEstado !== "verificada") alertas.push("A organização ainda não está verificada.");
  const semDominio = p.ativos.filter((a) => !a.dominioValidado).length;
  if (p.estado === "pendente" && semDominio > 0) alertas.push(semDominio === 1 ? "Há 1 domínio por validar." : `Há ${semDominio} domínios por validar.`);
  return {
    id: p.id,
    nome: p.nome,
    organizacaoId: p.organizacaoId,
    logoVersao: p.logoVersao,
    organizacaoNome: p.organizacao,
    estado: p.estado,
    tipo: p.tipo,
    fase: p.fase ?? undefined,
    resumo: p.resumo,
    divulgacao: p.divulgacao ?? undefined,
    submetidoEm: dia(p.submetidoEm),
    criadoEm: dia(p.criadoEm)!,
    ativos: p.ativos.map((a) => ({ id: a.id, nome: a.nome, identificador: a.identificador, tipo: a.tipo, dominioValidado: a.dominioValidado })),
    recompensa: p.recompensa,
    recompensas: r ? { critica: [r.critica.min, r.critica.max], alta: [r.alta.min, r.alta.max], media: [r.media.min, r.media.max], baixa: [r.baixa.min, r.baixa.max] } : undefined,
    orcamento: p.orcamento,
    pago: p.pago,
    relatorios: p.relatorios.total,
    tratados: p.medidas.relatoriosTratados,
    pesquisadores: p.medidas.pesquisadores,
    respostaDias: p.medidas.respostaDias ?? undefined,
    declaracaoAutoridade: p.declaracaoAutoridade,
    alertas: alertas.length ? alertas : undefined,
  };
}

export async function listarProgramas(): Promise<Programa[]> {
  const [lista, orgs] = await Promise.all([ler<ProgramaApi[]>("/admin/programas", []), listarOrganizacoes()]);
  const estado = new Map(orgs.map((o) => [o.id, o.estado]));
  return lista.map((p) => doPrograma(p, estado.get(p.organizacaoId)));
}

export async function obterPrograma(id: string): Promise<{ programa: Programa; organizacao: Organizacao | null } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await lerApi<ProgramaApi>(`/admin/programas/${id}`);
  if (!r.ok) return null;
  const org = await obterOrganizacao(r.dados.organizacaoId);
  return { programa: doPrograma(r.dados, org?.estado), organizacao: org };
}

/** Os relatórios de um programa, sem os detalhes técnicos. */
export async function relatoriosDoProgramaApi(programaId: string): Promise<RelatorioPrograma[]> {
  type R = { id: string; codigo: string; pesquisador: string; titulo: string; gravidade: RelatorioPrograma["gravidade"]; estado: RelatorioPrograma["estado"]; correcao: RelatorioPrograma["correcao"]; recompensa: number | null; enviadoEm: string };
  const lista = await ler<R[]>(`/admin/relatorios?programaId=${programaId}`, []);
  return lista.map((r) => ({ id: r.codigo, titulo: r.titulo, pesquisador: r.pesquisador, gravidade: r.gravidade, estado: r.estado, correcao: r.correcao, data: dia(r.enviadoEm)!, recompensa: r.recompensa }));
}

/* ---------------------------------------------------------------- Pesquisadores */

type PesquisadorApi = { id: string; nome: string; estado: Pesquisador["estado"]; desde: string; nota: string | null; relatorios: number; validos?: number; documento: { tipo: string; enviadoEm: string } | null };

function doPesquisador(p: PesquisadorApi): Pesquisador {
  return { handle: p.id, nome: p.nome, daApi: true, pais: "-", nivel: "-", pontos: 0, estado: p.estado, desde: dia(p.desde)!, relatorios: p.relatorios, validos: p.validos ?? 0, avisos: 0, motivo: p.nota ?? undefined, documento: p.documento ? { tipo: p.documento.tipo, enviadoEm: dia(p.documento.enviadoEm)! } : undefined };
}

export async function listarPesquisadores(): Promise<Pesquisador[]> {
  return (await ler<PesquisadorApi[]>("/admin/pesquisadores", [])).map(doPesquisador);
}

export async function obterPesquisador(id: string): Promise<{ pesquisador: Pesquisador; documentoNumero: string | null; documentoNome: string | null } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await lerApi<PesquisadorApi & { documento: { tipo: string; nome: string; numero: string; enviadoEm: string } | null }>(`/admin/pesquisadores/${id}`);
  if (!r.ok) return null;
  return { pesquisador: doPesquisador(r.dados), documentoNumero: r.dados.documento?.numero ?? null, documentoNome: r.dados.documento?.nome ?? null };
}

/* -------------------------------------------------------- Triagem e disputas */

type FilaApi = { id: string; codigo: string; titulo: string; organizacao: string; pesquisador: string; gravidadeSugerida: PedidoTriagem["gravidadeSugerida"]; enviadoEm: string; fila: PedidoTriagem["estado"]; analista: string | null };

export async function listarTriagem(): Promise<PedidoTriagem[]> {
  return (await ler<FilaApi[]>("/admin/triagem", [])).map((t) => ({ id: t.id, relatorioId: t.codigo, titulo: t.titulo, organizacaoId: "", organizacaoNome: t.organizacao, pesquisador: t.pesquisador, gravidadeSugerida: t.gravidadeSugerida, recebidoEm: dia(t.enviadoEm)!, estado: t.fila, analista: t.analista ?? undefined }));
}

type DisputaApi = { id: string; codigo: string; relatorio: string; titulo: string; organizacao: string; organizacaoId: string; pesquisador: string; gravidade: Disputa["gravidade"]; aberta: Disputa["aberta"]; motivo: string; estado: Disputa["estado"]; abertaEm: string; responsavel: string | null; valor: number | null };

export async function listarDisputas(): Promise<Disputa[]> {
  return (await ler<DisputaApi[]>("/admin/disputas", [])).map((d) => ({ id: d.id, codigo: d.codigo, relatorioId: d.relatorio, titulo: d.titulo, organizacaoId: d.organizacaoId, organizacaoNome: d.organizacao, pesquisador: d.pesquisador, gravidade: d.gravidade, aberta: d.aberta, motivo: d.motivo, estado: d.estado, abertaEm: dia(d.abertaEm)!, responsavel: d.responsavel ?? undefined, valor: d.valor ?? undefined }));
}

/* -------------------------------------------------------------------- Financeiro */

type PagamentoApi = { id: string; codigo: string; relatorio: string; organizacao: string; organizacaoId: string; pesquisador: string; valor: number; metodo: "mpesa" | "emola" | "transferencia" | null; estado: string; erro: string | null; data: string };
const METODOS = { mpesa: "M-Pesa", emola: "e-Mola", transferencia: "Transferência" } as const;

export async function listarPagamentos(): Promise<PagamentoPesquisador[]> {
  const lista = await ler<PagamentoApi[]>("/admin/pagamentos", []);
  // A equipa só trata o que a organização já aprovou.
  return lista
    .filter((p) => ["pendente", "processando", "processado", "falhado"].includes(p.estado))
    .map((p) => ({ id: p.id, codigo: p.codigo, pesquisador: p.pesquisador, relatorioId: p.relatorio, organizacaoId: p.organizacaoId, organizacaoNome: p.organizacao, valor: p.valor, metodo: p.metodo ? METODOS[p.metodo] : "-", estado: p.estado === "processado" ? "processado" : p.estado === "falhado" ? "falhado" : "pendente", data: dia(p.data)!, erro: p.erro ?? undefined }));
}

type FaturaApi = { id: string; codigo: string; organizacao: string; descricao: string; valor: number; emitidaEm: string; vence: string; estado: Fatura["estado"] };

export async function listarFaturas(): Promise<Fatura[]> {
  return (await ler<FaturaApi[]>("/admin/faturas", [])).map((f) => ({ id: f.id, codigo: f.codigo, organizacaoId: "", organizacaoNome: f.organizacao, descricao: f.descricao, valor: f.valor, emitidaEm: dia(f.emitidaEm)!, vence: dia(f.vence)!, estado: f.estado }));
}

/* ------------------------------------------------------------------------ Suporte */

type PedidoApi = { id: string; codigo: string; assunto: string; categoria: string; estado: PedidoSuporte["estado"]; abertoEm: string; de: { tipo: "empresa" | "pesquisador"; nome: string; organizacao?: string | null }; responsavel: string | null; mensagens?: { id: string; autor: "cliente" | "equipa"; nome: string | null; texto: string; data: string }[] };
const CATEGORIAS: Record<string, PedidoSuporte["categoria"]> = { conta: "Conta", pagamentos: "Pagamentos", programa: "Programa", relatorio: "Relatório", outro: "Outro" };

function doPedido(p: PedidoApi): PedidoSuporte {
  return {
    id: p.id,
    codigo: p.codigo,
    assunto: p.assunto,
    de: { tipo: p.de.tipo, nome: p.de.organizacao ? `${p.de.nome} (${p.de.organizacao})` : p.de.nome },
    categoria: CATEGORIAS[p.categoria] ?? "Outro",
    estado: p.estado,
    aberto: dia(p.abertoEm)!,
    responsavel: p.responsavel ?? undefined,
    mensagens: (p.mensagens ?? []).map((m) => ({ autor: m.autor, nome: m.nome ?? "Equipa", texto: m.texto, data: dia(m.data)! })),
  };
}

export async function listarPedidos(): Promise<PedidoSuporte[]> {
  return (await ler<PedidoApi[]>("/admin/suporte", [])).map(doPedido);
}

export async function obterPedido(id: string): Promise<PedidoSuporte | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await lerApi<PedidoApi>(`/admin/suporte/${id}`);
  return r.ok ? doPedido(r.dados) : null;
}

/* ------------------------------------------------------- Equipa e auditoria */

type MembroApi = { id: string; nome: string; email: string; funcao: FuncaoInterna; doisPassos: boolean; ultimoAcesso: string | null; estado: MembroInterno["estado"] };

export async function listarEquipa(): Promise<MembroInterno[]> {
  return (await ler<MembroApi[]>("/admin/equipa", [])).map((m) => ({ id: m.id, nome: m.nome, email: m.email, funcao: m.funcao, doisPassos: m.doisPassos, ultimoAcesso: m.ultimoAcesso ? horaLocal(m.ultimoAcesso) : "", estado: m.estado }));
}

type AuditoriaApi = { id: string; quando: string; quem: string | null; descricao: string; alvo: string; tipo: EventoAuditoria["tipo"]; ip: string | null };

export async function listarAuditoria(): Promise<EventoAuditoria[]> {
  const r = await ler<{ itens: AuditoriaApi[] }>("/admin/auditoria?limite=200", { itens: [] });
  return r.itens.map((a) => {
    const [entidade, id = ""] = a.alvo.split(":");
    return { id: a.id, quando: horaLocal(a.quando), quem: a.quem ?? "Sistema", acao: a.descricao, alvo: `${entidade} ${id.slice(0, 8)}`, tipo: a.tipo, ip: a.ip ?? "-" };
  });
}


/* ------------------------------------------------------- Alterações a programas ativos */

export type AlteracaoPendente = { id: string; programaId: string; programa: string; organizacao: string; organizacaoId: string; criadaEm: string };

export type AtivoDaAlteracao = { nome: string; identificador: string; tipo: string; gravidadeMax: string; dominioValidado?: boolean };

export type DadosDoPrograma = {
  nome?: string | null;
  resumo?: string | null;
  objetivos?: string | null;
  inicio?: string | null;
  fim?: string | null;
  foraDeEscopo?: string | null;
  permitidas?: string[] | null;
  proibidas?: string[] | null;
  regras?: string | null;
  divulgacao?: string | null;
  recompensas?: Record<"critica" | "alta" | "media" | "baixa", { min: number; max: number }> | null;
  elegibilidade?: string | null;
  acesso?: string | null;
  declaracaoAutoridade?: boolean | null;
  ativos?: AtivoDaAlteracao[];
};

export type AlteracaoDetalhe = {
  id: string;
  estado: "pendente" | "aprovada" | "rejeitada" | "cancelada";
  criadaEm: string;
  organizacao: string;
  programa: DadosDoPrograma & { id: string; estado: string; nome: string };
  proposta: DadosDoPrograma;
  ativosNovos: string[];
};

export async function listarAlteracoes(): Promise<AlteracaoPendente[]> {
  return ler<AlteracaoPendente[]>("/admin/alteracoes", []);
}

export async function obterAlteracao(id: string): Promise<AlteracaoDetalhe | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await lerApi<AlteracaoDetalhe>(`/admin/alteracoes/${id}`);
  return r.ok ? r.dados : null;
}
