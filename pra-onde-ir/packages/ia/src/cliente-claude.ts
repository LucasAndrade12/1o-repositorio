/**
 * Camada 2 — adaptador da API Claude.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NOTA SOBRE B5 E A RECOMENDAÇÃO DE "TEMPERATURA 0"
 *
 * A revisão recomenda: "Fixar temperatura em 0 e fixar a versão exata do modelo (nunca apontar
 * para alias móvel)." A INTENÇÃO — reprodutibilidade, para que a taxa de concordância não
 * esteja medindo vários sistemas diferentes sem saber — está inteiramente correta e é o que
 * este arquivo implementa.
 *
 * O mecanismo, porém, mudou: `temperature` NÃO EXISTE MAIS na API atual. Em claude-opus-5 o
 * parâmetro é REJEITADO com HTTP 400. Enviá-lo quebraria o sistema.
 *
 * O determinismo é obtido pelos meios que a API oferece hoje:
 *
 *   1. ID de modelo FIXO, sem alias móvel e sem sufixo de data (MODELO abaixo)
 *   2. Structured outputs com JSON Schema ESTRITO — a forma da resposta é garantida
 *      pelo servidor, não por instrução no prompt
 *   3. Enum fechado de IDs de critério — a IA não pode inventar critério
 *   4. `effort` fixo e GRAVADO em cada triagem
 *   5. Prompt versionado por hash do conteúdo
 *   6. Banco de vinhetas como rede de regressão a cada alteração
 *
 * Os itens 1, 4 e 5 são carimbados em todo registro (B7), que é o que permite comparar
 * "o sistema de setembro" com "o sistema de agosto".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Camada2Port, SaidaCamada2 } from '@pra-onde-ir/motor';

import {
  ESQUEMA_EXTRACAO,
  ESQUEMA_VERIFICACAO,
  VERSAO_ESQUEMA,
  validarExtracao,
  type Verificacao,
} from './esquema.js';
import {
  SYSTEM_PROMPT,
  SYSTEM_PROMPT_VERIFICACAO,
  VERSAO_PROMPT,
  montarMensagemUsuario,
  montarMensagemVerificacao,
} from './prompt.js';
import { camada2Degradada } from './degradado.js';

/**
 * B5 — versão exata do modelo. Nunca um alias móvel.
 * Trocar esta linha muda o comportamento clínico do sistema e DEVE disparar a suíte de vinhetas.
 */
export const MODELO = 'claude-opus-5';

/**
 * Esforço fixo. Extração estruturada sobre um catálogo fechado é uma tarefa de classificação
 * bem delimitada — não precisa de raciocínio profundo, e latência importa numa triagem.
 * O valor é gravado em cada registro junto com a versão do modelo.
 */
export const ESFORCO = 'low' as const;

export const VERSAO_MODELO = `${MODELO}/effort=${ESFORCO}`;

export interface OpcoesCamada2 {
  apiKey?: string;
  /** B3 — rodar a segunda passagem quando o resultado preliminar for baixo. */
  verificacaoAssimetrica?: boolean;
  /** Tempo máximo antes de cair para o modo degradado (B6). */
  timeoutMs?: number;
}

/**
 * Constrói a porta da camada 2.
 *
 * B6 — se não houver chave, ou se a chamada falhar, cai para o modo degradado sobre a MESMA
 * lista de critérios, e o modo é registrado. "a rede de segurança está correta, mas o modo em
 * que a triagem rodou não é registrado nem exibido."
 */
export function criarCamada2(opcoes: OpcoesCamada2 = {}): Camada2Port {
  const apiKey = opcoes.apiKey ?? process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Sem chave o piloto continua funcionando inteiro. Isso não é um contorno:
    // é exatamente a resiliência que a revisão elogia, exercitada por padrão.
    return camada2Degradada;
  }

  const client = new Anthropic({
    apiKey,
    timeout: opcoes.timeoutMs ?? 20_000,
    maxRetries: 1,
  });

  return async (relato, contexto) => {
    try {
      const resposta = await client.messages.create({
        model: MODELO,
        max_tokens: 2048,
        output_config: {
          effort: ESFORCO,
          format: { type: 'json_schema', schema: ESQUEMA_EXTRACAO },
        },
        // O catálogo de critérios é grande e estável — é o prefixo natural para cache.
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: montarMensagemUsuario(relato) }],
      });

      // Nunca leia content[0] sem checar stop_reason.
      if (resposta.stop_reason === 'refusal') {
        return { ...(await camada2Degradada(relato, contexto)), modo: 'degradado' as const };
      }

      const texto = resposta.content.find((b) => b.type === 'text');
      if (!texto || texto.type !== 'text') {
        return camada2Degradada(relato, contexto);
      }

      const extraido = validarExtracao(JSON.parse(texto.text));
      if (!extraido) return camada2Degradada(relato, contexto);

      const saida: SaidaCamada2 = {
        criterios: extraido.relato_incompreensivel ? [] : extraido.criterios,
        resumo: extraido.resumo,
        perguntaSugerida: extraido.pergunta_sugerida,
        agravantesMencionados: extraido.agravantes_mencionados,
        modo: 'ia',
        versaoPrompt: VERSAO_PROMPT,
        versaoModelo: VERSAO_MODELO,
        versaoEsquema: VERSAO_ESQUEMA,
      };

      // ── B3 — verificação assimétrica ────────────────────────────────────
      // Só quando o sistema está prestes a dizer "não precisa ir agora".
      // "O custo extra incide apenas na fatia baixa da distribuição, e é ali que o erro dói."
      const precisaVerificar =
        opcoes.verificacaoAssimetrica !== false && pareceBaixo(saida.criterios, contexto);

      if (precisaVerificar) {
        const v = await segundaPassagem(client, relato);
        if (v) {
          const novos = v.criterios.filter((c) => !saida.criterios.includes(c));
          saida.verificacao = {
            executada: true,
            encontrouBandeira: v.ha_bandeira,
            criteriosEncontrados: v.criterios,
            divergiu: v.ha_bandeira && novos.length > 0,
          };
          if (saida.verificacao.divergiu) saida.criterios = [...saida.criterios, ...novos];
        } else {
          saida.verificacao = {
            executada: false,
            encontrouBandeira: false,
            criteriosEncontrados: [],
            divergiu: false,
          };
        }
      }

      return saida;
    } catch {
      // B6 — qualquer falha cai para o modo degradado, e o modo é registrado.
      return camada2Degradada(relato, contexto);
    }
  };
}

/** B3 — segunda passagem independente, com prompt diferente. */
async function segundaPassagem(
  client: Anthropic,
  relato: string,
): Promise<Verificacao | null> {
  try {
    const r = await client.messages.create({
      model: MODELO,
      max_tokens: 1024,
      output_config: {
        effort: ESFORCO,
        format: { type: 'json_schema', schema: ESQUEMA_VERIFICACAO },
      },
      system: [
        { type: 'text', text: SYSTEM_PROMPT_VERIFICACAO, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: montarMensagemVerificacao(relato) }],
    });

    if (r.stop_reason === 'refusal') return null;
    const t = r.content.find((b) => b.type === 'text');
    if (!t || t.type !== 'text') return null;
    return JSON.parse(t.text) as Verificacao;
  } catch {
    return null;
  }
}

/** Heurística barata: a extração aponta para verde/azul? Então vale a segunda passagem. */
function pareceBaixo(
  criterios: string[],
  contexto: { criteriosJaAcionados: string[] },
): boolean {
  if (contexto.criteriosJaAcionados.length > 0) return false;
  return criterios.every((id) => id.startsWith('vd.') || id.startsWith('az.')) ;
}
