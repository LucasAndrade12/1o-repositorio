/**
 * C1 (CRÍTICO) — passe de encaminhamento com segundo fator, expiração e limite de tentativas.
 * E4 (MELHORIA) — desfecho no passe, fechando a contrarreferência.
 *
 * O problema, nas palavras da revisão:
 *
 * "com o alfabeto reduzido descrito, o espaço total de códigos fica na casa de aproximadamente
 *  um milhão de combinações. (…) um espaço dessa ordem é TRIVIALMENTE VARRIDO POR SCRIPT, e cada
 *  acerto expõe o RELATO DE SINTOMAS DE UMA PESSOA IDENTIFICÁVEL PELO CONTEXTO. Isso é dado
 *  pessoal sensível. E é uma contradição direta com a decisão, bem fundamentada, de descartar o
 *  número da casa e a rua para não identificar ninguém: de nada adianta não perguntar o nome se
 *  o documento pode ser lido por quem adivinhar quatro caracteres."
 *
 * A revisão é explícita que as cinco medidas são CUMULATIVAS, não alternativas. Todas estão aqui.
 */

import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import type { Nivel } from '@pra-onde-ir/protocolo';
import { repositorio } from '@pra-onde-ir/registro';

/** Alfabeto sem I, O, 0 e 1 — mantido do v1, para não confundir na leitura em voz alta. */
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** C1 — expiração. "24 a 48 horas, definida com a equipe." */
export const VALIDADE_HORAS = 36;

/** C1 — limite de tentativas com bloqueio progressivo. */
export const MAX_TENTATIVAS = 5;
const BLOQUEIO_PROGRESSIVO_MS = [0, 0, 1_000, 5_000, 30_000, 300_000];

export interface Passe {
  /** Identificador de EXIBIÇÃO. Sozinho, não abre nada. */
  codigo: string;
  /** Segundo fator: token longo, entregue por QR Code / link completo. */
  token: string;
  /** Segundo fator alternativo: PIN de 4 dígitos escolhido na triagem. Guardado como hash. */
  pinHash: string | null;
  triagemId: string;
  emitidoEm: string;
  expiraEm: string;
  nivel: Nivel;
  destino: string;
  resumo: string;
  criterios: string[];
  modo: string;
  versoes: Record<string, string>;
  /** C1 — cada abertura é registrada. */
  aberturas: { em: string; origem: string; sucesso: boolean }[];
  tentativasInvalidas: number;
  bloqueadoAte: number;
  /** E4 — contrarreferência. */
  desfecho?: {
    tipo: 'atendido' | 'redirecionado' | 'nao_compareceu';
    nivelAtribuidoNoDestino?: Nivel;
    registradoEm: string;
    por: string;
  };
}

const passes = new Map<string, Passe>();
/** Limite por IP, além do limite por código. */
const tentativasPorOrigem = new Map<string, { n: number; bloqueadoAte: number }>();

function gerarCodigo(): string {
  // 6 caracteres. Continua legível em voz alta, mas o código sozinho não abre nada —
  // a proteção real é o segundo fator, não o comprimento.
  let c = '';
  for (let i = 0; i < 6; i++) c += ALFABETO[randomInt(ALFABETO.length)];
  return passes.has(c) ? gerarCodigo() : c;
}

function hashPin(pin: string, codigo: string): string {
  return createHash('sha256').update(`${codigo}:${pin}:pra-onde-ir`).digest('hex');
}

export function emitirPasse(args: {
  triagemId: string;
  nivel: Nivel;
  destino: string;
  resumo: string;
  criterios: string[];
  modo: string;
  versoes: Record<string, string>;
  /** PIN de 4 dígitos escolhido pela pessoa no momento da triagem. */
  pin?: string;
}): { passe: Passe; linkCompleto: string } {
  const codigo = gerarCodigo();
  const token = randomBytes(32).toString('base64url');
  const agora = new Date();

  const passe: Passe = {
    codigo,
    token,
    pinHash: args.pin ? hashPin(args.pin, codigo) : null,
    triagemId: args.triagemId,
    emitidoEm: agora.toISOString(),
    expiraEm: new Date(agora.getTime() + VALIDADE_HORAS * 3_600_000).toISOString(),
    nivel: args.nivel,
    destino: args.destino,
    resumo: args.resumo,
    criterios: args.criterios,
    modo: args.modo,
    versoes: args.versoes,
    aberturas: [],
    tentativasInvalidas: 0,
    bloqueadoAte: 0,
  };

  passes.set(codigo, passe);
  repositorio.auditar({ tipo: 'passe_emitido', referencia: codigo, detalhe: `triagem=${args.triagemId}` });

  return { passe, linkCompleto: `/passe/${codigo}?t=${token}` };
}

export type ResultadoAbertura =
  | { ok: true; passe: Passe }
  | { ok: false; motivo: 'nao_encontrado' | 'expirado' | 'segundo_fator_invalido' | 'bloqueado'; esperarMs?: number };

/**
 * C1 — abrir o passe exige código MAIS segundo fator.
 * O código sozinho nunca é suficiente. Enumerar o espaço de códigos não expõe nada.
 */
export function abrirPasse(
  codigo: string,
  segundoFator: { token?: string; pin?: string },
  origem: string,
): ResultadoAbertura {
  const agora = Date.now();

  // Limite por ORIGEM (IP), antes mesmo de olhar o código — é o que barra a varredura.
  const porOrigem = tentativasPorOrigem.get(origem);
  if (porOrigem && porOrigem.bloqueadoAte > agora) {
    repositorio.auditar({
      tipo: 'passe_tentativa_invalida',
      referencia: codigo,
      origem,
      detalhe: 'origem bloqueada por excesso de tentativas',
    });
    return { ok: false, motivo: 'bloqueado', esperarMs: porOrigem.bloqueadoAte - agora };
  }

  const passe = passes.get(codigo.toUpperCase());

  if (!passe) {
    registrarFalhaDeOrigem(origem, agora);
    repositorio.auditar({ tipo: 'passe_tentativa_invalida', referencia: codigo, origem, detalhe: 'código inexistente' });
    return { ok: false, motivo: 'nao_encontrado' };
  }

  // Limite por CÓDIGO, com bloqueio progressivo.
  if (passe.bloqueadoAte > agora) {
    return { ok: false, motivo: 'bloqueado', esperarMs: passe.bloqueadoAte - agora };
  }

  if (new Date(passe.expiraEm).getTime() < agora) {
    passe.aberturas.push({ em: new Date().toISOString(), origem, sucesso: false });
    return { ok: false, motivo: 'expirado' };
  }

  const tokenOk =
    segundoFator.token != null &&
    segundoFator.token.length === passe.token.length &&
    timingSafeEqual(Buffer.from(segundoFator.token), Buffer.from(passe.token));

  const pinOk =
    segundoFator.pin != null &&
    passe.pinHash != null &&
    timingSafeEqual(
      Buffer.from(hashPin(segundoFator.pin, passe.codigo)),
      Buffer.from(passe.pinHash),
    );

  if (!tokenOk && !pinOk) {
    passe.tentativasInvalidas++;
    const espera = BLOQUEIO_PROGRESSIVO_MS[Math.min(passe.tentativasInvalidas, BLOQUEIO_PROGRESSIVO_MS.length - 1)]!;
    passe.bloqueadoAte = agora + espera;
    passe.aberturas.push({ em: new Date().toISOString(), origem, sucesso: false });
    registrarFalhaDeOrigem(origem, agora);
    repositorio.auditar({
      tipo: 'passe_tentativa_invalida',
      referencia: codigo,
      origem,
      detalhe: `segundo fator inválido (tentativa ${passe.tentativasInvalidas})`,
    });
    return { ok: false, motivo: 'segundo_fator_invalido', esperarMs: espera };
  }

  // C1 — registrar cada abertura (quando, de onde) para auditoria.
  passe.tentativasInvalidas = 0;
  passe.aberturas.push({ em: new Date().toISOString(), origem, sucesso: true });
  repositorio.auditar({ tipo: 'passe_aberto', referencia: codigo, origem });

  return { ok: true, passe };
}

function registrarFalhaDeOrigem(origem: string, agora: number): void {
  const atual = tentativasPorOrigem.get(origem) ?? { n: 0, bloqueadoAte: 0 };
  atual.n++;
  if (atual.n >= MAX_TENTATIVAS) {
    // Bloqueio progressivo por origem: a varredura por script fica inviável.
    atual.bloqueadoAte = agora + Math.min(300_000, 1_000 * 2 ** (atual.n - MAX_TENTATIVAS));
  }
  tentativasPorOrigem.set(origem, atual);
}

/**
 * E4 — desfecho preenchível pelo serviço receptor em três toques.
 *
 * "Isso fecha a referência e contrarreferência E produz o padrão-ouro para calibrar o
 *  protocolo — a comparação mais valiosa possível: o que o sistema disse contra o que o
 *  serviço encontrou."
 */
export function registrarDesfecho(
  codigo: string,
  tipo: NonNullable<Passe['desfecho']>['tipo'],
  por: string,
  nivelAtribuidoNoDestino?: Nivel,
): boolean {
  const passe = passes.get(codigo.toUpperCase());
  if (!passe) return false;
  passe.desfecho = {
    tipo,
    registradoEm: new Date().toISOString(),
    por,
    ...(nivelAtribuidoNoDestino ? { nivelAtribuidoNoDestino } : {}),
  };
  repositorio.registrarDesfecho(passe.triagemId, tipo, nivelAtribuidoNoDestino);
  return true;
}

export function listarPasses(): Passe[] {
  return [...passes.values()];
}

export function buscarPasse(codigo: string): Passe | undefined {
  return passes.get(codigo.toUpperCase());
}

export function limparPasses(): void {
  passes.clear();
  tentativasPorOrigem.clear();
}

/**
 * Espaço de códigos, para deixar explícito no painel por que o segundo fator existe.
 * Com 6 caracteres em alfabeto de 32, são ~10^9 combinações — mas o número não importa:
 * a proteção é o segundo fator, não a entropia do código de exibição.
 */
export const ESPACO_DE_CODIGOS = ALFABETO.length ** 6;
