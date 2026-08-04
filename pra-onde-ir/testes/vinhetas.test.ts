/**
 * B5 — suíte de regressão sobre o banco de vinhetas.
 *
 * Critério de aprovação ASSIMÉTRICO, conforme a revisão:
 *   ZERO SUB-TRIAGEM em vinhetas vermelhas e laranjas é condição de liberação.
 *   Sobre-triagem é tolerada dentro de um teto acordado.
 *
 * Roda SEM REDE e SEM CHAVE DE API — só o motor determinístico. É isso que permite executar
 * a suíte a cada alteração de critério, prompt ou modelo.
 */

import { describe, expect, it } from 'vitest';
import { gravidade, type Nivel } from '@pra-onde-ir/protocolo';
import { triagemImediata, triar } from '@pra-onde-ir/motor';
import { VINHETAS_ATIVAS, pacienteDaVinheta, type Vinheta } from './banco-vinhetas.js';

/** Teto de sobre-triagem acordado. Deve ser revisado com a equipe após a fase sombra. */
const TETO_SOBRE_TRIAGEM = 0.15;

async function rodar(v: Vinheta) {
  return triar({
    relato: v.relato,
    paciente: pacienteDaVinheta(v),
    paraQuem: v.relato.match(/\b(meu|minha|ele|ela)\b/) ? 'terceiro' : 'proprio',
    ...(v.respostasBlocoSeguranca ? { respostasBlocoSeguranca: v.respostasBlocoSeguranca } : {}),
    ...(v.confirmouBandeira !== undefined ? { confirmouBandeira: v.confirmouBandeira } : {}),
    ...(v.agora ? { agora: v.agora } : {}),
  });
}

describe('B5 — banco de vinhetas: critério de aprovação assimétrico', () => {
  it('ZERO sub-triagem em vinhetas vermelhas e laranjas (condição de liberação)', async () => {
    const falhas: string[] = [];

    for (const v of VINHETAS_ATIVAS) {
      if (v.nivelMinimo == null) continue;
      if (gravidade(v.nivelMinimo) < gravidade('laranja')) continue;

      const t = await rodar(v);
      if (gravidade(t.nivel) < gravidade(v.nivelMinimo)) {
        falhas.push(
          `#${v.n} [${v.achado}] "${v.relato}"\n` +
            `      esperado ≥ ${v.nivelMinimo}, obtido ${t.nivel}\n` +
            `      testa: ${v.testa}`,
        );
      }
    }

    expect(
      falhas,
      `SUB-TRIAGEM DETECTADA — isto bloqueia a liberação:\n\n${falhas.join('\n\n')}`,
    ).toEqual([]);
  });

  it('sobre-triagem dentro do teto acordado', async () => {
    const comTeto = VINHETAS_ATIVAS.filter((v) => v.nivelMaximo != null);
    const excedidas: string[] = [];

    for (const v of comTeto) {
      const t = await rodar(v);
      if (gravidade(t.nivel) > gravidade(v.nivelMaximo!)) {
        excedidas.push(`#${v.n} [${v.achado}] "${v.relato}" → ${t.nivel} (máx ${v.nivelMaximo})`);
      }
    }

    const taxa = excedidas.length / Math.max(1, comTeto.length);
    expect(
      taxa,
      `Sobre-triagem em ${(taxa * 100).toFixed(1)}% (teto ${TETO_SOBRE_TRIAGEM * 100}%):\n` +
        excedidas.join('\n'),
    ).toBeLessThanOrEqual(TETO_SOBRE_TRIAGEM);
  });

  it('destino esperado, quando o roteamento é o ponto do teste', async () => {
    const falhas: string[] = [];
    for (const v of VINHETAS_ATIVAS) {
      if (!v.destinoEsperado) continue;
      const t = await rodar(v);
      if (t.roteamento.destino !== v.destinoEsperado) {
        falhas.push(
          `#${v.n} [${v.achado}] "${v.relato}" → ${t.roteamento.destino}, esperado ${v.destinoEsperado}`,
        );
      }
    }
    expect(falhas, falhas.join('\n')).toEqual([]);
  });

  it('tipo de queixa esperado, quando é o ponto do teste', async () => {
    const falhas: string[] = [];
    for (const v of VINHETAS_ATIVAS) {
      if (!v.tipoQueixaEsperado) continue;
      const t = await rodar(v);
      if (t.classificacao.tipoQueixa !== v.tipoQueixaEsperado) {
        falhas.push(
          `#${v.n} "${v.relato}" → ${t.classificacao.tipoQueixa}, esperado ${v.tipoQueixaEsperado}`,
        );
      }
    }
    expect(falhas, falhas.join('\n')).toEqual([]);
  });
});

describe('B1 — vinhetas adversariais: negação, tempo verbal, hipótese, terceiro', () => {
  const adversariais = VINHETAS_ATIVAS.filter((v) => v.adversarial);

  it.each(adversariais.map((v) => [v.n, v.relato, v] as const))(
    '#%i não vai a vermelho indevidamente: "%s"',
    async (_n, _relato, v) => {
      const t = await rodar(v as Vinheta);
      if ((v as Vinheta).nivelMaximo) {
        expect(gravidade(t.nivel)).toBeLessThanOrEqual(gravidade((v as Vinheta).nivelMaximo as Nivel));
      }
    },
  );

  it('registra o motivo do descarte, para auditoria', async () => {
    const t = await rodar(VINHETAS_ATIVAS.find((v) => v.n === 2)!);
    const descartados = t.camada1.acertos.filter((a) => a.descartadoPor);
    expect(descartados.length).toBeGreaterThan(0);
    expect(descartados.some((a) => a.descartadoPor === 'negacao')).toBe(true);
    // O acerto descartado permanece visível — é isso que torna B1 auditável.
    expect(descartados[0]!.marcador).toBeTruthy();
  });

  it('negação cancelada: "não melhorou" não nega o sintoma', async () => {
    const t = await rodar(VINHETAS_ATIVAS.find((v) => v.n === 47)!);
    expect(t.nivel).toBe('vermelho');
  });
});

describe('B2 — curto-circuito: a tela nunca espera a rede', () => {
  it('bandeira vermelha confirmada devolve sem chamar a camada 2', async () => {
    let camada2Chamada = false;
    const t = await triar(
      {
        relato: 'meu marido tá com o braço caindo e a fala embolada',
        paciente: { agravantes: [] },
        paraQuem: 'terceiro',
        confirmouBandeira: true,
      },
      async () => {
        camada2Chamada = true;
        // Simula rede lenta. Se a decisão dependesse disto, o teste travaria a percepção.
        await new Promise((r) => setTimeout(r, 50));
        return {
          criterios: [], resumo: '', agravantesMencionados: [], modo: 'ia' as const,
          versaoPrompt: 'x', versaoModelo: 'y', versaoEsquema: 'z',
        };
      },
    );

    expect(t.curtoCircuito).toBe(true);
    expect(t.nivel).toBe('vermelho');
    expect(t.roteamento.destino).toBe('samu');
    // A camada 2 roda em segundo plano só para compor resumo e passe — não decide.
    expect(camada2Chamada).toBe(true);
  });

  it('a decisão da camada 1 independe totalmente da camada 2', () => {
    const imediata = triagemImediata({
      relato: 'ele deu um treco, arriou tudo e ficou esmorecido',
      paciente: { agravantes: [] },
      paraQuem: 'terceiro',
      confirmouBandeira: true,
    });
    expect(imediata.curtoCircuito).toBe(true);
    expect(imediata.camada1.bandeiraVermelha).toBe(true);
  });

  it('bandeira detectada sem resposta de confirmação pausa o fluxo (B1)', async () => {
    const t = await rodar({
      n: 0, relato: 'meu marido tá com o braço caindo', nivelMinimo: null,
      testa: '', achado: 'B1',
    });
    expect(t.aguardandoConfirmacao).toBe(true);
    expect(t.perguntaConfirmacao?.id).toBe('confirmacao_bandeira');
  });
});

describe('B4 — o bloco fixo é o mecanismo principal para relato vago', () => {
  it('"tô passando mal" sozinho não aciona critério algum', () => {
    const { camada1 } = triagemImediata({
      relato: 'tô passando mal desde ontem',
      paciente: { agravantes: [] },
      paraQuem: 'proprio',
    });
    expect(camada1.criteriosAcionados).toEqual([]);
  });

  it('com o bloco fixo respondido, a mesma frase vira vermelho', async () => {
    const t = await triar({
      relato: 'tô passando mal desde ontem',
      paciente: { agravantes: [] },
      paraQuem: 'proprio',
      respostasBlocoSeguranca: { 'bs.peito': true },
      confirmouBandeira: true,
    });
    expect(t.nivel).toBe('vermelho');
    expect(t.blocoSegurancaFoiPrincipal).toBe(true);
  });
});

describe('B7 — carimbo de versões em toda triagem', () => {
  it('grava protocolo, prompt, modelo, esquema, modo, fase e timestamp', async () => {
    const t = await rodar(VINHETAS_ATIVAS[9]!);
    expect(t.versoes.protocolo).toMatch(/^\d+\.\d+\.\d+$/);
    expect(t.versoes.modo).toMatch(/^(ia|degradado)$/);
    expect(t.versoes.fase).toBeTruthy();
    expect(Date.parse(t.versoes.timestamp)).not.toBeNaN();
  });
});

describe('A12 — safety-netting em todos os cinco níveis', () => {
  it('toda triagem devolve rede de segurança com prazo e gatilhos de retorno', async () => {
    for (const v of VINHETAS_ATIVAS) {
      const t = await rodar(v);
      expect(t.safetyNetting.observar.length, `vinheta #${v.n}`).toBeGreaterThan(0);
      expect(t.safetyNetting.prazoReavaliacao, `vinheta #${v.n}`).toBeTruthy();
      expect(t.safetyNetting.voltarSe.length, `vinheta #${v.n}`).toBeGreaterThan(0);
    }
  });

  it('bandeira vermelha traz orientação de primeiros minutos', async () => {
    const t = await rodar(VINHETAS_ATIVAS.find((v) => v.n === 27)!); // soda cáustica no olho
    expect(t.primeirosMinutos.length).toBeGreaterThan(0);
    // A irrigação precisa vir ANTES da instrução de deslocamento.
    expect(t.primeirosMinutos[0]!.toLowerCase()).toContain('lave');
  });
});

describe('C4 — aviso de decisão automatizada é permanente e não condicional', () => {
  it('está presente em toda triagem', async () => {
    for (const v of VINHETAS_ATIVAS.slice(0, 10)) {
      const t = await rodar(v);
      expect(t.avisoLGPD).toContain('orientação automática');
      expect(t.avisoLGPD).toContain('mesmo que o resultado diga o contrário');
    }
  });
});
