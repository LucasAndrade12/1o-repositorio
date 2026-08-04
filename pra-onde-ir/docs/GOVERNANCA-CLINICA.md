# Governança clínica e resposta a incidente

> **Achado C6 (ALTO)** — *"o documento diz que o protocolo precisa ser assinado antes do uso —
> correto — mas não define o que acontece depois: quem revisa alterações, com que periodicidade,
> e o que se faz quando um caso dá errado. Um sistema de triagem sem processo de incidente
> definido **antes** do primeiro incidente é um sistema que vai improvisar no pior momento
> possível."*

Este documento é o "uma página" que a revisão pede. Os campos entre colchetes precisam ser
preenchidos e o documento assinado **antes do primeiro paciente real**.

---

## 1. Responsável clínico nomeado

| Papel | Nome | Registro | Contato |
|---|---|---|---|
| Enfermeira responsável pelo acolhimento | **[NOME]** | COREN [—] | [—] |
| Retaguarda médica | **[NOME]** | CRM [—] | [—] |
| Responsável técnico pelo software | **[NOME]** | — | [—] |
| Ponto focal na Secretaria Municipal de Saúde | **[NOME]** | — | [—] |

A enfermeira e a retaguarda **assinam o protocolo**. Sem essas duas assinaturas, nenhum
critério, limiar ou destino deste piloto tem validade clínica — e o painel exibe o contador
de critérios pendentes justamente para que isso não passe despercebido.

## 2. Periodicidade de revisão do protocolo

| Quando | O quê | Quem |
|---|---|---|
| Semanal, durante as fases 0 a 2 | Fila de curadoria de não reconhecidos (B11) e casos de sub-triagem | Enfermeira |
| Quinzenal | Matriz de confusão, distribuição por nível, taxa de modo degradado | Enfermeira + retaguarda |
| A cada alteração de critério | Suíte de vinhetas em CI, com zero sub-triagem em vermelho e laranja | Automático + responsável técnico |
| Mensal | Revisão formal da versão do protocolo, com registro no histórico | Enfermeira + retaguarda + Secretaria |
| A cada troca de modelo ou de prompt | Suíte completa + comparação da distribuição antes/depois | Responsável técnico |

Toda alteração cria uma nova versão em `HISTORICO_VERSOES`, com data e responsável. Nenhuma
alteração de critério entra sem passar pelas vinhetas.

## 3. Procedimento de suspensão emergencial

O interruptor de desligamento fica **no painel da unidade**, aba *Governança*, e é acionável por
qualquer usuário autenticado da equipe — **sem depender do desenvolvedor**.

Com o sistema desligado:

- o app recusa novas triagens e devolve HTTP 503;
- a pessoa recebe: *"O sistema foi desligado pela unidade. Procure atendimento diretamente na
  UBS ou, em caso de emergência, ligue 192."*;
- passes já emitidos continuam abrindo (o encaminhamento em curso não é interrompido);
- o desligamento, com autor e motivo, entra na trilha de auditoria.

**Quando desligar, sem esperar autorização:** suspeita de evento adverso relacionado a uma
orientação do sistema; falha que produza classificação visivelmente errada; incidente de
segurança envolvendo o passe ou o painel; determinação da retaguarda médica ou da Secretaria.

## 4. Fluxo de análise de evento adverso

**Evento adverso** = qualquer desfecho em que uma pessoa que usou o sistema sofreu dano, ou
quase sofreu, e a orientação do sistema pode ter contribuído.

| Etapa | Prazo | Responsável |
|---|---|---|
| 1. Desligar o sistema (item 3) | Imediato | Quem identificou |
| 2. Notificar a enfermeira, a retaguarda e o responsável técnico | Até 2 horas | Quem identificou |
| 3. **Preservar os dados**: registro operacional, analítico, trilha de auditoria, passe, versões de protocolo/prompt/modelo | Antes de qualquer alteração de código | Responsável técnico |
| 4. Reconstruir o caso: rodar o relato na versão exata que o classificou (os carimbos de B7 permitem isso) | Até 24 horas | Responsável técnico |
| 5. Análise clínica do caso | Até 72 horas | Enfermeira + retaguarda |
| 6. Transformar o caso em **vinheta na suíte de regressão** | Junto com a correção | Responsável técnico |
| 7. Decisão de retomada, registrada por escrito | — | Retaguarda médica + Secretaria |
| 8. Notificação externa, se aplicável | Conforme a norma | Secretaria |

**Quem decide retomar:** a retaguarda médica, com ciência da Secretaria. Nunca o desenvolvedor
sozinho.

**O passo 6 não é opcional.** Um evento adverso que não vira teste automatizado é um evento que
pode se repetir. É a aplicação direta de B5 ao pior caso.

## 5. Dados preservados em um incidente

Graças a B7, cada triagem carrega `versao_protocolo`, `versao_prompt`, `versao_modelo`,
`versao_esquema`, `modo` e `fase`. Isso permite responder, meses depois, a pergunta que sem
esses carimbos seria impossível: **sob qual sistema, exatamente, este caso foi classificado?**

A trilha de auditoria é append-only: nunca `update`, nunca `delete`.
