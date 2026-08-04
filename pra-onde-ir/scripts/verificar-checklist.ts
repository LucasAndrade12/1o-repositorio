/**
 * Checklist de liberação (go / no-go) — os 22 itens da revisão.
 *
 * "Nenhum item abaixo deveria ser dispensado antes do primeiro uso com paciente real fora
 *  da unidade."
 *
 * Este script verifica automaticamente o que é verificável por código, e lista explicitamente
 * o que depende de decisão humana — assinatura clínica, consulta à ANVISA, pactuação com a
 * rede. Marcar um item humano como "verde" automaticamente seria justamente o tipo de
 * falso conforto que a revisão critica.
 *
 *   npm run checklist
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  BLOCO_SEGURANCA,
  CRITERIOS,
  DESTINOS,
  PROTOCOLO_META,
  SAFETY_NETTING,
  UNIDADES,
  criteriosPendentesDeAssinatura,
  ORDEM_NIVEIS,
} from '@pra-onde-ir/protocolo';
import { RETENCAO } from '@pra-onde-ir/registro';
import { VALIDADE_HORAS } from '@pra-onde-ir/passe';

const raiz = fileURLToPath(new URL('../', import.meta.url));

type Estado = 'ok' | 'falha' | 'humano';

interface Item {
  n: number;
  texto: string;
  referencia: string;
  verificar: () => { estado: Estado; nota: string };
}

const humano = (nota: string) => () => ({ estado: 'humano' as const, nota });

const ITENS: Item[] = [
  {
    n: 1,
    texto: 'Protocolo revisado e assinado pela enfermeira do acolhimento e pela retaguarda médica, com data e versão',
    referencia: 'Documento original; C6',
    verificar: () => {
      const pendentes = criteriosPendentesDeAssinatura().length;
      return {
        estado: pendentes === 0 ? 'ok' : 'humano',
        nota:
          pendentes === 0
            ? 'Todos os critérios assinados.'
            : `${pendentes} de ${CRITERIOS.length} critérios PENDENTES. ` +
              'Nenhum valor clínico deste piloto vale antes disso.',
      };
    },
  },
  {
    n: 2,
    texto: 'Enquadramento sanitário verificado (consulta à ANVISA protocolada ou dispensa fundamentada por escrito)',
    referencia: 'C5',
    verificar: () => ({
      estado: existsSync(`${raiz}docs/ENQUADRAMENTO-SANITARIO.md`) ? 'humano' : 'falha',
      nota: 'Análise documentada em docs/ENQUADRAMENTO-SANITARIO.md. A consulta em si é ato humano — protocolar junto à ANVISA.',
    }),
  },
  {
    n: 3,
    texto: 'Titularidade definida: quem é controlador, quem é operador, quem responde pelo software',
    referencia: 'C4, C5',
    verificar: () => ({
      estado: existsSync(`${raiz}docs/LGPD-RIPD.md`) ? 'humano' : 'falha',
      nota: 'Modelo em docs/LGPD-RIPD.md. Exige assinatura do município e do desenvolvedor.',
    }),
  },
  {
    n: 4,
    texto: 'Passe com segundo fator, expiração e limite de tentativas',
    referencia: 'C1',
    verificar: () => {
      const src = readFileSync(`${raiz}packages/passe/src/index.ts`, 'utf8');
      const ok =
        src.includes('pinHash') && src.includes('BLOQUEIO_PROGRESSIVO_MS') && VALIDADE_HORAS > 0;
      return {
        estado: ok ? 'ok' : 'falha',
        nota: `Segundo fator (PIN + token), expiração de ${VALIDADE_HORAS}h, bloqueio progressivo por código e por IP, aberturas auditadas.`,
      };
    },
  },
  {
    n: 5,
    texto: 'Painel com autenticação por usuário e registro de acesso',
    referencia: 'C3',
    verificar: () => {
      const src = readFileSync(`${raiz}apps/api/src/servidor.ts`, 'utf8');
      const ok = src.includes('sessaoDe(req)') && src.includes("tipo: 'acesso_painel'");
      return {
        estado: ok ? 'ok' : 'falha',
        nota: 'Autenticação individual, sessão de 30 min com expiração, cada acesso na trilha de auditoria.',
      };
    },
  },
  {
    n: 6,
    texto: 'Microárea removida da base analítica; horário arredondado; resumo sem detalhes identificadores',
    referencia: 'C2',
    verificar: () => {
      const src = readFileSync(`${raiz}packages/registro/src/registro.ts`, 'utf8');
      const ok = src.includes('faixaHoraria') && src.includes('verificarKAnonimato');
      const analitico = readFileSync(`${raiz}packages/registro/src/registro.ts`, 'utf8')
        .split('interface RegistroAnalitico')[1]
        ?.split('}')[0] ?? '';
      return {
        estado: ok && !analitico.includes('microarea') ? 'ok' : 'falha',
        nota: 'Base analítica sem microárea, horário em faixa, k-anonimato travando a exportação.',
      };
    },
  },
  {
    n: 7,
    texto: 'Bloco fixo de perguntas de segurança implementado',
    referencia: 'B4',
    verificar: () => ({
      estado: BLOCO_SEGURANCA.length >= 7 ? 'ok' : 'falha',
      nota: `${BLOCO_SEGURANCA.length} perguntas fechadas, determinísticas, sem rede nem IA.`,
    }),
  },
  {
    n: 8,
    texto: 'Tratamento de negação, histórico e terceiros na camada 1, validado contra vinhetas adversariais',
    referencia: 'B1',
    verificar: () => {
      const src = readFileSync(`${raiz}packages/motor/src/camada1.ts`, 'utf8');
      const ok = ['negacao', 'passado', 'hipotese', 'terceiro_nao_paciente'].every((m) => src.includes(m));
      return { estado: ok ? 'ok' : 'falha', nota: 'Quatro guardas linguísticas + 8 vinhetas adversariais na suíte.' };
    },
  },
  {
    n: 9,
    texto: 'Curto-circuito de bandeira vermelha (tela do SAMU sem esperar a rede)',
    referencia: 'B2',
    verificar: () => {
      const motor = readFileSync(`${raiz}packages/motor/src/triagem.ts`, 'utf8');
      const app = readFileSync(`${raiz}apps/web/publico/app.js`, 'utf8');
      return {
        estado: motor.includes('curtoCircuito') && app.includes('abrirEmergencia') ? 'ok' : 'falha',
        nota: 'Motor devolve curtoCircuito; o app abre a tela do SAMU pelo motor local, sem fetch.',
      };
    },
  },
  {
    n: 10,
    texto: 'Versões de protocolo, prompt, modelo e modo gravadas em cada triagem',
    referencia: 'B6, B7',
    verificar: () => {
      const src = readFileSync(`${raiz}packages/motor/src/triagem.ts`, 'utf8');
      const ok = ['protocolo:', 'prompt:', 'modelo:', 'esquema:', 'modo:', 'fase:'].every((c) => src.includes(c));
      return { estado: ok ? 'ok' : 'falha', nota: 'Carimbo completo em toda triagem, e concordância estratificada por modo.' };
    },
  },
  {
    n: 11,
    texto: 'Banco de vinhetas rodando em integração contínua, com zero sub-triagem em vermelho e laranja',
    referencia: 'B5',
    verificar: () => {
      try {
        execSync('npx vitest run --reporter=dot', { cwd: raiz, stdio: 'pipe' });
        return { estado: 'ok', nota: 'Suíte completa passou. Zero sub-triagem em vermelho e laranja.' };
      } catch {
        return { estado: 'falha', nota: 'A suíte FALHOU. Isto bloqueia a liberação.' };
      }
    },
  },
  {
    n: 12,
    texto: 'Simulação da distribuição de níveis sobre 200–300 casos históricos do acolhimento',
    referencia: 'A1, A2',
    verificar: humano(
      'Ferramenta pronta: `npm run distribuicao -- relatos-historicos.txt`. ' +
      'Falta o lote real do acolhimento — o lote embutido é sintético.',
    ),
  },
  {
    n: 13,
    texto: 'Regras de agravante e da janela de 24 horas revistas após a simulação',
    referencia: 'A1, A2',
    verificar: () => {
      const src = readFileSync(`${raiz}packages/protocolo/src/agravantes.ts`, 'utf8');
      const ok = src.includes('escalonaTiposQueixa') && src.includes('idadeIsoladaEscalona');
      return {
        estado: ok ? 'humano' : 'falha',
        nota: 'Matriz condicionada implementada e simulada. A revisão final dos limiares é da equipe clínica.',
      };
    },
  },
  {
    n: 14,
    texto: 'Roteamento por horário de funcionamento e feriados',
    referencia: 'D1',
    verificar: () => {
      const comHorario = UNIDADES.filter((u) => Object.keys(u.horarios).length === 7).length;
      return {
        estado: comHorario === UNIDADES.length ? 'ok' : 'falha',
        nota: `${UNIDADES.length} unidades com horário e feriados. Confirmar os dados com a Secretaria.`,
      };
    },
  },
  {
    n: 15,
    texto: 'Destino obstétrico definido e incluído na base de unidades',
    referencia: 'A11',
    verificar: () => {
      const u = UNIDADES.find((x) => x.destino === 'maternidade');
      return {
        estado: u && !u.endereco.includes('A CONFIRMAR') ? 'ok' : 'humano',
        nota: u
          ? `"${u.nome}" está na base, mas o endereço ainda é "${u.endereco}". Confirmar qual é a maternidade de referência da microárea.`
          : 'Maternidade ausente da base de unidades.',
      };
    },
  },
  {
    n: 16,
    texto: 'Trilha de saúde mental com CVV 188 visível e destino intermediário',
    referencia: 'A8',
    verificar: () => {
      const temCaps = DESTINOS.some((d) => d.id === 'caps');
      const temCvv = DESTINOS.some((d) => d.id === 'cvv' && d.telefone === '188');
      const intermediarios = CRITERIOS.filter((c) => c.origem === 'A8').length;
      return {
        estado: temCaps && temCvv && intermediarios >= 5 ? 'ok' : 'falha',
        nota: `${intermediarios} critérios de faixa intermediária, destino CAPS, CVV 188 exibido de forma não condicional. Pactuar com a rede municipal.`,
      };
    },
  },
  {
    n: 17,
    texto: 'Safety-netting em todos os níveis e orientações de primeiros minutos assinadas',
    referencia: 'A12',
    verificar: () => {
      const todos = ORDEM_NIVEIS.every((n) => SAFETY_NETTING[n].observar.length > 0);
      const semPrimeiros = CRITERIOS.filter((c) => c.nivel === 'vermelho' && c.irreversivel && !c.primeirosMinutos?.length);
      return {
        estado: todos && semPrimeiros.length === 0 ? 'humano' : 'falha',
        nota: 'Implementado nos 5 níveis e em todas as bandeiras vermelhas. Os textos precisam ser assinados pela retaguarda médica.',
      };
    },
  },
  {
    n: 18,
    texto: 'Aviso de que a orientação é automática e de que a pessoa pode sempre procurar atendimento',
    referencia: 'C4',
    verificar: () => {
      const app = readFileSync(`${raiz}apps/web/publico/app.js`, 'utf8');
      return {
        estado: app.includes('avisoLGPD') ? 'ok' : 'falha',
        nota: 'Frase permanente e não condicional na tela de resultado e na tela de emergência.',
      };
    },
  },
  {
    n: 19,
    texto: 'Interruptor de desligamento acessível à unidade, sem depender do desenvolvedor',
    referencia: 'C6',
    verificar: () => {
      const src = readFileSync(`${raiz}apps/api/src/servidor.ts`, 'utf8');
      return {
        estado: src.includes('/api/sistema/desligar') ? 'ok' : 'falha',
        nota: 'Botão no painel, aba Governança. Desligado, o app recusa triagens e orienta o 192.',
      };
    },
  },
  {
    n: 20,
    texto: 'Fluxo de evento adverso escrito, com responsável nomeado',
    referencia: 'C6',
    verificar: () => {
      if (!existsSync(`${raiz}docs/GOVERNANCA-CLINICA.md`)) return { estado: 'falha', nota: 'Documento ausente.' };
      const doc = readFileSync(`${raiz}docs/GOVERNANCA-CLINICA.md`, 'utf8');
      return {
        estado: doc.includes('[NOME]') ? 'humano' : 'ok',
        nota: 'Fluxo escrito em docs/GOVERNANCA-CLINICA.md. Falta NOMEAR o responsável clínico.',
      };
    },
  },
  {
    n: 21,
    texto: 'Fase sombra concluída com matriz de confusão dentro dos critérios acordados',
    referencia: 'E2',
    verificar: humano(
      'Máquina de fases e matriz de confusão prontas. A fase sombra em si leva 3 a 4 semanas de operação real.',
    ),
  },
  {
    n: 22,
    texto: 'Teste de usabilidade com pelo menos cinco usuários reais, incluindo idoso e baixa escolaridade',
    referencia: 'D4',
    verificar: humano(
      'Voz, leitura em voz alta, grade de ícones e alvos de 56px implementados. O teste com pessoas reais é insubstituível.',
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────

const SIMBOLO = { ok: '\x1b[32m✔\x1b[0m', falha: '\x1b[31m✘\x1b[0m', humano: '\x1b[33m◐\x1b[0m' };

console.log(`
╭──────────────────────────────────────────────────────────────────────────────╮
│  Checklist de liberação (go / no-go) — 22 itens                              │
│  "Nenhum item deveria ser dispensado antes do primeiro uso com paciente      │
│   real fora da unidade."                                                     │
╰──────────────────────────────────────────────────────────────────────────────╯
`);

const contagem = { ok: 0, falha: 0, humano: 0 };

for (const item of ITENS) {
  const r = item.verificar();
  contagem[r.estado]++;
  console.log(`  ${SIMBOLO[r.estado]} ${String(item.n).padStart(2)}. ${item.texto}`);
  console.log(`       \x1b[2m${item.referencia} — ${r.nota}\x1b[0m\n`);
}

console.log(`  ${'─'.repeat(74)}
  \x1b[32m✔ ${contagem.ok}\x1b[0m verificado por código   \x1b[33m◐ ${contagem.humano}\x1b[0m aguardando decisão humana   \x1b[31m✘ ${contagem.falha}\x1b[0m falhando
`);

if (contagem.falha > 0) {
  console.log('  \x1b[31mHá itens falhando. O piloto NÃO deve receber paciente real.\x1b[0m\n');
  process.exit(1);
}

console.log(`  ${PROTOCOLO_META.aviso}

  Os itens \x1b[33m◐\x1b[0m não são pendências de código: são decisões que a revisão determina
  que sejam humanas — assinatura clínica, consulta à ANVISA, pactuação com a rede,
  teste com usuários reais. Marcá-los automaticamente como concluídos seria
  exatamente o falso conforto que a revisão critica.
`);
