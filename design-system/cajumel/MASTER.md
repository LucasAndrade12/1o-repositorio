# CajuMel — Design System (MASTER)

Fonte de verdade das decisões de design do site. Gerado com a skill **ui-ux-pro-max**
e calibrado a partir da **identidade visual real** da marca (logo + embalagens).

## Marca

- **Nome:** CajuMel (Natal / Rio Grande do Norte)
- **Produto:** castanha de caju e pastas de castanha 100% naturais, sem óleos nem
  açúcares adicionados; castanhas torradas, caramelizadas e doces artesanais.
- **Posicionamento:** natural, artesanal, regional, saudável, caloroso.
- **Tom de voz:** próximo, afetivo, orgulhoso do Nordeste; sem jargão.

## Cores (extraídas da identidade)

| Papel | Token | Hex | Uso |
|-------|-------|-----|-----|
| Terracota (assinatura) | `--terracotta` | `#C0592B` | cor primária, hero, CTAs |
| Terracota escuro | `--terracotta-deep` | `#9E441E` | gradientes, hover |
| Dourado / âmbar | `--gold` | `#ECA43B` | selo em espiral, destaques, botão "Adicionar" |
| Marinho | `--navy` | `#1E2E4C` | seções secundárias, rótulo Flor de Sal |
| Verde | `--green` | `#3A7A47` | acentos, rótulo Pistache |
| Creme | `--cream` | `#FAF4EA` | fundo |
| Tinta | `--ink` | `#2A2018` | texto |

Contraste conforme WCAG AA: botões primários usam terracota→terracota-deep com texto
claro; botão "Adicionar" usa dourado com texto escuro.

## Tipografia

- **Marca (wordmark):** Kaushan Script — recria o manuscrito do logo.
- **Títulos:** Fraunces (serifa "soft", editorial e artesanal).
- **Corpo:** Inter (legível, neutra, moderna).
- Base 16px, entrelinha 1.6.

## Estilo & layout

- **Estilo:** minimalista natural / editorial, com fotografia protagonista.
- **Cantos:** arredondados (18–28px). Sombras suaves e quentes.
- **Grid produtos:** 4 colunas (desktop) → 3 → 2 → 1.
- **Logo/selo:** espiral quadrada dourada recriada em SVG (favicon + header).

## Motion (leve, sem bibliotecas)

- Revelação no scroll (IntersectionObserver) com stagger nos grids.
- Header encolhe com blur ao rolar.
- Blob dourado do hero em morph lento; parallax sutil na foto.
- Marquee de benefícios; drawer do carrinho deslizante; toast de feedback.
- Tudo desativado sob `prefers-reduced-motion`.

## Anti-padrões evitados

- Emoji como ícone (usa SVG line icons).
- Texto de corpo abaixo de 12px; cinza sobre cinza.
- Animar width/height (usa transform/opacity).
- Layout shift (dimensões de imagem reservadas, lazy-load).

## Pendências para o cliente

1. Confirmar/ajustar **preços reais** (atuais são estimativas de mercado).
2. Enviar **fotos** dos demais produtos (nomes em `js/data.js`).
3. Confirmar endereços completos das lojas (Candelária / Ponta Negra).
