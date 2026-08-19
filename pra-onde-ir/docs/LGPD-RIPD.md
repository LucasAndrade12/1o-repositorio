# LGPD — base legal, decisão automatizada e relatório de impacto

> **Achado C4 (ALTO)** — *"não perguntar o nome reduz muito a exposição, mas não retira o
> tratamento do escopo da LGPD — dado referente à saúde é dado pessoal sensível, e a combinação
> de atributos discutida em C2 pode reidentificar."*

Este documento não é parecer jurídico. É o material que a assessoria jurídica do município
precisa para produzir um.

---

## 1. Titularidade — a definir por escrito antes do piloto

| Papel | Quem | Situação |
|---|---|---|
| **Controlador** | Município de Parnamirim / Secretaria Municipal de Saúde | **A formalizar** |
| **Operador** | [responsável pelo desenvolvimento e pela operação do software] | **A formalizar** |
| Encarregado (DPO) | [indicado pelo município] | **A formalizar** |

A relação entre o desenvolvedor e a unidade precisa estar escrita: quem responde pelo software,
sob qual titularidade ele opera, e se há cessão, doação ou uso interno. Isso não é só LGPD —
decide também o enquadramento sanitário (ver `ENQUADRAMENTO-SANITARIO.md`).

## 2. Base legal

Dado de saúde é **dado pessoal sensível**. A hipótese aplicável no contexto é a de **tutela da
saúde**, em procedimento realizado por profissionais de saúde ou por serviços de saúde
(art. 11, II, "f" da LGPD), com o município como controlador.

Consentimento **não** é a base adequada aqui: o serviço público de saúde não pode condicionar o
atendimento ao consentimento, e um consentimento obtido nessas condições não é livre.

**A ser confirmado pela assessoria jurídica do município antes do piloto.**

## 3. Decisão automatizada e direito de revisão

A LGPD assegura ao titular o direito de solicitar revisão de decisões tomadas unicamente com
base em tratamento automatizado que afetem seus interesses (art. 20). **Um encaminhamento de
risco se enquadra confortavelmente nessa descrição.**

Implementação no piloto:

1. **Aviso permanente e não condicional**, exibido em toda tela de resultado e na tela de
   emergência:

   > *"Esta é uma orientação automática. Você pode sempre procurar a UBS e falar com um
   > profissional, mesmo que o resultado diga o contrário."*

   No código: `AVISO_DECISAO_AUTOMATIZADA` em `packages/protocolo/src/versao.ts`. Um teste da
   suíte falha se ele sumir de qualquer triagem.

2. **A decisão não é "unicamente automatizada" por desenho.** A IA (camada 2) traduz linguagem;
   ela não decide nível nem destino. A classificação é determinística e auditável, e a equipe
   reclassifica no painel. A revisão humana é parte do fluxo, não uma exceção.

3. **Explicabilidade real.** Toda triagem devolve `explicacao[]`: cada etapa que mudou o nível,
   com o motivo em linguagem clara e o achado da revisão que a originou. Não é uma pontuação
   opaca — é um rastro legível.

## 4. Dados tratados

| Dado | Base operacional | Base analítica | Por quê |
|---|---|---|---|
| Nome, CPF, cartão SUS | **não coletado** | **não coletado** | Decisão de projeto, elogiada pela revisão |
| Rua e número | **não coletado** | **não coletado** | Rua + sintoma em microárea pequena identifica |
| Relato integral | sim | **não** | A equipe precisa dele para atender; a análise não |
| Microárea | sim (em memória, para roteamento) | **não** (C2) | Microárea + sintoma + horário reidentifica |
| Bairro e equipe | sim | sim | Granularidade suficiente para análise |
| Horário | exato | **arredondado em faixa** (C2) | Horário exato reidentifica em quadro raro |
| Faixa etária e sexo | sim | sim, agregados, opcionais | E5 — estratificação por equidade |
| Nível, destino, critérios | sim | sim | Objeto da medição |
| Versões e modo | sim | sim | B7 — sem isso não há comparação possível |

**k-anonimato:** nenhuma exportação da base analítica sai sem checagem prévia. Se qualquer grupo
de quase-identificadores tiver menos de 5 registros, a exportação é **recusada** e o bloqueio
entra na trilha de auditoria. Ver `verificarKAnonimato` e `exportarAnalitico`.

## 5. Retenção e descarte

| Base | Prazo | Justificativa |
|---|---|---|
| Operacional (com relato integral) | 30 dias | O acolhimento precisa do texto por poucos dias |
| Analítica (anonimizada) | 730 dias | Análise do piloto e comparação entre versões |
| Trilha de auditoria | 1825 dias | Rastreabilidade de acesso a dado sensível |

*"Para um piloto cuja finalidade é medir concordância, os dados precisam durar o suficiente para
a análise e não mais que isso"* (C7). **Prazos a confirmar com a assessoria jurídica.**

## 6. Segurança

- Passe com segundo fator obrigatório, expiração, bloqueio progressivo e auditoria (C1)
- Painel com autenticação individual, sessão com expiração, registro de acesso (C3)
- Restrição de rede como camada **adicional**, nunca única
- Trilha append-only

## 7. Relatório de impacto (RIPD) — esqueleto

A revisão pede um RIPD *"ainda que enxuto — ele é também o documento que responde às perguntas
da Secretaria sobre risco"*. Estrutura mínima:

1. Descrição do tratamento e finalidade
2. Necessidade e proporcionalidade (por que não coletar nome é suficiente, e por que microárea
   não vai para a base analítica)
3. Riscos identificados: **reidentificação** (C2), **exposição do passe** (C1), **acesso indevido
   ao painel** (C3), **sub-triagem por erro do sistema** (risco à vida, não só à privacidade)
4. Medidas mitigadoras — as implementadas neste piloto, com referência ao código
5. Riscos residuais e decisão do controlador
6. Data, responsável e assinatura

## 8. Aviso de privacidade na primeira tela

Texto em linguagem simples, exigido por C4, a validar com a assessoria jurídica:

> Este aplicativo é da Secretaria Municipal de Saúde de Parnamirim. Ele **não pede seu nome nem
> seu CPF**. O que você escrever é usado para orientar onde procurar atendimento e para melhorar
> o serviço da unidade. Os dados usados na análise não permitem identificar você. Você pode
> procurar a UBS a qualquer momento, mesmo sem usar o aplicativo. Dúvidas: [contato do
> encarregado].

## 9. Marco legal de IA

O PL 2338/2023 foi aprovado no Senado em dezembro de 2024 e seguia em tramitação na Câmara ao
longo de 2026 — **não é lei em vigor**, mas seu texto classifica aplicações em saúde como alto
risco. Os requisitos previstos — documentação, explicabilidade, supervisão humana, registro —
são exatamente os que este piloto implementa por outras razões. Vale acompanhar.

---

*Referências normativas devem ser confirmadas quanto à vigência e à aplicabilidade ao caso
concreto por assessoria jurídica. Este documento não constitui parecer jurídico.*
