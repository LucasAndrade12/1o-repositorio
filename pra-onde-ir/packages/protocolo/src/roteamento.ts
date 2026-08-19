/**
 * A10 (ALTO) + A11 (CRÍTICO) + D1 (CRÍTICO) + A13/D5 — Roteamento.
 *
 * A decisão estrutural desta versão: DESACOPLAR nível de risco de ponto de atenção.
 *
 * "a rede do SUS tem mais portas do que essas cinco, e várias delas são a porta CORRETA para
 *  casos que o protocolo já contempla. Ao forçar tudo em cinco caixas, o sistema empurra para
 *  a UPA casos que a UPA não resolve — reproduzindo digitalmente a peregrinação que ele foi
 *  criado para eliminar."
 *
 * A cor responde "quão rápido". O destino responde "onde". São perguntas diferentes e no
 * protocolo original estavam fundidas.
 */

import type { Destino, DestinoId, Nivel, TipoQueixa, Unidade } from './tipos.js';

export const DESTINOS: readonly Destino[] = Object.freeze([
  {
    id: 'samu',
    nome: 'SAMU — 192',
    instrucao: 'Ligue 192 agora. Não saia de casa e não vá por conta própria.',
    telefone: '192',
    sensivelAHorario: false,
    semDeslocamento: true,
    origem: 'v1',
  },
  {
    id: 'upa',
    nome: 'UPA',
    instrucao: 'Vá à UPA agora.',
    sensivelAHorario: false, // UPA é 24h
    origem: 'v1',
  },
  {
    id: 'ubs_hoje',
    nome: 'Sua UBS, hoje',
    instrucao: 'Procure sua UBS hoje.',
    sensivelAHorario: true,
    origem: 'v1',
  },
  {
    id: 'ubs_agendada',
    nome: 'Sua UBS, com agendamento',
    instrucao: 'Agende uma consulta na sua UBS.',
    sensivelAHorario: true,
    origem: 'v1',
  },
  {
    id: 'casa',
    nome: 'Cuidados em casa',
    instrucao: 'Você pode se cuidar em casa por enquanto.',
    sensivelAHorario: false,
    semDeslocamento: true,
    origem: 'v1',
  },
  // ── A10: as portas que faltavam ──────────────────────────────────────────
  {
    id: 'maternidade',
    nome: 'Maternidade de referência',
    instrucao: 'Vá direto à maternidade de referência. Não passe pela UPA.',
    sensivelAHorario: false, // maternidade de referência é 24h
    origem: 'A11',
  },
  {
    id: 'caps',
    nome: 'CAPS — Centro de Atenção Psicossocial',
    instrucao: 'Procure o CAPS. Você pode chegar sem agendamento.',
    sensivelAHorario: true,
    origem: 'A8',
  },
  {
    id: 'ceo',
    nome: 'Urgência odontológica / CEO',
    instrucao: 'Procure a urgência odontológica.',
    sensivelAHorario: true,
    origem: 'A10',
  },
  {
    id: 'hospital_trauma',
    nome: 'Hospital de referência para trauma',
    instrucao: 'Vá ao hospital de referência para trauma.',
    sensivelAHorario: false,
    origem: 'A10',
  },
  {
    id: 'farmacia_unidade',
    nome: 'Farmácia da unidade',
    instrucao: 'Vá direto à farmácia da sua UBS. Você não precisa de consulta para isso.',
    sensivelAHorario: true,
    origem: 'A10',
  },
  {
    id: 'sala_vacina',
    nome: 'Sala de vacina',
    instrucao: 'Vá à sala de vacina da sua UBS. É atendimento por demanda espontânea.',
    sensivelAHorario: true,
    origem: 'A10',
  },
  {
    id: 'equipe_esf',
    nome: 'Equipe de Saúde da Família da sua microárea',
    instrucao:
      'Sua solicitação foi registrada. A equipe de Saúde da Família responsável pela sua área ' +
      'vai entrar em contato.',
    sensivelAHorario: true,
    semDeslocamento: true,
    origem: 'A13',
  },
  {
    id: 'servico_violencia',
    nome: 'Serviço de referência para violência',
    instrucao: 'Procure o serviço de referência. O atendimento é sigiloso.',
    sensivelAHorario: false,
    origem: 'A9',
  },
  {
    id: 'vigilancia_epidemiologica',
    nome: 'Vigilância epidemiológica',
    instrucao: 'Caso sinalizado para a vigilância epidemiológica do município.',
    sensivelAHorario: true,
    semDeslocamento: true,
    origem: 'A6',
  },
  {
    id: 'cvv',
    nome: 'CVV — 188',
    instrucao:
      'Ligue 188 (CVV). É gratuito, sigiloso e funciona 24 horas por dia. Você pode falar com ' +
      'alguém agora mesmo.',
    telefone: '188',
    sensivelAHorario: false,
    semDeslocamento: true,
    origem: 'A8',
  },
]);

const DESTINOS_POR_ID = new Map(DESTINOS.map((d) => [d.id, d]));
export function destinoPorId(id: DestinoId): Destino | undefined {
  return DESTINOS_POR_ID.get(id);
}

/**
 * D1 (CRÍTICO) — base de unidades com horário de funcionamento e feriados.
 *
 * "'Procure sua UBS hoje' às 22h de um sábado, num feriado ou durante recesso — momentos em
 *  que, previsivelmente, o uso de um aplicativo de orientação é MAIOR, não menor. A pessoa
 *  recebe uma orientação impossível e faz o que já fazia antes: vai à UPA. O sistema perde a
 *  única batalha que precisava vencer."
 *
 * Dados de exemplo, a confirmar com a Secretaria antes do piloto.
 */
const H_UBS = { abre: '07:00', fecha: '17:00' };

export const UNIDADES: readonly Unidade[] = Object.freeze([
  {
    id: 'ubs_joao_dias',
    nome: 'UBS João Dias',
    destino: 'ubs_hoje',
    endereco: 'Nova Parnamirim, Parnamirim/RN',
    bairro: 'Nova Parnamirim',
    horarios: { 0: null, 1: H_UBS, 2: H_UBS, 3: H_UBS, 4: H_UBS, 5: H_UBS, 6: null },
    feriados: ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25'],
  },
  {
    id: 'upa_parnamirim',
    nome: 'UPA de Parnamirim',
    destino: 'upa',
    endereco: 'Parnamirim/RN',
    bairro: 'Centro',
    horarios: {
      0: { abre: '00:00', fecha: '23:59' }, 1: { abre: '00:00', fecha: '23:59' },
      2: { abre: '00:00', fecha: '23:59' }, 3: { abre: '00:00', fecha: '23:59' },
      4: { abre: '00:00', fecha: '23:59' }, 5: { abre: '00:00', fecha: '23:59' },
      6: { abre: '00:00', fecha: '23:59' },
    },
    feriados: [],
  },
  {
    id: 'maternidade_referencia',
    nome: 'Maternidade de referência da microárea',
    destino: 'maternidade',
    endereco: 'A CONFIRMAR com a UBS e a Secretaria (A11)',
    bairro: 'a confirmar',
    horarios: {
      0: { abre: '00:00', fecha: '23:59' }, 1: { abre: '00:00', fecha: '23:59' },
      2: { abre: '00:00', fecha: '23:59' }, 3: { abre: '00:00', fecha: '23:59' },
      4: { abre: '00:00', fecha: '23:59' }, 5: { abre: '00:00', fecha: '23:59' },
      6: { abre: '00:00', fecha: '23:59' },
    },
    feriados: [],
  },
  {
    id: 'caps_parnamirim',
    nome: 'CAPS de Parnamirim',
    destino: 'caps',
    endereco: 'A pactuar com a rede de saúde mental do município (A8)',
    bairro: 'a confirmar',
    horarios: { 0: null, 1: H_UBS, 2: H_UBS, 3: H_UBS, 4: H_UBS, 5: H_UBS, 6: null },
    feriados: ['01-01', '12-25'],
  },
  {
    id: 'ceo_parnamirim',
    nome: 'Centro de Especialidades Odontológicas',
    destino: 'ceo',
    endereco: 'A confirmar com a Secretaria',
    bairro: 'a confirmar',
    horarios: { 0: null, 1: H_UBS, 2: H_UBS, 3: H_UBS, 4: H_UBS, 5: H_UBS, 6: null },
    feriados: ['01-01', '12-25'],
  },
]);

export function unidadePorDestino(destino: DestinoId): Unidade | undefined {
  return UNIDADES.find((u) => u.destino === destino);
}

export interface EstadoUnidade {
  aberta: boolean;
  proximaAbertura?: { dia: string; hora: string };
}

/** D1 — a unidade está aberta neste instante? */
export function estadoDaUnidade(unidade: Unidade, agora: Date): EstadoUnidade {
  const mmdd = `${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
  const feriado = unidade.feriados.includes(mmdd);
  const faixa = unidade.horarios[agora.getDay()];
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  const dentro =
    !feriado &&
    faixa != null &&
    minutosAgora >= paraMinutos(faixa.abre) &&
    minutosAgora <= paraMinutos(faixa.fecha);

  if (dentro) return { aberta: true };

  // Procura a próxima abertura nos próximos 8 dias.
  for (let i = 0; i < 8; i++) {
    const d = new Date(agora.getTime() + i * 86_400_000);
    const dd = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (unidade.feriados.includes(dd)) continue;
    const f = unidade.horarios[d.getDay()];
    if (!f) continue;
    if (i === 0 && minutosAgora >= paraMinutos(f.abre)) continue;
    return { aberta: false, proximaAbertura: { dia: nomeDoDia(d, agora), hora: f.abre } };
  }
  return { aberta: false };
}

function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

function nomeDoDia(alvo: Date, agora: Date): string {
  const diff = Math.round((zerar(alvo).getTime() - zerar(agora).getTime()) / 86_400_000);
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  return DIAS[alvo.getDay()]!;
}

function zerar(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * A11 (CRÍTICO) — limiar de idade gestacional para roteamento obstétrico.
 *
 * "'Gestante' é agravante de +1 nível. Uma gestante de 30 semanas com dor lombar e febre
 *  (AMARELO) vira LARANJA e recebe 'vá à UPA agora'. Boa parte das UPAs não é porta obstétrica
 *  — a pessoa será redirecionada à maternidade de referência, com atraso e desgaste,
 *  exatamente o problema que o passe de encaminhamento tenta resolver."
 *
 * Aqui a idade gestacional é variável de ROTEAMENTO: acima do limiar, qualquer queixa
 * potencialmente obstétrica vai direto para a maternidade, com o nível de risco definindo
 * se é agora ou hoje.
 */
export const LIMIAR_GESTACIONAL_SEMANAS = 20;

/** Tipos de queixa considerados potencialmente obstétricos em gestante acima do limiar. */
export const QUEIXAS_POTENCIALMENTE_OBSTETRICAS: readonly TipoQueixa[] = Object.freeze([
  'obstetrica',
  'urologica',
  'gastrointestinal',
  'infecciosa',
  'geral',
]);

export interface ContextoRoteamento {
  nivel: Nivel;
  tipoQueixa: TipoQueixa;
  agora: Date;
  gestante?: { semanas: number | null };
  /** A13/D5 — acamado, sem transporte, ou sem acompanhante. */
  semDeslocamento?: boolean;
  faixaEtaria?: 'crianca' | 'adulto' | 'idoso';
}

export interface ResultadoRoteamento {
  destino: DestinoId;
  unidade?: Unidade;
  instrucao: string;
  /** D1 — texto sensível ao relógio quando a unidade está fechada. */
  avisoHorario?: string;
  /** Destino alternativo se o principal estiver fechado. */
  planoB?: { destino: DestinoId; instrucao: string };
  /** A8 — CVV exibido sempre que o tema for tocado. */
  apoioPermanente?: { destino: DestinoId; instrucao: string; telefone: string };
  justificativa: string[];
}

/**
 * Tabela de roteamento: nível × tipo de queixa × horário.
 * O nível diz quão rápido; esta função diz onde.
 */
export function rotear(ctx: ContextoRoteamento): ResultadoRoteamento {
  const justificativa: string[] = [];

  // ── A13/D5: modalidade antes de destino ────────────────────────────────
  // Para quem não sai da cama, aumentar a urgência sem alterar o destino é aumentar a
  // angústia sem oferecer solução. Vermelho continua sendo SAMU — a ambulância vai até a pessoa.
  if (ctx.semDeslocamento && ctx.nivel !== 'vermelho') {
    justificativa.push(
      'A13/D5 — pessoa sem condição de deslocamento: encaminhado para a fila de contato da ' +
        'equipe de Saúde da Família da microárea, em vez de instrução inexequível.',
    );
    return montar('equipe_esf', ctx, justificativa);
  }

  // ── A11: roteamento obstétrico tem precedência sobre o destino genérico ──
  const semanas = ctx.gestante?.semanas;
  const ehGestante = ctx.gestante != null;
  if (
    ehGestante &&
    (semanas == null || semanas >= LIMIAR_GESTACIONAL_SEMANAS) &&
    QUEIXAS_POTENCIALMENTE_OBSTETRICAS.includes(ctx.tipoQueixa)
  ) {
    if (ctx.nivel === 'vermelho') {
      justificativa.push(
        'A11 — emergência obstétrica: SAMU aciona e conduz à maternidade de referência.',
      );
      const r = montar('samu', ctx, justificativa);
      r.planoB = {
        destino: 'maternidade',
        instrucao: 'A referência é a maternidade, não a UPA.',
      };
      return r;
    }
    justificativa.push(
      `A11 — gestante${semanas != null ? ` de ${semanas} semanas` : ''} com queixa potencialmente ` +
        'obstétrica: porta de entrada própria. A cor define se é agora ou hoje; o destino é a ' +
        'maternidade de referência, não a UPA.',
    );
    return montar('maternidade', ctx, justificativa);
  }

  // ── Roteamento por tipo de queixa (A10) ────────────────────────────────
  switch (ctx.tipoQueixa) {
    case 'saude_mental': {
      // A8 — CAPS é destino possível, e o CVV aparece SEMPRE.
      if (ctx.nivel === 'vermelho') {
        justificativa.push('A8 — risco imediato à vida: SAMU, com CVV oferecido em paralelo.');
        return montar('samu', ctx, justificativa);
      }
      if (ctx.nivel === 'laranja' || ctx.nivel === 'amarelo') {
        justificativa.push(
          'A8 — faixa intermediária que não existia entre SAMU e consulta agendada: destino CAPS, ' +
            'acolhimento no mesmo dia.',
        );
        return montar('caps', ctx, justificativa);
      }
      justificativa.push('A8 — sofrimento psíquico leve: acompanhamento na UBS, com CVV disponível.');
      return montar('ubs_agendada', ctx, justificativa);
    }

    case 'violencia': {
      justificativa.push('A9 — trilha de violência: serviço de referência específico, não acolhimento genérico.');
      return montar(ctx.nivel === 'vermelho' ? 'servico_violencia' : 'servico_violencia', ctx, justificativa);
    }

    case 'odontologica': {
      if (ctx.nivel === 'vermelho') return montar('samu', ctx, justificativa);
      justificativa.push('A10 — urgência odontológica tem porta própria (CEO). A UPA não resolve abscesso dentário.');
      return montar('ceo', ctx, justificativa);
    }

    case 'administrativa': {
      justificativa.push('A10 — demanda administrativa não ocupa vaga de consulta.');
      return montar('ubs_agendada', ctx, justificativa);
    }

    case 'medicamento': {
      justificativa.push('A10 — renovação de receita vai à farmácia da unidade, liberando a vaga de consulta.');
      return montar('farmacia_unidade', ctx, justificativa);
    }

    case 'vacina': {
      justificativa.push('A10 — sala de vacina, demanda espontânea.');
      return montar('sala_vacina', ctx, justificativa);
    }

    case 'trauma': {
      if (ctx.nivel === 'vermelho') {
        justificativa.push('A10 — trauma grave: SAMU, com referência ao hospital de trauma.');
        const r = montar('samu', ctx, justificativa);
        r.planoB = { destino: 'hospital_trauma', instrucao: 'A referência é o hospital de trauma.' };
        return r;
      }
      break;
    }

    case 'arbovirose': {
      justificativa.push('A6 — caso sinalizado para a vigilância epidemiológica do município.');
      break;
    }
  }

  // ── Roteamento por nível (padrão) ──────────────────────────────────────
  switch (ctx.nivel) {
    case 'vermelho':
      return montar('samu', ctx, justificativa);
    case 'laranja':
      return montar('upa', ctx, justificativa);
    case 'amarelo':
      return montar('ubs_hoje', ctx, justificativa);
    case 'verde':
      return montar('ubs_agendada', ctx, justificativa);
    case 'azul':
      return montar('casa', ctx, justificativa);
  }
}

function montar(
  destinoId: DestinoId,
  ctx: ContextoRoteamento,
  justificativa: string[],
): ResultadoRoteamento {
  const destino = destinoPorId(destinoId)!;
  const unidade = unidadePorDestino(destinoId);
  const r: ResultadoRoteamento = {
    destino: destinoId,
    unidade,
    instrucao: destino.instrucao,
    justificativa,
  };

  // ── D1: saída sensível ao relógio ───────────────────────────────────────
  if (destino.sensivelAHorario && unidade) {
    const estado = estadoDaUnidade(unidade, ctx.agora);
    if (!estado.aberta) {
      const quando = estado.proximaAbertura
        ? `${estado.proximaAbertura.dia} às ${estado.proximaAbertura.hora}`
        : 'no próximo dia útil';
      r.avisoHorario = `${unidade.nome} abre ${quando}.`;
      justificativa.push(
        `D1 — ${unidade.nome} está fechada agora. Orientação ajustada ao relógio, em vez de ` +
          'uma instrução impossível de cumprir.',
      );

      // Regra explícita e escrita para AMARELO fora do horário — não implícita no código.
      if (ctx.nivel === 'amarelo' || ctx.nivel === 'laranja') {
        r.planoB = {
          destino: 'upa',
          instrucao:
            `Se piorar antes disso, ou se você não conseguir esperar, procure a UPA. ` +
            `Fique atento aos sinais de alerta abaixo.`,
        };
      } else {
        r.planoB = {
          destino: 'upa',
          instrucao: 'Se piorar antes disso, procure a UPA.',
        };
      }
    }
  }

  // ── A8: CVV permanente e não condicional em qualquer caso que toque o tema ──
  if (ctx.tipoQueixa === 'saude_mental') {
    const cvv = destinoPorId('cvv')!;
    r.apoioPermanente = { destino: 'cvv', instrucao: cvv.instrucao, telefone: '188' };
  }

  return r;
}
