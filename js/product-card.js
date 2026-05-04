import { getAllProducts, getProductById, getProductsFilter } from "./products/useProducts.js";
import { iniciarCarrossel } from "./section-carousel.js";

// CRIA CARD PRODUTO

export function criarCardProduto(produto) {
  const imagemPrincipal =
    produto.images && produto.images.length > 0
      ? produto.images[0]
      : "/assets/media/img/default.png";
  const temDesconto = produto.hasDiscount;

  const formatarPreco = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return `
    <article class="slider-item">
    <a href="/produto/index.html?id=${produto.id}" class="linkCardProduto text-decoration-none" itemprop="item">
      <div class="card h-100">
        ${
          temDesconto
            ? `
          <span class="badge text-badge position-absolute top-0 start-0 m-1">
            <img src="/assets/media/icons/icone-desconto.svg" class="icone-badge" alt="icone desconto"> 
            -${Math.round(produto.discountPercentage)}%
          </span>
        `
            : ""
        }

        <img src="${imagemPrincipal}" class="cardImgProduto card-img-top" alt="${produto.name}" />

        <div class="card-body">
          <h3 class="card-title font20 mb-2 cardTitle">${produto.name}</h3>
          
          <!-- AJUSTE AQUI: Removido o R$ fixo e o toFixed(2), usando a nova função -->
          ${temDesconto ? `<p class="card-text preco-antigo txtMuted mb-0"><s>${formatarPreco(produto.fullPrice)}</s></p>` : ""}
          
          <!-- AJUSTE AQUI: Removido o R$ fixo e o toFixed(2), usando a nova função -->
          <span class="subTitleCard txtDark" itemprop="price">${formatarPreco(temDesconto ? produto.price : produto.fullPrice)} <sub>no PIX</sub></span>
        </div>
      </div>
      </a>
    </article>
  `;
}

// DETALHES DO PRODUTO

const parametros = new URLSearchParams(window.location.search);
const idProduto = parametros.get("id");

async function carregarDetalhesDoProduto() {
  if (!idProduto) return;

  console.log("O ID do produto clicado é:", idProduto);

  try {
    const produto = await getProductById(idProduto);
    console.log("Dados do produto recebidos:", produto);
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
  }
}

carregarDetalhesDoProduto();

// HOMEPAGE - OFERTAS DA SEMANA

async function renderizarOfertas() {
  const sliderWrapper = document.getElementById('sliderWrapper');
  const btnLeft = document.getElementById('btnLeftUnits');
  const btnRight = document.getElementById('btnRightUnits');
  const sliderTrack = document.getElementById('sliderTrack');
  if (!sliderTrack || !sliderWrapper || !btnLeft || !btnRight) return;

  try {
    const ofertas = await getProductsFilter({
      sortBy: 'discountPercentage',
      order: 'desc',
      limit: 10
    });

    sliderTrack.innerHTML = "";

    ofertas.forEach((produto) => {
      sliderTrack.innerHTML += criarCardProduto(produto);
    });

    setTimeout(() => {
      iniciarCarrossel("sliderWrapper", "btnLeftUnits", "btnRightUnits");
    }, 100);
  } catch (erro) {
    console.error("Erro ao carregar as ofertas:", erro);
    sliderTrack.innerHTML =
      '<p style="padding: 2rem;">Não foi possível carregar as ofertas. Tente novamente.</p>';
  }
}

// HOMEPAGE - MAIS VENDIDOS

async function renderizarMaisVendidos() {
  const sliderWrapper = document.getElementById('sliderWrapperBestSellers');
  const btnLeft = document.getElementById('btnLeftBestSellers');
  const btnRight = document.getElementById('btnRightBestSellers');
  const sliderTrack = document.getElementById('sliderTrackBestSellers');
  if (!sliderTrack || !sliderWrapper || !btnLeft || !btnRight) return;

  try {
    const maisVendidos = await getProductsFilter({
      sortBy: 'qtSales',
      order: 'desc',
      limit: 10
    });

    sliderTrack.innerHTML = "";

    maisVendidos.forEach((produto) => {
      sliderTrack.innerHTML += criarCardProduto(produto);
    });

    setTimeout(() => {
      iniciarCarrossel(
        "sliderWrapperBestSellers",
        "btnLeftBestSellers",
        "btnRightBestSellers",
      );
    }, 150);
  } catch (erro) {
    console.error("Erro ao carregar mais vendidos:", erro);
  }
}

export async function compreJunto(productList) {
  const sliderTrack = document.getElementById('sliderTrackCompreJunto');
  if (!sliderTrack) return;

  try {
    sliderTrack.innerHTML = '';
    
    productList.forEach(produto => {
      sliderTrack.innerHTML += criarCardProduto(produto);
    });

    setTimeout(() => {
      iniciarCarrossel(
        "sliderWrapperCompreJunto",
        "btnLeftCompreJunto",
        "btnRightCompreJunto",
      );
    }, 150);
  } catch (erro) {
    console.error("Erro ao carregar produtos para compre junto:", erro);
  }
}

// Inicia as funções globais
document.addEventListener("DOMContentLoaded", () => {
  renderizarOfertas();
  renderizarMaisVendidos();
});
