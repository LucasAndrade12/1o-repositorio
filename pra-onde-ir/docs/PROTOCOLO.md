# Protocolo de classificação de risco — Pra Onde Ir

**Versão 2.0.0** · gerado em 2026-08-04 a partir do código em execução

| | |
|---|---|
| Unidade piloto | UBS João Dias — Nova Parnamirim, Parnamirim/RN |
| Baseado em | Protocolo v1 gerado em 22/07/2026 (43 critérios, 11 agravantes) |
| Revisão que originou esta versão | Pra Onde Ir — Revisão crítica de protocolo e arquitetura, 03/08/2026 (44 achados) |
| Responsável clínico | **A NOMEAR** |
| Assinado em | **PENDENTE** |
| Camada 2 (IA) | `claude-opus-5/effort=low` |

> ⚠️ **Protocolo NÃO validado clinicamente. Critérios com assinatura pendente são propostas de partida extraídas da revisão técnica, para discussão com a enfermeira do acolhimento e a retaguarda médica da unidade.**
>
> **100 de 100 critérios aguardam assinatura** da enfermeira do
> acolhimento e da retaguarda médica.

## Aviso permanente exibido ao usuário

> Esta é uma orientação automática. Você pode sempre procurar a UBS e falar com um profissional, mesmo que o resultado diga o contrário.

## Histórico de versões

### v1.0.0 — 2026-07-22

*geração original a partir de /api/protocolo*

43 critérios, 11 agravantes globais de +1 nível, 5 destinos.

### v2.0.0 — 2026-08-03

*engenharia — pendente de assinatura clínica*

Resposta aos 44 achados da revisão: agravantes condicionados (A1), piso de 24h com exceções (A2), 12 bandeiras tempo-dependentes (A5), módulo de arbovirose (A6), bloco pediátrico AIDPI (A7), trilha de saúde mental com CAPS e CVV (A8), trilha de violência (A9), nível desacoplado de destino com 15 pontos de atenção (A10), roteamento obstétrico (A11), safety-netting nos 5 níveis e primeiros minutos (A12).

## Níveis de risco e pontos de atenção

O nível responde **quão rápido**. O destino responde **onde**. São perguntas diferentes.
No protocolo v1 estavam fundidas em cinco caixas, o que empurrava para a UPA casos que a UPA
não resolve (achado A10).

| Destino | Instrução | Sensível a horário | Sem deslocamento | Origem |
|---|---|---|---|---|
| **SAMU — 192** | Ligue 192 agora. Não saia de casa e não vá por conta própria. | não | sim | v1 |
| **UPA** | Vá à UPA agora. | não | não | v1 |
| **Sua UBS, hoje** | Procure sua UBS hoje. | sim | não | v1 |
| **Sua UBS, com agendamento** | Agende uma consulta na sua UBS. | sim | não | v1 |
| **Cuidados em casa** | Você pode se cuidar em casa por enquanto. | não | sim | v1 |
| **Maternidade de referência** | Vá direto à maternidade de referência. Não passe pela UPA. | não | não | A11 |
| **CAPS — Centro de Atenção Psicossocial** | Procure o CAPS. Você pode chegar sem agendamento. | sim | não | A8 |
| **Urgência odontológica / CEO** | Procure a urgência odontológica. | sim | não | A10 |
| **Hospital de referência para trauma** | Vá ao hospital de referência para trauma. | não | não | A10 |
| **Farmácia da unidade** | Vá direto à farmácia da sua UBS. Você não precisa de consulta para isso. | sim | não | A10 |
| **Sala de vacina** | Vá à sala de vacina da sua UBS. É atendimento por demanda espontânea. | sim | não | A10 |
| **Equipe de Saúde da Família da sua microárea** | Sua solicitação foi registrada. A equipe de Saúde da Família responsável pela sua área vai entrar em contato. | sim | sim | A13 |
| **Serviço de referência para violência** | Procure o serviço de referência. O atendimento é sigiloso. | não | não | A9 |
| **Vigilância epidemiológica** | Caso sinalizado para a vigilância epidemiológica do município. | sim | sim | A6 |
| **CVV — 188** | Ligue 188 (CVV). É gratuito, sigiloso e funciona 24 horas por dia. Você pode falar com alguém agora mesmo. | não | sim | A8 |

## Critérios (100)

### VERMELHO — 29 critério(s)

#### Dor no peito com sinais de gravidade

`vm.dor_toracica` · queixa: cardiovascular · origem: **v1** · assinatura: **pendente**

Dor ou aperto no peito, especialmente com irradiação para braço, mandíbula ou costas, associada a suor frio, falta de ar, náusea ou palidez.

*Como a pessoa descreve:* "dor no peito", "aperto no peito", "peito apertado", "dor no coração", "peso no peito", "dor no peito e suando frio", "dor no braço esquerdo", "queimação no peito com falta de ar", "opressão no peito"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 agora e fique no telefone.
2. Pare qualquer esforço. Sente ou deite com o tronco elevado.
3. Afrouxe roupas apertadas.
4. Não dirija e não vá por conta própria.
5. Se a pessoa desmaiar e parar de respirar, o atendente do 192 orienta a massagem pelo telefone.

#### Sinais de AVC

`vm.avc` · queixa: neurologica · origem: **v1** · assinatura: **pendente**

Início súbito de: fraqueza ou dormência de um lado do corpo, boca ou rosto torto, fala embolada ou dificuldade de falar, perda de visão súbita, desequilíbrio súbito.

*Como a pessoa descreve:* "boca torta", "rosto torto", "boca entortou", "braço caindo", "braço mole", "fala embolada", "falando enrolado", "não consegue falar", "perdeu a força de um lado", "dormência de um lado"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 agora e diga a hora em que os sinais começaram — isso muda o tratamento.
2. Não dê comida, bebida nem remédio pela boca.
3. Deite a pessoa de lado, com a cabeça um pouco elevada.
4. Não espere melhorar. Não vá de carro por conta própria.

#### Convulsão em curso ou repetida

`vm.convulsao` · queixa: neurologica · origem: **v1** · assinatura: **pendente**

Crise convulsiva acontecendo agora, crise com mais de 5 minutos, crises repetidas sem recuperação entre elas, ou primeira crise da vida.

*Como a pessoa descreve:* "convulsão", "convulsionando", "convulsionou", "deu convulsão", "tendo ataque", "ataque epilético", "tremendo todo e roxo", "virou os olhos e tremeu", "caiu duro tremendo"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 e marque a hora em que começou.
2. Proteja a cabeça com algo macio. Afaste móveis e objetos duros.
3. NÃO segure a pessoa e NÃO coloque nada na boca.
4. Depois que parar de tremer, vire de lado.
5. Fique ao lado até a ambulância chegar.

#### Falta de ar grave

`vm.falta_ar_grave` · queixa: respiratoria · origem: **v1** · assinatura: **pendente**

Dificuldade de respirar em repouso, incapacidade de completar uma frase, chiado intenso, lábios ou dedos arroxeados, respiração muito rápida.

*Como a pessoa descreve:* "não consigo respirar", "falta de ar forte", "sem ar", "lábio roxo", "beiço roxo", "respirando muito rápido", "cansaço pra respirar", "chiando muito", "não consegue falar de falta de ar", "não consegue respirar"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 agora.
2. Sente a pessoa com o tronco inclinado para a frente. Não deite.
3. Abra janelas, afrouxe a roupa.
4. Se usa bombinha de resgate, use conforme orientado pela equipe.

#### Reação alérgica grave (anafilaxia)

`vm.anafilaxia` · queixa: infecciosa · origem: **v1** · assinatura: **pendente**

Inchaço de lábios, língua ou garganta, dificuldade de respirar ou engolir, placas pelo corpo com mal-estar, após alimento, medicamento ou picada.

*Como a pessoa descreve:* "inchou a boca", "inchou a língua", "garganta fechando", "não consigo engolir", "alergia forte", "empolou o corpo todo", "tomei remédio e inchei"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 agora.
2. Se a pessoa tem caneta de adrenalina prescrita, use conforme orientado.
3. Deite a pessoa com as pernas elevadas; se estiver com falta de ar, deixe sentada.
4. Retire o ferrão da picada raspando de lado — não aperte.

#### Sangramento que não para

`vm.hemorragia_ativa` · queixa: trauma · origem: **v1** · assinatura: **pendente**

Sangramento externo abundante que não cessa com compressão, ou vômito com sangue vivo.

*Como a pessoa descreve:* "sangrando muito", "não para de sangrar", "sangue jorrando", "vomitando sangue", "perdendo muito sangue"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192.
2. Comprima o ferimento com um pano limpo, com força, e NÃO tire para olhar.
3. Se o pano encharcar, coloque outro por cima sem retirar o primeiro.
4. Eleve o membro ferido, se possível.

#### Desmaio com não recuperação ou confusão intensa

`vm.rebaixamento` · queixa: neurologica · origem: **v1** · assinatura: **pendente**

Pessoa não responde ao chamado, desmaiou e não acordou, ou está muito confusa e sonolenta.

*Como a pessoa descreve:* "desmaiou e não acordou", "não responde", "não acorda", "apagou", "muito confuso", "não reconhece ninguém", "deu um treco e ficou esmorecido"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192.
2. Vire a pessoa de lado para não engasgar.
3. Verifique se está respirando. Se não estiver, o atendente do 192 orienta pelo telefone.
4. Não dê nada pela boca.

#### Trauma grave

`vm.trauma_grave` · queixa: trauma · origem: **v1** · assinatura: **pendente**

Acidente com veículo em alta velocidade, queda de altura, deformidade de membro, traumatismo de cabeça com desmaio ou vômito, ferimento por arma.

*Como a pessoa descreve:* "bateu de moto", "caiu do telhado", "atropelado", "osso pra fora", "perna torta", "bateu a cabeça e desmaiou", "levou tiro", "levou facada"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192.
2. NÃO mexa no pescoço nem tente sentar a pessoa.
3. Comprima sangramentos com pano limpo.
4. Cubra a pessoa para ela não perder calor.

#### Suspeita de meningite

`vm.meningite` · queixa: infecciosa · origem: **v1** · assinatura: **pendente**

Febre com pescoço duro, dor de cabeça intensa, manchas roxas na pele, vômitos e confusão.

*Como a pessoa descreve:* "febre e pescoço duro", "não consegue encostar o queixo no peito", "manchas roxas no corpo", "dor de cabeça muito forte com febre"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192.
2. Deixe o ambiente com pouca luz e barulho.
3. Não dê remédio por conta própria.

#### Risco imediato à própria vida

`vm.risco_autoprovocado_iminente` · queixa: saude_mental · origem: **v1** · assinatura: **pendente**

Tentativa em curso ou recém-ocorrida, plano definido com meio disponível e intenção imediata.

*Como a pessoa descreve:* "vou me matar agora", "tomei os comprimidos", "me cortei fundo", "estou com a arma", "não aguento mais e vou fazer"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 agora. Se puder, ligue também para o CVV no 188 — atende 24 horas, de graça.
2. Não deixe a pessoa sozinha.
3. Retire do alcance medicamentos, armas, facas e cordas.
4. Fique perto e escute sem julgar. Você não precisa ter a resposta certa.

#### Emergência obstétrica

`vm.obstetrica_grave` · queixa: obstetrica · origem: **v1** · assinatura: **pendente**

Gestante com sangramento intenso, convulsão, dor de cabeça forte com visão embaçada, perda de líquido com cordão visível, ou parada de movimentos do bebê.

*Como a pessoa descreve:* "grávida sangrando muito", "grávida com convulsão", "grávida com dor de cabeça e vendo embaçado", "bebê parou de mexer", "estourou a bolsa e saiu o cordão"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 e diga de quantas semanas está a gestação.
2. Deite do lado esquerdo.
3. Não coma nem beba nada.

#### Hipoglicemia com alteração de consciência

`vm.hipoglicemia` · queixa: metabolica · origem: **v1** · assinatura: **pendente**

Glicemia abaixo do limiar definido pela retaguarda OU equivalente clínico: tremor, suor frio, confusão ou desmaio em pessoa que usa insulina ou medicação para diabetes.

*Como a pessoa descreve:* "açúcar baixo", "glicemia baixa", "tremendo e suando frio", "diabético passando mal", "ficou confuso e suando", "deu hipoglicemia"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. SE A PESSOA ESTÁ ACORDADA E CONSEGUE ENGOLIR: dê agora meio copo de suco ou refrigerante comum (não diet), ou uma colher de sopa de açúcar na água. Espere 15 minutos.
2. SE NÃO ACORDA OU NÃO CONSEGUE ENGOLIR: não force nada pela boca. Vire de lado e ligue 192.
3. Depois que melhorar, ofereça um lanche com pão ou bolacha.
4. Ligue 192 se não melhorar em 15 minutos ou se voltar a piorar.

*Fonte:* Conduta a ser revisada e assinada pela retaguarda médica (A14).

#### Melena / hemorragia digestiva alta

`a5.melena` · queixa: gastrointestinal · origem: **A5** · assinatura: **pendente**

Fezes pretas, pastosas e de odor forte (sangue digerido), com ou sem fraqueza, tontura ou palidez. Distinto de "sangue vivo nas fezes", que já era previsto.

*Como a pessoa descreve:* "fezes pretas", "cocô preto", "fezes como borra de café", "cocô preto fedendo muito", "fezes pretas e tô fraca", "evacuando preto"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 se estiver muito fraca, tonta ou pálida.
2. Não coma nem beba nada até ser avaliada.
3. Se tiver como, guarde uma foto ou registre a cor das fezes para mostrar à equipe.

*Fonte:* Lacuna A5 — "sangramento digerido não é vermelho vivo e passa despercebido".

#### Torção testicular / escroto agudo

`a5.torcao_testicular` · queixa: urologica · origem: **A5** · assinatura: **pendente**

Dor súbita e intensa no testículo, com ou sem inchaço, náusea ou dor abdominal. Janela cirúrgica curta — perda do testículo se atrasar.

*Como a pessoa descreve:* "dor forte no saco", "dor no testículo", "testículo inchado", "dor no saco desde de madrugada", "bola inchada e doendo", "dor forte no ovo"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Vá agora — cada hora conta para salvar o testículo.
2. Não coma nem beba nada, pode ser preciso operar.
3. Não coloque bolsa quente.

*Fonte:* Lacuna A5 — janela cirúrgica curta.

#### Obstrução de via aérea por corpo estranho

`a5.corpo_estranho_via_aerea` · queixa: respiratoria · origem: **A5** · assinatura: **pendente**

Engasgo com dificuldade de respirar, tossir ou falar, após engolir alimento ou objeto. Minutos. Exige orientação de manobra imediata, não deslocamento.

*Como a pessoa descreve:* "engasgou", "engoliu e não sai", "não consegue tossir", "entalou na garganta", "engasgou com comida", "engoliu moeda", "engoliu objeto", "engoliu pilha", "engoliu brinquedo", "engoliu bateria"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. SE A PESSOA CONSEGUE TOSSIR: incentive a tossir com força. Não bata nas costas nem dê água.
2. SE NÃO CONSEGUE TOSSIR, FALAR OU RESPIRAR: ligue 192 e comece a manobra agora.
3. ADULTO OU CRIANÇA MAIOR: fique atrás, abrace a barriga acima do umbigo e faça compressões rápidas para dentro e para cima.
4. BEBÊ MENOR DE 1 ANO: deite de bruços no seu antebraço, com a cabeça mais baixa, e dê 5 tapas firmes entre as escápulas; depois vire e faça 5 compressões no meio do peito.
5. Continue até o objeto sair ou a ajuda chegar.

*Fonte:* Lacuna A5 — "Exige orientação de manobra imediata, não deslocamento".

#### Síndrome da cauda equina

`a5.cauda_equina` · queixa: neurologica · origem: **A5** · assinatura: **pendente**

Dor lombar com perda de força ou dormência nas pernas, dormência na região entre as pernas (em sela), ou perda do controle de urina ou fezes. Déficit permanente se não descomprimido.

*Como a pessoa descreve:* "dor nas costas e não sinto as pernas", "não consigo segurar o xixi", "dormência entre as pernas", "perna dormente e dor na coluna", "fiz xixi sem sentir", "perdi a força nas pernas"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Vá agora — o tempo até a cirurgia decide se a função volta.
2. Evite andar ou carregar peso.
3. Anote a que horas a dormência ou a perda de urina começou.

*Fonte:* Lacuna A5 — déficit permanente se não descomprimido.

#### Sepse no adulto

`a5.sepse_adulto` · queixa: infecciosa · origem: **A5** · assinatura: **pendente**

Febre ou hipotermia com confusão mental, respiração rápida, pressão baixa, tremor intenso ou sonolência. No idoso pode se apresentar só como confusão e prostração. Foco urinário ou pulmonar não tinha porta no protocolo original.

*Como a pessoa descreve:* "febre e muito confuso", "tremendo muito e pressão baixa", "respirando rápido e sonolento", "idoso confuso com febre", "muito confusa com febre e respirando rápido", "febre e prostrado", "muito confuso", "muito confusa", "confuso", "confusa"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

*Só dispara na conjunção:* (febre ou febril ou corpo quente ou quente ou 38 ou 39 ou 40 ou hipotermia) **E** (confus ou desorient ou sonolent ou prostrad ou respirando rapido ou respiracao rapida ou tremendo muito ou pressao baixa)

**Enquanto a ajuda não chega:**

1. Ligue 192. Diga que há febre com confusão mental — isso muda a prioridade.
2. Ofereça água se a pessoa estiver acordada e engolindo bem.
3. Não dê antibiótico por conta própria.

*Fonte:* Lacuna A5 — "Hoje febre + confusão só existe sob suspeita de meningite; sepse de foco urinário/pulmonar em idoso não tem porta".

#### Queimadura de via aérea / inalação de fumaça

`a5.queimadura_via_aerea` · queixa: respiratoria · origem: **A5** · assinatura: **pendente**

Exposição a fogo ou fumaça em ambiente fechado, com rouquidão, tosse com fuligem, queimadura de face, chamuscamento de pelos do nariz. Edema progressivo — a janela fecha.

*Como a pessoa descreve:* "inalou fumaça", "queimou o rosto no incêndio", "rouco depois do fogo", "respirou fumaça", "tossindo preto depois do incêndio"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 mesmo que a pessoa pareça bem — o inchaço da garganta piora com o tempo.
2. Leve para o ar livre.
3. Não dê nada pela boca.
4. Resfrie queimaduras da pele com água corrente por 10 a 20 minutos. Não use gelo, pasta ou manteiga.

*Fonte:* Lacuna A5 — edema progressivo de via aérea.

#### Emergência ocular química

`a5.emergencia_ocular_quimica` · queixa: ocular · origem: **A5** · assinatura: **pendente**

Contato de produto químico (soda, ácido, cal, alvejante) com o olho. Requer irrigação imediata em casa ANTES do deslocamento.

*Como a pessoa descreve:* "caiu produto no olho", "respingou soda no olho", "queimei a vista", "caiu cal no olho", "entrou química no olho", "soda no olho", "ácido no olho", "alvejante no olho", "água sanitária no olho", "químico no olho"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. LAVE O OLHO AGORA, ANTES DE SAIR DE CASA: água corrente morna ou soro, por 20 minutos sem parar.
2. Mantenha a pálpebra aberta com os dedos e deixe a água correr do canto do nariz para fora.
3. Retire lente de contato se houver.
4. Não esfregue o olho, não use colírio nem nenhum outro produto.
5. Só depois dos 20 minutos, vá ao serviço. Leve a embalagem do produto.

*Fonte:* Lacuna A5 — "Requer irrigação imediata em casa ANTES do deslocamento".

#### Neutropenia febril

`a5.neutropenia_febril` · queixa: infecciosa · origem: **A5** · assinatura: **pendente**

Febre em pessoa em quimioterapia ou com imunossupressão grave. No protocolo original era apenas agravante de +1 nível a partir de amarelo; aqui é bandeira própria.

*Como a pessoa descreve:* "estou na quimioterapia e deu febre", "tô na quimio e tô com febre", "faço quimio e tô febril", "transplantado com febre", "na quimio e deu febre"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

*Só dispara na conjunção:* (quimio ou quimioterapia ou transplantado ou imunidade baixa ou imunossuprimido ou neutropenia) **E** (febre ou febril ou corpo quente ou 38 ou 39 ou 40)

**Enquanto a ajuda não chega:**

1. Vá agora e avise na recepção que está em quimioterapia — isso muda a prioridade da fila.
2. Evite aglomeração no caminho e use máscara se tiver.
3. Não tome antibiótico nem antitérmico por conta própria antes de ser avaliada.
4. Leve o cartão do tratamento, se tiver.

*Fonte:* Lacuna A5 — "Deveria ser bandeira própria".

#### Gravidez ectópica rota

`a5.ectopica` · queixa: obstetrica · origem: **A5** · assinatura: **pendente**

Atraso menstrual com dor abdominal forte de um lado, com ou sem sangramento, tontura ou desmaio. No protocolo original só era vermelho se a pessoa DECLARASSE estar grávida — que é justamente o que ela não sabe.

*Como a pessoa descreve:* "atraso na menstruação e dor forte de um lado", "dor na barriga e sangramento", "atraso de 2 meses e dor forte de um lado da barriga", "dor de um lado da barriga e tontura"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 se estiver muito tonta, pálida ou tiver desmaiado.
2. Não coma nem beba nada — pode ser necessário operar.
3. Deite com as pernas elevadas até a ajuda chegar.

*Fonte:* Lacuna A5 — "é justamente o que ela não sabe".

#### Choque elétrico, afogamento ou hipotermia

`a5.choque_afogamento_hipotermia` · queixa: trauma · origem: **A5** · assinatura: **pendente**

Ausência total no protocolo original. Risco de arritmia tardia mesmo com a pessoa aparentemente bem.

*Como a pessoa descreve:* "levou choque", "quase se afogou", "engoliu muita água na piscina", "ficou muito tempo no frio", "tomou choque na tomada", "levou choque do chuveiro"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 mesmo que a pessoa pareça bem — o coração pode alterar horas depois.
2. CHOQUE: desligue a energia antes de tocar na pessoa.
3. AFOGAMENTO: mantenha a pessoa deitada de lado e aquecida; não tente tirar água dos pulmões.
4. HIPOTERMIA: retire roupa molhada, cubra com cobertor seco, movimente com delicadeza.

*Fonte:* Lacuna A5 — "Risco de arritmia tardia; ausência total no protocolo".

#### Abdome agudo vascular no idoso

`a5.abdome_agudo_vascular` · queixa: gastrointestinal · origem: **A5** · assinatura: **pendente**

Dor abdominal de início súbito e muito intensa em pessoa idosa, desproporcional ao exame. No protocolo original caía em LARANJA genérico; isquemia mesentérica e aneurisma exigem porta de emergência.

*Como a pessoa descreve:* "dor muito forte na barriga que começou de repente", "dor na barriga do nada muito forte", "idoso com dor de barriga insuportável", "dor na barriga e nas costas de repente"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192.
2. Não coma nem beba nada.
3. Não tome analgésico nem antiespasmódico antes da avaliação.

*Fonte:* Lacuna A5 — "no idoso, isquemia mesentérica e aneurisma exigem porta de emergência".

#### Sinais gerais de perigo na criança

`ped.sinais_gerais_perigo` · queixa: pediatrica · origem: **A7** · assinatura: **pendente**

Não consegue mamar ou beber; vomita tudo o que ingere; convulsionou durante esta doença; letargia ou inconsciência; estridor em repouso; tiragem subcostal; batimento de asa de nariz.

*Como a pessoa descreve:* "não quer mamar", "não aceita líquido", "vomita tudo", "molinha", "molinho", "gemendo", "não acorda direito", "afundando a barriguinha", "afundando entre as costelas", "chiado alto pra respirar"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192.
2. Mantenha a criança no colo, em posição confortável, com a roupa folgada.
3. Não force alimento nem líquido se ela estiver muito sonolenta.
4. Se estiver com febre, pode retirar o excesso de roupa.

*Fonte:* AIDPI — Atenção Integrada às Doenças Prevalentes na Infância / Cadernos de Atenção Básica, Ministério da Saúde. Fonte citada conforme A7.

#### Febre em bebê com menos de 3 meses

`ped.febre_menor_3_meses` · queixa: pediatrica · origem: **v1** · assinatura: **pendente**

Qualquer febre em lactente menor de 3 meses.

*Como a pessoa descreve:* "bebê de 2 meses com febre", "recém-nascido com febre", "neném com febre"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Vá agora. Não dê antitérmico por conta própria antes da avaliação.

#### Violência sexual

`vi.violencia_sexual` · queixa: violencia · origem: **A9** · assinatura: **pendente**

Janela de profilaxia pós-exposição que se conta em HORAS. Encaminhamento a serviço de referência, com notificação compulsória.

*Como a pessoa descreve:* "fui estuprada", "me forçaram", "abusaram de mim", "violência sexual", "fui abusada"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Vá agora ao serviço de referência. A profilaxia é mais eficaz quanto antes for iniciada.
2. Se puder, não tome banho, não troque de roupa e não lave as roupas antes do atendimento.
3. Você tem direito ao atendimento independentemente de registrar boletim de ocorrência.
4. Você não tem culpa do que aconteceu.

*Fonte:* A9 — janela de profilaxia pós-exposição contada em horas.

#### Violência doméstica em curso

`vi.violencia_domestica` · queixa: violencia · origem: **A9** · assinatura: **pendente**

Agressão física, ameaça ou cárcere em curso ou risco iminente.

*Como a pessoa descreve:* "meu marido está me batendo", "estão me ameaçando em casa", "apanhei em casa", "ele me trancou", "estão me agredindo"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Se você está em perigo agora, ligue 190.
2. Ligue 180 (Central de Atendimento à Mulher) — é gratuito, sigiloso e funciona 24 horas.
3. Se puder, vá para um cômodo com saída, perto da porta, e evite cozinha e banheiro.
4. Combine uma palavra de código com alguém de confiança.

*Fonte:* A9.

#### Cefaleia súbita e explosiva (thunderclap)

`au.cefaleia_thunderclap` · queixa: neurologica · origem: **auditoria** · assinatura: **pendente**

Dor de cabeça que atinge intensidade máxima em segundos a minutos, descrita como "a pior da vida". Suspeita de hemorragia subaracnóidea. Distinta da enxaqueca e da cefaleia tensional.

*Como a pessoa descreve:* "pior dor de cabeça da minha vida", "pior dor de cabeça da vida", "dor de cabeça a pior da minha vida", "pior dor de cabeça que já senti", "dor de cabeça mais forte da vida", "dor de cabeça explodiu", "dor de cabeça de repente muito forte", "dor de cabeça que começou de repente e muito forte", "batida na cabeça de tão forte a dor"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Ligue 192 e diga que a dor começou de repente e é a pior da vida.
2. Fique em ambiente calmo e com pouca luz.
3. Não tome analgésico por conta própria antes de ser avaliada.

*Fonte:* Auditoria — cefaleia thunderclap é bandeira tempo-dependente clássica, ausente do protocolo.

#### Perda súbita de visão

`au.amaurose_subita` · queixa: ocular · origem: **auditoria** · assinatura: **pendente**

Perda de visão de um olho ou dos dois, de instalação súbita, com ou sem dor. Suspeita de oclusão de artéria da retina, descolamento ou AVC occipital. Janela curta para preservar a visão.

*Como a pessoa descreve:* "perdi a visão de um olho", "perdi a vista de repente", "fiquei cego de um olho", "parei de enxergar de um olho", "perda súbita de visão", "cegueira repentina", "não enxergo mais de um olho de repente", "apagou a vista de um olho"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

**Enquanto a ajuda não chega:**

1. Vá agora ao serviço de referência ou ligue 192 — cada hora conta para salvar a visão.
2. Não esfregue o olho.
3. Anote a que horas a perda começou.

*Fonte:* Auditoria — amaurose súbita é urgência oftalmológica/neurológica tempo-dependente.

### LARANJA — 21 critério(s)

#### Retenção urinária aguda

`a5.retencao_urinaria` · queixa: urologica · origem: **A5** · assinatura: **pendente**

Incapacidade de urinar por muitas horas, com bexiga distendida, dor e vontade intensa. Urgência de alívio; sem critério no protocolo original.

*Como a pessoa descreve:* "não consigo urinar desde ontem", "barriga estufada e vontade de urinar", "não sai xixi", "tô com a bexiga cheia e não consigo fazer", "não urino há horas", "não tá urinando", "não urina desde ontem", "não faz xixi desde ontem", "não consegue urinar", "parou de urinar"

⏱ **Tempo-dependente** — a janela terapêutica é curta.

**Enquanto a ajuda não chega:**

1. Não force. Não tome diurético nem beba grande quantidade de líquido de uma vez.
2. Uma compressa morna sobre a barriga pode ajudar a relaxar enquanto você se desloca.

*Fonte:* Lacuna A5 — urgência de alívio.

#### Dor intensa por descritores funcionais

`lj.dor_intensa_funcional` · queixa: geral · origem: **A4** · assinatura: **pendente**

A4 — a escala numérica é o parâmetro mais fácil de manipular e é sistematicamente subnotificada por idosos. O gatilho primário passa a ser funcional: a dor impede dormir, impede andar, falar ou trabalhar, ou piora ao respirar fundo. O número vira campo secundário.

*Como a pessoa descreve:* "dor que não deixa dormir", "não consigo andar de dor", "dor insuportável", "não consigo trabalhar de dor", "dor que piora quando respiro fundo"


*Fonte:* A4 — descritores funcionais são mais estáveis e menos manipuláveis que a escala 0–10.

#### Desidratação

`lj.desidratacao` · queixa: gastrointestinal · origem: **v1** · assinatura: **pendente**

Vômitos ou diarreia repetidos sem conseguir manter líquido, boca muito seca, urina escassa.

*Como a pessoa descreve:* "vomitando tudo", "não para de vomitar", "não consigo beber água", "quase não faço xixi", "diarreia sem parar", "boca seca e fraco", "não consigo segurar água", "não seguro nada no estômago", "vomito até água", "não paro de vomitar"


#### Dor abdominal intensa

`lj.abdome_agudo` · queixa: gastrointestinal · origem: **v1** · assinatura: **pendente**

Dor abdominal forte, contínua, com barriga dura, febre ou vômitos.

*Como a pessoa descreve:* "dor forte na barriga", "barriga dura", "dor na barriga e vomitando", "cólica muito forte"


#### Ferida infectada

`lj.ferida_infectada` · queixa: dermatologica · origem: **v1** · assinatura: **pendente**

Ferida com pus, vermelhidão que se espalha, calor local, febre ou mau cheiro.

*Como a pessoa descreve:* "ferida com pus", "ferida inflamada", "ferida cheirando mal", "machucado vermelho e quente", "ferida no pé que não sara", "ferida que não sara", "ferida que não cicatriza", "ferida há meses", "ferida no pé", "ferida que não fecha"


#### Falta de ar aos esforços

`lj.dispneia_esforco` · queixa: respiratoria · origem: **B11** · assinatura: **pendente**

Falta de ar que aparece com esforço pequeno — andar poucos passos, falar, tomar banho, trocar de roupa — ou piora recente da tolerância ao esforço habitual.

*Como a pessoa descreve:* "falta de ar", "falta de ar ao mínimo esforço", "falta de ar pra andar", "cansaço para respirar", "cansaço aos esforços", "canso fácil", "fico sem ar quando ando", "sem fôlego", "cansada demais pra andar"


*Fonte:* Lacuna encontrada pelo mecanismo de B11 ao rodar o piloto: "falta de ar ao mínimo esforço" não batia critério nenhum e caía no acolhimento genérico. É exatamente o ciclo que a curadoria de não reconhecidos existe para produzir.

#### Crise de asma ou DPOC moderada

`lj.crise_asmatica` · queixa: respiratoria · origem: **v1** · assinatura: **pendente**

Chiado e falta de ar que não melhoraram com a bombinha de resgate em casa.

*Como a pessoa descreve:* "crise de asma", "usei a bombinha e não melhorou", "chiando no peito", "falta de ar e chiado"


#### Hiperglicemia sintomática

`lj.hiperglicemia` · queixa: metabolica · origem: **A14** · assinatura: **pendente**

Glicemia muito alta OU equivalente clínico (A14): muita sede, urinando muito, emagrecimento rápido, hálito adocicado, náusea.

*Como a pessoa descreve:* "açúcar muito alto", "muita sede e urinando muito", "glicose alta", "hálito doce", "diabético descompensado"


*Fonte:* A14 — equivalentes clínicos formalizados ao lado dos números.

#### Abscesso dentário com edema facial

`lj.abscesso_dentario` · queixa: odontologica · origem: **A10** · assinatura: **pendente**

Dor de dente com inchaço do rosto, febre ou dificuldade de abrir a boca. A10 — destino é a urgência odontológica/CEO, não a UPA.

*Como a pessoa descreve:* "dor de dente e o rosto inchou", "inchaço no rosto por causa do dente", "dificuldade de abrir a boca", "abscesso no dente", "dente inflamado com febre"


*Fonte:* A10 — a rede tem mais portas do que cinco; esta é a porta correta.

#### Arbovirose com sinal de alarme

`arb.sinal_alarme` · queixa: arbovirose · origem: **A6** · assinatura: **pendente**

Quadro suspeito de arbovirose COM pelo menos um sinal de alarme. Inclui explicitamente a virada na defervescência: "febre há 4 dias, agora melhorou a febre mas tá com dor forte na barriga e vomitando".

*Como a pessoa descreve:* "febre baixou e tô com dor na barriga", "dengue com dor forte na barriga", "febre há 4 dias e vomitando", "sangramento na gengiva", "sangramento na gengiva com febre", "melhorou a febre mas piorei", "melhorou a febre mas", "a febre melhorou e piorou", "febre baixou", "febre abaixou"

⏱ **Tempo-dependente** — a janela terapêutica é curta.

**Sinais de alarme** → reclassifica para VERMELHO: Sangramento de qualquer sítio ou letargia/irritabilidade — os dois sinais que a checagem obrigatória do módulo classifica como VERMELHO.

**Enquanto a ajuda não chega:**

1. Vá agora. Continue bebendo líquido no caminho, em goles pequenos e frequentes.
2. Não tome AAS, ibuprofeno ou diclofenaco.
3. Leve a lista dos remédios que está tomando.

*Fonte:* A6 — "o manejo depende inteiramente de reconhecer a virada do quadro".

#### Febre em bebê de 3 a 6 meses

`ped.febre_3_a_6_meses` · queixa: pediatrica · origem: **A7** · assinatura: **pendente**

A7 — faixa intermediária de febre pediátrica, ausente no protocolo original.

*Como a pessoa descreve:* "bebê de 4 meses com febre", "bebê de 5 meses febril"


*Fonte:* AIDPI. Faixa acrescentada por A7.

#### Desidratação na criança por sinais observáveis

`ped.desidratacao_infantil` · queixa: pediatrica · origem: **A7** · assinatura: **pendente**

A7 — estimativa por sinais que o cuidador consegue observar: olhos fundos, chora sem lágrima, boca seca, fralda seca há muitas horas, moleira funda, pele que demora a voltar.

*Como a pessoa descreve:* "olhos fundos", "chora sem lágrima", "fralda seca", "não faz xixi", "moleira funda", "boca sequinha", "pele murcha"


*Fonte:* AIDPI — sinais de desidratação observáveis pelo cuidador (A7).

#### Ideação suicida sem plano definido

`sm.ideacao_sem_plano` · queixa: saude_mental · origem: **A8** · assinatura: **pendente**

Pensamentos de morte ou de desaparecer, sem plano estruturado, sem meio disponível e sem intenção imediata. A faixa intermediária que não existia.

*Como a pessoa descreve:* "pensando em sumir", "queria não acordar", "penso em morrer", "não quero mais viver", "tô muito ansiosa, pensando em sumir, mas não fiz nada", "cansei de tudo", "seria melhor se eu não existisse"


*Fonte:* A8 — faixa intermediária entre SAMU e consulta agendada.

#### Autolesão sem intenção letal

`sm.autolesao_sem_intencao_letal` · queixa: saude_mental · origem: **A8** · assinatura: **pendente**

Cortes, queimaduras ou outras autolesões sem intenção de morte.

*Como a pessoa descreve:* "me cortei", "me machuquei de propósito", "me queimei de propósito"


*Fonte:* A8.

#### Surto psicótico incipiente

`sm.surto_psicotico` · queixa: saude_mental · origem: **A8** · assinatura: **pendente**

Alteração de comportamento, fala desorganizada, ouvir vozes, desconfiança intensa.

*Como a pessoa descreve:* "ouvindo vozes", "falando coisa sem sentido", "acha que estão perseguindo", "muito agitado e desconfiado", "surtou"


*Fonte:* A8.

#### Abstinência de álcool ou outras drogas

`sm.abstinencia` · queixa: saude_mental · origem: **A8** · assinatura: **pendente**

Tremor, sudorese, agitação, náusea ou confusão após parar o uso.

*Como a pessoa descreve:* "parei de beber e tô tremendo", "abstinência", "crise por falta de bebida", "tremendo desde que parei"


*Fonte:* A8.

#### Maus-tratos ou negligência infantil

`vi.maus_tratos_infantil` · queixa: violencia · origem: **A9** · assinatura: **pendente**

Suspeita de violência ou negligência contra criança ou adolescente. Notificação compulsória.

*Como a pessoa descreve:* "estão batendo na criança", "criança com marcas", "criança abandonada", "bate no filho", "bate na filha", "bate no menino", "bate na menina", "batendo no filho", "espancando a criança", "batem na criança"


*Fonte:* A9 — encaminhamento inclui conselho tutelar quando aplicável.

#### Violência contra pessoa idosa

`vi.violencia_idoso` · queixa: violencia · origem: **A9** · assinatura: **pendente**

Agressão, negligência, abandono ou apropriação de bens de pessoa idosa.

*Como a pessoa descreve:* "estão maltratando minha mãe idosa", "idoso abandonado", "tomaram o dinheiro do meu pai"


*Fonte:* A9.

#### Exposição de risco ao HIV

`vi.exposicao_hiv` · queixa: violencia · origem: **A9** · assinatura: **pendente**

Exposição sexual ou por material biológico. Janela de profilaxia em horas.

*Como a pessoa descreve:* "me expus ao hiv", "preciso de pep", "relação sem camisinha com risco", "me furei com agulha usada"

⏱ **Tempo-dependente** — a janela terapêutica é curta.

**Enquanto a ajuda não chega:**

1. Procure atendimento nas primeiras horas — a profilaxia (PEP) deve começar o quanto antes, idealmente em até 72 horas.

*Fonte:* A9.

#### Redução dos movimentos fetais

`au.mov_fetal_reduzido` · queixa: obstetrica · origem: **auditoria** · assinatura: **pendente**

Gestante que percebe o bebê mexendo menos, ou parou de sentir os movimentos. Sinal de possível sofrimento fetal — avaliação obstétrica com cardiotocografia.

*Como a pessoa descreve:* "bebe nao mexe", "nenem nao mexe", "o bebe parou de mexer", "nao sinto o bebe mexer", "nao sinto o nenem mexer", "bebe mexendo pouco", "diminuiu o movimento do bebe", "o bebe ta mexendo menos", "faz tempo que nao sinto o bebe"

⏱ **Tempo-dependente** — a janela terapêutica é curta.

*Fonte:* Auditoria — redução de movimento fetal exige avaliação obstétrica; roteia à maternidade (A11).

#### Sangramento na gravidez

`au.sangramento_gestacional` · queixa: obstetrica · origem: **auditoria** · assinatura: **pendente**

Qualquer sangramento vaginal na gestação. Mesmo pequeno, exige avaliação obstétrica para descartar descolamento, placenta prévia e outras causas. O sangramento intenso já é vermelho.

*Como a pessoa descreve:* "gravida e sangrando", "gravida sangrando", "sangramento na gravidez", "sangrando um pouco gravida", "perdendo sangue gravida", "sangrando na gestacao", "to gravida e sangrando um pouco", "gravida com sangramento"

⏱ **Tempo-dependente** — a janela terapêutica é curta.

*Fonte:* Auditoria — sangramento na gravidez roteia à maternidade de referência (A11).

### AMARELO — 31 critério(s)

#### Pressão alta sem lesão de órgão-alvo

`am.pressao_alta_assintomatica` · queixa: cardiovascular · origem: **A3** · assinatura: **pendente**

A3 — no protocolo original, "pressão muito alta sem sintomas neurológicos" ia a LARANJA/UPA. Duas correções: o recorte "neurológicos" era estreito demais (o que separa emergência de pseudocrise é lesão de órgão-alvo em QUALQUER território), e elevação assintomática sem lesão de órgão-alvo é, na prática contemporânea, manejo ambulatorial — não porta de urgência. Como "pressão alta" é uma das queixas mais frequentes da Atenção Básica, este único critério podia responder sozinho por uma fatia expressiva dos encaminhamentos indevidos à UPA.

*Como a pessoa descreve:* "pressão alta", "pressão subiu", "minha pressão deu 18 por 11", "pressão descontrolada", "medi a pressão e tava alta", "pressão alta mas não sinto nada"


**Sinais de alarme** → reclassifica para VERMELHO: Qualquer sinal de lesão de órgão-alvo — em qualquer território, não só neurológico: dor no peito, falta de ar, alteração visual, déficit neurológico, redução do volume de urina.

*Fonte:* A3 — proposta a ser levada à retaguarda médica. Inclui pergunta de confiabilidade da medida (aparelho próprio, farmácia, quando mediu, se estava em repouso), porque o número informado é frequentemente não confiável.

#### Febre em adulto

`am.febre_adulto` · queixa: infecciosa · origem: **v1** · assinatura: **pendente**

Febre sem sinais de gravidade e sem sinais de alarme de arbovirose.

*Como a pessoa descreve:* "febre", "febril", "corpo quente", "tô com febre", "febre de 38"


#### Dor moderada

`am.dor_moderada` · queixa: geral · origem: **v1** · assinatura: **pendente**

Dor que incomoda mas não impede as atividades habituais.

*Como a pessoa descreve:* "dor moderada", "tá doendo", "dor chata", "dor mas dá pra aguentar"


#### Sintomas urinários

`am.infeccao_urinaria` · queixa: urologica · origem: **v1** · assinatura: **pendente**

Ardência ao urinar, urgência, urina turva ou com cheiro forte, sem febre alta ou dor lombar.

*Como a pessoa descreve:* "ardência pra urinar", "ardendo pra fazer xixi", "infecção urinária", "xixi turvo", "vontade de urinar toda hora", "mijo turvo", "urina turva", "mijo fedendo", "urina com cheiro forte", "arde quando faço xixi"


#### Diarreia sem sinais de desidratação

`am.diarreia` · queixa: gastrointestinal · origem: **v1** · assinatura: **pendente**

Diarreia mantendo boa aceitação de líquidos e urina normal.

*Como a pessoa descreve:* "diarreia", "desarranjo", "intestino solto", "indo muito ao banheiro"


#### Ferimento que pode precisar de sutura

`am.escoriacao_ferimento` · queixa: trauma · origem: **v1** · assinatura: **pendente**

Corte com bordas afastadas, sangramento controlado com compressão.

*Como a pessoa descreve:* "corte fundo", "cortei e abriu", "precisa levar ponto", "me cortei"


#### Dor lombar sem sinais de alarme

`am.lombalgia` · queixa: geral · origem: **v1** · assinatura: **pendente**

Dor nas costas sem perda de força, sem alteração de urina ou fezes, sem dormência em sela e sem febre.

*Como a pessoa descreve:* "dor nas costas", "dor na coluna", "lombar doendo", "travei as costas"


**Sinais de alarme** → reclassifica para VERMELHO: Sinais de cauda equina — ver critério a5.cauda_equina.

#### Suspeita de arbovirose sem sinal de alarme

`arb.suspeita` · queixa: arbovirose · origem: **A6** · assinatura: **pendente**

Febre com dois ou mais sintomas típicos (dor atrás dos olhos, dor no corpo ou nas juntas, dor de cabeça, manchas, prostração, náusea), SEM sinais de alarme. Exige checagem obrigatória dos sinais de alarme e orientação de defervescência.

*Como a pessoa descreve:* "febre e dor no corpo", "dengue", "chikungunya", "zika", "febre com dor nas juntas", "febre há 3 dias e dor no corpo", "dor atrás dos olhos com febre", "suspeita de dengue"


*Fonte:* A6 — módulo sazonal de arbovirose.

#### Crise de pânico

`sm.crise_panico` · queixa: saude_mental · origem: **A8** · assinatura: **pendente**

Início súbito de medo intenso com palpitação, falta de ar, formigamento e sensação de morte iminente. Requer descartar causa clínica.

*Como a pessoa descreve:* "crise de pânico", "ataque de pânico", "coração disparado e medo de morrer", "falta de ar e formigando as mãos", "sensação de que vou morrer"


*Fonte:* A8.

#### Luto agudo com sofrimento intenso

`sm.luto_agudo` · queixa: saude_mental · origem: **A8** · assinatura: **pendente**

Perda recente com sofrimento incapacitante.

*Como a pessoa descreve:* "perdi alguém", "meu filho morreu", "não consigo levantar desde que ele morreu"


*Fonte:* A8.

#### Tosse por mais de três semanas

`au.tuberculose_suspeita` · queixa: respiratoria · origem: **auditoria** · assinatura: **pendente**

Tosse persistente por mais de três semanas, especialmente com emagrecimento, sudorese noturna ou febre vespertina. Sintomático respiratório — investigar tuberculose. Notificação.

*Como a pessoa descreve:* "tossindo há mais de três semanas", "tosse há mais de 3 semanas", "tosse de três semanas e emagrecendo", "tosse mais de tres semanas", "tossindo faz um mês", "tosse que não passa e emagrecendo", "tossindo há mais de três semanas e emagrecendo", "tosse com suor à noite"


*Fonte:* Auditoria — sintomático respiratório (tosse >3 semanas) é busca ativa de tuberculose, com notificação à vigilância. Antes caía em síndrome gripal (AZUL/casa).

#### Sangue na urina

`au.hematuria` · queixa: urologica · origem: **auditoria** · assinatura: **pendente**

Presença de sangue na urina sem ardência nem febre associadas. Exige investigação — pode indicar desde cálculo até causas que se beneficiam de diagnóstico precoce.

*Como a pessoa descreve:* "sangue no mijo", "sangue na urina", "mijando sangue", "urina com sangue", "to mijando sangue", "sangue quando faço xixi"


*Fonte:* Auditoria — hematúria isolada exige investigação ambulatorial dirigida.

#### Ferida por pressão em pessoa acamada

`au.ulcera_pressao` · queixa: dermatologica · origem: **auditoria** · assinatura: **pendente**

Ferida que surge em pessoa acamada, tipicamente nas costas, quadril ou calcanhar. Úlcera por pressão — o cuidado é da equipe da microárea, que vai até a pessoa (A13).

*Como a pessoa descreve:* "ferida nas costas de acamado", "escara", "ferida de cama", "ferida em quem fica deitado", "ferida no bumbum de acamado", "ferida de pressão", "apareceu uma ferida nas costas"


*Fonte:* Auditoria — úlcera por pressão; acamado muda a modalidade para a equipe eSF (A13).

#### Reação de pele recente

`cur.reacao_cutanea_aguda` · queixa: dermatologica · origem: **B11** · assinatura: **pendente**

Picada de inseto que inchou, assadura intensa — reação local recente, sem sinais de anafilaxia.

*Como a pessoa descreve:* "picada de inseto que inchou", "picada que inchou", "fui picado e inchou o local", "assadura forte", "assadura do bebê", "brotoeja", "urticária localizada"


*Fonte:* Curadoria B11.

#### Sinal de pele ou caroço que mudou

`cur.lesao_cutanea_suspeita` · queixa: dermatologica · origem: **B11** · assinatura: **pendente**

Pinta ou sinal que mudou de cor, forma ou tamanho, ou caroço novo que cresce. Merece avaliação dirigida.

*Como a pessoa descreve:* "sinal que mudou de cor", "pinta que mudou", "pinta que cresceu", "caroço que cresce", "caroço embaixo do braço", "caroço no pescoço que cresce", "nódulo que apareceu"


*Fonte:* Curadoria B11 — lesão suspeita merece avaliação, não espera de fila genérica.

#### Dor de ouvido

`cur.otalgia` · queixa: infecciosa · origem: **B11** · assinatura: **pendente**

Dor de ouvido, ouvido entupido ou com secreção — comum em crianças e no adulto após resfriado.

*Como a pessoa descreve:* "ouvido doendo", "dor de ouvido", "ouvido entupido", "ouvido tampado", "ouvido com pus", "dor no ouvido", "meu ouvido tá doendo"


*Fonte:* Curadoria B11.

#### Olho vermelho e remelando

`cur.conjuntivite` · queixa: ocular · origem: **B11** · assinatura: **pendente**

Olho vermelho com secreção, coceira e sensação de areia — conjuntivite; ou cisco/corpo estranho superficial.

*Como a pessoa descreve:* "olho vermelho e remelando", "olho remelando", "conjuntivite", "olho vermelho", "cisco no olho", "entrou cisco no olho", "areia no olho", "olho grudando"


*Fonte:* Curadoria B11.

#### Dor de dente sem inchaço do rosto

`cur.odontalgia` · queixa: odontologica · origem: **B11** · assinatura: **pendente**

Dor de dente, cárie, gengiva inflamada ou sangrando, dente quebrado — sem edema facial (que já é laranja).

*Como a pessoa descreve:* "dor de dente", "dente cariado e doendo", "dente doendo", "dente inflamado", "gengiva sangra", "gengiva inflamada", "quebrei um dente", "dente quebrado"


*Fonte:* Curadoria B11 — roteia à urgência odontológica/CEO (A10).

#### Corrimento ou sintoma genital

`cur.corrimento_ist` · queixa: urologica · origem: **B11** · assinatura: **pendente**

Corrimento, coceira genital, ferida na região íntima, no homem ou na mulher. Avaliar infecção sexualmente transmissível.

*Como a pessoa descreve:* "corrimento amarelado", "corrimento", "coceira na vagina", "ferida na região íntima", "corrimento no homem", "ferida na parte íntima", "coceira íntima"


*Fonte:* Curadoria B11.

#### Torção, contusão ou pancada recente

`cur.trauma_leve_recente` · queixa: trauma · origem: **B11** · assinatura: **pendente**

Entorse, contusão, dedo ou membro batido recentemente, sem deformidade nem osso exposto (que já é vermelho).

*Como a pessoa descreve:* "torci o pé", "torci o tornozelo", "entorse", "dedo inchado depois que bati", "bati o dedo e inchou", "dor no cóccix depois de cair", "contusão", "me machuquei na queda"


*Fonte:* Curadoria B11.

#### Prisão de ventre

`cur.constipacao` · queixa: gastrointestinal · origem: **B11** · assinatura: **pendente**

Intestino preso por dias, sem distensão dolorosa nem vômito (que sugeririam obstrução, já coberta por dor abdominal intensa).

*Como a pessoa descreve:* "prisão de ventre", "intestino preso", "intestino trancado", "não vou ao banheiro faz dias", "não evacuo faz dias", "ressecado do intestino"


*Fonte:* Curadoria B11 — antes mapeada por engano para "diarreia" no dicionário regional.

#### Hemorroida ou sangue vivo ao evacuar

`cur.hemorroida` · queixa: gastrointestinal · origem: **B11** · assinatura: **pendente**

Sangue vermelho vivo no papel ou no vaso ao evacuar, com ou sem dor anal. Distinto de fezes pretas (melena), que é vermelho.

*Como a pessoa descreve:* "hemorroida", "sangue vivo no papel", "sangramento ao evacuar", "sangue no papel higiênico", "sangra quando vou ao banheiro", "bico de hemorroida"


*Fonte:* Curadoria B11.

#### Peito inflamado na amamentação

`cur.mastite` · queixa: geral · origem: **B11** · assinatura: **pendente**

Mama dolorida, inchada, vermelha ou empedrada durante a amamentação. Mastite ou ingurgitamento.

*Como a pessoa descreve:* "peito inchado amamentando", "peito empedrado", "seio inflamado amamentando", "mastite", "peito doendo de amamentar", "meu peito tá inchado e doendo"


*Fonte:* Curadoria B11.

#### Sapinho na boca do bebê

`cur.sapinho` · queixa: pediatrica · origem: **B11** · assinatura: **pendente**

Placas brancas na boca do bebê (candidíase oral), que podem atrapalhar a mamada.

*Como a pessoa descreve:* "sapinho na boca", "sapinho", "placas brancas na boca do bebê", "boca do bebê com placas brancas"


*Fonte:* Curadoria B11.

#### Uso de álcool ou outras drogas — busca de ajuda

`cur.uso_substancias` · queixa: saude_mental · origem: **B11** · assinatura: **pendente**

Pessoa que bebe demais e quer parar, ou familiar de quem usa drogas buscando ajuda, sem quadro agudo de abstinência (que é laranja).

*Como a pessoa descreve:* "bebendo demais e quero parar", "quero parar de beber", "bebo demais", "usando droga", "meu filho tá usando droga", "preciso de ajuda com bebida", "dependente químico"


*Fonte:* Curadoria B11 — porta para CAPS-AD; distinto da abstinência aguda (A8).

#### Pressão baixa com tontura

`cur.hipotensao_sintomatica` · queixa: cardiovascular · origem: **B11** · assinatura: **pendente**

Sensação de pressão baixa com tontura ao levantar, sem desmaio nem confusão. Avaliar medicação e hidratação.

*Como a pessoa descreve:* "pressão caiu", "pressão baixa", "pressão caiu e fiquei tonto", "pressão baixa e tontura", "fiquei tonto quando levantei", "minha pressão tá baixa"


*Fonte:* Curadoria B11.

#### Glicemia alta sem sintoma agudo

`cur.glicemia_alta_assintomatica` · queixa: metabolica · origem: **B11** · assinatura: **pendente**

Açúcar alto na medida, sem os sinais de descompensação (muita sede, urinar muito, hálito adocicado), que já são laranja. Ajuste ambulatorial.

*Como a pessoa descreve:* "açúcar deu 400", "glicose alta de manhã", "açúcar sempre alto", "glicemia alta", "açúcar não abaixa", "açúcar deu alto", "glicose sempre alta"


*Fonte:* Curadoria B11 — distinto da hiperglicemia sintomática (LARANJA).

#### Emagrecimento sem causa

`cur.perda_peso` · queixa: geral · origem: **B11** · assinatura: **pendente**

Perda de peso não intencional, ou idoso que não quer comer e emagrece. Investigação dirigida.

*Como a pessoa descreve:* "emagrecendo sem motivo", "perdi peso sem dieta", "perdi 8 quilos", "perdi peso sem querer", "emagrecendo", "não quer comer e tá emagrecendo", "perdendo peso sem motivo"


*Fonte:* Curadoria B11.

#### Perna inchada e vermelha de um lado

`cur.membro_inchado` · queixa: cardiovascular · origem: **B11** · assinatura: **pendente**

Inchaço e vermelhidão em uma perna. Avaliar trombose e erisipela — não deixar em fila genérica.

*Como a pessoa descreve:* "perna inchada e vermelha", "panturrilha inchada", "perna inchada de um lado", "perna vermelha e inchada", "batata da perna inchada e dolorida"


*Fonte:* Curadoria B11.

#### Dor de barriga leve ou recorrente

`cur.dor_abdominal_leve` · queixa: gastrointestinal · origem: **B11** · assinatura: **pendente**

Dor abdominal leve, cólica ou que vai e vem, sem barriga dura, febre alta ou vômitos persistentes (que já elevam para laranja).

*Como a pessoa descreve:* "dor de barriga", "dor de barriga faz dias", "dor de barriga leve", "cólica leve", "cólica forte", "dor de barriga que vai e vem", "dor na barriga fraca"


*Fonte:* Curadoria B11 — dor abdominal leve; a intensa e a com sinais de alarme sobem por outros critérios.

#### Vômitos recentes sem desidratação

`cur.vomito_agudo` · queixa: gastrointestinal · origem: **B11** · assinatura: **pendente**

Poucos episódios de vômito recentes, mantendo líquido. O vômito incoercível e a desidratação já sobem para laranja.

*Como a pessoa descreve:* "vomitou três vezes", "vomitou várias vezes", "vomitando bastante", "vomitei de manhã", "enjoo o dia todo", "muito enjoo"


*Fonte:* Curadoria B11.

### VERDE — 14 critério(s)

#### Acompanhamento de condição crônica

`vd.acompanhamento_cronico` · queixa: geral · origem: **v1** · assinatura: **pendente**

Revisão de hipertensão, diabetes, tireoide ou outra condição estável.

*Como a pessoa descreve:* "consulta de rotina", "revisar a pressão", "acompanhamento do diabetes"


#### Renovação de receita

`vd.renovacao_receita` · queixa: medicamento · origem: **A10** · assinatura: **pendente**

A10 — o destino correto é a farmácia da unidade, não uma vaga de consulta. Este caso não pode escalar por agravante de HAS ou DM (A1).

*Como a pessoa descreve:* "renovar receita", "renovar a receita", "preciso renovar a receita da pressão", "acabou meu remédio", "preciso da receita", "receita do remédio venceu"


*Fonte:* A10 — "farmácia da unidade (renovação de receita, que hoje ocupa uma vaga de consulta)".

#### Ansiedade, insônia ou busca por psicólogo

`vd.saude_mental_leve` · queixa: saude_mental · origem: **v1** · assinatura: **pendente**

Sofrimento psíquico sem ideação, sem autolesão e sem crise aguda. Ver trilha de saúde mental (A8) para tudo que estiver acima disto.

*Como a pessoa descreve:* "ansiedade", "não consigo dormir", "preciso de psicólogo", "tô triste", "estresse", "insônia", "ansiosa", "ansioso", "muito ansiosa", "muito ansioso"


#### Problema de pele de evolução lenta

`cur.dermatose_cronica` · queixa: dermatologica · origem: **B11** · assinatura: **pendente**

Micose, frieira, verruga, caspa, mancha, ressecamento, acne, unha encravada — quadros de pele sem sinais de infecção sistêmica.

*Como a pessoa descreve:* "micose", "frieira", "verruga", "caspa", "mancha na pele", "mancha branca no braço", "pele ressecada", "pele descascando", "acne", "espinha no rosto"


*Fonte:* Curadoria B11 — dermatologia ambulatorial, ausente do protocolo.

#### Queixa de ouvido, nariz ou garganta de evolução lenta

`cur.orl_cronico` · queixa: respiratoria · origem: **B11** · assinatura: **pendente**

Zumbido, cera, redução da audição, rouquidão persistente, perda de voz, sinusite recorrente.

*Como a pessoa descreve:* "zumbido no ouvido", "cera no ouvido", "não escuto direito", "ouço mal", "rouco faz dias", "rouco há dias", "voz sumiu", "perdi a voz", "sinusite"


*Fonte:* Curadoria B11.

#### Vista cansada ou coceira nos olhos

`cur.oftalmo_ambulatorial` · queixa: ocular · origem: **B11** · assinatura: **pendente**

Terçol, necessidade de óculos, coceira ocular alérgica, visão embaçada de evolução lenta.

*Como a pessoa descreve:* "terçol", "preciso de óculos", "não enxergo de longe", "coceira no olho", "olho coçando", "vista embaçada faz tempo", "vista cansada"


*Fonte:* Curadoria B11.

#### Necessidade odontológica sem dor

`cur.odonto_agendado` · queixa: odontologica · origem: **B11** · assinatura: **pendente**

Extração programada, limpeza, revisão — demanda odontológica sem urgência.

*Como a pessoa descreve:* "preciso extrair um dente", "quero fazer limpeza", "revisão do dente", "consulta no dentista"


*Fonte:* Curadoria B11.

#### Alteração menstrual sem dor aguda

`cur.disturbio_menstrual` · queixa: geral · origem: **B11** · assinatura: **pendente**

Menstruação muito intensa, ausência de menstruação sem gravidez, dor na relação — sem dor abdominal aguda de um lado (que já é vermelho, ectópica).

*Como a pessoa descreve:* "menstruação muito forte", "menstruação muito intensa", "sem menstruar faz meses", "sem menstruar faz três meses", "dor durante a relação", "menstruação irregular"


*Fonte:* Curadoria B11.

#### Dor articular ou muscular de longa data

`cur.dor_musculo_cronica` · queixa: geral · origem: **B11** · assinatura: **pendente**

Dor em ombro, joelho, cotovelo, punho, calcanhar, pescoço ou coluna, de evolução lenta; cãibras, varizes, formigamento crônico. Sem sinal de alarme neurológico.

*Como a pessoa descreve:* "dor no ombro", "dor no joelho", "joelho inchado", "tendinite", "dor no cotovelo", "dor no punho", "dor no calcanhar", "cãibra à noite", "varizes doendo", "varizes"


*Fonte:* Curadoria B11 — dor musculoesquelética crônica, encaminhamento eletivo.

#### Resultado de exame alterado

`cur.exame_alterado` · queixa: geral · origem: **B11** · assinatura: **pendente**

Colesterol, triglicerídeos, tireoide ou hemograma alterados no exame, sem sintoma agudo. Consulta para conduta.

*Como a pessoa descreve:* "colesterol alto", "triglicerídeos altos", "tireoide alterada", "anemia no exame", "exame alterado", "exame deu alterado", "resultado alterado"


*Fonte:* Curadoria B11.

#### Azia e má digestão

`cur.dispepsia` · queixa: gastrointestinal · origem: **B11** · assinatura: **pendente**

Azia, queimação no estômago, refluxo, gastrite — sintomas dispépticos crônicos. A dor torácica é discriminada pelo bloco fixo de segurança (B4).

*Como a pessoa descreve:* "azia", "queimação no estômago", "gastrite", "refluxo", "estômago embrulhado", "má digestão", "empachado", "queimação depois que como"


*Fonte:* Curadoria B11 — dispepsia, o item que a expansão anterior deixou explicitamente em aberto para a retaguarda. Entra como VERDE, e o bloco fixo de segurança segue descartando dor torácica.

#### Queixa infantil de rotina

`cur.pediatria_comum` · queixa: pediatrica · origem: **B11** · assinatura: **pendente**

Piolho, verme, baixo ganho de peso, puericultura — demanda pediátrica sem sinal de gravidade.

*Como a pessoa descreve:* "piolho", "verme", "coça o bumbum", "oxiúro", "não ganha peso", "não tá ganhando peso", "puericultura", "consulta do bebê", "acompanhamento do bebê"


*Fonte:* Curadoria B11.

#### Esquecimento e perda de memória

`cur.cognitivo` · queixa: geral · origem: **B11** · assinatura: **pendente**

Queixa de memória — esquecimento progressivo — sem confusão aguda (que é vermelho). Avaliação cognitiva eletiva.

*Como a pessoa descreve:* "esquecendo as coisas", "memória ruim", "ando esquecido", "ando esquecida", "esqueço tudo", "minha memória tá falhando"


*Fonte:* Curadoria B11 — distinto da confusão aguda, que segue sendo bandeira vermelha.

#### Exame preventivo ou rastreamento

`cur.preventivo` · queixa: administrativa · origem: **B11** · assinatura: **pendente**

Preventivo, pré-natal, mamografia, exame de próstata, teste rápido — demanda de rastreamento, agendável.

*Como a pessoa descreve:* "quero fazer o preventivo", "preventivo", "papanicolau", "fazer o pré-natal", "pré-natal", "marcar a mamografia", "mamografia", "teste de covid", "teste de gravidez", "exame de próstata"


*Fonte:* Curadoria B11.

### AZUL — 5 critério(s)

#### Dúvida administrativa

`vd.duvida_administrativa` · queixa: administrativa · origem: **v1** · assinatura: **pendente**

Agendamento, documentos, cartão SUS, resultado de exame.

*Como a pessoa descreve:* "como agendo", "preciso do cartão sus", "fazer o cartão do sus", "resultado do exame", "marcar consulta", "remarcar consulta", "remarcar minha consulta", "atestado", "declaração de comparecimento", "encaminhamento"


#### Dúvida sobre medicamento

`vd.duvida_medicamento` · queixa: medicamento · origem: **v1** · assinatura: **pendente**

Como tomar, horário, se pode junto com outro.

*Como a pessoa descreve:* "posso tomar junto", "que horas tomo o remédio", "esqueci de tomar", "tomar o remédio junto", "remédio junto com o outro", "de quantas em quantas horas", "remédio tá me dando enjoo", "remédio me dá enjoo", "trocar meu anticoncepcional", "trocar o remédio"


#### Vacinação

`vd.vacina` · queixa: vacina · origem: **A10** · assinatura: **pendente**

A10 — demanda espontânea de sala de vacina, não consulta.

*Como a pessoa descreve:* "tomar vacina", "vacina em atraso", "carteira de vacinação", "segunda dose", "tomar a segunda dose", "vacina atrasada", "vacina da criança atrasada", "atualizar a vacina", "reforço da vacina"


#### Síndrome gripal leve sem sinal de alarme

`az.sindrome_gripal_leve` · queixa: respiratoria · origem: **A2** · assinatura: **pendente**

Coriza, espirros, dor de garganta leve, febre baixa, sem falta de ar, sem dor no peito e sem prostração. Isento do piso de 24 horas (A2).

*Como a pessoa descreve:* "nariz escorrendo", "acordei com o nariz escorrendo e espirrando", "resfriado", "gripinha", "espirrando", "garganta arranhando", "nariz entupido", "dor de garganta", "garganta doendo", "garganta inflamada"


*Fonte:* A2 — exceção nomeada ao piso de 24 horas, para que o nível AZUL volte a existir.

#### Escoriação superficial

`az.escoriacao_superficial` · queixa: trauma · origem: **A2** · assinatura: **pendente**

Arranhão ou raspão superficial, sangramento mínimo, bordas justas. Isento do piso de 24h (A2).

*Como a pessoa descreve:* "ralei o joelho", "arranhão", "raspão", "me arranhei"


*Fonte:* A2 — exceção nomeada ao piso de 24 horas.

## Agravantes condicionados (A1)

No protocolo v1, onze condições subiam o caso um nível para **qualquer** critério. Como HAS,
DM e idade 60+ não são raros na demanda de uma UBS — são a demanda da UBS — o efeito era
reorientar o fluxo da Atenção Básica para a urgência. Aqui cada comorbidade só escalona os
critérios com os quais tem relação fisiopatológica.

**Teto:** agravante nunca cria emergência. VERMELHO exige bandeira clínica própria.

| Agravante | Bloco | Escalona | Justificativa |
|---|---|---|---|
| **Diabetes** | diabetes | dermatologica, metabolica, lj.ferida_infectada, am.febre_adulto, lj.desidratacao, am.infeccao_urinaria | Retardo de cicatrização e maior risco de infecção de partes moles; descompensação metabólica acelerada em quadros febris e desidratação. |
| **Pressão alta (hipertensão)** | coracao_pressao | cardiovascular, am.dor_moderada | Risco cardiovascular aumentado em dor torácica e em cefaleia, por associação com evento coronariano e cerebrovascular. |
| **Doença do coração** | coracao_pressao | cardiovascular, respiratoria | Reserva cardíaca reduzida: dispneia e dor torácica têm limiar de gravidade mais baixo. |
| **Asma ou problema de pulmão** | pulmao | respiratoria | Reserva ventilatória reduzida; deterioração rápida em quadro respiratório. |
| **Imunidade baixa (quimioterapia, transplante, HIV, corticoide)** | outros | infecciosa, dermatologica, qualquer febre | Resposta inflamatória atenuada mascara gravidade; infecção pode evoluir sem os sinais habituais. Ver também o critério próprio a5.neutropenia_febril. |
| **Problema nos rins** | outros | urologica, metabolica, lj.desidratacao, am.pressao_alta_assintomatica | Menor tolerância a desidratação e a distúrbios hidroeletrolíticos; hipertensão de difícil controle. |
| **Pessoa acamada ou com mobilidade muito reduzida** | outros | lj.ferida_infectada | Risco de lesão por pressão e de infecção. IMPORTANTE: o efeito principal deste marcador não é escalonar nível, e sim mudar a modalidade — ver roteamento para equipe eSF (A13). |
| **Pós-parto (até 42 dias)** | gravidez_pos_parto | obstetrica, infecciosa | Risco de infecção puerperal, hemorragia tardia e tromboembolismo. Também é variável de roteamento para a maternidade de referência (A11). |
| **Criança com menos de 2 anos** | outros | pediatrica, infecciosa, respiratoria, gastrointestinal | Deterioração rápida e reserva fisiológica reduzida. |

**Idade:** escalona sozinha a partir de 75 anos.
Entre 60 e 74 exige
idade **somada** a sinal agudo. Idade 60+ é a demanda da UBS, não uma exceção. Aplicá-la como agravante universal reorientaria o fluxo da Atenção Básica para a urgência (A1).

## Bloco fixo de perguntas de segurança (B4)

Determinístico, sem IA e sem rede. Para relatos vagos ("tô passando mal"), este bloco deixa
de ser complemento e passa a ser o **mecanismo principal** de triagem.

- 💔 **Está com dor ou aperto no peito?** — Peso, aperto ou dor no meio do peito, que pode ir para o braço, o pescoço ou as costas. → aciona `vm.dor_toracica`
- 🫁 **Está com falta de ar?** — Dificuldade de respirar mesmo parado, ou não consegue falar uma frase inteira. → aciona `vm.falta_ar_grave`
- 🫱 **Está com fraqueza ou dormência de um lado do corpo?** — Um braço ou uma perna que ficou sem força, mole, ou dormente — só de um lado. → aciona `vm.avc`
- 😐 **A boca ou o rosto ficaram tortos?** — Peça para a pessoa sorrir. Se um lado não sobe, é sinal de alerta. → aciona `vm.avc`
- 😵 **Desmaiou ou apagou?** — Perdeu a consciência, mesmo que por poucos segundos. → aciona `vm.rebaixamento`
- 🩸 **Está com sangramento que não para?** — Sangue que continua saindo mesmo apertando com um pano por alguns minutos. → aciona `vm.hemorragia_ativa`
- 🌡️ **Está com febre e o pescoço duro?** — Não consegue encostar o queixo no peito, com febre e dor de cabeça forte. → aciona `vm.meningite`

## Roteiros fechados em domínio sensível (B8)

Perguntas fixas escritas pela equipe clínica **não são a IA fazendo perguntas** — são
formulário, auditável e testável.

### saude_mental (`rot.risco_autoprovocado`)

- **Nos últimos dias, você teve pensamentos de que seria melhor não estar viva ou vivo?** — Não / Passou pela cabeça / Sim, com frequência
- **Você chegou a pensar em COMO faria isso?** — Não / Pensei vagamente / Sim, tenho um plano → eleva para VERMELHO
- **Você tem acesso ao que precisaria para isso?** — Não / Talvez / Sim → eleva para VERMELHO
- **Você já tentou tirar a própria vida antes?** — Não / Sim, há muito tempo / Sim, recentemente → eleva para LARANJA
- **Tem alguém com você agora, ou alguém que possa ficar com você?** — Sim / Não

### pediatrica (`rot.pediatrico`)

- **Ele ou ela está mamando/bebendo normal?** — Sim / Menos que o normal / Não consegue → eleva para VERMELHO
- **Está vomitando tudo o que toma?** — Não / Às vezes / Vomita tudo → eleva para VERMELHO
- **Tem afundado a barriguinha entre as costelas quando respira?** — Não / Sim → eleva para VERMELHO
- **Está muito molinho, difícil de acordar?** — Não / Sim → eleva para VERMELHO
- **Teve algum tremor ou convulsão nesta doença?** — Não / Sim → eleva para VERMELHO
- **Está fazendo xixi normalmente? A fralda tem ficado molhada?** — Sim / Menos que o normal / Está seca há muitas horas → eleva para LARANJA

### arbovirose (`rot.arbovirose`)

- **Está com dor forte na barriga, que não passa?** — Não / Sim → eleva para LARANJA
- **Está vomitando sem parar ou não consegue segurar líquido?** — Não / Sim → eleva para LARANJA
- **Apareceu sangramento — gengiva, nariz, urina, fezes ou manchas roxas?** — Não / Sim → eleva para VERMELHO
- **Sente tontura forte ou quase desmaia ao levantar?** — Não / Sim → eleva para LARANJA
- **Está muito sonolento, confuso ou muito irritado?** — Não / Sim → eleva para VERMELHO
- **A febre baixou de repente e você se sentiu PIOR depois disso?** — Não / Sim → eleva para LARANJA

### obstetrica (`rot.gestacao`)

- **De quantas semanas está a gestação?** — Menos de 20 / 20 a 36 / 37 ou mais / Não sei
- **Está com sangramento?** — Não / Pouco / Muito → eleva para VERMELHO
- **O bebê está se mexendo como de costume?** — Sim / Menos / Parou de mexer → eleva para VERMELHO
- **Perdeu líquido pela vagina?** — Não / Sim → eleva para LARANJA
- **Está com dor de cabeça forte ou vendo embaçado?** — Não / Sim → eleva para VERMELHO

## Módulo sazonal de arbovirose (A6)

Reconhecimento: febre **mais** 2 sintomas típicos.

**Sinais de alarme, de checagem obrigatória:**

- Está com dor forte na barriga, que não passa? → **LARANJA**
- Está vomitando sem parar ou não consegue segurar líquido? → **LARANJA**
- Apareceu algum sangramento — gengiva, nariz, urina, fezes ou pele? → **VERMELHO**
- Sente tontura forte ou desmaio ao levantar? → **LARANJA**
- Está muito sonolento, confuso ou muito irritado? → **VERMELHO**
- A febre baixou de repente e você se sentiu PIOR depois disso? → **LARANJA**

> ATENÇÃO — o momento mais perigoso da dengue é quando a febre baixa, entre o terceiro e o sétimo dia. É justamente quando a pessoa acha que está melhorando que o quadro pode virar. Se a febre baixar e você se sentir pior, procure atendimento no mesmo momento.

Não tome AAS (ácido acetilsalicílico), ibuprofeno, diclofenaco ou outros anti-inflamatórios sem orientação — eles aumentam o risco de sangramento.

## Rede de segurança nos cinco níveis (A12)

### VERMELHO

**Observar:** Se a pessoa parar de responder ou de respirar. · Se o sangramento aumentar. · Se surgir convulsão.

**Reavaliar:** Enquanto espera a ambulância — fique ao lado o tempo todo.

**Voltar se:** Se a ambulância demorar e a pessoa piorar, ligue 192 de novo e informe a mudança. · Não leve por conta própria sem falar com o 192 antes.

### LARANJA

**Observar:** Dor que aumenta muito. · Falta de ar nova ou que piora. · Desmaio, confusão ou muita sonolência. · Vômito que não para ou incapacidade de beber líquido. · Febre que sobe muito ou não cede.

**Reavaliar:** Vá agora. Se ainda estiver esperando em 1 hora, reavalie os sinais acima.

**Voltar se:** Se aparecer qualquer sinal da lista, ligue 192 imediatamente. · Se não conseguir se deslocar, use o app de novo e informe isso — a equipe pode ser acionada.

### AMARELO

**Observar:** Dor no peito ou falta de ar. · Fraqueza de um lado do corpo, boca torta ou fala embolada. · Febre com pescoço duro ou manchas roxas. · Vômito persistente ou barriga muito dura. · Desmaio ou confusão.

**Reavaliar:** Reavalie em até 12 horas, ou antes se algo mudar.

**Voltar se:** Se aparecer qualquer sinal da lista, procure atendimento imediatamente ou ligue 192. · Se não melhorar em 48 horas, volte a usar o app ou procure a UBS.

### VERDE

**Observar:** Piora do que você sente hoje. · Febre alta que aparece. · Dor que passa a impedir dormir, andar ou trabalhar.

**Reavaliar:** Reavalie em 48 a 72 horas.

**Voltar se:** Se aparecer febre alta, falta de ar ou dor intensa, volte a usar o app no mesmo momento. · Se o sintoma persistir além de uma semana, procure a UBS mesmo com a consulta agendada.

### AZUL

**Observar:** Febre que passa de 3 dias. · Falta de ar ou chiado. · Dor que piora em vez de melhorar. · Manchas na pele ou sangramento. · Muita sonolência ou confusão.

**Reavaliar:** Reavalie em 48 horas.

**Voltar se:** Volte a usar o app se aparecer qualquer um dos sinais acima. · Se você se sentir pior em vez de melhor, procure a UBS.

## Base de unidades e horários (D1)

| Unidade | Destino | Bairro | Endereço |
|---|---|---|---|
| UBS João Dias | ubs_hoje | Nova Parnamirim | Nova Parnamirim, Parnamirim/RN |
| UPA de Parnamirim | upa | Centro | Parnamirim/RN |
| Maternidade de referência da microárea | maternidade | a confirmar | A CONFIRMAR com a UBS e a Secretaria (A11) |
| CAPS de Parnamirim | caps | a confirmar | A pactuar com a rede de saúde mental do município (A8) |
| Centro de Especialidades Odontológicas | ceo | a confirmar | A confirmar com a Secretaria |

*Horários e feriados a confirmar com a Secretaria antes do piloto.*

## Dicionário regional potiguar (B1) — 721 expressões

"Expressões locais que a busca por palavra-chave não cobre. Coleta com a equipe e com os
agentes comunitários."

Este dicionário **não é exaustivo e não pode ser**. Nenhuma lista escrita em gabinete cobre a
variação real da fala: ela muda por bairro, por idade, por escolaridade. O que garante
cobertura ao longo do tempo é o mecanismo — a camada 2 traduz o que a lista não previu, e a
fila de curadoria (B11) transforma cada relato não reconhecido em linha nova aqui.

### Nosologia popular — revisar com atenção redobrada

As entradas abaixo não são sinônimos de sintoma: são **nomes populares de doença**, e cada
uma afirma uma equivalência clínica. Uma equivalência errada aqui não produz uma palavra não
reconhecida — produz um encaminhamento errado. São os itens deste arquivo que mais precisam
da assinatura da retaguarda.

- **"quebranto"** — Nome popular para prostração/letargia em criança, atribuída a mau-olhado. É o mesmo quadro que a AIDPI trata como SINAL GERAL DE PERIGO. Mapeado para "molinho" (A7) — a explicação da família sobre a causa é irrelevante para o risco, e discutir a causa com a família afasta em vez de acolher.
- **"zipela"** — Erisipela. Infecção de pele com porta de entrada, comum e potencialmente grave em pessoa com diabetes. Mapeado para "machucado vermelho e quente" (lj.ferida_infectada).
- **"cobreiro"** — Herpes-zóster. O tratamento antiviral tem janela útil de cerca de 72 horas do início das lesões, o que torna o reconhecimento precoce relevante. Hoje mapeado apenas para "manchas vermelhas" — a retaguarda precisa decidir se merece critério próprio.
- **"espinhela caida"** — Queixa torácica/epigástrica sem correlato anatômico. NÃO deve ser descartada: pode recobrir dor torácica real. Mapeada para "dor no corpo" e a discriminação fica com o bloco fixo de segurança (B4), que pergunta diretamente sobre dor no peito.
- **"rendidura"** — Hérnia. "Rendido"/"quebradura" descrevem hérnia inguinal ou umbilical. Se encarcerada, é emergência cirúrgica. Mapeada para "dor forte na barriga" (laranja) — a retaguarda precisa decidir se hérnia encarcerada merece bandeira própria, como os quadros de A5.
- **"gota coral"** — Nome popular de epilepsia no interior do Nordeste. Mapeado para "tendo ataque" (convulsão).
- **"papeira"** — Caxumba, ou qualquer aumento de volume cervical. Mapeado para "ferida inflamada"; a retaguarda deve avaliar se merece tratamento próprio.
- **"ingua"** — Linfonodo aumentado. Frequentemente benigno, mas pode acompanhar infecção significativa. Mapeado para "ferida inflamada" (laranja) — provavelmente conservador demais; item para revisão clínica.
- **"olho gordo"** — Ver "quebranto". Mesmo tratamento: o sinal observável é o que importa.
- **"resguardo"** — Puerpério. "De resguardo" indica pós-parto recente, que muda completamente o risco de uma queixa. Mapeado para gestante, o que aciona o roteamento obstétrico (A11).
- **"de bucho"** — Grávida. Junto com "embuchada" e "de barriga", é como boa parte da população descreve gestação — a palavra "gestante" é de prontuário, não de casa.

### Tabela completa

| Expressão local | Traduz para |
|---|---|
| deu um treco | desmaiou e não acordou |
| deu um troco | desmaiou e não acordou |
| deu um troço | desmaiou e não acordou |
| teve um treco | desmaiou e não acordou |
| deu um piripaque | desmaiou e não acordou |
| deu um piti | desmaiou e não acordou |
| deu um chilique | desmaiou e não acordou |
| deu um faniquito | desmaiou e não acordou |
| deu um fanico | desmaiou e não acordou |
| deu um xilique | desmaiou e não acordou |
| passou mal de repente | desmaiou e não acordou |
| caiu duro | desmaiou e não acordou |
| caiu dura | desmaiou e não acordou |
| caiu sem sentido | desmaiou e não acordou |
| perdeu os sentidos | desmaiou e não acordou |
| ficou sem sentido | desmaiou e não acordou |
| sem sentidos | não responde |
| desfaleceu | desmaiou e não acordou |
| desfalecida | não responde |
| desfalecido | não responde |
| arriou | desmaiou e não acordou |
| arriou tudo | desmaiou e não acordou |
| arriou de vez | desmaiou e não acordou |
| esmorecido | não responde |
| esmorecida | não responde |
| esmoreceu | não responde |
| desacordado | não responde |
| desacordada | não responde |
| nao da acordo | não responde |
| nao toma tino | não responde |
| nao da fe | não responde |
| nao da fe de nada | não responde |
| sem dar fe | não responde |
| apagou de vez | desmaiou e não acordou |
| apagou geral | desmaiou e não acordou |
| desmilinguido | muito fraco |
| desmilinguida | muito fraco |
| derriçado | muito fraco |
| derricado | muito fraco |
| arriado | muito fraco |
| arriada | muito fraco |
| estrompado | muito fraco |
| estrompada | muito fraco |
| acabado | muito fraco |
| acabada | muito fraco |
| moleza | muito fraco |
| moleza no corpo | muito fraco |
| sem eito | muito fraco |
| sem animo | muito fraco |
| sem disposicao | muito fraco |
| abatido | muito fraco |
| abatida | muito fraco |
| adoentado | muito fraco |
| adoentada | muito fraco |
| esculhambado do corpo | muito fraco |
| quebrado todo | dor no corpo |
| quebrada toda | dor no corpo |
| moido | dor no corpo |
| moida | dor no corpo |
| to que nao presto | muito fraco |
| nao presto pra nada | muito fraco |
| cansaco | falta de ar |
| canseira | falta de ar |
| canseira braba | falta de ar forte |
| cansado do peito | falta de ar |
| cansada do peito | falta de ar |
| cansaco no peito | falta de ar |
| peito cansado | falta de ar |
| cansa muito | falta de ar |
| cansa de andar | falta de ar pra andar |
| cansa a toa | falta de ar |
| cansa de nada | falta de ar |
| canso de tudo | falta de ar |
| bafo curto | falta de ar |
| folego curto | falta de ar |
| sem folego | falta de ar |
| falta de folego | falta de ar |
| ofego | falta de ar |
| ofegando | respirando muito rápido |
| arfando | respirando muito rápido |
| puxando o ar | respirando muito rápido |
| puxando muito | respirando muito rápido |
| respirando curto | respirando muito rápido |
| respiracao curta | respirando muito rápido |
| abafacao | falta de ar |
| abafamento | falta de ar |
| sufocacao | falta de ar forte |
| sufocando | não consigo respirar |
| sufocado | não consigo respirar |
| sufocada | não consigo respirar |
| afogando | não consigo respirar |
| afogado do peito | não consigo respirar |
| peito fechado | chiando no peito |
| peito chiando | chiando no peito |
| peito assobiando | chiando no peito |
| chiadeira | chiando no peito |
| chieira | chiando no peito |
| chiado no peito | chiando no peito |
| gato no peito | chiando no peito |
| gato ronronando no peito | chiando no peito |
| peito puxado | chiando no peito |
| peito carregado | chiando no peito |
| catarro preso | chiando no peito |
| catarro entalado | chiando no peito |
| peito cheio | chiando no peito |
| roncando o peito | chiando no peito |
| bombinha nao resolveu | usei a bombinha e não melhorou |
| bombinha nao adiantou | usei a bombinha e não melhorou |
| usei a bomba e nada | usei a bombinha e não melhorou |
| defluxo | nariz escorrendo |
| defluxado | nariz escorrendo |
| friagem | nariz escorrendo |
| friagem no corpo | nariz escorrendo |
| gripado | nariz escorrendo |
| gripada | nariz escorrendo |
| gripezinha | nariz escorrendo |
| nariz trancado | nariz entupido |
| nariz fechado | nariz entupido |
| venta trancada | nariz entupido |
| garganta arranhada | garganta arranhando |
| garganta ardida | dor de garganta |
| garganta em carne viva | dor de garganta |
| engolindo com dor | dor pra engolir |
| doi pra engolir | dor pra engolir |
| nao desce comida | dor pra engolir |
| tosse braba | tosse |
| tosse seca | tosse |
| tosse comprida | tosse |
| tossindo direto | tosse |
| pigarro | catarro |
| escarro | catarro |
| escarrando | catarro |
| gosma no peito | catarro |
| boca roxa | lábio roxo |
| beicos roxos | lábio roxo |
| ficando azul | lábio roxo |
| mal do coracao | dor no peito |
| doenca do coracao | dor no peito |
| coracao ruim | dor no peito |
| peito pesado | peso no peito |
| peso no peito | peso no peito |
| peito trancado | aperto no peito |
| trancamento no peito | aperto no peito |
| aperto aqui no peito | aperto no peito |
| agonia no peito | aperto no peito |
| aflicao no peito | aperto no peito |
| peito ardendo | queimação no peito com falta de ar |
| queimacao no peito | queimação no peito com falta de ar |
| fogo no peito | queimação no peito com falta de ar |
| fisgada no peito | dor no peito |
| pontada no peito | dor no peito |
| ferroada no peito | dor no peito |
| dor no vao do peito | dor no peito |
| dor na boca do estomago e suando | dor no peito e suando frio |
| suadeira fria | dor no peito e suando frio |
| braco esquerdo dormente | dor no braço esquerdo |
| dor descendo pro braco | dor no braço esquerdo |
| batedeira | coração disparado e medo de morrer |
| batedeira no peito | coração disparado e medo de morrer |
| coracao batendo forte | coração disparado e medo de morrer |
| coracao acelerado | coração disparado e medo de morrer |
| coracao disparado | coração disparado e medo de morrer |
| coracao descompassado | coração disparado e medo de morrer |
| palpitacao | coração disparado e medo de morrer |
| pressao nas alturas | pressão alta |
| pressao la em cima | pressão alta |
| pressao subiu | pressão alta |
| pressao descontrolada | pressão alta |
| pressao alterada | pressão alta |
| pressao arriada | pressão alta |
| medi a pressao e deu alta | pressão alta |
| a pressao ta ruim | pressão alta |
| pressao doida | pressão alta |
| derrame | derrame |
| derramou | derrame |
| deu derrame | derrame |
| teve derrame | derrame |
| trombose na cabeca | derrame |
| boca entortou | boca torta |
| boca torceu | boca torta |
| cara torta | rosto torto |
| rosto caido | rosto torto |
| cara caida | rosto torto |
| olho caido | rosto torto |
| banda do rosto caida | rosto torto |
| braco caiu | braço caindo |
| braco mole | braço mole |
| braco sem forca | braço mole |
| perna sem forca | perdi a força nas pernas |
| perna bamba | perdi a força nas pernas |
| pernas bambas | perdi a força nas pernas |
| perna mole | perdi a força nas pernas |
| perdeu a banda | perdeu a força de um lado |
| um lado nao obedece | perdeu a força de um lado |
| so de um lado | dormência de um lado |
| meio corpo dormente | dormência de um lado |
| lingua presa | fala embolada |
| fala enrolada | fala embolada |
| falando enrolado | falando enrolado |
| fala embaralhada | fala embolada |
| nao sai a fala | não consegue falar |
| perdeu a fala | não consegue falar |
| nao acha as palavras | fala embolada |
| ataque | tendo ataque |
| deu um ataque | tendo ataque |
| ataque de nervo | tendo ataque |
| gota coral | tendo ataque |
| mal de gota coral | tendo ataque |
| virou os olhos | virou os olhos e tremeu |
| revirou os olhos | virou os olhos e tremeu |
| tremedeira geral | tremendo todo e roxo |
| espumando pela boca | convulsão |
| espuma na boca | convulsão |
| tremendo todo | tremendo todo e roxo |
| variando | muito confuso |
| ta variando | muito confuso |
| variando das ideias | muito confuso |
| ruim das ideias | falando coisa sem sentido |
| fora de si | muito confuso |
| desnorteado | muito confuso |
| desnorteada | muito confuso |
| abestalhado | muito confuso |
| abestalhada | muito confuso |
| abestado | muito confuso |
| avoado | muito confuso |
| avoada | muito confuso |
| nao conhece mais ninguem | não reconhece ninguém |
| nao sabe quem eu sou | não reconhece ninguém |
| trocando os nomes | muito confuso |
| falando sozinho | falando coisa sem sentido |
| falando besteira | falando coisa sem sentido |
| falando coisa com coisa | falando coisa sem sentido |
| delirando | muito confuso |
| zoada na cabeca | dor de cabeça |
| zoeira na cabeca | dor de cabeça |
| cabeca zoando | dor de cabeça |
| cabeca rachando | dor de cabeça muito forte com febre |
| dor de cabeca de rachar | dor de cabeça muito forte com febre |
| cabeca estourando | dor de cabeça muito forte com febre |
| dor de cabeca braba | dor de cabeça muito forte com febre |
| zonzo | tontura ao levantar |
| zonza | tontura ao levantar |
| tonteira | tontura ao levantar |
| tontice | tontura ao levantar |
| cabeca rodando | tontura ao levantar |
| tudo rodando | tontura ao levantar |
| mundo rodando | tontura ao levantar |
| vista escureceu | vista escurece ao levantar |
| escureceu a vista | vista escurece ao levantar |
| vista preta | vista escurece ao levantar |
| vista embacada | vendo embaçado |
| vista turva | vendo embaçado |
| enxergando mal | vendo embaçado |
| vendo tudo dobrado | vendo embaçado |
| pescoco duro | febre e pescoço duro |
| pescoco travado | febre e pescoço duro |
| nuca dura | febre e pescoço duro |
| quentura | febre |
| quentura no corpo | febre |
| corpo quente | febre |
| febrao | febre |
| febrinha | febre |
| ta ardendo de febre | febre |
| ardendo em febre | febre |
| pegando fogo | febre |
| fervendo | febre |
| esquentando | febre |
| calor no corpo | febre |
| tremedeira de frio | febre |
| calafrio | febre |
| calafrios | febre |
| batendo queixo | febre |
| tremendo de frio | febre |
| suadeira | febre |
| suando muito a noite | febre |
| prostrado | febre e prostrado |
| prostrada | febre e prostrado |
| ingua | ferida inflamada |
| inguas | ferida inflamada |
| caroco no pescoco | ferida inflamada |
| papeira | ferida inflamada |
| dor danada | dor insuportável |
| dor braba | dor insuportável |
| dor medonha | dor insuportável |
| dor desgracada | dor insuportável |
| dor dos infernos | dor insuportável |
| dor da peste | dor insuportável |
| dor arretada | dor insuportável |
| dor de matar | dor insuportável |
| dor de rachar | dor insuportável |
| dor lascada | dor insuportável |
| dor pavorosa | dor insuportável |
| dor horrorosa | dor insuportável |
| dor sem tamanho | dor insuportável |
| doendo demais da conta | dor insuportável |
| doi que so | dor insuportável |
| doi demais | dor insuportável |
| num aguento de dor | dor insuportável |
| nao aguento de dor | dor insuportável |
| nao suporto a dor | dor insuportável |
| so gritando de dor | dor insuportável |
| chorando de dor | dor insuportável |
| rolando de dor | dor insuportável |
| nao prego o olho de dor | dor que não deixa dormir |
| nao durmo de dor | dor que não deixa dormir |
| passo a noite acordado de dor | dor que não deixa dormir |
| nao consigo me levantar de dor | não consigo andar de dor |
| nao ando de dor | não consigo andar de dor |
| nao dou um passo | não consigo andar de dor |
| nao trabalho de dor | não consigo trabalhar de dor |
| doi quando puxo o ar | dor que piora quando respiro fundo |
| doi pra respirar fundo | dor que piora quando respiro fundo |
| latejando | tá doendo |
| fisgada | tá doendo |
| pontada | tá doendo |
| ferroada | tá doendo |
| repuxando | tá doendo |
| trincando | tá doendo |
| ardendo | tá doendo |
| queimando | tá doendo |
| agulhada | tá doendo |
| incomodo | dor moderada |
| incomodacao | dor moderada |
| dor chatinha | dor moderada |
| bucho | dor forte na barriga |
| bucho doendo | dor forte na barriga |
| dor no bucho | dor forte na barriga |
| bucho embrulhado | enjoo |
| bucho ruim | enjoo |
| dor de barriga braba | dor forte na barriga |
| barriga doendo muito | dor forte na barriga |
| barriga dura | barriga dura |
| barriga inchada | barriga dura |
| empachado | barriga dura |
| empanzinado | barriga dura |
| colica braba | cólica muito forte |
| colica danada | cólica muito forte |
| torcao na barriga | cólica muito forte |
| gastura | enjoo |
| gastura no estomago | enjoo |
| dando gastura | enjoo |
| embrulho no estomago | enjoo |
| estomago embrulhado | enjoo |
| estomago ruim | enjoo |
| enjoo | enjoo |
| enjoada | enjoo |
| enjoado | enjoo |
| ansia de vomito | enjoo |
| com vontade de botar | enjoo |
| botando tudo | vomitando tudo |
| botando pra fora | vomitando tudo |
| golfando | vomitando tudo |
| vomitando sem parar | não para de vomitar |
| nao segura nada no estomago | vomitando tudo |
| nao para nada no estomago | vomitando tudo |
| desarranjo | desarranjo |
| desarranjo intestinal | desarranjo |
| soltura | diarreia |
| soltura de barriga | diarreia |
| caganeira | diarreia |
| barriga solta | intestino solto |
| indo muito no banheiro | indo muito ao banheiro |
| so agua | diarreia |
| diarreia braba | diarreia sem parar |
| nao para de ir ao banheiro | diarreia sem parar |
| coco preto | cocô preto |
| fezes escuras | fezes pretas |
| evacuando escuro | evacuando preto |
| coco de cor de borra | fezes como borra de café |
| coco tipo piche | fezes pretas |
| fezes fedendo demais | cocô preto fedendo muito |
| sangue no coco | fezes pretas |
| botando sangue pela boca | vomitando sangue |
| vomito com sangue | vomitando sangue |
| rendido | dor forte na barriga |
| rendidura | dor forte na barriga |
| quebradura | dor forte na barriga |
| ventre caido | dor forte na barriga |
| ardume | ardência pra urinar |
| ardume pra mijar | ardência pra urinar |
| mijo ardendo | ardência pra urinar |
| arde pra mijar | ardência pra urinar |
| arde quando faz xixi | ardência pra urinar |
| ardencia na urina | ardência pra urinar |
| queima pra urinar | ardência pra urinar |
| mijo turvo | xixi turvo |
| urina turva | xixi turvo |
| mijo fedendo | xixi turvo |
| urina com cheiro forte | xixi turvo |
| urina escura | xixi turvo |
| mijando toda hora | vontade de urinar toda hora |
| vontade de mijar toda hora | vontade de urinar toda hora |
| apertado pra mijar | vontade de urinar toda hora |
| nao faz agua | não sai xixi |
| nao sai mijo | não sai xixi |
| nao consigo mijar | não consigo urinar desde ontem |
| travou o mijo | não consigo urinar desde ontem |
| bexiga cheia e nao sai | tô com a bexiga cheia e não consigo fazer |
| mijando pouquinho | quase não faço xixi |
| quase nao mijo | quase não faço xixi |
| sangue no mijo | sangue na urina |
| mijando sangue | sangue na urina |
| urina com sangue | sangue na urina |
| dor nas cadeiras | dor nas costas |
| cadeiras doendo | dor nas costas |
| dor no fundo das costas | dor nas costas |
| pedra no rim | cólica muito forte |
| colica de rim | cólica muito forte |
| dor no saco | dor forte no saco |
| dor no ovo | dor forte no ovo |
| bola inchada | bola inchada e doendo |
| saco inchado | testículo inchado |
| de bucho | grávida |
| embuchada | grávida |
| esperando neném | grávida |
| esperando bebe | grávida |
| barriguda | grávida |
| de resguardo | grávida |
| no resguardo | grávida |
| resguardo quebrado | grávida sangrando muito |
| ganhei neném faz pouco | grávida |
| pari faz pouco | grávida |
| bolsa estourou | estourou a bolsa e saiu o cordão |
| estourou a bolsa | estourou a bolsa e saiu o cordão |
| rompeu a bolsa | estourou a bolsa e saiu o cordão |
| nenem parou de mexer | bebê parou de mexer |
| neném nao mexe | bebê parou de mexer |
| crianca nao mexe na barriga | bebê parou de mexer |
| dor de parto | grávida |
| regra atrasada | atraso na menstruação e dor forte de um lado |
| menstruacao atrasada | atraso na menstruação e dor forte de um lado |
| regra nao desceu | atraso na menstruação e dor forte de um lado |
| atraso da regra | atraso na menstruação e dor forte de um lado |
| sangrando muito por baixo | sangrando muito |
| hemorragia por baixo | sangrando muito |
| perdendo sangue por baixo | perdendo muito sangue |
| zipela | machucado vermelho e quente |
| zipra | machucado vermelho e quente |
| esipla | machucado vermelho e quente |
| erisipela | machucado vermelho e quente |
| perna vermelha e quente | machucado vermelho e quente |
| perna inflamada | ferida inflamada |
| cobreiro | manchas vermelhas |
| cobrelo | manchas vermelhas |
| nascida | ferida com pus |
| nascida no braco | ferida com pus |
| furunco | ferida com pus |
| furunculo | ferida com pus |
| panariço | ferida com pus |
| unheiro | ferida com pus |
| ferida braba | ferida inflamada |
| ferida com materia | ferida com pus |
| materia na ferida | ferida com pus |
| ferida catinguenta | ferida cheirando mal |
| ferida fedendo | ferida cheirando mal |
| ferida que nao fecha | ferida no pé que não sara |
| ferida no pe do diabetico | ferida no pé que não sara |
| chaga | ferida inflamada |
| chaga no pe | ferida no pé que não sara |
| empipocado | manchas vermelhas |
| empipocada | manchas vermelhas |
| brotoeja | manchas vermelhas |
| brotoejado | manchas vermelhas |
| pintado de vermelho | manchas vermelhas |
| cheio de manchas | manchas vermelhas |
| manchas roxas | manchas roxas no corpo |
| pintas roxas | manchas roxas no corpo |
| roxo no corpo sem bater | manchas roxas no corpo |
| inchume | inchou a boca |
| inchacao | inchou a boca |
| inchou tudo | empolou o corpo todo |
| empolou | empolou o corpo todo |
| empolado | empolou o corpo todo |
| cheio de bolhas | empolou o corpo todo |
| urticaria | empolou o corpo todo |
| alergia braba | alergia forte |
| inchou o beico | inchou a boca |
| beico inchado | inchou a boca |
| lingua inchada | inchou a língua |
| garganta fechando | garganta fechando |
| garganta apertando | garganta fechando |
| estrepou | me cortei |
| estrepei | me cortei |
| me cortei fundo | corte fundo |
| talho | corte fundo |
| talho fundo | corte fundo |
| rasgou a pele | corte fundo |
| abriu a carne | corte fundo |
| ralado | arranhão |
| esfolado | arranhão |
| esfolei | me arranhei |
| ralei | ralei o joelho |
| raspao | raspão |
| espinhela caida | dor no corpo |
| arca caida | dor no corpo |
| peito aberto | dor no corpo |
| travei as costas | travei as costas |
| lombeira | dor nas costas |
| dor na coluna | dor na coluna |
| dor nas juntas | dor nas juntas |
| juntas doendo | dor nas juntas |
| junta inchada | dor nas juntas |
| dor nas cadeiras e na perna | dor nas costas |
| dor no vao das pernas | dor forte na barriga |
| osso quebrado | osso pra fora |
| osso pra fora | osso pra fora |
| osso aparecendo | osso pra fora |
| perna virada | perna torta |
| braco torto | perna torta |
| deslocou | perna torta |
| se esborrachou | caiu do telhado |
| levou um tombo feio | caiu do telhado |
| caiu de altura | caiu do telhado |
| caiu do pe de arvore | caiu do telhado |
| bateu de moto | bateu de moto |
| capotou | bateu de moto |
| foi atropelado | atropelado |
| pegou de raspao no carro | atropelado |
| bateu a cuca | bateu a cabeça e desmaiou |
| bateu a cabeca | bateu a cabeça e desmaiou |
| levou um tiro | levou tiro |
| levou uma facada | levou facada |
| foi esfaqueado | levou facada |
| acucar alto | glicose alta |
| acucar la em cima | glicose alta |
| diabete alta | glicose alta |
| diabetes descontrolada | diabético descompensado |
| diabete descontrolada | diabético descompensado |
| glicose nas alturas | glicose alta |
| acucar baixo | açúcar baixo |
| acucar caiu | açúcar baixo |
| diabete baixa | açúcar baixo |
| glicose baixa | glicemia baixa |
| deu uma hipo | deu hipoglicemia |
| tremendo e suado | tremendo e suando frio |
| tremendo de fraqueza | tremendo e suando frio |
| muita sede | muita sede e urinando muito |
| sede demais | muita sede e urinando muito |
| bebendo agua demais | muita sede e urinando muito |
| boca seca demais | boca seca e fraco |
| secando de sede | boca seca e fraco |
| emagrecendo a toa | diabético descompensado |
| perdendo peso sem motivo | diabético descompensado |
| nervoso | ansiedade |
| nervosa | ansiedade |
| nervosismo | ansiedade |
| dos nervos | ansiedade |
| doente dos nervos | ansiedade |
| aperreado | ansiedade |
| aperreada | ansiedade |
| aperreio | ansiedade |
| aperreacao | ansiedade |
| agoniado | ansiedade |
| agoniada | ansiedade |
| agonia | ansiedade |
| aflito | ansiedade |
| aflita | ansiedade |
| aflicao | ansiedade |
| angustiado | ansiedade |
| angustiada | ansiedade |
| sem sossego | ansiedade |
| nao sossego | ansiedade |
| cabeca cheia | ansiedade |
| cabeca fervendo | ansiedade |
| nao prego o olho | não consigo dormir |
| nao durmo | não consigo dormir |
| sem dormir | não consigo dormir |
| noite em claro | não consigo dormir |
| so rolando na cama | não consigo dormir |
| desanimado | tô triste |
| desanimada | tô triste |
| sem vontade de nada | tô triste |
| jogado num canto | tô triste |
| so chorando | tô triste |
| chorando a toa | tô triste |
| coracao apertado | tô triste |
| ta pra baixo | tô triste |
| na fossa | tô triste |
| depressao | tô triste |
| cansei de tudo | cansei de tudo |
| cansada de viver | não quero mais viver |
| cansado de viver | não quero mais viver |
| nao quero mais nada | não quero mais viver |
| queria sumir | pensando em sumir |
| queria desaparecer | pensando em sumir |
| queria dormir e nao acordar | queria não acordar |
| queria nao acordar mais | queria não acordar |
| nao vejo saida | não quero mais viver |
| melhor eu morrer | penso em morrer |
| melhor que eu morresse | penso em morrer |
| so dou trabalho | seria melhor se eu não existisse |
| nao sirvo pra nada | seria melhor se eu não existisse |
| me cortei de proposito | me machuquei de propósito |
| me machuquei querendo | me machuquei de propósito |
| espirito ruim | ouvindo vozes |
| cabeca ruim | ouvindo vozes |
| escuta vozes | ouvindo vozes |
| ouve gente falando | ouvindo vozes |
| ve gente que nao tem | ouvindo vozes |
| ve vulto | ouvindo vozes |
| acha que querem matar ele | acha que estão perseguindo |
| diz que estao atras dele | acha que estão perseguindo |
| desconfiado de todo mundo | muito agitado e desconfiado |
| surtou | surtou |
| deu um surto | surtou |
| fora do normal | falando coisa sem sentido |
| parei de beber | parei de beber e tô tremendo |
| largou a cachaca | parei de beber e tô tremendo |
| sem beber faz dias | parei de beber e tô tremendo |
| tremendo sem beber | parei de beber e tô tremendo |
| crise de abstinencia | abstinência |
| na ressaca braba | abstinência |
| perdi meu filho | meu filho morreu |
| perdi minha mae | perdi alguém |
| faleceu | perdi alguém |
| de luto | perdi alguém |
| molinho | molinho |
| molinha | molinha |
| mole demais | molinho |
| sem forca nenhuma | molinho |
| quebranto | molinho |
| com quebranto | molinho |
| olho gordo | molinho |
| mau olhado | molinho |
| amuado | molinho |
| amuada | molinho |
| caidinho | molinho |
| caidinha | molinha |
| gemendo | gemendo |
| so gemendo | gemendo |
| chorando sem parar | gemendo |
| choro diferente | gemendo |
| nao quer o peito | não quer mamar |
| nao mama | não quer mamar |
| recusa a mamadeira | não aceita líquido |
| nao quer nada de comer | não aceita líquido |
| nao aceita agua | não aceita líquido |
| bota tudo que come | vomita tudo |
| golfa tudo | vomita tudo |
| nao segura nem agua | vomita tudo |
| nao acorda direito | não acorda direito |
| so dormindo | não acorda direito |
| dificil de acordar | não acorda direito |
| afundando a barriguinha | afundando a barriguinha |
| afundando as costelas | afundando entre as costelas |
| costela aparecendo quando respira | afundando entre as costelas |
| barriguinha subindo e descendo rapido | afundando a barriguinha |
| narizinho abrindo | nariz abrindo e fechando |
| venta abrindo e fechando | nariz abrindo e fechando |
| chiado alto | chiado alto pra respirar |
| respirando com barulho | chiado alto pra respirar |
| moleira funda | moleira funda |
| moleira afundada | moleira funda |
| moleira baixa | moleira funda |
| olhinho fundo | olhos fundos |
| olho encovado | olhos fundos |
| chora sem lagrima | chora sem lágrima |
| chora e nao sai lagrima | chora sem lágrima |
| fralda seca | fralda seca |
| fralda seca faz horas | fralda seca |
| nao molha a fralda | fralda seca |
| boquinha seca | boca sequinha |
| pele murcha | pele murcha |
| pele mole | pele murcha |
| nenem quente | neném com febre |
| crianca quente | neném com febre |
| bebe com quentura | neném com febre |
| dor no fundo dos olhos | dor atrás dos olhos |
| olhos doendo por dentro | dor atrás dos olhos |
| dor por tras dos olhos | dor atrás dos olhos |
| corpo todo doendo | dor no corpo |
| corpo moido | dor no corpo |
| dor no corpo todinho | dor no corpo |
| dor nos ossos | dor no corpo |
| febre quebra osso | febre com dor nas juntas |
| quebra ossos | febre com dor nas juntas |
| dengue | dengue |
| chicungunha | chikungunya |
| chincungunha | chikungunya |
| a febre baixou e piorei | melhorou a febre mas piorou |
| baixou a febre e piorou | melhorou a febre mas piorou |
| a quentura passou e piorou | melhorou a febre mas piorou |
| sangramento na gengiva | sangramento na gengiva |
| gengiva sangrando | sangramento na gengiva |
| sangrando pelo nariz | sangrando o nariz |
| sangue pelo nariz | sangrando o nariz |
| dor de dente braba | dor de dente e o rosto inchou |
| dente estragado | dente inflamado com febre |
| dente cariado | dente inflamado com febre |
| dente inflamado | dente inflamado com febre |
| cara inchada do dente | dor de dente e o rosto inchou |
| rosto inchou do dente | inchaço no rosto por causa do dente |
| nao abro a boca | dificuldade de abrir a boca |
| boca travada | dificuldade de abrir a boca |
| caroco na gengiva | abscesso no dente |
| caiu no olho | caiu produto no olho |
| respingou no olho | respingou soda no olho |
| entrou soda no olho | soda no olho |
| entrou agua sanitaria no olho | água sanitária no olho |
| queimei a vista | queimei a vista |
| olho ardendo de produto | entrou química no olho |
| entalou | entalou na garganta |
| entalado | entalou na garganta |
| entalou na goela | entalou na garganta |
| travou na garganta | entalou na garganta |
| engasgou feio | engasgou |
| engoliu errado | engasgou |
| foi pro lado errado | engasgou |
| nao consegue nem tossir | não consegue tossir |
| engoliu uma coisa | engoliu objeto |
| botou na boca e engoliu | engoliu objeto |
| tomou choque | levou choque |
| levou choque do chuveiro | levou choque do chuveiro |
| pegou choque na tomada | tomou choque na tomada |
| quase afogou | quase se afogou |
| engoliu agua na piscina | engoliu muita água na piscina |
| se afogou no acude | quase se afogou |
| se afogou no mar | quase se afogou |
| respirou fumaca | respirou fumaça |
| aspirou fumaca | inalou fumaça |
| ficou rouco do fogo | rouco depois do fogo |

---

Documento gerado automaticamente a partir de `packages/protocolo`. Não editar à mão.
Camada 2: `claude-opus-5`.