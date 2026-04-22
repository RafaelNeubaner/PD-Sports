import { calcularFrete, getLocationByCEP } from '../../js/fretes/useFretes.js'

const CART_STORAGE_KEY = 'pd-sports-cart';

var freteVal = 0;
var subtotal = 0;

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

function buildCartItemKey(item) {
    return `${item.id}::${item.variant || ''}`;
}

window.PDSportsCart = window.PDSportsCart || {
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
    removeFromCart: (id, quantidade = 1, variant = '') => {
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
    getTotalItens: () => getCartStorage().reduce((total, item) => total + (item.qtd || 0), 0),
    atualizarBadgeGlobal: () => {
        const total = String(window.PDSportsCart.getTotalItens());
        document.querySelectorAll('.cart-badge').forEach((badge) => {
            badge.textContent = total;
        });
    }
};

const cartBadge = document.querySelector('.cart-badge');
const carrinho = document.getElementById('carrinho');
const cartApi = window.PDSportsCart;
let quantidadeCarrinho = 0;

function getProdutoDados(produto) {
    const nome = produto.querySelector('h3.cardTitle, h3, h4')?.textContent?.trim() || 'Produto';
    const id = produto.getAttribute('data-id') || (cartApi?.parseProduto ? cartApi.parseProduto(nome) : nome.toLowerCase().replace(/\s+/g, '-'));
    const precoTexto = produto.querySelector('.prodPrice')?.textContent || 'R$ 0,00';
    const preco = cartApi?.parseValor ? cartApi.parseValor(precoTexto) : 0;
    const img = produto.querySelector('img')?.getAttribute('src') || '';
    const qtd = parseInt(produto.querySelector('.quantity')?.textContent || '0', 10) || 0;
    const variant = produto.querySelector('.cartVariant')?.textContent?.replace(/^Variante:\s*/i, '').trim() || '';

    return { id, nome, preco, img, qtd, variant };
}

function sincronizarQuantidadeCarrinho() {
    if (cartApi) {
        quantidadeCarrinho = cartApi.getTotalItens();
        return;
    }
    quantidadeCarrinho = 0;
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

        const itemKey = buildCartItemKey(item);

        const existente = totais.get(itemKey);
        if (existente) {
            existente.qtd += item.qtd;
        } else {
            totais.set(itemKey, {
                id: item.id,
                nome: item.nome,
                preco: item.preco,
                qtd: item.qtd,
                img: item.img,
                variant: item.variant || '',
                cartKey: itemKey
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
    calcularTotal()
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
        cartApi.addToCart({ id: item.id, nome: item.nome, preco: item.preco, img: item.img, variant: item.variant }, 1);
    }

    atualizarSubtotal();
    atualizarBadge();
    calcularTotal();
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
            cartApi.removeFromCart(item.id, 1, item.variant);
        }
    }

    if (qtd === 0) {
        produto.remove();
        if (cartApi) {
            sincronizarStorageComPagina();
        }
    }

    atualizarBadge();
    atualizarSubtotal();
    calcularTotal();
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
    const formulario = carrinho.querySelector('#formulario');

    if (quantidadeCarrinho === 0) {
        if (resumo) {
            resumo.style.display = 'none';
        }
        if (formulario) {
            formulario.style.display = 'none';
        }

        if (!textoVazio) {
            const texto = document.createElement('p');
            texto.className = 'carrinho-vazio';
            texto.textContent = 'Seu carrinho está vazio';
            carrinho.appendChild(texto);
        }
    } else {
        if (textoVazio) {
            textoVazio.remove();
        }
        if (resumo) {
            resumo.style.display = 'flex';
        }
        if (formulario) {
            formulario.style.display = 'block';
        }
    }
}

function atualizarSubtotal() {
    subtotal = 0;
    document.querySelectorAll('.cartItem').forEach(produto => {
        let subtotalProduto = parseFloat(produto.querySelector('.subTotal').textContent.replace('R$', '').replace(',', '.'));
        subtotal += subtotalProduto;
    });
    let subtotalElement = document.querySelector('.resumo .span2');
    if (!subtotalElement) return;
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

function calcularTotal() {
    let total = 0
    console.log(typeof total)
    if (subtotal) total += subtotal;
    console.log(typeof total)
    console.log(typeof freteVal)
    if (freteVal) total += freteVal;
    console.log(typeof total)

    document.querySelector(".precoTotal").textContent = total.toLocaleString("pt-BR", { currency: "BRL", style: "currency" })
    console.log(total)
}

function exibirModalCompraConcluida() {
    if (!carrinho) return;
    carrinho.classList.add('checkout-completed');
}

const botaoFinalizarCompra = carrinho?.querySelector('.resumo .buyNowButton');
if (carrinho && botaoFinalizarCompra) {
    botaoFinalizarCompra.addEventListener('click', () => {
        const audioCompraFinalizada = document.getElementById('audio-compra-finalizada');
        if (audioCompraFinalizada) {
            audioCompraFinalizada.currentTime = 0;
            audioCompraFinalizada.play().catch(() => { });
        }

        if (cartApi) {
            cartApi.clearCart();
        }
        document.querySelectorAll('.cartItem').forEach((produto) => produto.remove());
        quantidadeCarrinho = 0;
        atualizarBadge();
        atualizarSubtotal();
        exibirModalCompraConcluida();
    });
}

function removerItem(event) {
    let produto = event.currentTarget.closest('.cartItem');
    if (!produto) return;

    const item = getProdutoDados(produto);

    produto.remove();
    if (cartApi) {
        cartApi.removeFromCart(item.id, item.qtd, item.variant);
        sincronizarStorageComPagina();
    }
    atualizarBadge();
    atualizarSubtotal();
    calcularTotal();
}

function carregarCarrinho() {
    if (!cartApi) return;

    const conteiner = document.querySelector('.cartItens');
    if (!conteiner) return;
    const itens = cartApi.getCart();
    if (!itens || itens.length === 0) return;

    itens.forEach(item => {
        const produtoHTML = `
            <article class="cartItem" data-id="${item.id}">
            <div class="d-flex">
            <img src="${item.img}" alt="${item.nome}" />
            <div class="itemDetails">
                <h3 class="cardTitle">${item.nome}</h3>
                ${item.variant ? `<p class="cartVariant"><small>Variante: ${item.variant}</small></p>` : ''}
                <p class="prodPrice">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            </div>
            <div class="d-flex justify-content-between">
                <div class="quantityControl d-flex ">
                    <div class="controls">
                        <button class="decrease btnOutline">-</button>
                        <span class="quantity">${item.qtd}</span>
                        <button class="increase btnOutline">+</button>
                    </div>
                    <button class="remove btnOutline"><i class="bi bi-trash"></i></button>
                </div>
                <p class="subTotal red subTitleCard">R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</p>
            </div>
            </article>
        `;
        conteiner.insertAdjacentHTML('beforeend', produtoHTML);
    });

    atualizarBadge();
    atualizarSubtotal();
    calcularTotal();
}
/*
document.querySelector(".btnCalcularFrete").addEventListener('click', calculateFrete)
document.querySelector("#formFrete").addEventListener('submit', (event) => {
    event.preventDefault()
    calculateFrete()
})*/


const cepInput = document.querySelector("#cepInput")
var freteTemp
window.addEventListener("DOMContentLoaded", () => {
    const savedCEP = localStorage.getItem("LAST_CEP")
    cepInput.addEventListener('blur', async () => {
        getCEP()
        calculateFrete()
    })
    let selectedFrete = null
    cepInput.value = savedCEP
    freteTemp = document.getElementById("tempFreteOption")

    if (cepInput.value) {
        calculateFrete()
        getCEP()
    }

})

var isLoading = false;
async function calculateFrete() {
    console.log(freteTemp)
    if (!cepInput || !freteTemp || !cartApi) return;
    if (isLoading) return
    const cep = cepInput.value
    console.log(cep)
    if (!cep) return;

    localStorage.setItem("LAST_CEP", cep)
    isLoading = true
    const fretesSec = document.querySelector(".fretesOptions")
    if (!fretesSec) {
        isLoading = false;
        return;
    }
    fretesSec.replaceChildren()
    fretesSec.textContent = "Carregando..."

    //document.querySelector(".btnCalcularFrete").textContent = "Carregando..."
    const fretesOptions = await calcularFrete(cep, cartApi.getTotalItens())
    isLoading = false
    //document.querySelector(".btnCalcularFrete").textContent = "Calcular"
    if (!Array.isArray(fretesOptions) || fretesOptions.length === 0) {
        fretesSec.textContent = 'Nao foi possivel calcular o frete.';
        return;
    }

    fretesSec.replaceChildren()
    fretesOptions.forEach(frete => {
        if (frete.error) return;
        const li = freteTemp.content.cloneNode(true)

        li.querySelector("input").id = `${frete.name}Op`
        li.querySelector("label").setAttribute("for", `${frete.name}Op`)
        li.querySelector("img").src = frete.company.picture
        li.querySelector("h4").textContent = frete.name
        li.querySelector("p").textContent = `${frete.currency} ${frete.price.toString().replace(".", ",")}`

        li.querySelector("input").addEventListener("change", (event) => {
            freteVal = Number(frete.price)
            document.querySelector(".precoFrete").textContent = `${frete.currency} ${frete.price.toString().replace(".", ",")}`
            calcularTotal()
        })

        fretesSec.appendChild(li)
    })

    if (!fretesSec.firstElementChild) return;

    fretesSec.firstElementChild.querySelector("input").setAttribute("checked", true)
    document.querySelector(".precoFrete").textContent = fretesSec.firstElementChild.querySelector("p").textContent
    freteVal = Number(fretesOptions[0].price)
    calcularTotal()
}

var isLoadingCEP = false
async function getCEP() {
    if (isLoadingCEP) return
    const cep = cepInput.value
    if (!cep) return;

    isLoadingCEP = true;

    const location = await getLocationByCEP(cep)

    document.getElementById("ruaInput").value = location.logradouro
    document.getElementById("bairroInput").value = location.bairro
    document.getElementById("cidadeInput").value = location.localidade
    document.getElementById("estadoInput").value = location.estado
    document.getElementById("numeroInput").focus()
    isLoadingCEP = false
}