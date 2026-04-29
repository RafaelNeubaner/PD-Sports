
const CART_STORAGE_KEY = "pd-sports-cart";

function parseValor(valorTexto) {
  const normalizado = String(valorTexto || "0")
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const valor = Number.parseFloat(normalizado);
  return Number.isNaN(valor) ? 0 : valor;
}

function parseProduto(nome) {
  return String(nome || "produto")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCartStorage() {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch {
    return [];
  }
}

function setCartStorage(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function buildCartItemKey(item) {
  return `${item.id}::${item.variant || ""}`;
}

export const cartApi = {
  parseProduto,
  parseValor,
  getCart: () => getCartStorage(),
  saveCart: (cart) => setCartStorage(cart),
  addToCart: (produto, quantidade = 1) => {
    const cart = getCartStorage();
    const itemKey = buildCartItemKey(produto);
    const index = cart.findIndex((item) => buildCartItemKey(item) === itemKey);

    if (index >= 0) {
      cart[index].qtd += quantidade;
    } else {
      cart.push({ ...produto, qtd: quantidade, cartKey: itemKey });
    }

    setCartStorage(cart);
    return cart;
  },
  removeFromCart: (id, quantidade = 1, variant = "") => {
    const cart = getCartStorage();
    const itemKey = buildCartItemKey({ id, variant });
    const index = cart.findIndex((item) => buildCartItemKey(item) === itemKey);

    if (index === -1) {
      return cart;
    }

    cart[index].qtd -= quantidade;
    if (cart[index].qtd <= 0) {
      cart.splice(index, 1);
    }

    setCartStorage(cart);
    return cart;
  },
  clearCart: () => {
    setCartStorage([]);
  },
  getTotalItens: () =>
    getCartStorage().reduce((total, item) => total + (item.qtd || 0), 0),
  atualizarBadgeGlobal: () => {
    const total = String(cartApi.getTotalItens());
    document.querySelectorAll(".cart-badge").forEach((badge) => {
      badge.textContent = total;
    });
  },
};