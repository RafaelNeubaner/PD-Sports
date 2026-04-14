import { getAllProducts } from "/js/products/useProducts.js";
import { criarCardProduto } from "/js/product-card.js";

async function carregarVitrine() {
  const params = new URLSearchParams(window.location.search);

  // filtros da URL
  const promocao = params.get("promocao");
  const categoria = params.get("categoria")?.toLowerCase();
  const genero = params.get("genero")?.toLowerCase();

  const containerGrid = document.getElementById("gridProdutosBusca");
  const tituloH1 = document.getElementById("tituloBusca");
  let tituloDinamico = "Resultado da Busca";

  try {
    if (containerGrid) {
      containerGrid.innerHTML =
        '<div class="col-12 text-center py-5 w-100"><div class="spinner-border text-danger" role="status"></div><p class="mt-2 text-muted">Buscando produtos...</p></div>';
    }

    let todosProdutos = await getAllProducts();
    let produtosFiltrados = [];

    // --- HEADER - ESPORTES (1 de cada esporte) ---
    if (categoria === "esportes") {
      tituloDinamico = "Todas as Modalidades";
      const categoriasVistas = new Set();
      produtosFiltrados = todosProdutos
        .filter((p) => {
          if (!categoriasVistas.has(p.category)) {
            categoriasVistas.add(p.category);
            return true;
          }
          return false;
        })
        .slice(0, 15);
    }

    // --- HOME - HERO BANNER 1 (Até 50% OFF, 2 por esporte, max 30) ---
    else if (promocao === "banner1") {
      tituloDinamico = "Destaques da Temporada (Até 50% OFF)";
      const contadorCategoria = {};

      // Filtra primeiro quem tem desconto de até 50%
      const preFiltrados = todosProdutos.filter(
        (p) => !p.noDiscount && p.discountPercentage <= 50,
      );

      produtosFiltrados = preFiltrados
        .filter((p) => {
          contadorCategoria[p.category] =
            (contadorCategoria[p.category] || 0) + 1;
          return contadorCategoria[p.category] <= 2;
        })
        .slice(0, 30);
    }

    // --- HOME - HERO BANNER 2 (Futebol com ~15% OFF) ---
    else if (promocao === "banner2") {
      tituloDinamico = "Especial Futebol";
      // Pega produtos de futebol que têm desconto
      produtosFiltrados = todosProdutos.filter(
        (p) =>
          p.category.toLowerCase() === "futebol" &&
          !p.noDiscount &&
          p.discountPercentage >= 14,
      );
    }

    // --- HOME - BANNER CTA (+15% OFF em todas categorias) ---
    else if (promocao === "cta") {
      tituloDinamico = "Liquidação de Performance (+15% OFF)";
      produtosFiltrados = todosProdutos.filter(
        (p) => !p.noDiscount && p.discountPercentage >= 15,
      );
    }

    // --- OFERTAS DA SEMANA (Qualquer desconto, limite 12) ---
    else if (promocao === "ofertas") {
      tituloDinamico = "Ofertas da Semana";
      produtosFiltrados = todosProdutos
        .filter((p) => !p.noDiscount)
        .slice(0, 12);
    }

    // --- MAIS VENDIDOS (Sorteia 12 itens aleatórios) ---
    else if (promocao === "mais-vendidos") {
      tituloDinamico = "Mais Vendidos";
      produtosFiltrados = todosProdutos
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
    }

    // GÊNERO OU CATEGORIA ESPECÍFICA ---
    else {
      produtosFiltrados = todosProdutos;

      if (genero) {
        produtosFiltrados = produtosFiltrados.filter(
          (p) => p.gender.toLowerCase() === genero,
        );
        tituloDinamico = genero.charAt(0).toUpperCase() + genero.slice(1);
      }

      if (categoria && categoria !== "esportes") {
        const removerAcentos = (texto) =>
          texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let categoriaBuscada =
          categoria === "academia" ? "musculacao" : categoria;

        produtosFiltrados = produtosFiltrados.filter((p) => {
          const categoriaDoProduto = removerAcentos(p.category.toLowerCase());
          return categoriaDoProduto === categoriaBuscada;
        });

        const dicionarioDeTitulos = {
          musculacao: "Musculação",
          natacao: "Natação",
          basquete: "Basquete",
          volei: "Vôlei",
          tenis: "Tênis",
          futebol: "Futebol",
          corrida: "Corrida",
          "artes marciais": "Artes Marciais",
          hipismo: "Hipismo",
        };

        tituloDinamico =
          dicionarioDeTitulos[categoriaBuscada] ||
          categoria.charAt(0).toUpperCase() + categoria.slice(1);
      }
    }

    if (tituloH1) tituloH1.textContent = tituloDinamico;
    renderizarGrid(produtosFiltrados, containerGrid);
  } catch (error) {
    console.error("Erro na busca:", error);
    if (containerGrid) {
      containerGrid.innerHTML =
        '<div class="col-12 text-center py-5 w-100"><p class="text-danger">Erro ao carregar os produtos. Verifique sua conexão.</p></div>';
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
  carregarVitrine();
});
