/* js/cart.js
 - Carrinho simples com localStorage
 - Checkout via WhatsApp para o número: 55 85 4141 7831
 - Atualize PRODUCTS caso queira trocar ou adicionar
*/

(() => {
  // ======= CONFIG =======
  const WHATSAPP_NUMBER = "558541417831"; // número sem +, use o seu: 55 DDD NÚMERO
  const STORAGE_KEY = "gotrack_cart";

  // Exemplo de produtos (3 genéricos). Troque/adicione conforme necessário.
  const PRODUCTS = [
    {
      id: "p01",
      title: "Rastreador Veicular GT-4G",
      desc: "Rastreador 4G com bloqueio remoto e bateria interna.",
      price: 1299.00,
      category: "rastreadores",
      img: "img/EC33.png"
    },
    {
      id: "p02",
      title: "Rastreador Moto Compacto",
      desc: "Pequeno, discreto e com bateria de reserva.",
      price: 249.00,
      category: "rastreadores",
      img: "img/rastreador2.jpg"
    },
    {
      id: "p03",
      title: "Plano Auto Gestão - 1 mês",
      desc: "Plano para autogestão via plataforma (mensal).",
      price: 39.90,
      category: "planos",
      img: "img/acessorio1.jpg"
    }
  ];

  // ======= UTIL =======
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const formatMoney = (v) => {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // ======= CART STATE =======
  let cart = [];

  const saveCart = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  const loadCart = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cart = raw ? JSON.parse(raw) : [];
    } catch (e) { cart = []; }
  };

  // ======= RENDER PRODUTO GRID =======
  const grid = $("#gridProdutos");
  function renderProducts(filterText = "", category = "todos") {
    grid.innerHTML = "";
    const q = filterText.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => {
      const matchText = p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchCat = (category === "todos") || (p.category === category);
      return matchText && matchCat;
    });

    if(filtered.length === 0){
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted)">Nenhum produto encontrado.</p>`;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement("article");
      card.className = "produto-card";
      card.innerHTML = `
        <img class="produto-thumb" src="${p.img}" alt="${p.title}">
        <div class="produto-body">
          <div>
            <div class="produto-title">${p.title}</div>
            <div class="produto-desc">${p.desc}</div>
          </div>
          <div class="produto-meta">
            <div class="produto-price">${formatMoney(p.price)}</div>
            <button class="btn-add" data-id="${p.id}">Adicionar</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // bind add buttons
    $$(".btn-add").forEach(b => b.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart(id);
    }));
  }

  // ======= CART RENDER =======
  const cartPanel = $("#cartPanel");
  const cartList = $("#cartList");
  const cartCount = $("#cartCount");
  const cartTotalEl = $("#cartTotal");

  function updateCartUI(){
    // clear and render
    cartList.innerHTML = "";
    if(cart.length === 0){
      cartList.innerHTML = `<p style="text-align:center;color:var(--muted)">Seu carrinho está vazio.</p>`;
      cartCount.textContent = "0";
      cartTotalEl.textContent = formatMoney(0);
      return;
    }

    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="${product.img}" alt="${product.title}">
        <div class="ci-body">
          <div class="ci-title">${product.title}</div>
          <div class="ci-meta">
            <div>${formatMoney(product.price)} </div>
            <div class="qty-control" data-id="${item.id}">
              <button class="qty-minus" aria-label="Diminuir">−</button>
              <div class="qty-value">${item.qty}</div>
              <button class="qty-plus" aria-label="Aumentar">+</button>
              <button class="btn btn-outline btn-sm remove-item" style="margin-left:8px;">Remover</button>
            </div>
          </div>
        </div>
      `;
      cartList.appendChild(el);
    });

    // bind qty controls
    $$(".qty-control").forEach(ctrl => {
      const id = ctrl.dataset.id;
      ctrl.querySelector(".qty-plus").addEventListener("click", () => changeQty(id, 1));
      ctrl.querySelector(".qty-minus").addEventListener("click", () => changeQty(id, -1));
      ctrl.querySelector(".remove-item").addEventListener("click", () => removeItem(id));
    });

    const total = cart.reduce((s, it) => {
      const p = PRODUCTS.find(x => x.id === it.id);
      return s + (p.price * it.qty);
    }, 0);

    cartCount.textContent = cart.reduce((s,i)=> s + i.qty, 0);
    cartTotalEl.textContent = formatMoney(total);
  }

  // ======= CART OPERATIONS =======
  function addToCart(productId, qty = 1){
    const existing = cart.find(i => i.id === productId);
    if(existing){
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty });
    }
    saveCart();
    updateCartUI();
    openCart();
  }

  function changeQty(productId, delta){
    const it = cart.find(i => i.id === productId);
    if(!it) return;
    it.qty += delta;
    if(it.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
    updateCartUI();
  }

  function removeItem(productId){
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
  }

  function clearCart(){
    cart = [];
    saveCart();
    updateCartUI();
  }

  // ======= UI: open/close cart =======
  const openBtn = $("#openCart");
  const closeBtn = $("#closeCart");
  const clearBtn = $("#clearCart");
  const checkoutBtn = $("#checkoutBtn");

  function openCart(){ cartPanel.classList.add("open"); cartPanel.setAttribute("aria-hidden","false"); }
  function closeCart(){ cartPanel.classList.remove("open"); cartPanel.setAttribute("aria-hidden","true"); }

  openBtn.addEventListener("click", () => openCart());
  closeBtn.addEventListener("click", () => closeCart());
  clearBtn.addEventListener("click", () => {
    if(confirm("Limpar todo o carrinho?")) clearCart();
  });

  // ======= CHECKOUT VIA WHATSAPP =======
  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0) { alert("Seu carrinho está vazio."); return; }
    // montar mensagem
    let lines = [];
    lines.push("Olá, quero finalizar a compra:");
    lines.push("----------------------------");
    let total = 0;
    cart.forEach(it => {
      const p = PRODUCTS.find(x => x.id === it.id);
      const sub = p.price * it.qty;
      total += sub;
      lines.push(`${it.qty}x ${p.title} — ${formatMoney(p.price)}  (subtotal: ${formatMoney(sub)})`);
    });
    lines.push("----------------------------");
    lines.push(`Total: ${formatMoney(total)}`);
    lines.push("");
    lines.push("Nome: ");
    lines.push("Telefone: ");

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    // abrir em nova aba
    window.open(url, "_blank");
  });

  // ======= SEARCH & FILTER =======
  const searchInput = $("#searchInput");
  const categorySelect = $("#filterCat");
  searchInput.addEventListener("input", (e) => renderProducts(e.target.value, categorySelect.value));
  categorySelect.addEventListener("change", () => renderProducts(searchInput.value, categorySelect.value));

  // ====== Carrossel de depoimentos ======
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const testimonials = Array.from(track.children);
let index = 0;

// Função para mover o carrossel
function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

// Botões
nextBtn.addEventListener('click', () => {
  index = (index + 1) % testimonials.length;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  index = (index - 1 + testimonials.length) % testimonials.length;
  updateCarousel();
});

// Auto-slide
setInterval(() => {
  index = (index + 1) % testimonials.length;
  updateCarousel();
}, 6000);


  // ======= INIT =======
  function init(){
    loadCart();
    renderProducts("", "todos");
    updateCartUI();

    // fechar painel ao clicar fora (opcional)
    document.addEventListener("click", (ev) => {
      if(!cartPanel.classList.contains("open")) return;
      const target = ev.target;
      // fechar se clicar fora do painel e fora do botão
      if(!cartPanel.contains(target) && !openBtn.contains(target)) {
        // don't immediately close when clicking inside header nav etc
        // leave this behavior for mobile friendly UX
      }
    });

    // accessibility: escape to close
    document.addEventListener("keydown", (ev) => {
      if(ev.key === "Escape") closeCart();
    });

    // populate footer year if exists
    const y = new Date().getFullYear();
    const ye = document.getElementById("year-p");
    if(ye) ye.textContent = y;
  }

  init();
})();
