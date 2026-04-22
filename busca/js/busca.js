import { getProductsFilter } from "../../js/products/useProducts.js";
import { criarCardProduto } from "/js/product-card.js";
import { sincronizarCheckboxes, iniciarFiltrosLateral } from "./filtros.js";

async function carregarVitrine() {
  const params = new URLSearchParams(window.location.search);

  sincronizarCheckboxes(params);

  const query = params.get("query")
  const promocao = params.get("promocao");
  const categorias = params.getAll("categoria").map(c => c.toLowerCase());
  const generos = params.getAll("genero").map(g => g.toLowerCase());
  const marcas = params.getAll("marca").map(m => m.toLowerCase());

  const containerGrid = document.getElementById("gridProdutosBusca");
  const tituloH1 = document.getElementById("tituloBusca");
  let tituloDinamico = "Resultado da Busca";

  try {
    if (containerGrid) {
      containerGrid.innerHTML = '<div class="col-12 text-center py-5 w-100"><div class="spinner-border text-danger" role="status"></div><p class="mt-2 text-muted">Buscando produtos...</p></div>';
    }


    // BUSCA NA API
    let parametrosAPI = { limit: 100 }; 

    if (categorias.length === 1 && !categorias.includes("esportes")) {
      const catLimpa = categorias[0] === "academia" ? "musculacao" : categorias[0];
      parametrosAPI.category = catLimpa.charAt(0).toUpperCase() + catLimpa.slice(1); 
    }
    if (generos.length === 1) {
      parametrosAPI.gender = generos[0].charAt(0).toUpperCase() + generos[0].slice(1);
    }
    if (query){
      parametrosAPI.query = query
    }

    let produtosApi = await getProductsFilter(parametrosAPI);
    let produtosFiltrados = produtosApi;


    // PROMOÇÃO E BANNERS 
    if (promocao === "ofertas") {
      tituloDinamico = "Ofertas da Semana";

      produtosFiltrados = produtosApi.filter(p => !p.noDiscount).slice(0, 12);
    } 
    else if (promocao === "banner1") {
      tituloDinamico = "Destaques da Temporada (Até 50% OFF)";
      const contadorCategoria = {};
      const preFiltrados = produtosApi.filter(p => !p.noDiscount && p.discountPercentage <= 50);
      produtosFiltrados = preFiltrados.filter((p) => {
        contadorCategoria[p.category] = (contadorCategoria[p.category] || 0) + 1;
        return contadorCategoria[p.category] <= 2;
      }).slice(0, 30);
    } 
    else if (promocao === "banner2") {
      tituloDinamico = "Especial Futebol";
      produtosFiltrados = produtosApi.filter(p => p.category.toLowerCase() === "futebol" && !p.noDiscount && p.discountPercentage >= 14);
    } 
    else if (promocao === "cta") {
      tituloDinamico = "Liquidação de Performance (+15% OFF)";
      produtosFiltrados = produtosApi.filter(p => !p.noDiscount && p.discountPercentage >= 15);
    } 
    else if (promocao === "mais-vendidos") {
      tituloDinamico = "Mais Vendidos";
      produtosFiltrados = produtosApi.sort(() => 0.5 - Math.random()).slice(0, 12);
    }

    // ESPORTES
    else if (categorias.includes("esportes")) {
      tituloDinamico = "Todas as Modalidades";
      const categoriasVistas = new Set();
      produtosFiltrados = produtosApi.filter((p) => {
        if (!categoriasVistas.has(p.category)) {
          categoriasVistas.add(p.category);
          return true;
        }
        return false;
      }).slice(0, 15);
    }

    // FILTROS ASIDE 
    else {
      let titulosParaOHeader = [];

      if (marcas.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(p => marcas.includes(p.brand.toLowerCase()));
        titulosParaOHeader.push(...marcas);
      }

      if (generos.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(p => generos.includes(p.gender.toLowerCase()));
        titulosParaOHeader.push(...generos);
      }

      if (categorias.length > 0 && !categorias.includes("esportes")) {
        const removerAcentos = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const categoriasBuscadas = categorias.map(c => c === "academia" ? "musculacao" : c);

        produtosFiltrados = produtosFiltrados.filter((p) => {
          return categorias.includes(p.category.toLowerCase()); 
        });

        const dicionarioDeTitulos = {
          musculacao: "Musculação", natacao: "Natação", basquete: "Basquete",
          volei: "Vôlei", tenis: "Tênis", futebol: "Futebol", corrida: "Corrida",
          "artes marciais": "Artes Marciais", hipismo: "Hipismo",
        };

        const titulosCategorias = categoriasBuscadas.map(c => dicionarioDeTitulos[c] || c);
        titulosParaOHeader.push(...titulosCategorias);
      }

      if (titulosParaOHeader.length > 0) {
        tituloDinamico = titulosParaOHeader
          .slice(0, 3)
          .map(t => t.charAt(0).toUpperCase() + t.slice(1))
          .join(", ");
        if (titulosParaOHeader.length > 3) tituloDinamico += " e mais...";
      }
    }

    if (tituloH1) tituloH1.textContent = tituloDinamico;
    renderizarGrid(produtosFiltrados, containerGrid);

  } catch (error) {
    console.error("Erro na busca:", error);
    if (containerGrid) {
      containerGrid.innerHTML = '<div class="col-12 text-center py-5 w-100"><p class="text-danger">Erro ao carregar os produtos. Verifique sua conexão.</p></div>';
    }
  }
}

function renderizarGrid(produtos, containerGrid) {
  if (!containerGrid) return;
  containerGrid.innerHTML = "";

  if (produtos.length === 0) {
    containerGrid.innerHTML = `
            <div class="col-12 text-center py-5 w-100">
                <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                <h4 class="text-muted">Nenhum produto encontrado com estes filtros.</h4>
            </div>`;
    return;
  }

  produtos.forEach((produto) => {
    const col = document.createElement("div");
    col.className = "col";
    const cardPronto = criarCardProduto(produto);

    if (cardPronto) {
      col.innerHTML = cardPronto;
      containerGrid.appendChild(col);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarFiltrosLateral(carregarVitrine);
  carregarVitrine();
  window.addEventListener('popstate', carregarVitrine);
});