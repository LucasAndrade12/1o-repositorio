/**
 * Testes da Parte C (privacidade, segurança e conformidade) e da Parte E (métricas).
 *
 * O banco de vinhetas cobre o protocolo clínico e a arquitetura de decisão.
 * Este arquivo cobre o que a revisão classificou como CRÍTICO fora da clínica:
 * o passe enumerável (C1), a reidentificação por microárea (C2), e a fusão de
 * sub- com sobre-triagem no botão único (E1).
 */

import { beforeEach, describe, expect, it } from 'vitest';

import {
  ORDEM_NIVEIS,
  SAFETY_NETTING,
  CRITERIOS,
  criteriosPendentesDeAssinatura,
  estadoSistema,
  desligarSistema,
  religarSistema,
  rotear,
  estadoDaUnidade,
  UNIDADES,
} from '@pra-onde-ir/protocolo';
import { triar } from '@pra-onde-ir/motor';
import { camada2Degradada } from '@pra-onde-ir/ia';
import {
  exportarAnalitico,
  matrizDeConfusao,
  montarPainel,
  repositorio,
  verificarKAnonimato,
  faixaDe,
  type RegistroAnalitico,
} from '@pra-onde-ir/registro';
import {
  VALIDADE_HORAS,
  abrirPasse,
  buscarPasse,
  emitirPasse,
  limparPasses,
  registrarDesfecho,
} from '@pra-onde-ir/passe';

// ═══════════════════════════════════════════════════════════════════════════
// C1 (CRÍTICO) — o passe de quatro caracteres é enumerável
// ═══════════════════════════════════════════════════════════════════════════

describe('C1 — passe com segundo fator, expiração e limite de tentativas', () => {
  beforeEach(() => limparPasses());

  function novoPasse(pin = '4821') {
    return emitirPasse({
      triagemId: 'tri_teste',
      nivel: 'laranja',
      destino: 'upa',
      resumo: 'A pessoa relata dor abdominal intensa.',
      criterios: ['lj.abdome_agudo'],
      modo: 'degradado',
      versoes: { protocolo: '2.0.0' },
      pin,
    });
  }

  it('o código sozinho NÃO abre o passe — este era o furo central', () => {
    const { passe } = novoPasse();
    const r = abrirPasse(passe.codigo, {}, '10.0.0.1');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.motivo).toBe('segundo_fator_invalido');
  });

  it('abre com o PIN correto', () => {
    const { passe } = novoPasse('1234');
    const r = abrirPasse(passe.codigo, { pin: '1234' }, '10.0.0.1');
    expect(r.ok).toBe(true);
  });

  it('abre com o token longo do QR Code, sem PIN', () => {
    const { passe } = novoPasse();
    const r = abrirPasse(passe.codigo, { token: passe.token }, '10.0.0.1');
    expect(r.ok).toBe(true);
  });

  it('bloqueio progressivo torna a varredura por script inviável', () => {
    const { passe } = novoPasse('1111');
    for (let i = 0; i < 4; i++) abrirPasse(passe.codigo, { pin: '0000' }, '10.0.0.2');
    const r = abrirPasse(passe.codigo, { pin: '0000' }, '10.0.0.2');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.esperarMs ?? 0).toBeGreaterThan(0);
  });

  it('varredura de códigos inexistentes bloqueia a ORIGEM', () => {
    const origem = '203.0.113.9';
    for (let i = 0; i < 6; i++) abrirPasse(`ZZZZ${i}A`, { pin: '0000' }, origem);
    const { passe } = novoPasse('7777');
    // Mesmo com o PIN correto, a origem já está bloqueada.
    const r = abrirPasse(passe.codigo, { pin: '7777' }, origem);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.motivo).toBe('bloqueado');
  });

  it('expira dentro da janela definida com a equipe', () => {
    const { passe } = novoPasse();
    const horas = (new Date(passe.expiraEm).getTime() - new Date(passe.emitidoEm).getTime()) / 3_600_000;
    expect(horas).toBeCloseTo(VALIDADE_HORAS, 1);
  });

  it('registra cada abertura — quando e de onde — para auditoria', () => {
    const { passe } = novoPasse('2222');
    abrirPasse(passe.codigo, { pin: '2222' }, '10.0.0.5');
    abrirPasse(passe.codigo, { pin: '9999' }, '10.0.0.6');
    const p = buscarPasse(passe.codigo)!;
    expect(p.aberturas.length).toBe(2);
    expect(p.aberturas.filter((a) => a.sucesso).length).toBe(1);
    expect(p.aberturas[0]!.origem).toBe('10.0.0.5');
  });

  it('E4 — desfecho fecha a contrarreferência', () => {
    const { passe } = novoPasse('3333');
    expect(registrarDesfecho(passe.codigo, 'atendido', 'upa', 'laranja')).toBe(true);
    expect(buscarPasse(passe.codigo)!.desfecho?.tipo).toBe('atendido');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// C2 (ALTO) — microárea + sintoma + horário reidentifica
// ═══════════════════════════════════════════════════════════════════════════

describe('C2 — anonimização da base analítica', () => {
  it('horário vira faixa, nunca o instante exato', () => {
    expect(faixaDe(new Date('2026-08-10T03:14:00'))).toBe('madrugada');
    expect(faixaDe(new Date('2026-08-10T09:00:00'))).toBe('manha');
    expect(faixaDe(new Date('2026-08-10T15:30:00'))).toBe('tarde');
    expect(faixaDe(new Date('2026-08-10T21:45:00'))).toBe('noite');
  });

  it('a base analítica não carrega microárea', async () => {
    repositorio.limpar();
    const t = await triar(
      { relato: 'dor de cabeça', paraQuem: 'proprio', paciente: { agravantes: [] } },
      camada2Degradada,
    );
    repositorio.registrar(t, 'dor de cabeça', {
      bairro: 'Nova Parnamirim',
      microarea: 'micro-07',
      equipe: 'eSF 1',
    });

    const analitico = repositorio.listarAnalitico();
    expect(analitico[0]).toBeDefined();
    // A microárea existe na base OPERACIONAL, para o roteamento…
    expect(repositorio.listarOperacional()[0]!.microarea).toBe('micro-07');
    // …e NÃO atravessa para a base analítica.
    expect(JSON.stringify(analitico[0])).not.toContain('micro-07');
    expect(analitico[0]!.bairro).toBe('Nova Parnamirim');
    expect(analitico[0]!.equipe).toBe('eSF 1');
    // O texto integral do relato também não atravessa.
    expect(Object.values(analitico[0]!)).not.toContain('dor de cabeça');
  });

  it('k-anonimato recusa exportação com grupos raros', () => {
    const raros: RegistroAnalitico[] = [
      base({ id: '1', bairro: 'Cohabinal', faixaHoraria: 'madrugada', nivel: 'vermelho' }),
    ];
    const r = exportarAnalitico(raros);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.motivo).toContain('menos de 5');
  });

  it('k-anonimato aprova quando os grupos são grandes o suficiente', () => {
    const muitos = Array.from({ length: 6 }, (_, i) =>
      base({ id: String(i), bairro: 'Nova Parnamirim', faixaHoraria: 'manha', nivel: 'amarelo' }),
    );
    expect(verificarKAnonimato(muitos).aprovado).toBe(true);
    expect(exportarAnalitico(muitos).ok).toBe(true);
  });
});

function base(p: Partial<RegistroAnalitico>): RegistroAnalitico {
  return {
    id: 'x', faixaHoraria: 'manha', diaSemana: 1, semanaEpidemiologica: 32,
    bairro: 'Nova Parnamirim', nivel: 'amarelo', destino: 'ubs_hoje', criterios: [],
    modo: 'degradado', versaoProtocolo: '2.0.0', versaoPrompt: 'p', versaoModelo: 'm',
    fase: 'demonstracao', naoReconhecido: false, comprimentoRelato: 'curto',
    faixaEtaria: 'adulto', ...p,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// E1 (ALTO) — dois botões não separam sub de sobre-triagem
// ═══════════════════════════════════════════════════════════════════════════

describe('E1 — matriz de confusão separa falha de segurança de falha de eficiência', () => {
  it('sub-triagem e sobre-triagem são contadas separadamente', () => {
    const registros: RegistroAnalitico[] = [
      base({ id: 'a', nivel: 'amarelo', nivelAtribuidoPelaEquipe: 'amarelo' }),
      base({ id: 'b', nivel: 'amarelo', nivelAtribuidoPelaEquipe: 'laranja' }), // SUB — segurança
      base({ id: 'c', nivel: 'laranja', nivelAtribuidoPelaEquipe: 'amarelo' }), // SOBRE — eficiência
      base({ id: 'd', nivel: 'verde', nivelAtribuidoPelaEquipe: 'verde' }),
    ];
    const m = matrizDeConfusao(registros);
    expect(m.total).toBe(4);
    expect(m.concordancia).toBeCloseTo(0.5);
    expect(m.subTriagem).toBeCloseTo(0.25);
    expect(m.sobreTriagem).toBeCloseTo(0.25);
    expect(m.casosSubTriagem).toHaveLength(1);
    expect(m.casosSubTriagem[0]!.id).toBe('b');
  });

  it('uma concordância agregada alta pode esconder sub-triagem — e o painel sinaliza', () => {
    const registros: RegistroAnalitico[] = [
      ...Array.from({ length: 17 }, (_, i) =>
        base({ id: `ok${i}`, nivel: 'amarelo', nivelAtribuidoPelaEquipe: 'amarelo' })),
      base({ id: 'perigo', nivel: 'amarelo', nivelAtribuidoPelaEquipe: 'vermelho' }),
    ];
    const painel = montarPainel(registros);
    const m = painel.matriz;
    // 94% de concordância — um número que passaria numa reunião…
    expect(m.concordancia).toBeGreaterThan(0.9);
    // …mas o indicador que PREVALECE sobre todos os outros está em alarme.
    const sub = painel.indicadores.find((i) => i.id === 'sub_triagem')!;
    expect(sub.emAlarme).toBe(true);
    expect(m.sensibilidadeVermelho).toBeLessThan(1);
  });

  it('B6 — a concordância é estratificada por modo', () => {
    const registros: RegistroAnalitico[] = [
      ...Array.from({ length: 4 }, (_, i) =>
        base({ id: `ia${i}`, modo: 'ia', nivel: 'amarelo', nivelAtribuidoPelaEquipe: 'amarelo' })),
      ...Array.from({ length: 4 }, (_, i) =>
        base({ id: `dg${i}`, modo: 'degradado', nivel: 'amarelo', nivelAtribuidoPelaEquipe: 'laranja' })),
    ];
    const painel = montarPainel(registros);
    expect(painel.porModo.ia!.concordancia).toBe(1);
    expect(painel.porModo.degradado!.concordancia).toBe(0);
    // Sem estratificar, o número global (50%) misturaria dois sistemas diferentes.
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// D1 (CRÍTICO) — o destino ignora horário de funcionamento
// ═══════════════════════════════════════════════════════════════════════════

describe('D1 — roteamento sensível ao relógio', () => {
  const ubs = UNIDADES.find((u) => u.id === 'ubs_joao_dias')!;

  it('sábado às 22h a UBS está fechada', () => {
    const e = estadoDaUnidade(ubs, new Date('2026-08-08T22:00:00-03:00'));
    expect(e.aberta).toBe(false);
    expect(e.proximaAbertura).toBeDefined();
  });

  it('terça às 9h a UBS está aberta', () => {
    expect(estadoDaUnidade(ubs, new Date('2026-08-11T09:00:00-03:00')).aberta).toBe(true);
  });

  it('fora do horário, o AMARELO ganha aviso e plano B em vez de instrução impossível', () => {
    const r = rotear({
      nivel: 'amarelo',
      tipoQueixa: 'geral',
      agora: new Date('2026-08-08T22:00:00-03:00'),
    });
    expect(r.destino).toBe('ubs_hoje');
    expect(r.avisoHorario).toBeTruthy();
    expect(r.planoB).toBeDefined();
    expect(r.planoB!.destino).toBe('upa');
  });

  it('a UPA é 24h e não ganha aviso de horário', () => {
    const r = rotear({ nivel: 'laranja', tipoQueixa: 'geral', agora: new Date('2026-08-08T03:00:00-03:00') });
    expect(r.destino).toBe('upa');
    expect(r.avisoHorario).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// A8, A11, A13 — roteamento desacoplado do nível
// ═══════════════════════════════════════════════════════════════════════════

describe('A10/A11/A13 — a cor diz quão rápido, o destino diz onde', () => {
  const agora = new Date('2026-08-11T10:00:00-03:00');

  it('A11 — gestante acima do limiar vai à maternidade, não à UPA', () => {
    const r = rotear({ nivel: 'laranja', tipoQueixa: 'obstetrica', agora, gestante: { semanas: 30 } });
    expect(r.destino).toBe('maternidade');
  });

  it('A11 — gestante abaixo do limiar segue o fluxo geral', () => {
    const r = rotear({ nivel: 'laranja', tipoQueixa: 'obstetrica', agora, gestante: { semanas: 8 } });
    expect(r.destino).toBe('upa');
  });

  it('A8 — saúde mental intermediária vai ao CAPS, com CVV sempre presente', () => {
    const r = rotear({ nivel: 'laranja', tipoQueixa: 'saude_mental', agora });
    expect(r.destino).toBe('caps');
    expect(r.apoioPermanente?.telefone).toBe('188');
  });

  it('A8 — o CVV aparece mesmo no nível mais leve de saúde mental', () => {
    const r = rotear({ nivel: 'verde', tipoQueixa: 'saude_mental', agora });
    expect(r.apoioPermanente?.telefone).toBe('188');
  });

  it('A13 — quem não pode se deslocar recebe contato da equipe, não instrução inexequível', () => {
    const r = rotear({ nivel: 'laranja', tipoQueixa: 'respiratoria', agora, semDeslocamento: true });
    expect(r.destino).toBe('equipe_esf');
  });

  it('A13 — mas em VERMELHO o SAMU continua: a ambulância vai até a pessoa', () => {
    const r = rotear({ nivel: 'vermelho', tipoQueixa: 'cardiovascular', agora, semDeslocamento: true });
    expect(r.destino).toBe('samu');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// A1 — o teto de agravante
// ═══════════════════════════════════════════════════════════════════════════

describe('A1 — agravante nunca cria emergência', () => {
  it('idoso com quadro laranja não é escalado a vermelho por idade', async () => {
    const t = await triar(
      {
        relato: 'tô com falta de ar',
        paraQuem: 'proprio',
        paciente: { agravantes: ['cardiopatia'], idade: 82, faixaEtaria: 'idoso' },
      },
      camada2Degradada,
    );
    expect(t.nivel).toBe('laranja');
    const teto = t.classificacao.explicacao.find((e) => e.etapa === 'agravante_teto');
    expect(teto).toBeDefined();
    expect(teto!.motivo).toContain('VERMELHO exige bandeira clínica própria');
  });

  it('a explicação registra quando o agravante NÃO se aplica', async () => {
    const t = await triar(
      {
        relato: 'tô com dor de garganta',
        paraQuem: 'proprio',
        paciente: { agravantes: ['diabetes', 'hipertensao'], idade: 63 },
      },
      camada2Degradada,
    );
    const nao = t.classificacao.explicacao.find((e) => e.etapa === 'agravante_nao_aplicado');
    expect(nao).toBeDefined();
    expect(nao!.motivo).toContain('matriz é condicionada');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// C6 — interruptor de desligamento
// ═══════════════════════════════════════════════════════════════════════════

describe('C6 — interruptor acessível à unidade', () => {
  it('desliga e religa, registrando quem e por quê', () => {
    expect(estadoSistema.ativo).toBe(true);
    desligarSistema('enfermeira', 'caso adverso em análise');
    expect(estadoSistema.ativo).toBe(false);
    expect(estadoSistema.desligadoPor).toBe('enfermeira');
    expect(estadoSistema.motivo).toBe('caso adverso em análise');
    religarSistema('retaguarda');
    expect(estadoSistema.ativo).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Integridade do protocolo
// ═══════════════════════════════════════════════════════════════════════════

describe('integridade do protocolo', () => {
  it('todo critério tem os campos obrigatórios e um achado de origem', () => {
    for (const c of CRITERIOS) {
      expect(c.id, c.id).toMatch(/^[a-z0-9]+\.[a-z0-9_]+$/);
      expect(c.titulo, c.id).toBeTruthy();
      expect(c.descricao.length, c.id).toBeGreaterThan(20);
      expect(ORDEM_NIVEIS, c.id).toContain(c.nivel);
      expect(c.comoAPessoaDescreve.length, c.id).toBeGreaterThan(0);
      expect(c.origem, c.id).toBeTruthy();
      expect(c, c.id).toHaveProperty('assinatura');
    }
  });

  it('não há IDs duplicados', () => {
    const ids = CRITERIOS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda bandeira vermelha irreversível traz orientação de primeiros minutos (A12)', () => {
    const semOrientacao = CRITERIOS
      .filter((c) => c.nivel === 'vermelho' && c.irreversivel)
      .filter((c) => !c.primeirosMinutos || c.primeirosMinutos.length === 0);
    expect(semOrientacao.map((c) => c.id)).toEqual([]);
  });

  it('há safety-netting definido para os cinco níveis', () => {
    for (const n of ORDEM_NIVEIS) {
      expect(SAFETY_NETTING[n].observar.length, n).toBeGreaterThan(0);
      expect(SAFETY_NETTING[n].voltarSe.length, n).toBeGreaterThan(0);
    }
  });

  it('as 12 lacunas tempo-dependentes de A5 estão cobertas', () => {
    const a5 = CRITERIOS.filter((c) => c.origem === 'A5');
    expect(a5.length).toBeGreaterThanOrEqual(12);
    expect(a5.every((c) => c.tempoDependente === true)).toBe(true);
  });

  it('a assinatura clínica é rastreável — e hoje está pendente em todos', () => {
    // Não é uma trava: os critérios funcionam. É transparência auditável.
    expect(criteriosPendentesDeAssinatura().length).toBe(CRITERIOS.length);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// A11 — gestação detectada no texto, sem IA
// ═══════════════════════════════════════════════════════════════════════════

describe('A11 — extração determinística de gestação', () => {
  it('"grávida de 8 meses" roteia para a maternidade mesmo em modo degradado', async () => {
    const t = await triar(
      {
        relato: 'grávida de 8 meses com febre e ardência pra urinar',
        paraQuem: 'proprio',
        paciente: { agravantes: [] },
      },
      camada2Degradada,
    );
    expect(t.camada1.gestacao?.detectada).toBe(true);
    expect(t.camada1.gestacao?.semanas).toBe(32);
    expect(t.roteamento.destino).toBe('maternidade');
  });

  it('lê semanas quando informadas em semanas', async () => {
    const t = await triar(
      { relato: 'estou grávida de 34 semanas e com dor lombar', paraQuem: 'proprio', paciente: { agravantes: [] } },
      camada2Degradada,
    );
    expect(t.camada1.gestacao?.semanas).toBe(34);
  });

  it('gestação sem idade informada é tratada como acima do limiar — a decisão segura', async () => {
    const t = await triar(
      { relato: 'estou grávida e com dor na barriga', paraQuem: 'proprio', paciente: { agravantes: [] } },
      camada2Degradada,
    );
    expect(t.camada1.gestacao?.semanas).toBeNull();
    expect(t.roteamento.destino).toBe('maternidade');
  });

  it('o que a pessoa informou explicitamente prevalece sobre o texto', async () => {
    const t = await triar(
      {
        relato: 'grávida de 8 meses com dor na barriga',
        paraQuem: 'proprio',
        paciente: { agravantes: [], gestante: { semanas: 10 } },
      },
      camada2Degradada,
    );
    // 10 semanas está abaixo do limiar: segue o fluxo geral, não a maternidade.
    expect(t.roteamento.destino).not.toBe('maternidade');
  });

  it('não inventa gestação onde não há', async () => {
    const t = await triar(
      { relato: 'dor de garganta desde ontem', paraQuem: 'proprio', paciente: { agravantes: [] } },
      camada2Degradada,
    );
    expect(t.camada1.gestacao).toBeNull();
  });
});
