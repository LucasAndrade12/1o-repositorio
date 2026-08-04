/**
 * Integridade do dicionário regional (B1).
 *
 * Um dicionário de regionalismos apodrece em silêncio: alguém renomeia um termo em
 * `comoAPessoaDescreve`, e a expressão local passa a traduzir para um termo canônico que não
 * existe mais. Nada quebra, nada avisa — o relato simplesmente volta a cair em "não
 * reconhecido", que é justamente o buraco que o dicionário existia para tapar.
 *
 * Estes testes tornam esse apodrecimento impossível de passar despercebido.
 */

import { describe, expect, it } from 'vitest';

import {
  DICIONARIO_REGIONAL,
  NOTAS_NOSOLOGIA_POPULAR,
  TOTAL_REGIONALISMOS,
  expandirRegionalismos,
  normalizar,
} from '@pra-onde-ir/protocolo';
import { varrer } from '@pra-onde-ir/motor';

/**
 * Expressões que carregam CONTEXTO, não sintoma. Não precisam acionar critério sozinhas:
 * mudam o roteamento (gestação) ou o sujeito, e só ganham sentido somadas a uma queixa.
 */
const CONTEXTUAIS = new Set([
  'de bucho', 'embuchada', 'esperando neném', 'esperando bebe', 'de barriga', 'barriguda',
  'pesada', 'de resguardo', 'no resguardo', 'ganhei neném faz pouco', 'pari faz pouco',
  'dor de parto',
]);

describe('dicionário regional — integridade', () => {
  it('toda expressão do dicionário é reconhecida por alguma via', () => {
    // Reconhecida = aciona critério, OU é sinal de alarme (A3), OU é sintoma/alarme do
    // módulo de arbovirose (A6). As três vias existem; o que não pode é a expressão ser
    // muda — traduzir para um termo canônico que nenhum índice do motor enxerga.
    const mudas: string[] = [];

    for (const [expressao, canonico] of Object.entries(DICIONARIO_REGIONAL)) {
      if (CONTEXTUAIS.has(expressao)) continue;
      const r = varrer(expressao);
      const reconhecida =
        r.criteriosAcionados.length > 0 ||
        r.sinaisDeAlarme.length > 0 ||
        r.arbovirose.sintomas.length > 0 ||
        r.arbovirose.alarmes.length > 0;
      if (!reconhecida) mudas.push(`"${expressao}" → "${canonico}"`);
    }

    expect(
      mudas,
      `${mudas.length} expressão(ões) do dicionário não chegam a lugar algum do motor. ` +
        `Ou o termo canônico saiu de comoAPessoaDescreve, ou a expressão é decorativa:\n\n` +
        mudas.join('\n'),
    ).toEqual([]);
  });

  it('as expressões contextuais de gestação são detectadas como gestação (A11)', () => {
    for (const expressao of ['de bucho', 'embuchada', 'esperando neném', 'de resguardo']) {
      const r = varrer(`${expressao} e com febre`);
      expect(r.gestacao?.detectada, `"${expressao}" deveria marcar gestação`).toBe(true);
    }
  });

  it('toda nota de nosologia popular corresponde a uma entrada real do dicionário', () => {
    const chaves = new Set(Object.keys(DICIONARIO_REGIONAL).map((k) => normalizar(k)));
    for (const termo of Object.keys(NOTAS_NOSOLOGIA_POPULAR)) {
      const presente =
        chaves.has(normalizar(termo)) ||
        [...chaves].some((k) => k.includes(normalizar(termo)));
      expect(presente, `A nota de nosologia popular "${termo}" não existe no dicionário`).toBe(true);
    }
  });

  it('o contador exposto ao painel bate com o dicionário', () => {
    expect(TOTAL_REGIONALISMOS).toBe(Object.keys(DICIONARIO_REGIONAL).length);
  });
});

describe('casamento com fronteira de palavra', () => {
  it('não casa expressão no meio de outra palavra', () => {
    // "ingua" dentro de "linguagem", "mole" dentro de "molecada", "azia" dentro de "brasileira".
    const armadilhas = [
      'nao entendo a linguagem do documento',
      'a molecada ta na escola',
      'trabalho com moldes',
      'sou de uma familia grande',
    ];
    for (const texto of armadilhas) {
      const { traduzidos } = expandirRegionalismos(normalizar(texto));
      expect(traduzidos, `"${texto}" não deveria casar regionalismo algum`).toEqual([]);
    }
  });

  it('a expressão mais longa vence a mais curta contida nela', () => {
    const { traduzidos } = expandirRegionalismos(normalizar('to com uma dor de cabeça de rachar'));
    const de = traduzidos.map((t) => t.de);
    expect(de).toContain('dor de cabeca de rachar');
    expect(de).not.toContain('zoada na cabeca');
  });
});

describe('regionalismos que a revisão nomeia explicitamente', () => {
  it('"cansaço" chega a falta de ar — o regionalismo de maior impacto clínico', () => {
    const r = varrer('to com um cansaço danado pra andar dentro de casa');
    expect(r.criteriosAcionados).toContain('lj.dispneia_esforco');
    expect(r.regionalismos.map((x) => x.de)).toContain('cansaco');
  });

  it('"deu um treco" e "arriou tudo" chegam a rebaixamento de consciência', () => {
    for (const relato of ['minha mae deu um treco e arriou tudo']) {
      const r = varrer(relato);
      expect(r.bandeiraVermelha).toBe(true);
    }
  });

  it('"quentura" é febre', () => {
    const r = varrer('o menino ta com quentura desde ontem');
    expect(r.criteriosAcionados.length).toBeGreaterThan(0);
    expect(r.regionalismos.map((x) => x.de)).toContain('quentura');
  });

  it('"canseira" não vira emergência sozinha — sobe até laranja, não vermelho', () => {
    const r = varrer('to com canseira');
    expect(r.bandeiraVermelha).toBe(false);
  });

  /**
   * Regressão de um erro cometido ao expandir o dicionário: "azia" chegou a ser mapeada para
   * "queimação no peito com falta de ar", e a vinheta adversarial #4 do Anexo I quebrou na
   * hora. Dispepsia não é dor torácica isquêmica. O bloco fixo de segurança (B4) é quem
   * discrimina — o dicionário não adivinha.
   */
  it('dispepsia não é mapeada para dor torácica', () => {
    for (const relato of ['to com azia', 'queimacao no estomago', 'refluxo']) {
      const r = varrer(relato);
      expect(r.bandeiraVermelha, `"${relato}" não pode virar bandeira vermelha`).toBe(false);
      expect(r.criteriosAcionados).not.toContain('vm.dor_toracica');
    }
  });
});

/**
 * Regressões colhidas na auditoria de 315 relatos sintéticos (`npm run auditar`).
 * Cada uma foi um encaminhamento errado de verdade antes de virar teste.
 */
describe('auditoria dos 315 relatos — regressões', () => {
  it('contração da fala não esconde violência doméstica', () => {
    // "meu marido TÁ me batendo" não casava com "meu marido ESTÁ me batendo".
    const r = varrer('meu marido ta me batendo agora');
    expect(r.criteriosAcionados).toContain('vi.violencia_domestica');
  });

  it('convulsão no pretérito é reconhecida', () => {
    // "a criança convulsionou agora" caía em não reconhecido → UBS.
    const r = varrer('a criança convulsionou agora');
    expect(r.criteriosAcionados).toContain('vm.convulsao');
    expect(r.bandeiraVermelha).toBe(true);
  });

  it('hematoma de dedo não é cianose', () => {
    const r = varrer('bati o dedo na porta e ta roxo');
    expect(r.bandeiraVermelha).toBe(false);
    expect(r.criteriosAcionados).not.toContain('vm.falta_ar_grave');
  });

  it('candidíase oral de bebê não é sinal geral de perigo', () => {
    const r = varrer('meu bebe ta com sapinho na boca');
    expect(r.criteriosAcionados).not.toContain('ped.sinais_gerais_perigo');
  });

  it('demência crônica não é rebaixamento agudo de consciência', () => {
    const r = varrer('meu pai ta caducando, não conhece mais a gente');
    expect(r.bandeiraVermelha).toBe(false);
  });

  it('"dor de barriga" não marca gestação', () => {
    // 'de barriga' → 'grávida' fazia uma criança de 8 anos ser roteada à maternidade.
    const r = varrer('meu filho ta com dor de barriga faz dias');
    expect(r.gestacao).toBeNull();
  });

  it('edema de perna não é falta de ar', () => {
    const r = varrer('minha vó ta com a perna inchada e vermelha');
    expect(r.criteriosAcionados).not.toContain('lj.dispneia_esforco');
  });

  it('hipoglicemia é atribuída ao critério certo, não a dor torácica', () => {
    const r = varrer('meu açúcar caiu, fiquei tremendo e suando frio');
    expect(r.criteriosAcionados).toContain('vm.hipoglicemia');
    expect(r.criteriosAcionados).not.toContain('vm.dor_toracica');
  });
});

describe('as guardas de B1 continuam valendo sobre o texto expandido', () => {
  it('negação sobre regionalismo não dispara bandeira', () => {
    const r = varrer('ela não deu treco nenhum, só ta com dor de garganta');
    expect(r.bandeiraVermelha).toBe(false);
  });

  it('passado sobre regionalismo não dispara bandeira', () => {
    const r = varrer('ano passado ela arriou tudo, hoje ta só com o nariz escorrendo');
    const naoDescartados = r.acertos.filter((a) => !a.descartadoPor).map((a) => a.criterioId);
    expect(naoDescartados).not.toContain('vm.rebaixamento');
  });

  it('o regionalismo casado fica registrado no acerto, para auditoria', () => {
    const r = varrer('to com uma canseira braba');
    const viaRegional = r.acertos.filter((a) => a.viaRegionalismo);
    expect(viaRegional.length).toBeGreaterThan(0);
  });
});
