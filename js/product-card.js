import { getAllProducts } from "./products/useProducts.js";
import { iniciarCarrossel } from "./section-carousel.js";

// cria card produto
export function criarCardProduto(produto) {
  
  const imagemPrincipal = produto.images && produto.images.length > 0 ? produto.images[0] : '/assets/media/img/default.png';
  const temDesconto = !produto.noDiscount;

  return `
    <article class="slider-item">
    <a href="/produto/index.html?id=${produto.id}" class="linkCardProduto text-decoration-none" itemprop="item">
      <div class="card h-100">
        ${temDesconto ? `
          <span class="badge text-badge position-absolute top-0 start-0 m-2">
            <img src="/assets/media/icons/icone-desconto.svg" class="icone-badge" alt="icone desconto"> 
            -${Math.round(produto.discountPercentage)}%
          </span>
        ` : ''}

        <img src="${imagemPrincipal}" class="cardImgProduto card-img-top" alt="${produto.name}" />

        <div class="card-body">
          <h3 class="card-title font20 mb-2 cardTitle">${produto.name}</h3>
          ${temDesconto ? `<p class="card-text preco-antigo txtMuted mb-0"><s>R$ ${produto.price.toFixed(2)}</s></p>` : ''}
          <span class="subTitleCard txtDark" itemprop="price">R$ ${(temDesconto ? produto.discount : produto.price).toFixed(2)} <sub>no PIX</sub></span>
        </div>
      </div>
      </a>
    </article>
  `;
}

// capturar o ID do produto selecionado a partir da URL
const parametros = new URLSearchParams(window.location.search);

const idProduto = parametros.get('id'); 

console.log("O ID do produto clicado é:", idProduto);

import { getProductById } from "../js/products/useProducts.js";

async function carregarDetalhesDoProduto() {
  try {
    
    const produto = await getProductById(idProduto);
    
    console.log("Dados do produto recebidos:", produto);
    
    
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
  }
}

carregarDetalhesDoProduto();


//  Homepage - Ofertas da Semana
async function renderizarOfertas() {
  const sliderWrapper = document.getElementById('sliderWrapper');
  const btnLeft = document.getElementById('btnLeftUnits');
  const btnRight = document.getElementById('btnRightUnits');
  const sliderTrack = document.getElementById('sliderTrack');
  if (!sliderTrack || !sliderWrapper || !btnLeft || !btnRight) return;

  try {
    const todosProdutos = await getAllProducts();
    // filtra produtos com desconto
    const ofertas = todosProdutos.filter(p => p.noDiscount === false).slice(0, 10);

    sliderTrack.innerHTML = ''; 
    
    ofertas.forEach(produto => {
      sliderTrack.innerHTML += criarCardProduto(produto);
    });

    setTimeout(() => {
      iniciarCarrossel("sliderWrapper", "btnLeftUnits", "btnRightUnits");
    }, 100);

    iniciarCarrossel("sliderWrapper", "btnLeftUnits", "btnRightUnits");

  } catch (erro) {
    console.error("Erro ao carregar as ofertas:", erro);
    sliderTrack.innerHTML = '<p style="padding: 2rem;">Não foi possível carregar as ofertas. Tente novamente.</p>';
  }

}


//  Homepage - Mais Vendidos
async function renderizarMaisVendidos() {
  const sliderWrapper = document.getElementById('sliderWrapperBestSellers');
  const btnLeft = document.getElementById('btnLeftBestSellers');
  const btnRight = document.getElementById('btnRightBestSellers');
  const sliderTrack = document.getElementById('sliderTrackBestSellers');
  if (!sliderTrack || !sliderWrapper || !btnLeft || !btnRight) return;

  try {
    const todosProdutos = await getAllProducts();
    
    const maisVendidos = todosProdutos.filter(p => p.noDiscount === true).slice(0, 10);

    sliderTrack.innerHTML = '';
    
    maisVendidos.forEach(produto => {
      sliderTrack.innerHTML += criarCardProduto(produto);
    });

    
    setTimeout(() => {
      iniciarCarrossel("sliderWrapperBestSellers", "btnLeftBestSellers", "btnRightBestSellers");
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
      iniciarCarrossel("sliderWrapperCompreJunto", "btnLeftCompreJunto", "btnRightCompreJunto");
    }, 150);

  } catch (erro) {
    console.error("Erro ao carregar produtos para compre junto:", erro);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarOfertas(); 
  renderizarMaisVendidos();
});