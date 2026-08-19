/**
 * CAMADA 3 — classificação determinística.
 *
 * A revisão elogia a separação: "Separar tradução de linguagem (camada 2) de classificação
 * (camada 3) é a arquitetura correta. Ela permite auditar, testar e responsabilizar."
 * A camada 3 é preservada como o único lugar onde o nível é decidido. A IA nunca decide.
 *
 * Achados endereçados:
 *   A1 — agravantes condicionados, no máximo um degrau
 *   A2 — piso de 24 horas com lista de exceções nomeadas
 *   A3 — sinais de alarme reclassificam para cima
 *   A12 — safety-netting montado em todos os níveis
 */

import {
  AGRAVANTES,
  MAX_DEGRAUS_POR_AGRAVANTE,
  REGRA_IDADE,
  SAFETY_NETTING,
  criterioPorId,
  escalonar,
  gravidade,
  maisGrave,
  type Agravante,
  type Criterio,
  type Nivel,
  type TipoQueixa,
} from '@pra-onde-ir/protocolo';

export interface DadosPaciente {
  faixaEtaria?: 'crianca' | 'adulto' | 'idoso';
  idade?: number | null;
  sexo?: 'feminino' | 'masculino' | 'outro' | null;
  agravantes: string[];
  gestante?: { semanas: number | null } | null;
  semDeslocamento?: boolean;
  /** Sintoma com menos de 24 horas (A2). */
  inicioMenos24h?: boolean;
  /** Sinais de alarme respondidos como "sim" nos roteiros fechados (A3, A6, B8). */
  sinaisDeAlarme?: string[];
}

export interface ExplicacaoNivel {
  etapa: string;
  de?: Nivel;
  para: Nivel;
  motivo: string;
  achado: string;
}

export interface ResultadoClassificacao {
  nivel: Nivel;
  tipoQueixa: TipoQueixa;
  criteriosAplicados: Criterio[];
  agravantesAplicados: Agravante[];
  /** Rastro completo de como o nível foi decidido — auditável linha a linha. */
  explicacao: ExplicacaoNivel[];
  /** Nenhum critério bateu → acolhimento (B11). */
  naoReconhecido: boolean;
  safetyNetting: (typeof SAFETY_NETTING)[Nivel];
  /** A12 — o que fazer nos minutos de espera, quando houver bandeira vermelha. */
  primeirosMinutos: string[];
}

export function classificar(
  criterioIds: string[],
  paciente: DadosPaciente,
  /**
   * Especificidade do casamento por critério (vinda da camada 1). Usada apenas como
   * DESEMPATE entre critérios de mesmo nível — nunca para decidir o nível em si.
   */
  especificidade: Record<string, number> = {},
): ResultadoClassificacao {
  const explicacao: ExplicacaoNivel[] = [];
  const criterios = criterioIds
    .map((id) => criterioPorId(id))
    .filter((c): c is Criterio => c != null);

  // ── B11 — nenhum critério bateu: a decisão segura é o acolhimento ────────
  if (criterios.length === 0) {
    explicacao.push({
      etapa: 'nao_reconhecido',
      para: 'amarelo',
      motivo:
        'Nenhum critério do protocolo foi reconhecido no relato. A decisão segura é encaminhar ' +
        'ao acolhimento. Este caso entra na fila de curadoria, porque cada relato não reconhecido ' +
        'é um sinal de lacuna do protocolo.',
      achado: 'B11',
    });
    return {
      nivel: 'amarelo',
      tipoQueixa: 'geral',
      criteriosAplicados: [],
      agravantesAplicados: [],
      explicacao,
      naoReconhecido: true,
      safetyNetting: SAFETY_NETTING.amarelo,
      primeirosMinutos: [],
    };
  }

  // ── Nível base: o critério mais grave prevalece ──────────────────────────
  //
  // Empate entre critérios do mesmo nível é resolvido de forma determinística e explicável:
  //   1. tempo-dependente vence (janela terapêutica curta define o tipo de queixa e o destino)
  //   2. casamento mais específico vence o genérico ("febre e dor no corpo" > "febre")
  //   3. ordem no catálogo, para que o resultado seja sempre reprodutível
  const ordenados = [...criterios].sort((a, b) => {
    const porNivel = gravidade(b.nivel) - gravidade(a.nivel);
    if (porNivel !== 0) return porNivel;
    const porTempo = Number(b.tempoDependente ?? false) - Number(a.tempoDependente ?? false);
    if (porTempo !== 0) return porTempo;
    return (especificidade[b.id] ?? 0) - (especificidade[a.id] ?? 0);
  });

  const criterioLider = ordenados[0]!;
  let nivel: Nivel = criterioLider.nivel;

  explicacao.push({
    etapa: 'base',
    para: nivel,
    motivo:
      `Critério mais grave reconhecido: "${criterioLider.titulo}" (${criterioLider.id}).` +
      (criterios.length > 1
        ? ` Outros critérios reconhecidos: ${criterios.filter((c) => c.id !== criterioLider.id).map((c) => c.id).join(', ')}.`
        : ''),
    achado: criterioLider.origem,
  });

  // ── A3 / A6 — sinais de alarme reclassificam para cima ───────────────────
  const alarmes = paciente.sinaisDeAlarme ?? [];
  if (alarmes.length > 0) {
    for (const c of criterios) {
      if (!c.sinaisDeAlarme) continue;
      const bateu = c.sinaisDeAlarme.comoAPessoaDescreve.some((t) =>
        alarmes.some((a) => a.toLowerCase().includes(t.toLowerCase())),
      );
      if (bateu && gravidade(c.sinaisDeAlarme.nivelSeAlarme) > gravidade(nivel)) {
        const de = nivel;
        nivel = c.sinaisDeAlarme.nivelSeAlarme;
        explicacao.push({
          etapa: 'sinal_de_alarme',
          de,
          para: nivel,
          motivo:
            `Sinal de alarme presente em "${c.titulo}": ${c.sinaisDeAlarme.descricao} ` +
            'O gatilho foi ampliado de "sintomas neurológicos" para qualquer sinal de lesão de ' +
            'órgão-alvo.',
          achado: 'A3',
        });
      }
    }
  }

  // ── A1 — agravantes CONDICIONADOS, no máximo um degrau ───────────────────
  const tipoQueixa = criterioLider.tipoQueixa;
  const { aplicados, motivos } = agravantesAplicaveis(paciente, criterios, tipoQueixa);

  if (aplicados.length > 0 && nivel !== 'vermelho') {
    const de = nivel;
    const candidato = escalonar(nivel, MAX_DEGRAUS_POR_AGRAVANTE);

    // TETO DE AGRAVANTE: comorbidade nunca cria emergência.
    //
    // A revisão registra que a ressalva do v1 — "vários agravantes nunca transformam um caso
    // azul em emergência" — era logicamente impossível de violar com escalonamento de um único
    // degrau, o que sugeria que o código acumulava de forma diferente do documento. Aqui a
    // ressalva vira regra real e testável: VERMELHO exige bandeira clínica própria.
    //
    // O motivo é o custo assimétrico apontado na revisão: "Ativações indevidas do SAMU custam
    // recurso público real e, repetidas, destroem a confiança da equipe no sistema mais rápido
    // do que qualquer erro de sub-triagem."
    if (candidato === 'vermelho') {
      explicacao.push({
        etapa: 'agravante_teto',
        de,
        para: nivel,
        motivo:
          `Agravante(s) aplicável(is): ${motivos.join('; ')}. O escalonamento PARA em LARANJA: ` +
          'comorbidade e idade não criam emergência por conta própria — VERMELHO exige bandeira ' +
          'clínica própria. Acionar o SAMU por agravante destruiria a confiança da equipe no ' +
          'sistema mais rápido do que qualquer erro de sub-triagem.',
        achado: 'A1',
      });
    } else {
      nivel = candidato;
      explicacao.push({
        etapa: 'agravante',
        de,
        para: nivel,
        motivo:
          `Agravante(s) com relação fisiopatológica com este quadro: ${motivos.join('; ')}. ` +
          `Regra explícita e única: no máximo ${MAX_DEGRAUS_POR_AGRAVANTE} degrau, ` +
          'independentemente de quantos agravantes se apliquem.',
        achado: 'A1',
      });
    }
  } else if (paciente.agravantes.length > 0 && aplicados.length === 0) {
    explicacao.push({
      etapa: 'agravante_nao_aplicado',
      para: nivel,
      motivo:
        `Comorbidades informadas (${paciente.agravantes.join(', ')}) NÃO escalonam este quadro: ` +
        'a matriz é condicionada, e não há relação fisiopatológica com o critério reconhecido. ' +
        'No protocolo v1 este caso teria subido um degrau por regra genérica.',
      achado: 'A1',
    });
  }

  // ── A2 — piso de 24 horas COM lista de exceções nomeadas ────────────────
  if (paciente.inicioMenos24h && gravidade(nivel) < gravidade('amarelo')) {
    const isento = criterios.every((c) => c.isentoPiso24h === true);
    if (isento) {
      explicacao.push({
        etapa: 'piso_24h_isento',
        para: nivel,
        motivo:
          'Quadro de baixa gravidade explicitamente listado como exceção ao piso de 24 horas. ' +
          'No protocolo v1 a regra "sintoma com menos de 24 horas sempre gera atendimento no ' +
          'mesmo dia" anulava o nível AZUL por contradição interna — "acordei com o nariz ' +
          'escorrendo" é exatamente um quadro de primeiro dia.',
        achado: 'A2',
      });
    } else {
      const de = nivel;
      nivel = 'amarelo';
      explicacao.push({
        etapa: 'piso_24h',
        de,
        para: nivel,
        motivo:
          'Sintoma agudo com menos de 24 horas, fora da lista de exceções: piso de atendimento ' +
          'no mesmo dia.',
        achado: 'A2',
      });
    }
  }

  // ── A12 — safety-netting e primeiros minutos ────────────────────────────
  const primeirosMinutos: string[] = [];
  for (const c of criterios) {
    if (c.nivel === 'vermelho' && c.primeirosMinutos) {
      primeirosMinutos.push(...c.primeirosMinutos);
    }
  }

  return {
    nivel,
    tipoQueixa,
    criteriosAplicados: criterios,
    agravantesAplicados: aplicados,
    explicacao,
    naoReconhecido: false,
    safetyNetting: SAFETY_NETTING[nivel],
    primeirosMinutos: [...new Set(primeirosMinutos)],
  };
}

/**
 * A1 — a matriz esparsa em ação.
 * Um agravante só entra se tiver relação com o tipo de queixa ou com um critério específico.
 */
function agravantesAplicaveis(
  paciente: DadosPaciente,
  criterios: Criterio[],
  tipoQueixa: TipoQueixa,
): { aplicados: Agravante[]; motivos: string[] } {
  const aplicados: Agravante[] = [];
  const motivos: string[] = [];
  const ids = new Set(criterios.map((c) => c.id));
  const temFebre = criterios.some(
    (c) => c.tipoQueixa === 'infecciosa' || c.id.includes('febre') || c.titulo.toLowerCase().includes('febre'),
  );

  for (const idAgravante of paciente.agravantes) {
    const ag = AGRAVANTES.find((a) => a.id === idAgravante);
    if (!ag) continue;

    const porTipo = ag.escalonaTiposQueixa.includes(tipoQueixa);
    const porCriterio = (ag.escalonaCriterios ?? []).some((id) => ids.has(id));
    const porFebre = ag.escalonaQualquerFebre === true && temFebre;

    if (porTipo || porCriterio || porFebre) {
      aplicados.push(ag);
      const razao = porFebre
        ? 'imunossupressão escalona qualquer febre'
        : porCriterio
          ? 'relação direta com o critério reconhecido'
          : `relação fisiopatológica com queixa ${tipoQueixa}`;
      motivos.push(`${ag.rotulo} (${razao})`);
    }
  }

  // ── Idade: 75+ escalona sozinho; 60–74 exige sinal agudo somado ─────────
  const idade = paciente.idade;
  if (idade != null) {
    const tipoSensivel = (REGRA_IDADE.tiposQueixaSensiveis as readonly string[]).includes(tipoQueixa);
    if (idade >= REGRA_IDADE.idadeIsoladaEscalona && tipoSensivel) {
      motivos.push(`idade ${idade} anos (corte isolado de ${REGRA_IDADE.idadeIsoladaEscalona}+)`);
      aplicados.push(idadeComoAgravante(idade));
    } else if (
      idade >= REGRA_IDADE.faixaExigeSinalAgudo.min &&
      idade <= REGRA_IDADE.faixaExigeSinalAgudo.max &&
      tipoSensivel &&
      criterios.some((c) => c.tempoDependente === true || gravidade(c.nivel) >= gravidade('laranja'))
    ) {
      motivos.push(`idade ${idade} anos SOMADA a sinal agudo (faixa 60–74 não escalona sozinha)`);
      aplicados.push(idadeComoAgravante(idade));
    }
  }

  return { aplicados, motivos };
}

function idadeComoAgravante(idade: number): Agravante {
  return {
    id: 'idade',
    rotulo: `Idade ${idade} anos`,
    bloco: 'outros',
    escalonaTiposQueixa: [...REGRA_IDADE.tiposQueixaSensiveis],
    comoAPessoaDescreve: [],
    justificativaFisiopatologica: REGRA_IDADE.justificativa,
    origem: 'A1',
    assinatura: null,
  };
}

/** Utilidade exportada para os testes de vinhetas. */
export { maisGrave, gravidade };
