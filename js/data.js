/* ============================================================
   CajuMel — Dados dos produtos
   ------------------------------------------------------------
   COMO EDITAR (tudo em um lugar só):
   • price  : preço em reais (número). Itens sem foto real usam
              ESTIMATIVA de mercado — troque pelo preço real quando quiser.
   • img    : caminho da foto em assets/products/. Se o arquivo não
              existir, aparece um placeholder elegante automaticamente.
              Para usar uma foto real, salve-a em assets/products/ com
              esse nome — ela passa a aparecer sozinha, sem mexer no código.
   • cat    : categoria (ver CATEGORIES) — usada nos filtros do catálogo.
   • badge  : etiqueta opcional sobre a imagem (ex.: "Mais vendido").
   • tint   : cor do placeholder ('terracotta' | 'gold' | 'navy' | 'green' | 'cream').
   • shape  : desenho do placeholder ('jar' | 'nut' | 'bar' | 'bag').
   • real   : true = foto real fornecida pela marca.
   ============================================================ */

const WHATSAPP_NUMBER = "5584992318558"; // (84) 99231-8558
const BRAND_EMAIL = "contato@sigacajumel.com.br";

const CATEGORIES = [
  { id: "todos",         label: "Todos" },
  { id: "castanhas",     label: "Castanhas Clássicas" },
  { id: "pastas",        label: "Pastas & Cremes" },
  { id: "caramelizados", label: "Caramelizadas" },
  { id: "doces",         label: "Doces" },
  { id: "kits",          label: "Kits" },
];

/* URLs das mídias geradas por IA (Higgsfield). Ficam públicas no CDN.
   Para auto-hospedar, baixe cada uma e salve em assets/ai/ com o nome
   indicado — o site passa a usar o arquivo local automaticamente. */
const AI_MEDIA = {
  hero: { local: "assets/ai/hero.jpg",   url: "https://d8j0ntlcm91z4.cloudfront.net/user_3EzQXCXDQZN2jRnw2ieBJYTwqqT/hf_20260722_195009_da3a6cc1-bc3c-4550-98f1-2e66fb175957.png" },
  processo: { local: "assets/ai/processo.jpg", url: "https://d8j0ntlcm91z4.cloudfront.net/user_3EzQXCXDQZN2jRnw2ieBJYTwqqT/hf_20260722_195018_049d013d-82df-44a5-b643-1dd19772205f.png" },
  historia: { local: "assets/ai/historia.jpg", url: "https://d8j0ntlcm91z4.cloudfront.net/user_3EzQXCXDQZN2jRnw2ieBJYTwqqT/hf_20260722_195021_3d94d5e8-fcb3-410f-93bd-ff7b6d9387b7.png" },
  loja: { local: "assets/ai/loja.jpg", url: "https://d8j0ntlcm91z4.cloudfront.net/user_3EzQXCXDQZN2jRnw2ieBJYTwqqT/hf_20260722_195023_6f67ea3d-eba6-4843-bd56-021e0be9f3e2.png" },
};

const PRODUCTS = [
  /* ---------- Produtos com FOTO REAL ---------- */
  {
    id: "pasta-flor-de-sal-40",
    name: "Pasta de Castanha com Flor de Sal",
    cat: "pastas", weight: "40 g", price: 14.90,
    badge: "Novidade", tint: "navy", shape: "jar", featured: true, real: true,
    img: "assets/products/pasta-flor-de-sal.jpg",
    desc: "100% castanha de caju com um toque de flor de sal. Cremosa, sem óleos nem açúcares adicionados.",
  },
  {
    id: "pasta-pistache-550",
    name: "Pasta de Castanha com Pistache",
    cat: "pastas", weight: "550 g", price: 79.90,
    badge: "Premium", tint: "green", shape: "jar", featured: true, real: true,
    img: "assets/products/pasta-pistache.jpg",
    desc: "A cremosidade da castanha de caju encontra o pistache. Pote família de 550 g.",
  },
  {
    id: "castanha-caipira-250",
    name: "Castanha de Caju Caipira Torrada",
    cat: "castanhas", weight: "250 g", price: 29.90,
    badge: "Sem sal", tint: "gold", shape: "bag", featured: true, real: true,
    img: "assets/products/castanha-caipira.jpg",
    desc: "Castanha caipira torrada no ponto, sem sal e sem conservantes. Crocância pura.",
  },

  /* ---------- Catálogo (placeholders até chegarem as fotos) ---------- */
  {
    id: "pasta-pura-200",
    name: "Pasta de Castanha de Caju Pura",
    cat: "pastas", weight: "200 g", price: 32.90,
    badge: "Sem açúcar", tint: "terracotta", shape: "jar", featured: true,
    img: "assets/products/pasta-pura.jpg",
    desc: "100% castanha de caju, sem óleos nem açúcares adicionados. Cremosa e natural.",
  },
  {
    id: "pasta-chocolate-200",
    name: "Pasta de Castanha com Chocolate",
    cat: "pastas", weight: "200 g", price: 36.90,
    badge: "Mais vendido", tint: "navy", shape: "jar", featured: true,
    img: "assets/products/pasta-chocolate.jpg",
    desc: "A cremosidade da castanha de caju com cacau selecionado. Puro prazer natural.",
  },
  {
    id: "castanha-desidratada-500",
    name: "Castanha de Caju Desidratada",
    cat: "castanhas", weight: "500 g", price: 54.90,
    badge: "Premium", tint: "gold", shape: "nut",
    img: "assets/products/castanha-desidratada.jpg",
    desc: "Castanha inteira selecionada, desidratada no ponto certo. Sabor de verdade.",
  },
  {
    id: "castanha-torrada-250",
    name: "Castanha de Caju Torrada & Salgada",
    cat: "castanhas", weight: "250 g", price: 29.90,
    tint: "cream", shape: "bag",
    img: "assets/products/castanha-torrada.jpg",
    desc: "Torra artesanal com o toque certo de sal marinho. Clássico irresistível.",
  },
  {
    id: "caramel-maracuja-150",
    name: "Castanha Caramelizada de Maracujá",
    cat: "caramelizados", weight: "150 g", price: 24.90,
    badge: "Regional", tint: "gold", shape: "nut", featured: true,
    img: "assets/products/caramel-maracuja.jpg",
    desc: "Castanha envolta em caramelo com o azedinho do maracujá do Nordeste.",
  },
  {
    id: "caramel-cupuacu-150",
    name: "Castanha Caramelizada de Cupuaçu",
    cat: "caramelizados", weight: "150 g", price: 24.90,
    tint: "green", shape: "nut",
    img: "assets/products/caramel-cupuacu.jpg",
    desc: "O aroma marcante do cupuaçu amazônico em caramelo artesanal.",
  },
  {
    id: "caramel-acai-150",
    name: "Castanha Caramelizada de Açaí",
    cat: "caramelizados", weight: "150 g", price: 24.90,
    tint: "navy", shape: "nut",
    img: "assets/products/caramel-acai.jpg",
    desc: "Caramelo de açaí envolvendo a castanha crocante. Energia natural.",
  },
  {
    id: "caramel-gergelim-150",
    name: "Castanha Caramelizada de Gergelim",
    cat: "caramelizados", weight: "150 g", price: 23.90,
    tint: "cream", shape: "nut",
    img: "assets/products/caramel-gergelim.jpg",
    desc: "Crocância dupla: castanha e gergelim tostado no caramelo dourado.",
  },
  {
    id: "caramel-coco-150",
    name: "Castanha Caramelizada de Coco",
    cat: "caramelizados", weight: "150 g", price: 23.90,
    tint: "cream", shape: "nut",
    img: "assets/products/caramel-coco.jpg",
    desc: "Caramelo com coco fresco e castanha inteira. Sabor tropical.",
  },
  {
    id: "cajumel-tablete",
    name: "Tablete Cajumel de Caju",
    cat: "doces", weight: "80 g", price: 12.90,
    badge: "Tradicional", tint: "terracotta", shape: "bar", featured: true,
    img: "assets/products/cajumel-tablete.jpg",
    desc: "O doce que dá nome à marca: caju e castanha em tablete artesanal.",
  },
  {
    id: "doce-caju-cremoso-300",
    name: "Doce de Caju Cremoso",
    cat: "doces", weight: "300 g", price: 22.90,
    tint: "terracotta", shape: "jar",
    img: "assets/products/doce-caju-cremoso.jpg",
    desc: "Doce de caju cremoso, no ponto da vovó, feito em Natal/RN.",
  },
  {
    id: "kit-degustacao",
    name: "Kit Degustação CajuMel",
    cat: "kits", weight: "5 itens", price: 129.90,
    badge: "Presente", tint: "terracotta", shape: "bag", featured: true,
    img: "assets/products/kit-degustacao.jpg",
    desc: "Uma seleção dos nossos favoritos para experimentar tudo: pastas, castanhas e caramelizadas.",
  },
  {
    id: "kit-pastas",
    name: "Kit Pastas de Castanha",
    cat: "kits", weight: "3 potes", price: 94.90,
    tint: "navy", shape: "jar",
    img: "assets/products/kit-pastas.jpg",
    desc: "Trio de pastas cremosas: pura, com chocolate e com flor de sal. Para todos os momentos.",
  },
];
