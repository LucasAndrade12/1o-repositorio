# Pra Onde Ir — código piloto

Implementação de referência do sistema de pré-triagem e orientação de destino no SUS descrito
em *"Pra Onde Ir — Revisão crítica de protocolo e arquitetura"* (03/08/2026), respondendo aos
**44 achados** da revisão: 9 críticos, 14 altos, 12 médios e 9 melhorias.

Unidade piloto: **UBS João Dias — Nova Parnamirim, Parnamirim/RN**.

> ⚠️ **Protocolo não validado clinicamente.** Todos os 64 critérios nascem com
> `assinatura: null`. Os valores são propostas de partida extraídas da revisão técnica, para
> discussão com a enfermeira do acolhimento e a retaguarda médica. O piloto roda para ser visto,
> testado e criticado — não para atender paciente real.

---

## Rodar

```bash
npm install
npm run build:web     # empacota o motor determinístico para o navegador
npm run dev           # http://localhost:3000
```

| | |
|---|---|
| App do paciente | http://localhost:3000/ |
| Painel da unidade | http://localhost:3000/painel — `enfermeira` / `piloto2026` |
| Protocolo em JSON | http://localhost:3000/api/protocolo |

**Sem `ANTHROPIC_API_KEY` o piloto roda inteiro.** A camada 1 é determinística e offline, e a
camada 2 cai para busca textual sobre a mesma lista de critérios, com `modo = degradado` gravado
em cada registro. Isso não é um contorno: é a resiliência que a revisão elogia, exercitada por
padrão (B6). Com a chave, a camada 2 real entra e o selo no painel muda.

```bash
npm test              # 58 testes — vinhetas, privacidade, métricas, roteamento
npm run vinhetas      # só o banco de vinhetas, verboso
npm run distribuicao  # simula a distribuição de níveis (a recomendação de sequência)
npm run checklist     # os 22 itens do go/no-go
npm run typecheck
```

---

## As três decisões que a revisão elogia, preservadas

A revisão registra três acertos estruturais *"antes das críticas, porque essas escolhas são o
que torna o restante corrigível"*. Nenhuma foi alterada — todas foram reforçadas:

1. **A IA não decide o destino.** A separação entre tradução de linguagem (camada 2) e
   classificação (camada 3) é mantida integralmente. O esquema da camada 2 tem enum fechado de
   IDs: ela não pode inventar critério, e não devolve nível nem destino.
2. **A varredura offline roda antes da rede.** Agora ela roda também *no navegador* — o mesmo
   TypeScript, empacotado para o PWA (B9). "Funciona apesar da internet ruim" deixou de ser
   promessa e virou propriedade verificável.
3. **A métrica de concordância está no produto desde o dia um.** Ela ganhou a matriz de confusão
   completa, que separa o que o botão único fundia (E1).

---

## Arquitetura

```
Relato
  │
  ├─ CAMADA 1 · determinística, offline, roda ANTES da rede
  │    negação · tempo verbal · hipótese · sujeito · regionalismos · injeção
  │    │
  │    └─ bandeira vermelha? ──► pergunta de confirmação (B1)
  │                              └─ confirmada ──► TELA DO SAMU AGORA (B2)
  │                                                a camada 2 roda em 2º plano
  │
  ├─ BLOCO FIXO DE SEGURANÇA · 7 perguntas fechadas, sem IA, sem rede (B4)
  │
  ├─ CAMADA 2 · IA traduz linguagem → critérios (nunca decide)
  │    JSON Schema estrito · enum fechado · relato como DADO
  │    └─ 2ª passagem quando o resultado é verde/azul (B3)
  │
  └─ CAMADA 3 · determinística
       agravantes condicionados (A1) · piso 24h com exceções (A2)
       │
       └─ ROTEAMENTO · nível ≠ destino (A10)
            a cor diz "quão rápido"; o destino diz "onde"
            15 pontos de atenção · horário · mobilidade · gestação
```

```
packages/
  protocolo/   dados clínicos versionados — zero dependências
  motor/       camadas 1 e 3 — isomórfico: mesmo código no servidor e no navegador
  ia/          camada 2 — Claude, esquema estrito, 2ª passagem, modo degradado
  registro/    versões, trilha append-only, anonimização, matriz de confusão
  passe/       segundo fator, expiração, rate limit, contrarreferência
apps/
  api/         servidor (node:http, sem framework)
  web/         PWA do paciente + painel da unidade + página do passe
testes/        banco de vinhetas + suíte de privacidade e métricas
docs/          governança clínica, LGPD/RIPD, enquadramento sanitário, rollout
```

**Por que monorepo TypeScript:** as camadas 1 e 3 precisam rodar no servidor *e* no navegador.
Duas implementações divergiriam em silêncio — exatamente o tipo de divergência que a revisão
condena em B5 e B7. Uma fonte de verdade clínica, dois ambientes de execução.

---

## Onde cada achado virou código

### Parte A — protocolo clínico

| | Achado | Onde |
|---|---|---|
| A1 | Agravantes globais de +1 nível | `protocolo/agravantes.ts` — matriz esparsa condicionada; idade isolada só em 75+; **teto: agravante nunca cria emergência** |
| A2 | Regra das 24h anula o AZUL | `criterios.ts` — `isentoPiso24h` em quadros nomeados; `motor/camada3.ts` |
| A3 | Pressão alta assintomática → UPA | `criterios.ts` — AMARELO + lesão de órgão-alvo em **qualquer** território |
| A4 | Escala numérica de dor | `criterios.ts` — descritores funcionais como gatilho primário |
| **A5** | 12 lacunas tempo-dependentes | `criterios.ts` — melena, torção testicular, corpo estranho, cauda equina, sepse, queimadura de via aérea, emergência ocular química, neutropenia febril, ectópica, choque/afogamento, retenção urinária, abdome vascular |
| **A6** | Sem rota para arbovirose | `criterios.ts` — `MODULO_ARBOVIROSE` com sinais de alarme e defervescência |
| A7 | Pediatria sem sinais gerais de perigo | `criterios.ts` — bloco AIDPI com fonte citada |
| **A8** | Saúde mental sem faixa intermediária | `criterios.ts` + `roteamento.ts` — CAPS como destino, **CVV 188 não condicional** |
| A9 | Violência ausente | `criterios.ts` — trilha própria + botão de saída rápida |
| A10 | Cinco destinos para a rede real | `roteamento.ts` — **15 pontos de atenção**, nível desacoplado de destino |
| **A11** | Gestante escalonada para a UPA | `roteamento.ts` — idade gestacional como variável de **roteamento** |
| A12 | Sem safety-netting nem primeiros socorros | `blocos.ts` — rede nos 5 níveis + "enquanto a ajuda não chega" |
| A13 | Destino inexecutável para acamado | `roteamento.ts` — fila de contato da equipe eSF |
| A14 | Critérios numéricos sem conduta | `criterios.ts` — equivalentes clínicos; hipoglicemia orienta **antes** do deslocamento |

### Parte B — arquitetura de decisão

| | Achado | Onde |
|---|---|---|
| **B1** | Busca textual sem negação/tempo/sujeito | `motor/camada1.ts` — 4 guardas + pergunta de confirmação determinística |
| B2 | Camada 1 não interrompe o fluxo | `motor/triagem.ts` — `curtoCircuito`; teste falha se esperar a rede |
| B3 | Falsos negativos sem rede de captura | `ia/cliente-claude.ts` — verificação assimétrica em verde/azul |
| **B4** | Sensibilidade depende do relato espontâneo | `protocolo/blocos.ts` — 7 perguntas fechadas |
| **B5** | Não determinismo sem regressão | `testes/vinhetas.test.ts` — critério assimétrico em CI |
| B6 | Modo degradado não sinalizado | `ia/degradado.ts` — `modo` gravado, exibido, e concordância estratificada |
| B7 | Versão ausente no registro | `motor/triagem.ts` — carimbo completo |
| B8 | "Uma pergunta" como regra de segurança | `blocos.ts` — roteiros fechados em domínio sensível |
| B9 | Sem estratégia de indisponibilidade | `apps/web/` — PWA + service worker + motor embarcado |
| B10 | Entrada livre sem tratamento de abuso | `camada1.ts` + `ia/prompt.ts` — relato delimitado como dado |
| B11 | Fila de não reconhecidos vira ralo | `apps/web/publico/painel.js` — curadoria com meta de <15% |

### Parte C — privacidade, segurança e conformidade

| | Achado | Onde |
|---|---|---|
| **C1** | Passe de 4 caracteres enumerável | `packages/passe/` — PIN + token, expiração, bloqueio progressivo, auditoria |
| C2 | Microárea + sintoma + horário | `registro/registro.ts` — base analítica sem microárea, horário em faixa, k-anonimato travando a exportação |
| C3 | Painel sem controle de acesso | `apps/api/servidor.ts` — autenticação individual, sessão, registro de acesso |
| C4 | LGPD: decisão automatizada | `docs/LGPD-RIPD.md` + aviso permanente no app |
| **C5** | Enquadramento sanitário | `docs/ENQUADRAMENTO-SANITARIO.md` |
| C6 | Responsabilidade e incidente | `docs/GOVERNANCA-CLINICA.md` + kill switch no painel |
| C7 | Retenção e auditoria | `registro/registro.ts` — trilha append-only, prazos declarados |

### Partes D e E — produto e métricas

| | Achado | Onde |
|---|---|---|
| **D1** | Destino ignora horário | `roteamento.ts` — saída sensível ao relógio, com plano B escrito |
| D2 | Usuário não distinguido | `blocos.ts` + `app.js` — "é para você ou para outra pessoa?" |
| D3 | Coleta de agravantes | `agravantes.ts` — extração pela IA + 4 blocos de linguagem simples |
| D4 | Acessibilidade e letramento | `app.js` — voz, leitura em voz alta, grade de ícones, alvos de 56px |
| D5 | Barreira de deslocamento | `roteamento.ts` — pergunta em LARANJA, resposta vira indicador |
| D6 | Comunicação do resultado | `app.js` — discagem direta, mapa, compartilhar, autonomia |
| E1 | Dois botões não medem | `registro/metricas.ts` — matriz de confusão 5×5 |
| **E2** | Falta fase sombra | `versao.ts` — `FASE_PILOTO` configurável |
| E3 | Painel de indicadores | `metricas.ts` — 7 indicadores com sinal de alarme |
| E4 | Contrarreferência aberta | `passe/index.ts` — desfecho em três toques |
| E5 | Sem estratificação por equidade | `metricas.ts` — por modo, faixa etária e **comprimento do relato** |
| E6 | Sem critério de encerramento | `metricas.ts` — definido antes de começar |

---

## Uma correção à recomendação B5

A revisão pede *"fixar temperatura em 0 e fixar a versão exata do modelo"*. A intenção —
reprodutibilidade — está correta e é o que o código implementa. O mecanismo mudou: **`temperature`
não existe mais na API atual** e é rejeitado com HTTP 400 em `claude-opus-5`. Enviá-lo quebraria
o sistema.

O determinismo é obtido pelos meios disponíveis hoje: ID de modelo fixo sem alias móvel,
structured outputs com JSON Schema estrito, enum fechado de IDs, `effort` fixo e gravado, prompt
versionado por hash, e o banco de vinhetas como rede de regressão. Detalhes em
`packages/ia/src/cliente-claude.ts`.

---

## O que o piloto mede sobre si mesmo

`npm run distribuicao` compara o protocolo v2 com a regra v1 sobre o mesmo lote. No lote
sintético embutido:

| | v1 (agravante global) | v2 (matriz condicionada) |
|---|---|---|
| Encaminhamentos à urgência | **55,3%** | **36,8%** |

O caso que a revisão usa como exemplo — *"febre 38 há um dia em um hipertenso de 63 anos"* —
sai de LARANJA → UPA e volta a ser AMARELO → UBS.

**O lote é sintético.** Antes de ligar o sistema, rode sobre 200–300 relatos históricos do
acolhimento: `npm run distribuicao -- relatos-historicos.txt`.

---

## Limite

Este é código de engenharia executável, não um sistema clinicamente validado. Nenhum critério,
limiar ou destino aqui vale clinicamente. A revisão é explícita: *"Nenhuma sugestão de critério,
limiar ou destino aqui contida deve entrar em produção sem revisão e assinatura desses
profissionais."*

O caminho mais curto para um piloto defensável, nas palavras da própria revisão: **não entregar
resultado a paciente antes da fase sombra; não alterar protocolo sem teste de regressão; e não
tratar nenhuma decisão clínica como válida sem a assinatura da equipe da unidade.**
