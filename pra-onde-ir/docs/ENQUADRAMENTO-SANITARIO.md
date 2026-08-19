# Enquadramento sanitário — software como dispositivo médico (SaMD)

> **Achado C5 (CRÍTICO)** — *"a ANVISA disciplina software como dispositivo médico pela
> **RDC 657/2022**, com a classificação de risco definida pelas regras da **RDC 751/2022**.
> Softwares exclusivamente administrativos ou de processamento demográfico/epidemiológico sem
> finalidade clínica ficam fora do escopo; **triagem automática com finalidade clínica, não.**
> O documento não menciona esse enquadramento em nenhum ponto — e é a lacuna com maior potencial
> de travar o projeto depois de pronto."*

Este documento organiza a questão. **Não substitui parecer regulatório.**

---

## 1. A pergunta que decide o caso

A revisão é precisa sobre onde está o nó:

> *"a norma prevê tratamento diferenciado para software **desenvolvido internamente pelo serviço
> de saúde e de uso exclusivo desse serviço**. Se o desenvolvimento é feito por alguém externo à
> unidade — o que a leitura do documento sugere, ao descrever entrevistas com a equipe — a
> hipótese de dispensa **provavelmente não se aplica**. E a norma é explícita quanto a
> **comercialização ou doação** sem regularização."*

Portanto, antes de qualquer outra coisa:

- [ ] **O software é desenvolvido pelo próprio serviço de saúde?**
- [ ] **É de uso exclusivo desse serviço?**
- [ ] **Há cessão, doação ou comercialização envolvida?**

As respostas precisam estar **por escrito**, e são as mesmas que a LGPD exige para definir
controlador e operador (ver `LGPD-RIPD.md`, seção 1). Não é coincidência: as duas normas
perguntam quem responde pelo artefato.

## 2. Descrição objetiva da função, para a consulta

O que o sistema faz, em termos que uma consulta de enquadramento aceita:

- **Faz:** classificação de risco em cinco níveis a partir de relato da própria pessoa, e
  orientação sobre qual ponto da rede procurar e com que urgência.
- **Não faz:** diagnóstico, indicação terapêutica, prescrição, cálculo de dose, interpretação de
  imagem ou de sinal biológico, monitoramento de paciente.
- **Autonomia:** a IA traduz linguagem; a classificação é determinística, baseada em protocolo
  assinado por profissionais nomeados. A equipe reclassifica todos os casos no painel.
- **Público:** pessoas da área de abrangência da UBS, sem intermediação profissional na fase 3.
- **Consequência de erro:** encaminhamento a ponto de atenção inadequado. Em sub-triagem, risco
  de atraso em quadro tempo-dependente.

Este último item é o que importa para a classificação de risco pelas regras da RDC 751/2022:
o que se pondera é a **significância da informação para a decisão** e a **condição do paciente**.

## 3. Providências

- [ ] **Protocolar consulta de enquadramento junto à ANVISA**, descrevendo objetivamente a
      função acima. A própria Agência orienta nesse enquadramento.
- [ ] **Definir por escrito a natureza do vínculo** com a UBS e com a Secretaria.
- [ ] Verificar com assessoria jurídica: normas de **telessaúde** aplicáveis; **responsabilidade
      profissional** pelo protocolo assinado; e, se houver intenção de publicar resultados,
      necessidade de aprovação em **Comitê de Ética em Pesquisa**.

## 4. Enquanto o enquadramento não estiver claro

A recomendação da revisão é direta:

> *"Enquanto o enquadramento não estiver claro, operar em **fase sombra** — que não entrega
> resultado ao paciente e portanto reduz substancialmente a exposição."*

No piloto isso é **configuração, não alteração de código**:

```bash
FASE_PILOTO=sombra npm run dev
```

Nessa fase o sistema mede tudo — matriz de confusão, distribuição, taxa de não reconhecimento —
e devolve ao paciente apenas: *"Sua resposta foi registrada para avaliação do sistema. Procure o
acolhimento da unidade normalmente."*

A fase corrente é carimbada em **cada registro** (`versoes.fase`) e exibida no painel, de modo
que não há como analisar dados de fase sombra achando que são de uso real, nem o contrário.

## 5. O que o piloto já oferece a uma eventual regularização

Se o enquadramento como SaMD se confirmar, boa parte da documentação técnica exigida já existe
como subproduto de outros achados:

| Exigência típica | Onde está |
|---|---|
| Especificação funcional | `GET /api/protocolo`, regenerado do código em execução |
| Gestão de versões | `HISTORICO_VERSOES`, carimbo em cada triagem (B7) |
| Verificação e validação | Suíte de vinhetas em CI, com critério assimétrico (B5) |
| Gestão de risco | Índice de achados, teto de agravante, curto-circuito, verificação assimétrica |
| Rastreabilidade | Trilha append-only (C7) |
| Vigilância pós-mercado | Matriz de confusão, curadoria, desfecho no passe (E1, B11, E4) |
| Plano de resposta a incidente | `GOVERNANCA-CLINICA.md` (C6) |

Como a revisão observa a respeito do marco legal de IA, *"os requisitos previstos —
documentação, explicabilidade, supervisão humana, registro — são exatamente os que este relatório
recomenda por outras razões"*. Vale para a via sanitária também.

---

*Referências normativas (RDC 657/2022, RDC 751/2022) devem ser confirmadas quanto à vigência e à
aplicabilidade ao caso concreto. Este documento não constitui parecer regulatório.*
