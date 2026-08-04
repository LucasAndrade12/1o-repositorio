/**
 * Regressões da segunda auditoria — os erros que rodar 315 relatos sintéticos revelou.
 *
 * Cada `it` abaixo foi um encaminhamento errado, um bug de motor, ou um domínio inteiro sem
 * critério, antes de virar teste. A meta não é 0% de não reconhecimento (impossível e
 * indesejável — relato vago DEVE cair no bloco fixo de segurança), mas garantir que nenhuma
 * dessas correções regrida em silêncio.
 */

import { describe, expect, it } from 'vitest';

import { CRITERIOS } from '@pra-onde-ir/protocolo';
import { triar, varrer, type DadosPaciente } from '@pra-onde-ir/motor';
import { camada2Degradada } from '@pra-onde-ir/ia';

const rec = (relato: string) => varrer(relato);
const nivelDe = async (relato: string, paciente: Partial<DadosPaciente> = {}) =>
  (await triar({ relato, paraQuem: 'proprio', paciente: { agravantes: [], ...paciente }, confirmouBandeira: true }, camada2Degradada)).nivel;

describe('bug de motor — fronteira de palavra na guarda de hipótese', () => {
  it('"apareceu uma ferida" não é descartado como hipótese ("parece" ⊂ "apareceu")', () => {
    // O bug: MARCADORES_HIPOTESE contém "parece", casado por substring dentro de "aPARECEu".
    // Toda frase "apareceu uma X" — comuníssima — caía em não reconhecido.
    const r = rec('apareceu uma ferida com pus no braço');
    expect(r.criteriosAcionados).toContain('lj.ferida_infectada');
  });

  it('a hipótese real continua descartando', () => {
    const r = rec('tenho medo de estar tendo um infarto, mas é só azia');
    expect(r.bandeiraVermelha).toBe(false);
  });
});

describe('bug de motor — febre infantil pela idade, não pela frase (A7)', () => {
  it('bebê de 2 meses com febre é VERMELHO', async () => {
    expect(rec('meu bebê de dois meses tá com febre').criteriosAcionados).toContain('ped.febre_menor_3_meses');
    expect(await nivelDe('meu bebê de dois meses tá com febre', { idade: 0, agravantes: ['crianca_menor_2'] })).toBe('vermelho');
  });

  it('bebê de 4 meses com febre é LARANJA, não vermelho', () => {
    const r = rec('neném de quatro meses com febre');
    expect(r.criteriosAcionados).toContain('ped.febre_3_a_6_meses');
    expect(r.criteriosAcionados).not.toContain('ped.febre_menor_3_meses');
  });

  it('"faz dois meses" (duração) não é lido como idade de bebê', () => {
    const r = rec('perdi 8 quilos em dois meses sem fazer dieta');
    expect(r.criteriosAcionados).not.toContain('ped.febre_menor_3_meses');
  });
});

describe('bug de motor — sepse independe da ordem das palavras', () => {
  it('"febre e muito confusa, respirando rápido" é sepse VERMELHO', () => {
    const r = rec('minha esposa tá com febre e muito confusa, respirando rápido');
    expect(r.criteriosAcionados).toContain('a5.sepse_adulto');
    expect(r.bandeiraVermelha).toBe(true);
  });

  it('confusão SEM febre não é sepse', () => {
    expect(rec('tô muito confusa com esse formulário').criteriosAcionados).not.toContain('a5.sepse_adulto');
  });
});

describe('emergência ou violência testemunhada sobre terceiro', () => {
  it('criança roxa que não consegue respirar é VERMELHO', () => {
    const r = rec('meu filho tá roxo e não consegue respirar');
    expect(r.bandeiraVermelha).toBe(true);
  });

  it('acidente de moto de vizinho, agora, com osso exposto é VERMELHO', () => {
    const r = rec('meu vizinho bateu de moto e o osso tá pra fora');
    expect(r.criteriosAcionados).toContain('vm.trauma_grave');
  });

  it('denúncia de maus-tratos infantil por vizinha é reconhecida', () => {
    const r = rec('minha vizinha bate no filho pequeno');
    expect(r.criteriosAcionados).toContain('vi.maus_tratos_infantil');
  });

  it('mas "vizinho desmaiou semana passada, quero saber" continua NÃO sendo emergência', () => {
    const r = rec('meu vizinho desmaiou semana passada, quero saber se preciso me preocupar');
    expect(r.bandeiraVermelha).toBe(false);
  });

  it('e a virose do vizinho não aciona nada', () => {
    expect(rec('meu vizinho tá gripado').criteriosAcionados).toEqual([]);
  });
});

describe('bandeiras tempo-dependentes que a auditoria acrescentou', () => {
  it('cefaleia thunderclap é VERMELHO', () => {
    expect(rec('dor de cabeça a pior da minha vida, começou de repente').bandeiraVermelha).toBe(true);
  });
  it('perda súbita de visão é VERMELHO', () => {
    expect(rec('perdi a visão de um olho de repente').bandeiraVermelha).toBe(true);
  });
  it('redução de movimento fetal é reconhecida e roteia gestante', () => {
    const r = rec('grávida de 7 meses e o bebê não mexe desde ontem');
    expect(r.criteriosAcionados).toContain('au.mov_fetal_reduzido');
    expect(r.gestacao?.detectada).toBe(true);
  });
  it('sangramento na gravidez é reconhecido', () => {
    expect(rec('tô grávida e sangrando um pouco').criteriosAcionados).toContain('au.sangramento_gestacional');
  });
  it('tosse por mais de três semanas com emagrecimento não fica em azul/casa', async () => {
    // "tosse" também é sintoma de síndrome gripal, então os dois critérios casam — mas TB
    // (AMARELO) lidera sobre gripal (AZUL) por gravidade, e o desfecho não é mais "fique em casa".
    const r = rec('tossindo há mais de três semanas e emagrecendo');
    expect(r.criteriosAcionados).toContain('au.tuberculose_suspeita');
    expect(await nivelDe('tossindo há mais de três semanas e emagrecendo')).toBe('amarelo');
  });
});

describe('domínios que não tinham nenhum critério (curadoria B11)', () => {
  const casos: [string, string][] = [
    ['tô com uma micose entre os dedos', 'cur.dermatose_cronica'],
    ['apareceu um caroço embaixo do braço que cresce', 'cur.lesao_cutanea_suspeita'],
    ['meu ouvido tá doendo muito', 'cur.otalgia'],
    ['tô com um zumbido no ouvido', 'cur.orl_cronico'],
    ['meu olho tá vermelho e remelando', 'cur.conjuntivite'],
    ['tô com um terçol no olho', 'cur.oftalmo_ambulatorial'],
    ['tô com dor de dente há três dias', 'cur.odontalgia'],
    ['tô com um corrimento amarelado', 'cur.corrimento_ist'],
    ['tô com tendinite no ombro', 'cur.dor_musculo_cronica'],
    ['tô com o colesterol alto no exame', 'cur.exame_alterado'],
    ['tô com azia todo dia', 'cur.dispepsia'],
    ['tô com prisão de ventre faz uma semana', 'cur.constipacao'],
    ['tô com hemorroida sangrando', 'cur.hemorroida'],
    ['meu peito tá inchado e doendo, tô amamentando', 'cur.mastite'],
    ['minha filha tá com piolho', 'cur.pediatria_comum'],
    ['meu açúcar deu 400 hoje', 'cur.glicemia_alta_assintomatica'],
    ['quero fazer o preventivo', 'cur.preventivo'],
  ];
  for (const [relato, criterio] of casos) {
    it(`"${relato}" → ${criterio}`, () => {
      expect(rec(relato).criteriosAcionados).toContain(criterio);
    });
  }
});

describe('prisão de ventre não é confundida com diarreia', () => {
  it('constipação não aciona o critério de diarreia', () => {
    const r = rec('tô com prisão de ventre faz uma semana');
    expect(r.criteriosAcionados).toContain('cur.constipacao');
    expect(r.criteriosAcionados).not.toContain('am.diarreia');
  });
});

describe('todos os critérios novos nascem pendentes de assinatura', () => {
  it('nenhum critério de origem auditoria/B11 vem assinado', () => {
    const novos = CRITERIOS.filter((c) => c.origem === 'auditoria' || (c.id.startsWith('cur.') || c.id.startsWith('au.')));
    expect(novos.length).toBeGreaterThan(20);
    expect(novos.every((c) => c.assinatura === null)).toBe(true);
  });
});
