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

describe('segunda auditoria (445 relatos) — emergências por paráfrase', () => {
  // Em modo degradado, sem a IA, a camada 1 é a ÚNICA rede das bandeiras vermelhas. Cada uma
  // destas caía em AMARELO por variação de conjugação antes de virar teste.
  const vermelhas: [string, string][] = [
    ['minha filha comeu amendoim e a boca tá inchando', 'vm.anafilaxia'],
    ['meu esposo tá com metade do corpo dormente de repente', 'vm.avc'],
    ['meu pai parou de responder e tá com a respiração estranha', 'vm.rebaixamento'],
    ['tô sem conseguir respirar direito, o peito fecha', 'vm.falta_ar_grave'],
    ['meu vizinho se cortou e o sangue não para de jorrar', 'vm.hemorragia_ativa'],
    ['tomei um monte de comprimido, não aguento mais viver', 'vm.risco_autoprovocado_iminente'],
    ['tô com vontade de me matar e já pensei como', 'vm.risco_autoprovocado_iminente'],
    ['dor forte de cabeça que começou de repente', 'au.cefaleia_thunderclap'],
  ];
  for (const [relato, criterio] of vermelhas) {
    it(`"${relato}" → ${criterio} (vermelho)`, () => {
      const r = rec(relato);
      expect(r.criteriosAcionados).toContain(criterio);
      expect(r.bandeiraVermelha).toBe(true);
    });
  }
});

describe('segunda auditoria — trilha de violência não falha por paráfrase', () => {
  const casos: [string, string][] = [
    ['meu marido me bateu e tô com medo de voltar pra casa', 'vi.violencia_domestica'],
    ['meu namorado me ameaça e não me deixa sair', 'vi.violencia_domestica'],
    ['fui forçada por um homem ontem à noite', 'vi.violencia_sexual'],
    ['minha vizinha vive batendo nos filhos pequenos', 'vi.maus_tratos_infantil'],
    ['meu pai idoso tá sendo maltratado pela cuidadora', 'vi.violencia_idoso'],
  ];
  for (const [relato, criterio] of casos) {
    it(`"${relato}" → ${criterio}`, () => {
      expect(rec(relato).criteriosAcionados).toContain(criterio);
    });
  }
});

describe('segunda auditoria — urgências e janela de hipótese', () => {
  it('açúcar em 500 com vômito é hiperglicemia (não fica em não reconhecido)', () => {
    expect(rec('minha diabética tá com o açúcar em 500 e vomitando').criteriosAcionados).toContain('lj.hiperglicemia');
  });
  it('não conseguir fazer xixi desde ontem é retenção urinária', () => {
    expect(rec('não consigo fazer xixi desde ontem e a barriga doeu').criteriosAcionados).toContain('a5.retencao_urinaria');
  });
  it('a janela de hipótese não engole o sintoma que vem depois do palpite', () => {
    // "acho que é dengue" é palpite; "febre" logo depois é sintoma real e deve ser reconhecido.
    const r = rec('acho que é dengue, tô com febre e dor no corpo');
    expect(r.criteriosAcionados.length).toBeGreaterThan(0);
  });
  it('pele e olhos amarelos (icterícia) é reconhecido', () => {
    expect(rec('meu tio tá amarelo dos olhos e da pele').criteriosAcionados).toContain('cur.ictericia');
  });
});

describe('terceira auditoria (490 relatos potiguares) — «num» é «não»', () => {
  // O defeito de maior alcance encontrado: o catálogo está escrito com "não" e o Nordeste
  // fala "num". Duas emergências ficavam MUDAS por uma palavra de três letras.
  const casos: [string, string][] = [
    ['painho desmaiou e num ta acordando', 'vm.rebaixamento'],
    ['meu vizinho se cortou e o sangue num para de jorrar', 'vm.hemorragia_ativa'],
    ['meu filho ta roxo e mole, num responde', 'vm.rebaixamento'],
    ['a criança se tremeu todo e num voltou direito', 'vm.convulsao'],
  ];
  for (const [relato, criterio] of casos) {
    it(`"${relato}" → ${criterio}`, () => {
      const r = rec(relato);
      expect(r.criteriosAcionados).toContain(criterio);
      expect(r.bandeiraVermelha).toBe(true);
    });
  }

  it('"num" continua negando quando é negação de verdade', () => {
    // A equivalência vale só para casar token; a guarda de negação segue lendo o texto original.
    expect(rec('ela num ta com a boca torta, só tonta').bandeiraVermelha).toBe(false);
  });

  it('"num" como contração de "em um" não vira negação de terceiro', () => {
    // "vi num vídeo" / "li num grupo" são marcadores de terceiro-não-paciente. Se `normalizar`
    // tivesse trocado num→nao globalmente, esses marcadores quebrariam.
    const r = rec('vi num video que dor no peito pode ser infarto');
    expect(r.bandeiraVermelha).toBe(false);
  });

  it('maus-tratos descritos como "batendo nos meninos" são reconhecidos', () => {
    expect(rec('minha vizinha vive batendo nos meninos dela').criteriosAcionados)
      .toContain('vi.maus_tratos_infantil');
  });

  it('criança agredida pelo padrasto é reconhecida', () => {
    expect(rec('meu filho apanhou do padrasto e ta com marca no braço').criteriosAcionados)
      .toContain('vi.maus_tratos_infantil');
  });
});

describe('todos os critérios novos nascem pendentes de assinatura', () => {
  it('nenhum critério de origem auditoria/B11 vem assinado', () => {
    const novos = CRITERIOS.filter((c) => c.origem === 'auditoria' || (c.id.startsWith('cur.') || c.id.startsWith('au.')));
    expect(novos.length).toBeGreaterThan(20);
    expect(novos.every((c) => c.assinatura === null)).toBe(true);
  });
});
