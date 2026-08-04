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
> **64 de 64 critérios aguardam assinatura** da enfermeira do
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

## Critérios (64)

### VERMELHO — 27 critério(s)

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

*Como a pessoa descreve:* "convulsão", "convulsionando", "tendo ataque", "ataque epilético", "tremendo todo e roxo", "virou os olhos e tremeu", "caiu duro tremendo"

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

*Como a pessoa descreve:* "não consigo respirar", "falta de ar forte", "sem ar", "roxo", "lábio roxo", "respirando muito rápido", "cansaço pra respirar", "chiando muito", "não consegue falar de falta de ar"

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

*Como a pessoa descreve:* "febre e muito confuso", "tremendo muito e pressão baixa", "respirando rápido e sonolento", "idoso confuso com febre", "muito confusa com febre e respirando rápido", "febre e prostrado"

⏱ **Tempo-dependente** — a janela terapêutica é curta.
🔒 **Bandeira irreversível** — uma vez disparada, não desce.

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

### LARANJA — 19 critério(s)

#### Retenção urinária aguda

`a5.retencao_urinaria` · queixa: urologica · origem: **A5** · assinatura: **pendente**

Incapacidade de urinar por muitas horas, com bexiga distendida, dor e vontade intensa. Urgência de alívio; sem critério no protocolo original.

*Como a pessoa descreve:* "não consigo urinar desde ontem", "barriga estufada e vontade de urinar", "não sai xixi", "tô com a bexiga cheia e não consigo fazer", "não urino há horas"

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

*Como a pessoa descreve:* "vomitando tudo", "não para de vomitar", "não consigo beber água", "quase não faço xixi", "diarreia sem parar", "boca seca e fraco"


#### Dor abdominal intensa

`lj.abdome_agudo` · queixa: gastrointestinal · origem: **v1** · assinatura: **pendente**

Dor abdominal forte, contínua, com barriga dura, febre ou vômitos.

*Como a pessoa descreve:* "dor forte na barriga", "barriga dura", "dor na barriga e vomitando", "cólica muito forte"


#### Ferida infectada

`lj.ferida_infectada` · queixa: dermatologica · origem: **v1** · assinatura: **pendente**

Ferida com pus, vermelhidão que se espalha, calor local, febre ou mau cheiro.

*Como a pessoa descreve:* "ferida com pus", "ferida inflamada", "ferida cheirando mal", "machucado vermelho e quente", "ferida no pé que não sara"


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

*Como a pessoa descreve:* "estão batendo na criança", "criança com marcas", "criança abandonada", "meu vizinho bate no filho"


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

### AMARELO — 10 critério(s)

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

*Como a pessoa descreve:* "ardência pra urinar", "ardendo pra fazer xixi", "infecção urinária", "xixi turvo", "vontade de urinar toda hora"


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

### VERDE — 3 critério(s)

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

*Como a pessoa descreve:* "ansiedade", "não consigo dormir", "preciso de psicólogo", "tô triste", "estresse", "insônia"


### AZUL — 5 critério(s)

#### Dúvida administrativa

`vd.duvida_administrativa` · queixa: administrativa · origem: **v1** · assinatura: **pendente**

Agendamento, documentos, cartão SUS, resultado de exame.

*Como a pessoa descreve:* "como agendo", "preciso do cartão sus", "resultado do exame", "marcar consulta"


#### Dúvida sobre medicamento

`vd.duvida_medicamento` · queixa: medicamento · origem: **v1** · assinatura: **pendente**

Como tomar, horário, se pode junto com outro.

*Como a pessoa descreve:* "posso tomar junto", "que horas tomo o remédio", "esqueci de tomar"


#### Vacinação

`vd.vacina` · queixa: vacina · origem: **A10** · assinatura: **pendente**

A10 — demanda espontânea de sala de vacina, não consulta.

*Como a pessoa descreve:* "tomar vacina", "vacina em atraso", "carteira de vacinação"


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

---

Documento gerado automaticamente a partir de `packages/protocolo`. Não editar à mão.
Camada 2: `claude-opus-5`.