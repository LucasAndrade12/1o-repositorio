/* ============================================================
   CajuMel — Lógica do site
   • Renderização de produtos (landing + catálogo)
   • Carrinho persistente (localStorage) + checkout via WhatsApp
   • Placeholders SVG de marca quando não há foto
   • Animações leves (IntersectionObserver) — sem bibliotecas
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Utilidades ---------------- */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------------- Placeholders SVG (identidade CajuMel) ---------------- */
  const TINTS = {
    terracotta: ["#CC6A38", "#A84A22", "#F4D3B6"],
    gold:       ["#F0B357", "#D08A22", "#4A3316"],
    navy:       ["#2B3E63", "#1E2E4C", "#CBD4E6"],
    green:      ["#478C57", "#2B5C36", "#D2E3D4"],
    cream:      ["#F3E8D6", "#E4D3B8", "#B07C3E"],
  };
  const SHAPES = {
    jar: (m) =>
      `<rect x="35" y="18" width="30" height="9" rx="3" fill="${m}"/>
       <rect x="30" y="28" width="40" height="52" rx="11" fill="${m}" opacity=".92"/>
       <rect x="36" y="42" width="28" height="20" rx="5" fill="#fff" opacity=".22"/>`,
    nut: (m) =>
      `<path d="M62 26 A24 24 0 1 0 62 74 A15 15 0 1 1 62 26 Z" fill="${m}"/>`,
    bar: (m) =>
      `<rect x="24" y="34" width="52" height="34" rx="7" fill="${m}"/>
       <line x1="41" y1="34" x2="41" y2="68" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
       <line x1="59" y1="34" x2="59" y2="68" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`,
    bag: (m) =>
      `<path d="M34 26 h32 l-3 -7 h-26 z" fill="${m}" opacity=".65"/>
       <rect x="30" y="26" width="40" height="54" rx="9" fill="${m}"/>
       <rect x="40" y="40" width="20" height="14" rx="3" fill="#fff" opacity=".22"/>`,
  };
  // Selo em espiral da marca (marca d'água)
  const SPIRAL =
    `<polyline points="24,24 78,24 78,78 26,78 26,36 66,36 66,66 38,66 38,48 54,48 54,58"
       fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

  function placeholderSVG(shape, tint) {
    const [a, b, m] = TINTS[tint] || TINTS.cream;
    const gid = "g" + Math.random().toString(36).slice(2, 8);
    return (
      `<svg class="ph" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
         <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
         </linearGradient></defs>
         <rect width="100" height="100" fill="url(#${gid})"/>
         <g transform="translate(0,-2)">${(SHAPES[shape] || SHAPES.nut)(m)}</g>
         <g transform="translate(70 72) scale(.26)" stroke="#fff" stroke-opacity=".28" stroke-width="8">${SPIRAL}</g>
       </svg>`
    );
  }

  /* ---------------- Card de produto ---------------- */
  function productCard(p) {
    const badge = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";
    const catLabel = (CATEGORIES.find((c) => c.id === p.cat) || {}).label || "";
    return (
      `<article class="product-card reveal" data-id="${p.id}">
         <div class="product-media">
           <img src="${p.img}" alt="${p.name}" loading="lazy" width="600" height="600"
                data-ph="${p.shape}:${p.tint}">
           ${placeholderSVG(p.shape, p.tint)}
           ${badge}
         </div>
         <div class="product-body">
           <span class="product-cat">${catLabel}</span>
           <h3 class="product-name">${p.name}</h3>
           <span class="product-weight">${p.weight}</span>
           <div class="product-foot">
             <span class="product-price">${brl(p.price)}</span>
             <button class="add-btn" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">
               <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
               Adicionar
             </button>
           </div>
         </div>
       </article>`
    );
  }

  // Foto real primeiro; se falhar, mostra o placeholder de marca
  function wireImageFallbacks(scope) {
    $$("img[data-ph]", scope).forEach((img) => {
      const ph = img.parentElement.querySelector(".ph");
      const showPh = () => { img.style.display = "none"; if (ph) ph.style.display = "block"; };
      if (img.complete && img.naturalWidth === 0) showPh();
      img.addEventListener("error", showPh);
      img.addEventListener("load", () => { if (ph) ph.style.display = "none"; });
    });
  }

  function staggerChildren(grid) {
    $$(":scope > *", grid).forEach((el, i) => (el.style.transitionDelay = (i % 8) * 60 + "ms"));
  }

  /* ---------------- Render: destaques (landing) ---------------- */
  function renderFeatured() {
    const grid = $("#featured-products");
    if (!grid) return;
    const items = PRODUCTS.filter((p) => p.featured).slice(0, 8);
    grid.innerHTML = items.map(productCard).join("");
    wireImageFallbacks(grid);
    staggerChildren(grid);
  }

  /* ---------------- Render: catálogo (produtos) ---------------- */
  function renderCatalog(filter = "todos") {
    const grid = $("#product-grid");
    if (!grid) return;
    const items = filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);
    grid.innerHTML = items.map(productCard).join("");
    wireImageFallbacks(grid);
    staggerChildren(grid);
    revealObserve(grid);
  }

  function renderFilters() {
    const wrap = $("#filters");
    if (!wrap) return;
    wrap.innerHTML = CATEGORIES.map(
      (c) => `<button class="filter-chip" data-filter="${c.id}" aria-pressed="${c.id === "todos"}">${c.label}</button>`
    ).join("");
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      $$(".filter-chip", wrap).forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      renderCatalog(btn.dataset.filter);
    });
  }

  /* ---------------- Carrinho ---------------- */
  const KEY = "cajumel_cart_v1";
  let cart = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
  function save() { localStorage.setItem(KEY, JSON.stringify(cart)); }
  const count = () => cart.reduce((s, i) => s + i.qty, 0);
  const total = () => cart.reduce((s, i) => { const p = byId(i.id); return p ? s + p.price * i.qty : s; }, 0);

  function add(id) {
    const row = cart.find((i) => i.id === id);
    if (row) row.qty++; else cart.push({ id, qty: 1 });
    save(); syncBadge(); renderCart();
  }
  function setQty(id, q) {
    const row = cart.find((i) => i.id === id);
    if (!row) return;
    row.qty = q;
    if (row.qty <= 0) cart = cart.filter((i) => i.id !== id);
    save(); syncBadge(); renderCart();
  }
  function remove(id) { cart = cart.filter((i) => i.id !== id); save(); syncBadge(); renderCart(); }

  function syncBadge() {
    const el = $("#cart-count");
    if (!el) return;
    const n = count();
    el.textContent = n;
    el.classList.toggle("show", n > 0);
  }

  function renderCart() {
    const box = $("#cart-items");
    if (!box) return;
    if (!cart.length) {
      box.innerHTML =
        `<div class="cart-empty">
           <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
           <p>Seu carrinho está vazio.<br>Que tal começar por uma pasta cremosa?</p>
         </div>`;
    } else {
      box.innerHTML = cart
        .map((i) => {
          const p = byId(i.id);
          if (!p) return "";
          return (
            `<div class="cart-row">
               <div class="thumb">
                 <img src="${p.img}" alt="" loading="lazy" data-ph="${p.shape}:${p.tint}">
                 ${placeholderSVG(p.shape, p.tint)}
               </div>
               <div>
                 <div class="ci-name">${p.name}</div>
                 <div class="ci-price">${brl(p.price)} · ${p.weight}</div>
                 <div class="qty">
                   <button data-dec="${p.id}" aria-label="Diminuir">−</button>
                   <span>${i.qty}</span>
                   <button data-inc="${p.id}" aria-label="Aumentar">+</button>
                 </div>
               </div>
               <div style="text-align:right">
                 <div style="font-weight:600">${brl(p.price * i.qty)}</div>
                 <button class="ci-remove" data-rm="${p.id}">remover</button>
               </div>
             </div>`
          );
        })
        .join("");
      wireImageFallbacks(box);
    }
    const t = $("#cart-total-val");
    if (t) t.textContent = brl(total());
    const checkout = $("#cart-checkout");
    if (checkout) checkout.toggleAttribute("disabled", cart.length === 0);
  }

  /* ---------------- Checkout WhatsApp ---------------- */
  function checkout() {
    if (!cart.length) return;
    let msg = "Olá, CajuMel! 🌰 Gostaria de fazer um pedido:\n\n";
    cart.forEach((i) => {
      const p = byId(i.id);
      if (p) msg += `• ${i.qty}x ${p.name} (${p.weight}) — ${brl(p.price * i.qty)}\n`;
    });
    msg += `\n*Total: ${brl(total())}*\n\nMeu nome é: `;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  /* ---------------- Drawer + toast ---------------- */
  function openCart() {
    $("#cart-drawer")?.classList.add("open");
    $("#cart-overlay")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    $("#cart-drawer")?.classList.remove("open");
    $("#cart-overlay")?.classList.remove("open");
    document.body.style.overflow = "";
  }
  let toastT;
  function toast(text) {
    const el = $("#toast");
    if (!el) return;
    $("#toast-text").textContent = text;
    el.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------------- Animações de revelação ---------------- */
  let io;
  function revealObserve(scope = document) {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal, [data-stagger]", scope).forEach((el) => el.classList.add("in"));
      return;
    }
    io = io || new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    $$(".reveal, [data-stagger]", scope).forEach((el) => io.observe(el));
  }

  /* ---------------- Header / menu / eventos globais ---------------- */
  function initChrome() {
    const header = $(".site-header");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Parallax suave no visual do hero
    const heroPhoto = $(".hero-photo");
    if (heroPhoto && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.addEventListener("scroll", () => {
        const y = Math.min(window.scrollY, 600);
        heroPhoto.style.transform = `translateY(${y * 0.04}px)`;
      }, { passive: true });
    }

    // Menu mobile
    $("#nav-toggle")?.addEventListener("click", () => $("#mobile-menu")?.classList.add("open"));
    $("#mm-close")?.addEventListener("click", () => $("#mobile-menu")?.classList.remove("open"));
    $$("#mobile-menu a").forEach((a) => a.addEventListener("click", () => $("#mobile-menu")?.classList.remove("open")));

    // Carrinho
    $$("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
    $("#cart-close")?.addEventListener("click", closeCart);
    $("#cart-overlay")?.addEventListener("click", closeCart);
    $("#cart-checkout")?.addEventListener("click", checkout);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

    // Delegação: adicionar / ajustar quantidades
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        add(addBtn.dataset.add);
        const p = byId(addBtn.dataset.add);
        toast(`${p ? p.name : "Produto"} adicionado`);
        addBtn.classList.add("added");
        const label = addBtn.childNodes[addBtn.childNodes.length - 1];
        setTimeout(() => addBtn.classList.remove("added"), 1200);
        return;
      }
      const inc = e.target.closest("[data-inc]");
      if (inc) return setQty(inc.dataset.inc, (cart.find((i) => i.id === inc.dataset.inc)?.qty || 0) + 1);
      const dec = e.target.closest("[data-dec]");
      if (dec) return setQty(dec.dataset.dec, (cart.find((i) => i.id === dec.dataset.dec)?.qty || 0) - 1);
      const rm = e.target.closest("[data-rm]");
      if (rm) return remove(rm.dataset.rm);
    });
  }

  /* ---------------- Balões interativos (Por que CajuMel) ---------------- */
  function initBlobs() {
    const blobs = $$(".blob");
    if (!blobs.length) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    blobs.forEach((el) => {
      let raf = null;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;    // 0..1
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        if (reduce || e.pointerType === "touch") return;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rx = (0.5 - py) * 12, ry = (px - 0.5) * 14;
          el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
        });
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------------- Ano no rodapé ---------------- */
  function initYear() { const y = $("#year"); if (y) y.textContent = new Date().getFullYear(); }

  /* ---------------- Boot ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    renderFilters();
    renderCatalog();
    syncBadge();
    renderCart();
    initChrome();
    initBlobs();
    initYear();
    revealObserve();
  });
})();
