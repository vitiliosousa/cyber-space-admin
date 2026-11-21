/** DADOS DE EXEMPLO da administração. Pessoas, empresas e valores são inventados. */

export const equipaAtual = { nome: "Ana Macamo", funcao: "Super-administradora", email: "ana.macamo@cyberspace.co.mz" };

/** Hoje, em ISO (AAAA-MM-DD). Lê-se na hora, por isso só se usa em ecrãs que já esperam pela sessão. */
export const hoje = () => new Date().toISOString().slice(0, 10);

export function diasDesde(data: string, referencia = hoje()) {
  return Math.round((new Date(`${referencia}T12:00:00Z`).getTime() - new Date(`${data}T12:00:00Z`).getTime()) / 86_400_000);
}

export function haDias(data: string) {
  const d = diasDesde(data);
  return d <= 0 ? "hoje" : d === 1 ? "há 1 dia" : `há ${d} dias`;
}

/* ---------------------------------------------------------------- Organizações */

export type EstadoOrganizacao = "verificada" | "em-analise" | "por-verificar" | "rejeitada" | "suspensa";

export const estadosOrganizacao: Record<EstadoOrganizacao, { label: string; estilo: string }> = {
  verificada: { label: "Verificada", estilo: "bg-green-50 text-green-800" },
  "em-analise": { label: "Em análise", estilo: "bg-blue-50 text-blue-800" },
  "por-verificar": { label: "Por verificar", estilo: "bg-amber-50 text-amber-900" },
  rejeitada: { label: "Rejeitada", estilo: "bg-rose-50 text-rose-800" },
  suspensa: { label: "Suspensa", estilo: "bg-slate-100 text-slate-700" },
};

export type PassoVerificacao = { chave: "dados" | "dominios" | "representante" | "prova-adicional"; rotulo: string; texto: string; feito: boolean };

export type Organizacao = {
  id: string;
  /** Muda quando o logótipo muda; nulo se a organização não tem. */
  logoVersao?: number | null;
  nome: string;
  setor: string;
  estado: EstadoOrganizacao;
  registadaEm: string;
  /** Quando pediu a verificação, se está em análise. */
  pedidoEm?: string;
  /** Sectores com mais risco (finanças, energia) pedem uma prova adicional na verificação. */
  risco: "normal" | "alto";
  nuit: string;
  website: string;
  contacto: string;
  representante: { nome: string; cargo: string };
  programas: number;
  passos: PassoVerificacao[];
  nota?: string;
};

function passos(feitos: number, risco: "normal" | "alto" = "normal"): PassoVerificacao[] {
  const base: Omit<PassoVerificacao, "feito">[] = [
    { chave: "dados", rotulo: "Dados da organização", texto: "Nome, sector e site coincidem com a organização." },
    { chave: "dominios", rotulo: "Domínios", texto: "Prova de que controla os domínios dos ativos." },
    { chave: "representante", rotulo: "Representante autorizado", texto: "Pode autorizar testes de segurança em nome da organização." },
  ];
  if (risco === "alto") base.push({ chave: "prova-adicional", rotulo: "Prova adicional", texto: "Declaração, feita na plataforma, de que a administração autoriza os programas e indica quem responde a incidentes." });
  return base.map((p, i) => ({ ...p, feito: i < feitos }));
}

export const organizacoes: Organizacao[] = [
  { id: "vodacom", nome: "Vodacom Moçambique", setor: "Telecomunicações", estado: "verificada", registadaEm: "2025-03-10", risco: "normal", nuit: "400123456", website: "vodacom.co.mz", contacto: "seguranca@vodacom.co.mz", representante: { nome: "Marta Cossa", cargo: "Responsável de segurança" }, programas: 3, passos: passos(4) },
  { id: "movitel", nome: "Movitel", setor: "Telecomunicações", estado: "verificada", registadaEm: "2025-05-22", risco: "normal", nuit: "400234567", website: "movitel.co.mz", contacto: "ciso@movitel.co.mz", representante: { nome: "Rui Machava", cargo: "Diretor de tecnologia" }, programas: 2, passos: passos(4) },
  { id: "bvm", nome: "Bolsa de Valores de Moçambique", setor: "Finanças", estado: "verificada", registadaEm: "2025-08-04", risco: "alto", nuit: "400345678", website: "bvm.co.mz", contacto: "ti@bvm.co.mz", representante: { nome: "Ana Tembe", cargo: "Diretora de sistemas" }, programas: 2, passos: passos(5, "alto") },
  { id: "zap", nome: "ZAP", setor: "Televisão", estado: "em-analise", registadaEm: "2026-11-03", pedidoEm: "2026-11-12", risco: "normal", nuit: "400456789", website: "zap.co.mz", contacto: "seguranca@zap.co.mz", representante: { nome: "Sérgio Langa", cargo: "Responsável de segurança" }, programas: 2, passos: passos(2), nota: "Falta provar o controlo do domínio *.zap.co.mz." },
  { id: "cdm", nome: "CDM", setor: "Bebidas", estado: "em-analise", registadaEm: "2026-11-06", pedidoEm: "2026-11-14", risco: "normal", nuit: "400567890", website: "cdm.co.mz", contacto: "ti@cdm.co.mz", representante: { nome: "Helena Sitoe", cargo: "Diretora de TI" }, programas: 1, passos: passos(3) },
  { id: "enh", nome: "ENH", setor: "Energia", estado: "por-verificar", registadaEm: "2026-11-09", risco: "alto", nuit: "400678901", website: "enh.co.mz", contacto: "seguranca@enh.co.mz", representante: { nome: "Paulo Nhaca", cargo: "Gestor de risco" }, programas: 0, passos: passos(1, "alto") },
  { id: "coca-cola", nome: "Coca-Cola Moçambique", setor: "Bebidas", estado: "por-verificar", registadaEm: "2026-11-15", risco: "normal", nuit: "400789012", website: "cocacola.co.mz", contacto: "digital@cocacola.co.mz", representante: { nome: "Carla Mondlane", cargo: "Diretora digital" }, programas: 0, passos: passos(0) },
  { id: "mcel", nome: "mcel", setor: "Telecomunicações", estado: "suspensa", registadaEm: "2025-07-15", risco: "normal", nuit: "400890123", website: "mcel.co.mz", contacto: "seguranca@mcel.co.mz", representante: { nome: "Vasco Bila", cargo: "Diretor de tecnologia" }, programas: 1, passos: passos(4), nota: "Suspensa por recompensas por pagar há mais de 60 dias." },
];

/** O endereço do logótipo da organização, ou vazio se não tem (e se mostram as iniciais). A versão muda com o logótipo. */
export function logoDe(organizacaoId: string, versao?: number | null) {
  return versao ? `/logos/${organizacaoId}/${versao}` : "";
}

export function getOrganizacao(id: string) {
  return organizacoes.find((o) => o.id === id);
}

/* -------------------------------------------------------------------- Programas */

export type EstadoPrograma = "rascunho" | "pendente" | "ativo" | "pausado" | "concluido" | "arquivado";

export const estadosPrograma: Record<EstadoPrograma, { label: string; estilo: string }> = {
  rascunho: { label: "Rascunho", estilo: "bg-slate-100 text-slate-800" },
  pendente: { label: "Pendente de aprovação", estilo: "bg-blue-50 text-blue-800" },
  ativo: { label: "Ativo", estilo: "bg-green-50 text-green-800" },
  pausado: { label: "Pausado", estilo: "bg-amber-50 text-amber-900" },
  concluido: { label: "Concluído", estilo: "bg-violet-50 text-violet-800" },
  arquivado: { label: "Arquivado", estilo: "bg-slate-100 text-slate-600" },
};

export type AtivoPrograma = { id?: string; nome: string; identificador: string; tipo: string; dominioValidado: boolean };

/** controlado: novo, só por convite, a caminho de público; privado: privado de propósito; publico: aberto. */
export type FasePrograma = "controlado" | "privado" | "publico";


export type Divulgacao = "coordenada" | "apos-correcao" | "nao";

export const politicasDivulgacao: Record<Divulgacao, { label: string; texto: string }> = {
  coordenada: { label: "Coordenada", texto: "O pesquisador só pode divulgar depois de a empresa autorizar." },
  "apos-correcao": { label: "Depois da correção", texto: "O pesquisador pode divulgar quando a vulnerabilidade estiver corrigida." },
  nao: { label: "Não permitida", texto: "O pesquisador não pode divulgar a vulnerabilidade em nenhum caso." },
};

export type Desempenho = { eficiencia: number; primeiraResposta: string; ateResolucao: string };

export type Programa = {
  /** Muda quando o logótipo da organização muda; nulo se não tem. */
  logoVersao?: number | null;
  /** Uma frase sobre o programa, como aparece aos pesquisadores. */
  resumo?: string;
  /** O que a empresa mais quer encontrar. */
  foco?: string[];
  /** Intervalo de recompensa por gravidade, em MZN. */
  recompensas?: Record<"critica" | "alta" | "media" | "baixa", [number, number]>;
  desempenho?: Desempenho;
  /** O que o pesquisador pode fazer depois de reportar. */
  divulgacao?: Divulgacao;
  fase?: FasePrograma;
  /** Relatórios já aceites, recusados ou duplicados. Por omissão, todos os recebidos. */
  tratados?: number;
  /** Média de dias até à primeira resposta. */
  respostaDias?: number;
  id: string;
  nome: string;
  organizacaoId: string;
  estado: EstadoPrograma;
  tipo: "publico" | "privado";
  /** Quando a empresa o submeteu para aprovação. */
  submetidoEm?: string;
  criadoEm: string;
  ativos: AtivoPrograma[];
  recompensa: { min: number; max: number };
  orcamento: number;
  pago: number;
  relatorios: number;
  pesquisadores: number;
  /** Declarou ter autoridade para autorizar testes nos ativos. */
  declaracaoAutoridade: boolean;
  /** Frases de alerta que a equipa deve ver antes de aprovar. */
  alertas?: string[];
  /** Nome da organização, nos programas que vêm da API. */
  organizacaoNome?: string;
};

const programasBase: Programa[] = [
  { id: "portal", nome: "Portal de clientes e aplicações móveis", organizacaoId: "vodacom", estado: "ativo", tipo: "publico", criadoEm: "2025-03-12", ativos: [{ nome: "Portal de clientes", identificador: "conta.vodacom.co.mz", tipo: "Aplicação web", dominioValidado: true }, { nome: "API de clientes", identificador: "api.vodacom.co.mz/v2", tipo: "API", dominioValidado: true }, { nome: "Aplicação Android", identificador: "mz.co.vodacom.myvodacom", tipo: "Android", dominioValidado: true }], recompensa: { min: 2000, max: 150000 }, orcamento: 700000, pago: 520000, relatorios: 23, pesquisadores: 11, declaracaoAutoridade: true },
  { id: "pagamentos-moveis", nome: "Pagamentos móveis", organizacaoId: "vodacom", estado: "ativo", tipo: "privado", criadoEm: "2026-02-08", ativos: [{ nome: "API de pagamentos", identificador: "pagamentos.vodacom.co.mz/api", tipo: "API", dominioValidado: true }], recompensa: { min: 4000, max: 300000 }, orcamento: 900000, pago: 412000, relatorios: 9, pesquisadores: 5, declaracaoAutoridade: true },
  { id: "cloud", nome: "Vodacom Cloud", organizacaoId: "vodacom", estado: "ativo", tipo: "privado", criadoEm: "2026-10-18", ativos: [{ nome: "Consola Cloud", identificador: "cloud.vodacom.co.mz", tipo: "Aplicação web", dominioValidado: true }, { nome: "API Cloud", identificador: "api.cloud.vodacom.co.mz", tipo: "API", dominioValidado: true }], recompensa: { min: 3000, max: 200000 }, orcamento: 250000, pago: 66000, relatorios: 5, tratados: 4, respostaDias: 2, pesquisadores: 7, declaracaoAutoridade: true },
  { id: "business", nome: "Vodacom Business", organizacaoId: "vodacom", estado: "pendente", tipo: "publico", submetidoEm: "2026-11-11", criadoEm: "2026-11-02", ativos: [{ nome: "Portal Business", identificador: "business.vodacom.co.mz", tipo: "Aplicação web", dominioValidado: true }], recompensa: { min: 2000, max: 150000 }, orcamento: 300000, pago: 0, relatorios: 0, pesquisadores: 0, declaracaoAutoridade: true },
  { id: "zap-conta", nome: "Conta de subscritor e aplicação de televisão", organizacaoId: "zap", estado: "pendente", tipo: "publico", submetidoEm: "2026-11-13", criadoEm: "2026-11-05", ativos: [{ nome: "Conta de subscritor", identificador: "conta.zap.co.mz", tipo: "Aplicação web", dominioValidado: true }, { nome: "Domínios da ZAP", identificador: "*.zap.co.mz", tipo: "Domínio com wildcard", dominioValidado: false }, { nome: "Aplicação de televisão", identificador: "mz.co.zap.tv", tipo: "Android", dominioValidado: true }], recompensa: { min: 1500, max: 120000 }, orcamento: 400000, pago: 0, relatorios: 0, pesquisadores: 0, declaracaoAutoridade: true, alertas: ["O domínio *.zap.co.mz ainda não foi validado.", "A organização ainda está em análise."] },
  { id: "cdm-distribuidores", nome: "Portal de distribuidores", organizacaoId: "cdm", estado: "pendente", tipo: "privado", submetidoEm: "2026-11-15", criadoEm: "2026-11-09", ativos: [{ nome: "Portal de distribuidores", identificador: "distribuidores.cdm.co.mz", tipo: "Aplicação web", dominioValidado: true }, { nome: "API de encomendas", identificador: "api.cdm.co.mz/encomendas", tipo: "API", dominioValidado: true }], recompensa: { min: 2000, max: 90000 }, orcamento: 250000, pago: 0, relatorios: 0, pesquisadores: 0, declaracaoAutoridade: true, alertas: ["A organização ainda está em análise (falta o representante autorizado)."] },
  { id: "movitel-clientes", nome: "Área de clientes e revendedores", organizacaoId: "movitel", estado: "ativo", tipo: "privado", criadoEm: "2025-06-02", ativos: [{ nome: "Área de clientes", identificador: "app.movitel.co.mz", tipo: "Aplicação web", dominioValidado: true }, { nome: "Portal de revendedores", identificador: "revendedores.movitel.co.mz", tipo: "Aplicação web", dominioValidado: true }], recompensa: { min: 2000, max: 120000 }, orcamento: 500000, pago: 238000, relatorios: 14, pesquisadores: 11, declaracaoAutoridade: true, respostaDias: 2 },
  { id: "bvm-portal", nome: "Portal de informação e área de membros", organizacaoId: "bvm", estado: "ativo", tipo: "privado", criadoEm: "2025-08-20", ativos: [{ nome: "Portal de informação", identificador: "www.bvm.co.mz", tipo: "Aplicação web", dominioValidado: true }, { nome: "Área de membros", identificador: "membros.bvm.co.mz", tipo: "Aplicação web", dominioValidado: true }], recompensa: { min: 3000, max: 200000 }, orcamento: 600000, pago: 175000, relatorios: 8, pesquisadores: 6, declaracaoAutoridade: true },
  { id: "mcel-servicos", nome: "Portal de serviços e recargas", organizacaoId: "mcel", estado: "pausado", tipo: "publico", criadoEm: "2025-07-18", ativos: [{ nome: "Portal de serviços", identificador: "mcel.co.mz", tipo: "Aplicação web", dominioValidado: true }, { nome: "API de recargas", identificador: "api.mcel.co.mz/recargas", tipo: "API", dominioValidado: true }], recompensa: { min: 1500, max: 80000 }, orcamento: 200000, pago: 140000, relatorios: 12, pesquisadores: 8, declaracaoAutoridade: true },
  { id: "campanha-2025", nome: "Campanha de verão 2025", organizacaoId: "vodacom", estado: "concluido", tipo: "publico", criadoEm: "2025-11-01", ativos: [{ nome: "Portal de recargas", identificador: "recargas.vodacom.co.mz", tipo: "Aplicação web", dominioValidado: true }], recompensa: { min: 1500, max: 120000 }, orcamento: 100000, pago: 96000, relatorios: 7, pesquisadores: 5, declaracaoAutoridade: true },
];


const programasNovos: Programa[] = [
  { id: "movitel-mobile", nome: "Aplicações móveis Movitel", organizacaoId: "movitel", estado: "ativo", tipo: "publico", criadoEm: "2026-03-09", ativos: [{ nome: "Aplicação para Android", identificador: "mz.co.movitel.mymovitel", tipo: "Android", dominioValidado: true }, { nome: "Aplicação para iOS", identificador: "mz.co.movitel.mymovitel", tipo: "iOS", dominioValidado: true }], recompensa: { min: 1500, max: 100000 }, orcamento: 300000, pago: 118000, relatorios: 11, pesquisadores: 9, declaracaoAutoridade: true },
  { id: "bvm-negociacao", nome: "Plataforma de negociação", organizacaoId: "bvm", estado: "pausado", tipo: "privado", criadoEm: "2026-01-14", ativos: [{ nome: "API de ordens", identificador: "ordens.bvm.co.mz/api", tipo: "API", dominioValidado: true }], recompensa: { min: 5000, max: 250000 }, orcamento: 500000, pago: 90000, relatorios: 4, pesquisadores: 3, declaracaoAutoridade: true },
  { id: "zap-parceiros", nome: "Portal de parceiros", organizacaoId: "zap", estado: "rascunho", tipo: "privado", criadoEm: "2026-11-16", ativos: [{ nome: "Portal de parceiros", identificador: "parceiros.zap.co.mz", tipo: "Aplicação web", dominioValidado: false }], recompensa: { min: 1500, max: 60000 }, orcamento: 120000, pago: 0, relatorios: 0, pesquisadores: 0, declaracaoAutoridade: false },
];

const pagas = (c: [number, number], a: [number, number], m: [number, number], b: [number, number]) => ({ critica: c, alta: a, media: m, baixa: b });

/** Texto, foco, recompensas e desempenho de cada programa, como os pesquisadores os veem. */
const detalhes: Record<string, Pick<Programa, "resumo" | "foco" | "recompensas" | "desempenho">> = {
  portal: { resumo: "O portal de clientes, a API e as aplicações móveis da Vodacom.", foco: ["Acesso a contas de outros clientes", "Contornar a autenticação ou os dois passos", "Fuga de dados pessoais em respostas da API"], recompensas: pagas([80000, 150000], [30000, 80000], [10000, 30000], [2000, 10000]), desempenho: { eficiencia: 94, primeiraResposta: "6 horas", ateResolucao: "18 dias" } },
  "pagamentos-moveis": { resumo: "A aplicação e a API de pagamentos móveis. Só por convite, por envolver dinheiro dos clientes.", foco: ["Alterar ou desviar pagamentos", "Contornar limites e validações de saldo", "Acesso a dados de transações de outros clientes"], recompensas: pagas([150000, 300000], [60000, 150000], [20000, 60000], [4000, 20000]), desempenho: { eficiencia: 97, primeiraResposta: "3 horas", ateResolucao: "9 dias" } },
  cloud: { resumo: "A consola e a API da nova plataforma de computação em nuvem. Em lançamento controlado.", foco: ["Isolamento entre clientes", "Gestão de chaves e credenciais", "Escalada de privilégios na consola"], recompensas: pagas([100000, 200000], [40000, 100000], [15000, 40000], [3000, 15000]), desempenho: { eficiencia: 100, primeiraResposta: "1 dia", ateResolucao: "6 dias" } },
  business: { resumo: "O portal para empresas clientes da Vodacom.", foco: ["Acesso a faturas e contratos de outras empresas", "Gestão de utilizadores da empresa"], recompensas: pagas([80000, 150000], [30000, 80000], [10000, 30000], [2000, 10000]) },
  "zap-conta": { resumo: "A conta de subscritor e a aplicação de televisão da ZAP.", foco: ["Partilha ou roubo de subscrições", "Acesso a dados de pagamento"], recompensas: pagas([60000, 120000], [20000, 60000], [6000, 20000], [1500, 6000]) },
  "cdm-distribuidores": { resumo: "O portal de distribuidores e a API de encomendas da CDM. Só por convite.", foco: ["Alterar encomendas de outros distribuidores", "Acesso a preços e contratos confidenciais"], recompensas: pagas([50000, 90000], [20000, 50000], [6000, 20000], [2000, 6000]) },
  "movitel-clientes": { resumo: "A área de clientes e o portal de revendedores da Movitel.", foco: ["Controlo de acesso no portal de revendedores", "Contornar a autenticação de clientes", "Fuga de dados pessoais"], recompensas: pagas([70000, 120000], [30000, 70000], [8000, 30000], [2000, 8000]), desempenho: { eficiencia: 91, primeiraResposta: "8 horas", ateResolucao: "21 dias" } },
  "movitel-mobile": { resumo: "As aplicações para Android e iOS da Movitel.", foco: ["Armazenamento inseguro de dados na aplicação", "Contornar a verificação da conta", "Ligações e comunicação sem cifra"], recompensas: pagas([60000, 100000], [25000, 60000], [6000, 25000], [1500, 6000]), desempenho: { eficiencia: 88, primeiraResposta: "12 horas", ateResolucao: "25 dias" } },
  "bvm-portal": { resumo: "O portal de informação e a área de membros da Bolsa de Valores de Moçambique. Só por convite.", foco: ["Acesso à área de membros", "Manipulação de comunicados e dados de mercado", "Fuga de dados de emitentes"], recompensas: pagas([100000, 200000], [40000, 100000], [10000, 40000], [3000, 10000]), desempenho: { eficiencia: 95, primeiraResposta: "5 horas", ateResolucao: "14 dias" } },
  "bvm-negociacao": { resumo: "A API de ordens da plataforma de negociação. Pausado enquanto a empresa corrige falhas críticas.", foco: ["Manipular ordens ou preços", "Contornar limites de negociação"], recompensas: pagas([150000, 250000], [60000, 150000], [15000, 60000], [5000, 15000]), desempenho: { eficiencia: 89, primeiraResposta: "4 horas", ateResolucao: "30 dias" } },
  "mcel-servicos": { resumo: "O portal de serviços e a API de recargas da mcel. Pausado por recompensas em atraso.", foco: ["Recargas sem pagamento", "Acesso a contas de clientes"], recompensas: pagas([50000, 80000], [20000, 50000], [5000, 20000], [1500, 5000]), desempenho: { eficiencia: 61, primeiraResposta: "2 dias", ateResolucao: "45 dias" } },
  "campanha-2025": { resumo: "Programa temporário para a campanha de recargas. Terminou em março de 2026.", foco: ["Abuso de promoções", "Recargas duplicadas"], recompensas: pagas([60000, 120000], [20000, 60000], [8000, 20000], [1500, 8000]), desempenho: { eficiencia: 100, primeiraResposta: "7 horas", ateResolucao: "12 dias" } },
  "zap-parceiros": { resumo: "O portal usado pelos parceiros comerciais da ZAP. Ainda em rascunho.", foco: ["Acesso a contratos de outros parceiros"], recompensas: pagas([30000, 60000], [10000, 30000], [4000, 10000], [1500, 4000]) },
};

const divulgacoes: Record<string, Divulgacao> = {
  portal: "apos-correcao",
  "pagamentos-moveis": "nao",
  cloud: "coordenada",
  business: "apos-correcao",
  "zap-conta": "coordenada",
  "cdm-distribuidores": "coordenada",
  "movitel-clientes": "coordenada",
  "movitel-mobile": "apos-correcao",
  "bvm-portal": "nao",
  "bvm-negociacao": "nao",
  "mcel-servicos": "apos-correcao",
  "campanha-2025": "apos-correcao",
  "zap-parceiros": "coordenada",
};

export const programas: Programa[] = [...programasBase, ...programasNovos].map((p) => ({ ...p, ...detalhes[p.id], divulgacao: divulgacoes[p.id] }));

export const faseDe = (p: Programa): FasePrograma => p.fase ?? (p.tipo === "privado" ? "privado" : "publico");

export function getPrograma(id: string) {
  return programas.find((p) => p.id === id);
}

export const nomeOrganizacao = (id: string) => getOrganizacao(id)?.nome ?? id;

/* ---------------------------------------------------------------- Pesquisadores */

export type EstadoConta = "ativo" | "por-verificar" | "suspenso" | "banido";

export const estadosConta: Record<EstadoConta, { label: string; estilo: string }> = {
  ativo: { label: "Ativo", estilo: "bg-green-50 text-green-800" },
  "por-verificar": { label: "Por verificar", estilo: "bg-amber-50 text-amber-900" },
  suspenso: { label: "Suspenso", estilo: "bg-orange-50 text-orange-800" },
  banido: { label: "Banido", estilo: "bg-rose-50 text-rose-800" },
};

export type Pesquisador = {
  /** Identificador da conta. Nos dados da API, o nome mostra-se em `nome`. */
  handle: string;
  nome?: string;
  /** Só nos dados da API: não há país, nível nem pontos. */
  daApi?: boolean;
  pais: string;
  nivel: string;
  pontos: number;
  estado: EstadoConta;
  desde: string;
  relatorios: number;
  validos: number;
  /** Relatórios recusados por má conduta (spam, fora do âmbito, testes em dados reais). */
  avisos: number;
  motivo?: string;
  /** Pedido de verificação de identidade, quando a conta está por verificar. */
  documento?: { tipo: string; enviadoEm: string };
};

export const pesquisadores: Pesquisador[] = [
  { handle: "ninja_sec10", pais: "Moçambique", nivel: "Mestre", pontos: 1500, estado: "ativo", desde: "2025-03-14", relatorios: 41, validos: 33, avisos: 0 },
  { handle: "pemba_root27", pais: "Moçambique", nivel: "Mestre", pontos: 1354, estado: "ativo", desde: "2025-03-22", relatorios: 38, validos: 30, avisos: 0 },
  { handle: "savana_dev44", pais: "Moçambique", nivel: "Mestre", pontos: 1223, estado: "ativo", desde: "2025-04-02", relatorios: 35, validos: 27, avisos: 1 },
  { handle: "zambeze_hunter61", pais: "Moçambique", nivel: "Especialista", pontos: 1097, estado: "ativo", desde: "2025-05-09", relatorios: 30, validos: 24, avisos: 0 },
  { handle: "ilha_byte78", pais: "Moçambique", nivel: "Especialista", pontos: 991, estado: "ativo", desde: "2025-06-17", relatorios: 26, validos: 20, avisos: 0 },
  { handle: "mapi_hax15", pais: "Moçambique", nivel: "Especialista", pontos: 888, estado: "suspenso", desde: "2025-07-01", relatorios: 24, validos: 16, avisos: 3, motivo: "Testou ativos fora do âmbito de um programa privado." },
  { handle: "xai_bug32", pais: "Brasil", nivel: "Especialista", pontos: 803, estado: "ativo", desde: "2025-08-12", relatorios: 22, validos: 17, avisos: 0 },
  { handle: "kwanza_sec23", pais: "Angola", nivel: "Caçador", pontos: 612, estado: "ativo", desde: "2025-09-30", relatorios: 18, validos: 12, avisos: 1 },
  { handle: "tete_byte39", pais: "Moçambique", nivel: "Caçador", pontos: 455, estado: "ativo", desde: "2026-01-19", relatorios: 14, validos: 9, avisos: 0 },
  { handle: "baobab_root44", pais: "Moçambique", nivel: "Explorador", pontos: 240, estado: "ativo", desde: "2026-04-08", relatorios: 9, validos: 5, avisos: 0 },
  { handle: "nacala_dev52", pais: "Moçambique", nivel: "Iniciante", pontos: 20, estado: "por-verificar", desde: "2026-11-14", relatorios: 0, validos: 0, avisos: 0, documento: { tipo: "Bilhete de identidade", enviadoEm: "2026-11-15" } },
  { handle: "spam_bot_91", pais: "Outro", nivel: "Iniciante", pontos: 0, estado: "banido", desde: "2026-09-02", relatorios: 27, validos: 0, avisos: 8, motivo: "Envio em massa de relatórios copiados, sem prova." },
];

export function getPesquisador(handle: string) {
  return pesquisadores.find((p) => p.handle === handle);
}

/* ------------------------------------------------------------------- Relatórios */

export type EstadoDisputa = "aberta" | "em-analise" | "resolvida";

export const estadosDisputa: Record<EstadoDisputa, { label: string; estilo: string }> = {
  aberta: { label: "Aberta", estilo: "bg-amber-50 text-amber-900" },
  "em-analise": { label: "Em análise", estilo: "bg-blue-50 text-blue-800" },
  resolvida: { label: "Resolvida", estilo: "bg-green-50 text-green-800" },
};

export type Disputa = {
  id: string;
  codigo?: string;
  organizacaoNome?: string;
  relatorioId: string;
  titulo: string;
  organizacaoId: string;
  pesquisador: string;
  gravidade: "critica" | "alta" | "media" | "baixa";
  aberta: "pesquisador" | "empresa";
  motivo: string;
  estado: EstadoDisputa;
  abertaEm: string;
  responsavel?: string;
  valor?: number;
};

export const disputas: Disputa[] = [
  { id: "D-014", relatorioId: "VM-0284", titulo: "Cabeçalhos de segurança em falta", organizacaoId: "vodacom", pesquisador: "mapi_hax15", gravidade: "baixa", aberta: "pesquisador", motivo: "O pesquisador discorda da recusa: diz que o problema permite roubo de sessão.", estado: "aberta", abertaEm: "2026-11-15" },
  { id: "D-013", relatorioId: "MV-0112", titulo: "Controlo de acesso em falta na área de revendedores", organizacaoId: "movitel", pesquisador: "pemba_root27", gravidade: "alta", aberta: "pesquisador", motivo: "Recompensa aprovada abaixo do intervalo do programa para gravidade alta.", estado: "em-analise", abertaEm: "2026-11-10", responsavel: "Rui Machava", valor: 45000 },
  { id: "D-012", relatorioId: "BV-0044", titulo: "Injeção SQL na pesquisa de comunicados", organizacaoId: "bvm", pesquisador: "ninja_sec10", gravidade: "critica", aberta: "empresa", motivo: "A empresa diz que o relatório é duplicado de BV-0039, mas o pesquisador enviou-o primeiro.", estado: "em-analise", abertaEm: "2026-11-07", responsavel: "Ana Macamo", valor: 150000 },
  { id: "D-011", relatorioId: "VM-0272", titulo: "Mensagem de erro com informação interna", organizacaoId: "vodacom", pesquisador: "indico_dev31", gravidade: "media", aberta: "pesquisador", motivo: "Marcado como duplicado sem indicar o relatório original.", estado: "resolvida", abertaEm: "2026-10-24", responsavel: "Marta Dias" },
  { id: "D-010", relatorioId: "MC-0031", titulo: "Recompensa por pagar há 75 dias", organizacaoId: "mcel", pesquisador: "kwanza_sec23", gravidade: "alta", aberta: "pesquisador", motivo: "A empresa aceitou o relatório mas não pagou a recompensa.", estado: "resolvida", abertaEm: "2026-09-02", responsavel: "Ana Macamo", valor: 40000 },
];

export type PedidoTriagem = {
  id: string;
  organizacaoNome?: string;
  pesquisador?: string;
  relatorioId: string;
  titulo: string;
  organizacaoId: string;
  gravidadeSugerida: "critica" | "alta" | "media" | "baixa";
  recebidoEm: string;
  estado: "na-fila" | "em-triagem" | "devolvido";
  analista?: string;
};

export const filaTriagem: PedidoTriagem[] = [
  { id: "T-088", relatorioId: "BV-0049", titulo: "Redirecionamento aberto no início de sessão de membros", organizacaoId: "bvm", gravidadeSugerida: "media", recebidoEm: "2026-11-16", estado: "na-fila" },
  { id: "T-087", relatorioId: "MV-0117", titulo: "Token de convite reutilizável", organizacaoId: "movitel", gravidadeSugerida: "alta", recebidoEm: "2026-11-15", estado: "na-fila" },
  { id: "T-086", relatorioId: "BV-0048", titulo: "Listagem de diretórios no servidor de documentos", organizacaoId: "bvm", gravidadeSugerida: "baixa", recebidoEm: "2026-11-14", estado: "em-triagem", analista: "Marta Dias" },
  { id: "T-085", relatorioId: "MV-0115", titulo: "IDOR no histórico de recargas", organizacaoId: "movitel", gravidadeSugerida: "alta", recebidoEm: "2026-11-13", estado: "em-triagem", analista: "Rui Machava" },
  { id: "T-084", relatorioId: "BV-0046", titulo: "XSS refletido na pesquisa de emitentes", organizacaoId: "bvm", gravidadeSugerida: "media", recebidoEm: "2026-11-11", estado: "devolvido", analista: "Marta Dias" },
];

/* -------------------------------------------------------------------- Financeiro */

export type EstadoPagamento = "pendente" | "processado" | "falhado";

export const estadosPagamento: Record<EstadoPagamento, { label: string; estilo: string }> = {
  pendente: { label: "Por processar", estilo: "bg-amber-50 text-amber-900" },
  processado: { label: "Processado", estilo: "bg-green-50 text-green-800" },
  falhado: { label: "Falhou", estilo: "bg-rose-50 text-rose-800" },
};

export type PagamentoPesquisador = {
  id: string;
  codigo?: string;
  organizacaoNome?: string;
  pesquisador: string;
  relatorioId: string;
  organizacaoId: string;
  valor: number;
  metodo: "M-Pesa" | "e-Mola" | "Transferência" | "-";
  estado: EstadoPagamento;
  data: string;
  erro?: string;
};

export const pagamentos: PagamentoPesquisador[] = [
  { id: "P-2041", pesquisador: "ninja_sec10", relatorioId: "VM-0287", organizacaoId: "vodacom", valor: 120000, metodo: "Transferência", estado: "pendente", data: "2026-11-16" },
  { id: "P-2040", pesquisador: "ilha_byte78", relatorioId: "VM-0290", organizacaoId: "vodacom", valor: 18000, metodo: "M-Pesa", estado: "pendente", data: "2026-11-16" },
  { id: "P-2039", pesquisador: "pemba_root27", relatorioId: "MV-0112", organizacaoId: "movitel", valor: 45000, metodo: "e-Mola", estado: "falhado", data: "2026-11-15", erro: "Número sem conta e-Mola ativa." },
  { id: "P-2038", pesquisador: "savana_dev44", relatorioId: "BV-0044", organizacaoId: "bvm", valor: 60000, metodo: "M-Pesa", estado: "processado", data: "2026-11-14" },
  { id: "P-2037", pesquisador: "zambeze_hunter61", relatorioId: "VM-0281", organizacaoId: "vodacom", valor: 45000, metodo: "Transferência", estado: "processado", data: "2026-11-12" },
  { id: "P-2036", pesquisador: "xai_bug32", relatorioId: "VM-0278", organizacaoId: "vodacom", valor: 3000, metodo: "Transferência", estado: "processado", data: "2026-11-10" },
  { id: "P-2035", pesquisador: "kwanza_sec23", relatorioId: "MC-0033", organizacaoId: "mcel", valor: 12000, metodo: "M-Pesa", estado: "processado", data: "2026-11-06" },
  { id: "P-2034", pesquisador: "tete_byte39", relatorioId: "MV-0109", organizacaoId: "movitel", valor: 9000, metodo: "e-Mola", estado: "processado", data: "2026-11-03" },
];

export const COMISSAO = 0.1;

export type EstadoFatura = "emitida" | "paga" | "atrasada";

export const estadosFatura: Record<EstadoFatura, { label: string; estilo: string }> = {
  emitida: { label: "Emitida", estilo: "bg-blue-50 text-blue-800" },
  paga: { label: "Paga", estilo: "bg-green-50 text-green-800" },
  atrasada: { label: "Atrasada", estilo: "bg-rose-50 text-rose-800" },
};

export type Fatura = {
  id: string;
  codigo?: string;
  organizacaoNome?: string;
  organizacaoId: string;
  descricao: string;
  valor: number;
  emitidaEm: string;
  vence: string;
  estado: EstadoFatura;
};

export const faturas: Fatura[] = [
  { id: "F-0318", organizacaoId: "vodacom", descricao: "Comissão de outubro (10%) e triagem", valor: 78500, emitidaEm: "2026-11-01", vence: "2026-11-30", estado: "emitida" },
  { id: "F-0317", organizacaoId: "movitel", descricao: "Comissão de outubro (10%) e triagem", valor: 41200, emitidaEm: "2026-11-01", vence: "2026-11-30", estado: "emitida" },
  { id: "F-0316", organizacaoId: "bvm", descricao: "Comissão de outubro (10%) e triagem", valor: 29800, emitidaEm: "2026-11-01", vence: "2026-11-30", estado: "paga" },
  { id: "F-0301", organizacaoId: "mcel", descricao: "Comissão de agosto (10%)", valor: 14000, emitidaEm: "2026-09-01", vence: "2026-09-30", estado: "atrasada" },
  { id: "F-0299", organizacaoId: "vodacom", descricao: "Comissão de setembro (10%) e triagem", valor: 66000, emitidaEm: "2026-10-01", vence: "2026-10-31", estado: "paga" },
];

/* ------------------------------------------------------------------------ Suporte */

export type EstadoPedido = "novo" | "em-curso" | "resolvido";

export const estadosPedido: Record<EstadoPedido, { label: string; estilo: string }> = {
  novo: { label: "Novo", estilo: "bg-amber-50 text-amber-900" },
  "em-curso": { label: "Em curso", estilo: "bg-blue-50 text-blue-800" },
  resolvido: { label: "Resolvido", estilo: "bg-green-50 text-green-800" },
};

export type PedidoSuporte = {
  id: string;
  codigo?: string;
  assunto: string;
  de: { tipo: "empresa" | "pesquisador"; nome: string };
  categoria: "Conta" | "Pagamentos" | "Programa" | "Relatório" | "Outro";
  estado: EstadoPedido;
  aberto: string;
  responsavel?: string;
  mensagens: { autor: "cliente" | "equipa"; nome: string; texto: string; data: string }[];
};

export const pedidos: PedidoSuporte[] = [
  {
    id: "S-210",
    assunto: "Não consigo receber por M-Pesa",
    de: { tipo: "pesquisador", nome: "pemba_root27" },
    categoria: "Pagamentos",
    estado: "novo",
    aberto: "2026-11-16",
    mensagens: [{ autor: "cliente", nome: "pemba_root27", texto: "O pagamento de 45 000 MZN falhou duas vezes. O número está certo mas usa e-Mola, não M-Pesa. Como mudo o método?", data: "2026-11-16" }],
  },
  {
    id: "S-209",
    assunto: "Dúvida sobre a validação do domínio",
    de: { tipo: "empresa", nome: "ZAP" },
    categoria: "Programa",
    estado: "em-curso",
    aberto: "2026-11-15",
    responsavel: "Marta Dias",
    mensagens: [
      { autor: "cliente", nome: "Sérgio Langa (ZAP)", texto: "Como provamos que controlamos *.zap.co.mz? Temos o domínio no registo da .mz.", data: "2026-11-15" },
      { autor: "equipa", nome: "Marta Dias", texto: "Pode acrescentar um registo TXT com o valor que enviámos por e-mail. Diga-nos quando estiver feito e validamos.", data: "2026-11-16" },
    ],
  },
  { id: "S-208", assunto: "Quero alterar o nome do utilizador", de: { tipo: "pesquisador", nome: "tete_byte39" }, categoria: "Conta", estado: "novo", aberto: "2026-11-14", mensagens: [{ autor: "cliente", nome: "tete_byte39", texto: "Posso mudar o meu nome de utilizador? Escrevi-o com um erro.", data: "2026-11-14" }] },
  { id: "S-207", assunto: "Relatório marcado como duplicado sem explicação", de: { tipo: "pesquisador", nome: "mapi_hax15" }, categoria: "Relatório", estado: "em-curso", aberto: "2026-11-13", responsavel: "Rui Machava", mensagens: [{ autor: "cliente", nome: "mapi_hax15", texto: "A empresa marcou o meu relatório como duplicado sem indicar qual é o original.", data: "2026-11-13" }] },
  { id: "S-206", assunto: "Como convidar a equipa de segurança?", de: { tipo: "empresa", nome: "Movitel" }, categoria: "Conta", estado: "resolvido", aberto: "2026-11-09", responsavel: "Marta Dias", mensagens: [{ autor: "cliente", nome: "Rui Machava (Movitel)", texto: "Onde convidamos mais pessoas da equipa?", data: "2026-11-09" }, { autor: "equipa", nome: "Marta Dias", texto: "Em Definições > Equipa. Só administradores podem convidar.", data: "2026-11-09" }] },
];

export function getPedido(id: string) {
  return pedidos.find((p) => p.id === id);
}

/* ---------------------------------------------------------------------- Auditoria */

export type EventoAuditoria = {
  id: string;
  quando: string;
  quem: string;
  acao: string;
  alvo: string;
  tipo: "aprovacao" | "conta" | "financeiro" | "acesso" | "configuracao";
  ip: string;
};

export const auditoria: EventoAuditoria[] = [
  { id: "A-912", quando: "2026-11-17T09:12", quem: "Ana Macamo", acao: "Iniciou sessão", alvo: "Administração", tipo: "acesso", ip: "197.218.x.x" },
  { id: "A-911", quando: "2026-11-16T17:40", quem: "Marta Dias", acao: "Respondeu ao pedido de suporte", alvo: "S-209", tipo: "conta", ip: "197.218.x.x" },
  { id: "A-910", quando: "2026-11-16T16:05", quem: "Rui Machava", acao: "Reencaminhou a triagem para a empresa", alvo: "T-084", tipo: "aprovacao", ip: "41.220.x.x" },
  { id: "A-909", quando: "2026-11-16T11:30", quem: "Carlos Uamusse", acao: "Marcou o pagamento como processado", alvo: "P-2038", tipo: "financeiro", ip: "41.220.x.x" },
  { id: "A-908", quando: "2026-11-15T15:22", quem: "Ana Macamo", acao: "Aprovou o programa", alvo: "Portal de distribuidores (CDM)", tipo: "aprovacao", ip: "197.218.x.x" },
  { id: "A-907", quando: "2026-11-15T10:48", quem: "Marta Dias", acao: "Pediu mais informação à organização", alvo: "ZAP", tipo: "aprovacao", ip: "197.218.x.x" },
  { id: "A-906", quando: "2026-11-14T14:02", quem: "Ana Macamo", acao: "Suspendeu o pesquisador", alvo: "mapi_hax15", tipo: "conta", ip: "197.218.x.x" },
  { id: "A-905", quando: "2026-11-14T09:30", quem: "Carlos Uamusse", acao: "Emitiu a fatura", alvo: "F-0318", tipo: "financeiro", ip: "41.220.x.x" },
  { id: "A-904", quando: "2026-11-13T17:15", quem: "Ana Macamo", acao: "Alterou a função de Rui Machava", alvo: "Analista de triagem", tipo: "configuracao", ip: "197.218.x.x" },
  { id: "A-903", quando: "2026-11-12T12:05", quem: "Marta Dias", acao: "Verificou a organização", alvo: "Movitel", tipo: "aprovacao", ip: "197.218.x.x" },
];

/* ------------------------------------------------------------------------- Equipa */

export type FuncaoInterna = "super-admin" | "triagem" | "financeiro" | "suporte";

export const funcoes: Record<FuncaoInterna, { label: string; descricao: string }> = {
  "super-admin": { label: "Super-administrador", descricao: "Tudo, incluindo a equipa e as definições." },
  triagem: { label: "Analista de triagem", descricao: "Aprovações, organizações, relatórios e disputas." },
  financeiro: { label: "Financeiro", descricao: "Pagamentos, comissões e faturas." },
  suporte: { label: "Suporte", descricao: "Pedidos de ajuda; só vê dados básicos de contas." },
};

export type MembroInterno = {
  id?: string;
  nome: string;
  email: string;
  funcao: FuncaoInterna;
  doisPassos: boolean;
  ultimoAcesso: string;
  estado: "ativo" | "convidado" | "desativado";
};

export const membros: MembroInterno[] = [
  { nome: "Ana Macamo", email: "ana.macamo@cyberspace.co.mz", funcao: "super-admin", doisPassos: true, ultimoAcesso: "2026-11-17T09:12", estado: "ativo" },
  { nome: "Marta Dias", email: "marta.dias@cyberspace.co.mz", funcao: "triagem", doisPassos: true, ultimoAcesso: "2026-11-16T17:40", estado: "ativo" },
  { nome: "Rui Machava", email: "rui.machava@cyberspace.co.mz", funcao: "triagem", doisPassos: true, ultimoAcesso: "2026-11-16T16:05", estado: "ativo" },
  { nome: "Carlos Uamusse", email: "carlos.uamusse@cyberspace.co.mz", funcao: "financeiro", doisPassos: true, ultimoAcesso: "2026-11-16T11:30", estado: "ativo" },
  { nome: "Dina Nhantumbo", email: "dina.nhantumbo@cyberspace.co.mz", funcao: "suporte", doisPassos: false, ultimoAcesso: "2026-11-12T08:50", estado: "ativo" },
  { nome: "Jorge Tivane", email: "jorge.tivane@cyberspace.co.mz", funcao: "suporte", doisPassos: false, ultimoAcesso: "", estado: "convidado" },
];

export const gravidadeLabels = { critica: "Crítica", alta: "Alta", media: "Média", baixa: "Baixa" } as const;
export const gravidadeEstilo = {
  critica: "bg-rose-50 text-rose-800",
  alta: "bg-orange-50 text-orange-800",
  media: "bg-amber-50 text-amber-900",
  baixa: "bg-sky-50 text-sky-800",
} as const;

/* ------------------------------------------------------- Relatórios por programa */

export type EstadoRelatorio = "enviado" | "em-triagem" | "aceite" | "recusado" | "duplicado" | "informativo";
export type CorrecaoRelatorio = "por-corrigir" | "em-correcao" | "corrigido";

export const estadosRelatorio: Record<EstadoRelatorio, { label: string; estilo: string }> = {
  enviado: { label: "Enviado", estilo: "bg-amber-50 text-amber-900" },
  "em-triagem": { label: "Em triagem", estilo: "bg-blue-50 text-blue-800" },
  aceite: { label: "Aceite", estilo: "bg-violet-50 text-violet-800" },
  recusado: { label: "Recusado", estilo: "bg-rose-50 text-rose-800" },
  duplicado: { label: "Duplicado", estilo: "bg-slate-100 text-slate-800" },
  informativo: { label: "Informativo", estilo: "bg-sky-50 text-sky-800" },
};

export const correcoesRelatorio: Record<CorrecaoRelatorio, { label: string; estilo: string }> = {
  "por-corrigir": { label: "Por corrigir", estilo: "bg-amber-50 text-amber-900" },
  "em-correcao": { label: "Em correção", estilo: "bg-blue-50 text-blue-800" },
  corrigido: { label: "Corrigido", estilo: "bg-green-50 text-green-800" },
};

/** Relatório visto pela administração: só o necessário para acompanhar, sem os detalhes técnicos da falha. */
export type RelatorioPrograma = {
  id: string;
  titulo: string;
  pesquisador: string;
  gravidade: "critica" | "alta" | "media" | "baixa";
  estado: EstadoRelatorio;
  correcao: CorrecaoRelatorio | null;
  data: string;
  recompensa: number | null;
};

const r = (id: string, titulo: string, pesquisador: string, gravidade: RelatorioPrograma["gravidade"], estado: EstadoRelatorio, correcao: CorrecaoRelatorio | null, data: string, recompensa: number | null = null): RelatorioPrograma => ({ id, titulo, pesquisador, gravidade, estado, correcao, data, recompensa });

const relatoriosPorPrograma: Record<string, RelatorioPrograma[]> = {
  portal: [
    r("VM-0301", "Execução de código ao processar faturas em PDF", "ninja_sec10", "critica", "enviado", null, "2026-11-14"),
    r("VM-0299", "Acesso a dados de outros clientes pela API de saldo", "pemba_root27", "alta", "enviado", null, "2026-11-13"),
    r("VM-0296", "XSS armazenado no campo de nome do perfil", "savana_dev44", "media", "em-triagem", null, "2026-11-11"),
    r("VM-0293", "Ligação de recuperação de conta reutilizável", "zambeze_hunter61", "alta", "em-triagem", null, "2026-11-10"),
    r("VM-0290", "Limite de tentativas ausente no início de sessão", "ilha_byte78", "media", "aceite", "em-correcao", "2026-11-08", 18000),
    r("VM-0287", "Injeção SQL na pesquisa de lojas", "ninja_sec10", "critica", "aceite", "por-corrigir", "2026-11-05", 120000),
    r("VM-0284", "Cabeçalhos de segurança em falta", "mapi_hax15", "baixa", "recusado", null, "2026-11-04"),
    r("VM-0281", "Fuga de ficheiros através de ligação previsível", "xai_bug32", "alta", "aceite", "corrigido", "2026-10-30", 45000),
  ],
  "pagamentos-moveis": [
    r("PM-0019", "Alteração do destinatário num pagamento pendente", "ninja_sec10", "critica", "aceite", "corrigido", "2026-10-02", 250000),
    r("PM-0017", "Limite diário contornável por pedidos em paralelo", "savana_dev44", "alta", "aceite", "corrigido", "2026-09-14", 90000),
    r("PM-0015", "Histórico de transações visível com outro número", "pemba_root27", "alta", "aceite", "em-correcao", "2026-11-06", 70000),
    r("PM-0014", "Mensagem de erro com dados da conta", "zambeze_hunter61", "baixa", "informativo", null, "2026-08-21"),
  ],
  cloud: [
    r("CL-0005", "Chave de API visível no histórico da consola", "ninja_sec10", "alta", "aceite", "corrigido", "2026-11-12", 40000),
    r("CL-0004", "Acesso a máquinas virtuais de outro cliente", "pemba_root27", "critica", "aceite", "corrigido", "2026-11-04", 26000),
    r("CL-0003", "Escalada de privilégios na consola", "savana_dev44", "alta", "em-triagem", null, "2026-11-15"),
  ],
  "movitel-clientes": [
    r("MV-0117", "Token de convite reutilizável", "zambeze_hunter61", "alta", "em-triagem", null, "2026-11-15"),
    r("MV-0115", "IDOR no histórico de recargas", "ilha_byte78", "alta", "em-triagem", null, "2026-11-13"),
    r("MV-0112", "Controlo de acesso em falta na área de revendedores", "pemba_root27", "alta", "aceite", "em-correcao", "2026-11-05", 45000),
    r("MV-0109", "Enumeração de números de cliente", "tete_byte39", "media", "aceite", "corrigido", "2026-10-18", 9000),
  ],
  "movitel-mobile": [
    r("MM-0011", "Dados da sessão guardados sem cifra no telemóvel", "xai_bug32", "media", "aceite", "corrigido", "2026-10-30", 14000),
    r("MM-0010", "Verificação da conta contornável na aplicação Android", "savana_dev44", "alta", "aceite", "em-correcao", "2026-11-09", 35000),
    r("MM-0009", "Ligação sem cifra para o servidor de imagens", "baobab_root44", "baixa", "recusado", null, "2026-10-12"),
  ],
  "bvm-portal": [
    r("BV-0049", "Redirecionamento aberto no início de sessão de membros", "tete_byte39", "media", "em-triagem", null, "2026-11-16"),
    r("BV-0044", "Injeção SQL na pesquisa de comunicados", "ninja_sec10", "critica", "aceite", "corrigido", "2026-11-07", 150000),
    r("BV-0041", "Listagem de diretórios no servidor de documentos", "kwanza_sec23", "baixa", "aceite", "corrigido", "2026-10-02", 5000),
  ],
  "bvm-negociacao": [
    r("BN-0004", "Ordens aceites com preço fora do intervalo permitido", "ninja_sec10", "critica", "aceite", "por-corrigir", "2026-11-01", 200000),
    r("BN-0003", "Limite de ordens por segundo contornável", "pemba_root27", "alta", "aceite", "em-correcao", "2026-10-15", 80000),
  ],
  "mcel-servicos": [
    r("MC-0033", "Recargas repetidas com o mesmo código", "kwanza_sec23", "alta", "aceite", "corrigido", "2026-10-05", 40000),
    r("MC-0031", "Acesso ao histórico de outros clientes", "pemba_root27", "alta", "aceite", "corrigido", "2026-08-12", 40000),
    r("MC-0028", "Informação interna em página de erro", "mapi_hax15", "baixa", "informativo", null, "2026-07-20"),
  ],
  "campanha-2025": [
    r("CV-0007", "Código promocional reutilizável", "savana_dev44", "media", "aceite", "corrigido", "2026-01-20", 12000),
    r("CV-0006", "Recarga duplicada ao repetir o pedido", "ninja_sec10", "alta", "aceite", "corrigido", "2025-12-14", 50000),
    r("CV-0004", "Promoção aplicada a números de outro operador", "tete_byte39", "baixa", "recusado", null, "2025-12-02"),
  ],
};

export function relatoriosDoPrograma(programaId: string) {
  return (relatoriosPorPrograma[programaId] ?? []).toSorted((a, b) => b.data.localeCompare(a.data));
}
