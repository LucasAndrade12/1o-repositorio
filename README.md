# CajuMel — Site institucional & catálogo

Site profissional, moderno e minimalista da **CajuMel** — castanha de caju e pastas
naturais, feitas artesanalmente em **Natal/RN**. Respeita a identidade visual da marca
(terracota, dourado, marinho e verde) e usa animações leves que carregam sem dificuldade.

## Estrutura

```
index.html          Landing (hero, história, diferenciais, destaques, contato)
produtos.html       Catálogo com filtros por categoria
css/styles.css      Design system + estilos (tokens de cor, tipografia, componentes)
js/data.js          Dados dos produtos (nome, preço, categoria, foto)  ← edite aqui
js/app.js           Carrinho + checkout WhatsApp + animações
assets/             Logo, favicon, foto do hero
assets/products/    Fotos dos produtos
design-system/      Documentação das decisões de design (MASTER.md)
```

## Como rodar

É um site **estático** (HTML/CSS/JS puro), sem build. Basta abrir `index.html`
no navegador. Para testar o carrinho localmente, sirva a pasta com um servidor simples:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Hospedagem: funciona direto em **GitHub Pages, Netlify ou Vercel** (arrastar a pasta).

## Editar produtos e preços

Tudo fica em **`js/data.js`**. Cada produto tem `name`, `price`, `weight`, `cat`,
`img` e etc. Os preços atuais dos itens **sem foto real são estimativas de mercado** —
troque pelos valores reais quando quiser.

## Trocar/adicionar fotos de produto

Coloque a imagem em `assets/products/` com o **mesmo nome** definido no campo `img`
do produto em `js/data.js`. Enquanto a foto não existir, aparece automaticamente um
**placeholder elegante** com a identidade da marca — quando o arquivo é adicionado,
a foto real passa a aparecer sozinha, sem mexer no código.

Fotos reais já incluídas: Pasta com Flor de Sal, Pasta com Pistache e Castanha Caipira.

## Checkout via WhatsApp

O carrinho monta a mensagem do pedido e abre o WhatsApp
**(84) 99231-8558**. Para mudar o número, edite `WHATSAPP_NUMBER` em `js/data.js`.

## Acessibilidade & performance

- Contraste conforme WCAG, foco visível, `aria-label`s e navegação por teclado.
- Imagens com `loading="lazy"`, dimensões reservadas (evita layout shift).
- Animações respeitam `prefers-reduced-motion`.
