/* =========================
   ДАНІ (до 20 товарів)
========================= */
const PRODUCTS = [
  { id: "drip-kit", name: "Крапельний полив (комплект)", category: "Полив", price: 799, popular: 10, desc: "Комплект для 20–30 м грядок. Економить воду." },
  { id: "shovel", name: "Лопата садова", category: "Інструменти", price: 349, popular: 9, desc: "Міцна сталь, зручна ручка." },
  { id: "rake", name: "Граблі металеві", category: "Інструменти", price: 299, popular: 8, desc: "Для листя та вирівнювання ґрунту." },
  { id: "seeds-tomato", name: "Насіння томатів (пакет)", category: "Насіння", price: 39, popular: 10, desc: "Стабільне сходження, перевірена партія." },
  { id: "seeds-cucumber", name: "Насіння огірків (пакет)", category: "Насіння", price: 35, popular: 8, desc: "Ранній сорт, підходить для теплиці." },
  { id: "fertilizer-universal", name: "Добриво універсальне 1 кг", category: "Добрива", price: 189, popular: 9, desc: "Для овочів, ягід, квітів." },
  { id: "fertilizer-bio", name: "Біо-добриво (концентрат)", category: "Добрива", price: 249, popular: 7, desc: "Підтримка росту та кореневої системи." },
  { id: "gloves", name: "Рукавички садові", category: "Аксесуари", price: 79, popular: 7, desc: "Захист рук, не ковзають." },
  { id: "shears", name: "Секатор", category: "Інструменти", price: 269, popular: 8, desc: "Для обрізки гілок та кущів." },
  { id: "hose", name: "Шланг поливний 20 м", category: "Полив", price: 499, popular: 6, desc: "Гнучкий, міцний, зручний." },
  { id: "sprayer", name: "Обприскувач 5 л", category: "Полив", price: 399, popular: 7, desc: "Для підживлення та захисту рослин." },
  { id: "soil", name: "Ґрунт універсальний 20 л", category: "Ґрунти", price: 159, popular: 6, desc: "Для розсади та пересадки." },
];

/* =========================
   СТЕЙТ
========================= */
const state = {
  search: "",
  category: "all",
  sort: "popular",
  cart: loadCart(), // { [id]: qty }
};

/* =========================
   DOM
========================= */
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const categoryCustom = document.getElementById("categoryCustom");
const categoryCustomBtn = document.getElementById("categoryCustomBtn");
const categoryCustomMenu = document.getElementById("categoryCustomMenu");
const sortSelect = document.getElementById("sortSelect");
const sortCustom = document.getElementById("sortCustom");
const sortCustomBtn = document.getElementById("sortCustomBtn");
const sortCustomMenu = document.getElementById("sortCustomMenu");
const clearBtn = document.getElementById("clearBtn");

const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartBadge = document.getElementById("cartBadge");
const clearCartBtn = document.getElementById("clearCartBtn");
const cartToggleBtn = document.getElementById("cartToggleBtn");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const openOrderBtn = document.getElementById("openOrderBtn");

const orderModal = document.getElementById("orderModal");
const orderOverlay = document.getElementById("orderOverlay");
const closeOrderBtn = document.getElementById("closeOrderBtn");

const orderForm = document.getElementById("orderForm");
const formNotice = document.getElementById("formNotice");
const promoProductsBtn = document.getElementById("promoProductsBtn");

const burgerBtn = document.getElementById("burgerBtn");
const mobileNav = document.getElementById("mobileNav");

/* =========================
   INIT
========================= */
initCategories();
initSortCustomMenu();
renderProducts();
renderCart();
wireEvents();

/* =========================
   UI / EVENTS
========================= */
function wireEvents() {
  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  categorySelect.addEventListener("change", (e) => {
    state.category = e.target.value;
    syncCategoryCustomState();
    renderProducts();
  });

  categoryCustomBtn?.addEventListener("click", () => {
    const isOpen = categoryCustom.classList.contains("select-custom--open");
    setCategoryMenuOpen(!isOpen);
  });

  categoryCustomMenu?.addEventListener("click", (e) => {
    const optionBtn = e.target.closest("[data-category-value]");
    if (!optionBtn) return;
    const value = optionBtn.getAttribute("data-category-value") || "all";
    categorySelect.value = value;
    categorySelect.dispatchEvent(new Event("change", { bubbles: true }));
    setCategoryMenuOpen(false);
  });

  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    syncSortCustomState();
    renderProducts();
  });

  sortCustomBtn?.addEventListener("click", () => {
    const isOpen = sortCustom.classList.contains("select-custom--open");
    setSortMenuOpen(!isOpen);
  });

  sortCustomMenu?.addEventListener("click", (e) => {
    const optionBtn = e.target.closest("[data-sort-value]");
    if (!optionBtn) return;
    const value = optionBtn.getAttribute("data-sort-value") || "popular";
    sortSelect.value = value;
    sortSelect.dispatchEvent(new Event("change", { bubbles: true }));
    setSortMenuOpen(false);
  });

  clearBtn.addEventListener("click", () => {
    state.search = "";
    state.category = "all";
    state.sort = "popular";
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "popular";
    syncCategoryCustomState();
    syncSortCustomState();
    renderProducts();
  });

  productsGrid.addEventListener("click", (e) => {
    const decQty = e.target.closest("[data-qty-dec]");
    const incQty = e.target.closest("[data-qty-inc]");
    const removeAdded = e.target.closest("[data-remove-added]");

    if (decQty || incQty) {
      const card = (decQty || incQty).closest(".product");
      const qtyEl = card?.querySelector("[data-qty-value]");
      if (!qtyEl) return;

      const currentQty = Number(qtyEl.textContent) || 1;
      const nextQty = decQty
        ? Math.max(1, currentQty - 1)
        : Math.min(99, currentQty + 1);

      qtyEl.textContent = String(nextQty);
      return;
    }

    if (removeAdded) {
      const id = removeAdded.getAttribute("data-remove-added");
      if (!id) return;
      removeFromCart(id);
      return;
    }

    const btn = e.target.closest("[data-add]");
    if (!btn) return;

    const card = btn.closest(".product");
    const qtyEl = card?.querySelector("[data-qty-value]");
    const qty = Math.max(1, Number(qtyEl?.textContent) || 1);

    const id = btn.getAttribute("data-add");
    addToCart(id, qty);
    showAddedState(btn);
  });

  // Quick add from hero
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quick-add]");
    if (!btn) return;
    const id = btn.getAttribute("data-quick-add");
    addToCart(id, 1);
    showAddedState(btn);
  });

  cartList.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const remove = e.target.closest("[data-remove]");

    if (inc) changeQty(inc.getAttribute("data-inc"), +1);
    if (dec) changeQty(dec.getAttribute("data-dec"), -1);
    if (remove) removeFromCart(remove.getAttribute("data-remove"));
  });

  clearCartBtn.addEventListener("click", () => {
    state.cart = {};
    persistCart();
    renderCart();
    renderProducts();
  });

  cartToggleBtn.addEventListener("click", () => {
    const isOpen = cartPanel.classList.contains("cart--open");
    setCartPanelOpen(!isOpen);
  });

  cartOverlay.addEventListener("click", () => {
    setCartPanelOpen(false);
  });

  cartPanel.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      setCartPanelOpen(false);
    }
  });

  openOrderBtn.addEventListener("click", () => {
    if (Object.keys(state.cart).length === 0) {
      formNotice.textContent = "Кошик порожній — додайте товари перед оформленням 🙂";
      setCartPanelOpen(true);
      return;
    }
    formNotice.textContent = "";
    setCartPanelOpen(false);
    setOrderModalOpen(true);
  });

  closeOrderBtn.addEventListener("click", () => {
    setOrderModalOpen(false);
  });

  orderOverlay.addEventListener("click", () => {
    setOrderModalOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setCategoryMenuOpen(false);
      setSortMenuOpen(false);
      setOrderModalOpen(false);
      setCartPanelOpen(false);
    }
  });

  document.addEventListener("click", (e) => {
    if (categoryCustom && !categoryCustom.contains(e.target)) {
      setCategoryMenuOpen(false);
    }
    if (sortCustom && !sortCustom.contains(e.target)) {
      setSortMenuOpen(false);
    }
  });

  orderForm.addEventListener("submit", onSubmitOrder);

  burgerBtn.addEventListener("click", () => {
    const isOpen = mobileNav.style.display === "block";
    mobileNav.style.display = isOpen ? "none" : "block";
  });

  mobileNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") mobileNav.style.display = "none";
  });

  promoProductsBtn?.addEventListener("click", () => {
    promoProductsBtn.classList.add("btn--pressed");
    promoProductsBtn.setAttribute("aria-pressed", "true");
  });

}

function setCartPanelOpen(isOpen) {
  cartPanel.classList.toggle("cart--open", isOpen);
  cartOverlay.classList.toggle("cart-overlay--open", isOpen);
  cartPanel.setAttribute("aria-hidden", String(!isOpen));
  cartOverlay.setAttribute("aria-hidden", String(!isOpen));
  cartToggleBtn.setAttribute("aria-expanded", String(isOpen));
}

function setOrderModalOpen(isOpen) {
  orderModal.classList.toggle("order-modal--open", isOpen);
  orderOverlay.classList.toggle("order-overlay--open", isOpen);
  orderModal.setAttribute("aria-hidden", String(!isOpen));
  orderOverlay.setAttribute("aria-hidden", String(!isOpen));
}

function showAddedState(btn) {
  if (!btn) return;

  const id = btn.getAttribute("data-add") || btn.getAttribute("data-quick-add");
  if (!id) return;

  const isAdded = Boolean(state.cart[id]);
  btn.textContent = isAdded ? "Додано" : "Додати в кошик";
  btn.classList.toggle("btn--added", isAdded);
}

/* =========================
   PRODUCTS RENDER
========================= */
function initCategories() {
  const categories = Array.from(new Set(PRODUCTS.map(p => p.category))).sort((a,b)=>a.localeCompare(b, "uk"));
  for (const cat of categories) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  }
  renderCategoryCustomMenu();
  syncCategoryCustomState();
}

function renderCategoryCustomMenu() {
  if (!categoryCustomMenu || !categorySelect) return;

  categoryCustomMenu.innerHTML = "";
  for (const opt of categorySelect.options) {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "select-custom__option";
    optionBtn.textContent = opt.textContent;
    optionBtn.setAttribute("data-category-value", opt.value);
    optionBtn.setAttribute("role", "option");
    optionBtn.setAttribute("aria-selected", String(opt.value === categorySelect.value));
    categoryCustomMenu.appendChild(optionBtn);
  }
}

function syncCategoryCustomState() {
  if (!categoryCustomBtn || !categoryCustomMenu || !categorySelect) return;

  const selectedOption = categorySelect.options[categorySelect.selectedIndex];
  if (selectedOption) {
    categoryCustomBtn.textContent = selectedOption.textContent;
  }

  for (const child of categoryCustomMenu.children) {
    const value = child.getAttribute("data-category-value");
    const isActive = value === categorySelect.value;
    child.classList.toggle("select-custom__option--active", isActive);
    child.setAttribute("aria-selected", String(isActive));
  }
}

function setCategoryMenuOpen(isOpen) {
  if (!categoryCustom || !categoryCustomBtn) return;
  categoryCustom.classList.toggle("select-custom--open", isOpen);
  categoryCustomBtn.setAttribute("aria-expanded", String(isOpen));
}

function initSortCustomMenu() {
  if (!sortCustomMenu || !sortSelect) return;

  sortCustomMenu.innerHTML = "";
  for (const opt of sortSelect.options) {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "select-custom__option";
    optionBtn.textContent = opt.textContent;
    optionBtn.setAttribute("data-sort-value", opt.value);
    optionBtn.setAttribute("role", "option");
    optionBtn.setAttribute("aria-selected", String(opt.value === sortSelect.value));
    sortCustomMenu.appendChild(optionBtn);
  }

  syncSortCustomState();
}

function syncSortCustomState() {
  if (!sortCustomBtn || !sortCustomMenu || !sortSelect) return;

  const selectedOption = sortSelect.options[sortSelect.selectedIndex];
  if (selectedOption) {
    sortCustomBtn.textContent = selectedOption.textContent;
  }

  for (const child of sortCustomMenu.children) {
    const value = child.getAttribute("data-sort-value");
    const isActive = value === sortSelect.value;
    child.classList.toggle("select-custom__option--active", isActive);
    child.setAttribute("aria-selected", String(isActive));
  }
}

function setSortMenuOpen(isOpen) {
  if (!sortCustom || !sortCustomBtn) return;
  sortCustom.classList.toggle("select-custom--open", isOpen);
  sortCustomBtn.setAttribute("aria-expanded", String(isOpen));
}

function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (state.category !== "all") {
    list = list.filter(p => p.category === state.category);
  }
  if (state.search) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(state.search) ||
      p.category.toLowerCase().includes(state.search) ||
      p.desc.toLowerCase().includes(state.search)
    );
  }

  switch (state.sort) {
    case "priceAsc": list.sort((a,b)=>a.price-b.price); break;
    case "priceDesc": list.sort((a,b)=>b.price-a.price); break;
    case "nameAsc": list.sort((a,b)=>a.name.localeCompare(b.name, "uk")); break;
    default: list.sort((a,b)=>b.popular-a.popular);
  }
  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  productsGrid.innerHTML = "";

  if (list.length === 0) {
    productsGrid.innerHTML = `<div class="card" style="grid-column:1/-1;">
      <h3>Нічого не знайдено</h3>
      <p class="muted">Спробуй інший запит або скинь фільтри.</p>
    </div>`;
    return;
  }

  for (const p of list) {
    const isAdded = Boolean(state.cart[p.id]);
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
      <div class="product__top">
        <div class="product__name">${escapeHtml(p.name)}</div>
        <div class="tag">${escapeHtml(p.category)}</div>
      </div>
      <div class="product__desc">${escapeHtml(p.desc)}</div>
      <div class="product__meta">
        <div class="product__price">${p.price} ₴</div>
        <div class="muted">★ ${p.popular}/10</div>
      </div>
      <div class="product__actions">
        <div class="productQty" aria-label="Кількість">
          <button type="button" class="productQty__btn" data-qty-dec="${p.id}" aria-label="Зменшити кількість">−</button>
          <span class="productQty__value" data-qty-value>1</span>
          <button type="button" class="productQty__btn" data-qty-inc="${p.id}" aria-label="Збільшити кількість">+</button>
        </div>
        <div class="product__ctaRow">
          <button class="btn btn--full product__addBtn${isAdded ? " btn--added" : ""}" data-add="${p.id}">${isAdded ? "Додано" : "Додати в кошик"}</button>
          ${isAdded ? `<button class="product__removeAdded" type="button" data-remove-added="${p.id}" aria-label="Прибрати з кошика" title="Прибрати з кошика">🗑️</button>` : ""}
        </div>
      </div>
    `;
    productsGrid.appendChild(el);
  }

  syncQuickAddButtonState();
}

/* =========================
   CART
========================= */
function addToCart(id, qty) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  state.cart[id] = (state.cart[id] || 0) + qty;
  if (state.cart[id] < 1) delete state.cart[id];

  persistCart();
  renderCart();
  renderProducts();
}

function changeQty(id, delta) {
  if (!state.cart[id]) return;
  state.cart[id] += delta;
  if (state.cart[id] < 1) delete state.cart[id];
  persistCart();
  renderCart();
  renderProducts();
}

function removeFromCart(id) {
  delete state.cart[id];
  persistCart();
  renderCart();
  renderProducts();
}

function renderCart() {
  const entries = Object.entries(state.cart);
  cartList.innerHTML = "";

  if (entries.length === 0) {
    cartList.innerHTML = `<div class="muted">Кошик порожній. Додай щось корисне, а не “мрію про врожай”. 😄</div>`;
    cartTotal.textContent = "0 ₴";
    cartCount.textContent = "0 товарів";
    cartBadge.textContent = "0";
    syncQuickAddButtonState();
    return;
  }

  let total = 0;
  let count = 0;

  for (const [id, qty] of entries) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) continue;

    const line = product.price * qty;
    total += line;
    count += qty;

    const item = document.createElement("div");
    item.className = "cartItem";
    item.innerHTML = `
      <div class="cartItem__row">
        <strong>${escapeHtml(product.name)}</strong>
        <span>${line} ₴</span>
      </div>
      <div class="cartItem__row">
        <div class="qty">
          <button type="button" data-dec="${id}" aria-label="Зменшити">−</button>
          <span>${qty} шт</span>
          <button type="button" data-inc="${id}" aria-label="Збільшити">+</button>
        </div>
        <button type="button" class="btn btn--ghost" data-remove="${id}">Видалити</button>
      </div>
      <div class="muted" style="font-size:12px;">${product.price} ₴ / шт</div>
    `;
    cartList.appendChild(item);
  }

  cartTotal.textContent = `${total} ₴`;
  cartCount.textContent = `${count} товарів`;
  cartBadge.textContent = String(count);
  syncQuickAddButtonState();
}

function syncQuickAddButtonState() {
  const quickAddBtn = document.querySelector("[data-quick-add='drip-kit']");
  if (!quickAddBtn) return;

  const isAdded = Boolean(state.cart["drip-kit"]);
  quickAddBtn.textContent = isAdded ? "Додано" : "Додати в кошик";
  quickAddBtn.classList.toggle("btn--added", isAdded);
}

/* =========================
   ORDER SUBMIT (Google Sheets)
========================= */
/**
 * 1) Створиш Google Apps Script web app URL і вставиш сюди:
 * const ORDER_ENDPOINT = "https://script.google.com/macros/s/....../exec";
 */
const ORDER_ENDPOINT = "https://script.google.com/macros/s/AKfycbzm3J_2o-ZwvWq6Gi2EHj-fE2q5sok7XDMNn1EVhpGCGlWYHXSivlEETj3MApxUujrLnw/exec";

async function onSubmitOrder(e) {
  e.preventDefault();
  formNotice.textContent = "";

  const entries = Object.entries(state.cart);
  if (entries.length === 0) {
    formNotice.textContent = "Кошик порожній — нема що відправляти 🙂";
    return;
  }

  const formData = new FormData(orderForm);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    comment: String(formData.get("comment") || "").trim(),
    items: entries.map(([id, qty]) => {
      const p = PRODUCTS.find(x => x.id === id);
      return { id, name: p?.name || id, price: p?.price || 0, qty };
    }),
    total: calcTotal(),
    createdAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  if (payload.name.length < 2) { formNotice.textContent = "Вкажи ім’я (мінімум 2 символи)."; return; }
  if (payload.phone.length < 7) { formNotice.textContent = "Вкажи нормальний телефон 🙂"; return; }
  if (!ORDER_ENDPOINT || ORDER_ENDPOINT.includes("PASTE_")) {
    formNotice.textContent = "Нема endpoint. Спочатку підключи Google Sheets (крок 5).";
    return;
  }

  try {
    setBusy(true);
    const res = await fetch(ORDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data?.ok) {
      formNotice.textContent = "Замовлення надіслано ✅ Ми з тобою зв’яжемось.";
      orderForm.reset();
      state.cart = {};
      persistCart();
      renderCart();
      setOrderModalOpen(false);
    } else {
      throw new Error(data?.error || "Unknown error");
    }
  } catch (err) {
    console.error(err);
    formNotice.textContent = "Помилка відправки. Перевір Apps Script доступ або URL.";
  } finally {
    setBusy(false);
  }
}

function calcTotal() {
  return Object.entries(state.cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function setBusy(isBusy) {
  const btn = orderForm.querySelector('button[type="submit"]');
  btn.disabled = isBusy;
  btn.textContent = isBusy ? "Відправляю…" : "Надіслати замовлення";
}

/* =========================
   STORAGE + HELPERS
========================= */
function persistCart() {
  localStorage.setItem("gg_cart", JSON.stringify(state.cart));
}

function loadCart() {
  try {
    const raw = localStorage.getItem("gg_cart");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
