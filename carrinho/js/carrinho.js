const CART_STORAGE_KEY = 'pd-sports-cart';

function parseValor(valorTexto) {
    const normalizado = String(valorTexto || '0')
        .replace(/[^\d,.-]/g, '')
        .replace(/\.(?=\d{3}(\D|$))/g, '')
        .replace(',', '.');

    const valor = Number.parseFloat(normalizado);
    return Number.isNaN(valor) ? 0 : valor;
}

function parseProduto(nome) {
    return String(nome || 'produto')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
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

window.PDSportsCart = window.PDSportsCart || {
    parseProduto,
    parseValor,
    getCart: () => getCartStorage(),
    saveCart: (cart) => setCartStorage(cart),
    addToCart: (produto, quantidade = 1) => {
        const cart = getCartStorage();
        const index = cart.findIndex((item) => item.id === produto.id);

        if (index >= 0) {
            cart[index].qtd += quantidade;
        } else {
            cart.push({ ...produto, qtd: quantidade });
        }

        setCartStorage(cart);
        return cart;
    },
    removeFromCart: (id, quantidade = 1) => {
        const cart = getCartStorage();
        const index = cart.findIndex((item) => item.id === id);

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
    getTotalItens: () => getCartStorage().reduce((total, item) => total + (item.qtd || 0), 0),
    atualizarBadgeGlobal: () => {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = String(window.PDSportsCart.getTotalItens());
        }
    }
};

const cartBadge = document.querySelector('.cart-badge');
const carrinho = document.getElementById('carrinho');
const cartApi = window.PDSportsCart;
let quantidadeCarrinho = 0;

function getProdutoDados(produto) {
    const nome = produto.querySelector('h3 .cardTitle')?.textContent?.trim() || 'Produto';
    const id = cartApi?.parseProduto ? cartApi.parseProduto(nome) : nome.toLowerCase().replace(/\s+/g, '-');
    const precoTexto = produto.querySelector('.prodPrice')?.textContent || 'R$ 0,00';
    const preco = cartApi?.parseValor ? cartApi.parseValor(precoTexto) : 0;
    const img = produto.querySelector('img')?.getAttribute('src') || '';
    const qtd = parseInt(produto.querySelector('.quantity')?.textContent || '0', 10) || 0;

    return { id, nome, preco, img, qtd };
}

function sincronizarQuantidadeCarrinho() {
    if (cartApi) {
        quantidadeCarrinho = cartApi.getTotalItens();
        return;
    }
    quantidadeCarrinho = 1;
    document.querySelectorAll('.cartItem').forEach((produto) => {
        const qtd = parseInt(produto.querySelector('.quantity')?.textContent || '0', 10) || 0;
        quantidadeCarrinho += qtd;
    });
}

function sincronizarStorageComPagina() {
    if (!cartApi) return;

    const totais = new Map();
    document.querySelectorAll('.cartItem').forEach((produto) => {
        const item = getProdutoDados(produto);
        if (!item.id) return;

        const existente = totais.get(item.id);
        if (existente) {
            existente.qtd += item.qtd;
        } else {
            totais.set(item.id, {
                id: item.id,
                nome: item.nome,
                preco: item.preco,
                qtd: item.qtd,
                img: item.img
            });
        }
    });

    cartApi.saveCart(Array.from(totais.values()).filter((item) => item.qtd > 0));
}


addEventListener('DOMContentLoaded', () => {
    if (cartApi && cartApi.getCart().length === 0) {
        sincronizarStorageComPagina();
    }

    sincronizarQuantidadeCarrinho();

    const cartItens = document.querySelector('.cartItens');
    if (cartItens) {
        cartItens.addEventListener('click', (event) => {
            const botaoAdicionar = event.target.closest('.increase');
            if (botaoAdicionar) {
                somarItem({ currentTarget: botaoAdicionar });
                return;
            }

            const botaoSubtrair = event.target.closest('.decrease');
            if (botaoSubtrair) {
                subtrairItem({ currentTarget: botaoSubtrair });
                return;
            }

            const botaoRemover = event.target.closest('.remove');
            if (botaoRemover) {
                removerItem({ currentTarget: botaoRemover });
            }
        });

        const observer = new MutationObserver(() => {
            sincronizarQuantidadeCarrinho();
            atualizarBadge();
            atualizarSubtotal();
        });

        observer.observe(cartItens, { childList: true });

        const resumo = document.querySelector('.resumo');
        if (cartApi.getCart().length === 0 && resumo) {
            resumo.style.display = 'none';
        }
    }

    carregarCarrinho();
    atualizarBadge();
    atualizarSubtotal();
});



function somarItem(event) {
    const produto = event.currentTarget.closest('.cartItem');
    if (!produto) return;

    const precoSpan = produto.querySelector('.prodPrice');
    const quantidadeSpan = produto.querySelector('.quantity');
    const totalSpan = produto.querySelector('.subTotal');

    if (!precoSpan || !quantidadeSpan || !totalSpan) return;

    const precoProduto = parseFloat(precoSpan.textContent.replace('R$', '').replace(',', '.'));
    let qtd = parseInt(quantidadeSpan.textContent, 10) || 0;
    qtd++;
    quantidadeSpan.textContent = String(qtd);

    const subtotalProduto = precoProduto * qtd;
    totalSpan.textContent = `R$ ${subtotalProduto.toFixed(2).replace('.', ',')}`;

    const item = getProdutoDados(produto);
    if (cartApi) {
        cartApi.addToCart({ id: item.id, nome: item.nome, preco: item.preco, img: item.img }, 1);
    }

    atualizarSubtotal();
    atualizarBadge();
}

function subtrairItem(event) {
    const produto = event.currentTarget.closest('.cartItem');
    if (!produto) return;

    const precoSpan = produto.querySelector('.prodPrice');
    const quantidadeSpan = produto.querySelector('.quantity');
    const totalSpan = produto.querySelector('.subTotal');

    if (!precoSpan || !quantidadeSpan || !totalSpan) return;

    const precoProduto = parseFloat(precoSpan.textContent.replace('R$', '').replace(',', '.'));
    let qtd = parseInt(quantidadeSpan.textContent, 10) || 0;

    if (qtd > 0) {
        qtd--;
        quantidadeSpan.textContent = String(qtd);

        const subtotalProduto = precoProduto * qtd;
        totalSpan.textContent = `R$ ${subtotalProduto.toFixed(2).replace('.', ',')}`;

        const item = getProdutoDados(produto);
        if (cartApi) {
            cartApi.removeFromCart(item.id, 1);
        }

        atualizarBadge();
        atualizarSubtotal();
    }
    if (qtd === 0) {
        produto.remove();
        if (cartApi) {
            sincronizarStorageComPagina();
        }
        atualizarBadge();
        atualizarSubtotal();
    }
}

function atualizarBadge() {
    sincronizarQuantidadeCarrinho();
    if (cartBadge) {
        cartBadge.textContent = String(quantidadeCarrinho);
    }
    if (cartApi) {
        cartApi.atualizarBadgeGlobal();
    }
    if (!carrinho) return;

    const textoVazio = carrinho.querySelector('.carrinho-vazio');
    const resumo = carrinho.querySelector('.resumo');

    if (quantidadeCarrinho === 0) {
        if (!textoVazio) {
            const texto = document.createElement('p');
            texto.className = 'carrinho-vazio';
            texto.textContent = 'Seu carrinho está vazio';
            carrinho.appendChild(texto);
            resumo.style.display = 'none';
        }
    } else {
        if (textoVazio) {
            textoVazio.remove();
            resumo.style.display = 'flex';
        }
    }
}

function atualizarSubtotal() {
    let subtotal = 0;
    document.querySelectorAll('.cartItem').forEach(produto => {
        let subtotalProduto = parseFloat(produto.querySelector('.subTotal').textContent.replace('R$', '').replace(',', '.'));
            subtotal += subtotalProduto;
    });
    let subtotalElement = document.querySelector('.resumo .span2');
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

document.querySelectorAll('.finalizar').forEach(button => {
    button.addEventListener('click', () => {
        const audioCompraFinalizada = document.getElementById('audio-compra-finalizada');
        if (audioCompraFinalizada) {
            audioCompraFinalizada.currentTime = 0;
            audioCompraFinalizada.play().catch(() => {});
        }

        alert('Compra finalizada com sucesso!');
        if (cartApi) {
            cartApi.clearCart();
        }
        document.querySelectorAll('.cartItem').forEach((produto) => produto.remove());
        quantidadeCarrinho = 0;
        atualizarBadge();
        atualizarSubtotal();
    });
});

function removerItem(event) {
    let produto = event.currentTarget.closest('.cartItem');
    if (!produto) return;

    const item = getProdutoDados(produto);

    produto.remove();
    if (cartApi) {
        cartApi.removeFromCart(item.id, item.qtd);
        sincronizarStorageComPagina();
    }
    atualizarBadge();
    atualizarSubtotal();
}

function carregarCarrinho() {
    if (!cartApi) return;

    const conteiner = document.querySelector('.cartItens');
    const itens = cartApi.getCart();
    if (!itens || itens.length === 0) return;

    itens.forEach(item => {
        const produtoHTML = `
            <article class="cartItem">
            <div class="d-flex">
            <img src="${item.img}" alt="${item.nome}" />
            <div class="itemDetails">
                <h3 class="cardTitle">${item.nome}</h3>
                <p><small>Variante: Vermelho , 42</small></p>
            </div>
            </div>
                <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                <div class="d-flex justify-content-between">
                <div class="quantityControl">
                <button class="decrease btnOutline">-</button>
                <span class="quantity">${item.qtd}</span>
                <button class="increase btnOutline">+</button>
                <button class="remove btnOutline"><i class="bi bi-trash"></i></button>
                </div>
                <p class="subTotal red cardTitle">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            </article>
        `;
        conteiner.insertAdjacentHTML('beforeend', produtoHTML);
    });

    atualizarBadge();
    atualizarSubtotal();
}