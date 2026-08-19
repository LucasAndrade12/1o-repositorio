# Rollout em quatro fases

> **Achado E2 (CRÍTICO)** — *"o desenho atual vai direto de 'não validado' para 'orientando
> pacientes'. Não existe etapa em que o sistema é medido sem que ninguém dependa dele."*

> *"A fase sombra é também o melhor argumento junto à Secretaria: chega-se à reunião com uma
> matriz de confusão real, e não com uma promessa."*

No piloto a fase é **configuração** (`FASE_PILOTO`), carimbada em cada registro e exibida no
painel. O padrão do repositório é `demonstracao`, para que o fluxo completo possa ser inspecionado
e criticado.

| Fase | Duração | O que acontece | Critério para avançar |
|---|---|---|---|
| **0 — Vinhetas** | 1 a 2 semanas | Só o banco de casos sintéticos, revisado pela enfermeira e pela retaguarda | Zero sub-triagem em vinhetas vermelhas e laranjas |
| **1 — Sombra** | 3 a 4 semanas | Preenchido na recepção junto com o acolhimento presencial; **o resultado não é mostrado ao paciente** | Sub-triagem próxima de zero e sobre-triagem dentro do teto acordado |
| **2 — Assistido** | 4 semanas | Usado por pacientes dentro da unidade, com profissional por perto para conferir e corrigir | Concordância estável, taxa de não reconhecimento em queda |
| **3 — Domiciliar** | — | Uso em casa, como concebido | Revisão formal com a equipe e com a Secretaria |

```bash
FASE_PILOTO=vinhetas   npm run dev
FASE_PILOTO=sombra     npm run dev
FASE_PILOTO=assistido  npm run dev
FASE_PILOTO=domiciliar npm run dev
```

Em `vinhetas` e `sombra`, `mostraResultadoAoPaciente` é `false` e a API devolve apenas a
confirmação de registro. Tudo o mais — classificação, roteamento, métricas — continua sendo
computado e gravado.

## Antes da fase 0

As duas providências que a revisão chama de *"baratas e que reduzem mais risco por hora investida
do que todo o resto"*:

1. **Simular a distribuição de níveis sobre 200–300 relatos históricos do acolhimento**, para
   medir a sobre-triagem antes de ligar o sistema:

   ```bash
   npm run distribuicao -- relatos-historicos.txt
   ```

2. **Montar o banco de vinhetas e transformá-lo em teste automatizado** — feito:
   `testes/vinhetas.test.ts`, rodando em CI.

   ```bash
   npm run vinhetas
   ```

*"Sem essas duas, qualquer alteração no protocolo é feita às cegas."*

## Critério de encerramento (E6)

Definido **antes** de começar, em `packages/registro/src/metricas.ts` e visível no painel, aba
Governança. *"Um piloto sem critério de parada acordado previamente tende a ser julgado por
impressão, e a impressão será formada pelo caso mais barulhento, não pelo mais representativo."*
