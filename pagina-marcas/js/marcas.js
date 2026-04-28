import { getProductsFilter } from "/js/products/useProducts.js";
import { criarCardProduto } from "/js/product-card.js";
import { iniciarCarrossel } from "/js/section-carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  const containerDestaques = document.getElementById("containerDestaquesMarca");

  const parametrosURL = new URLSearchParams(window.location.search);
  const marcaAtual =
    document.body.getAttribute("data-marca") || parametrosURL.get("marca");

  if (!marcaAtual) {
    console.error(
      "Marca não identificada nesta página. Adicione data-marca='nome' na tag <body>.",
    );
    return;
  }

  const keyMarca = marcaAtual.toLowerCase().replace(/\s+/g, "");

  //  PRODUTOS EM DESTAQUE

  const produtoDestaques = {
    umbro: [
      {
        idProduto: "2.5",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-1.png",
        titulo: "Umbro Adamant Master<br><small>Class Pro Kintsugi</small>",
        corFundo: "#145c8f",
      },
      {
        idProduto: "1.2",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-2.png",
        titulo: "Camisa England 1998 com 30% OFF",
        corFundo: "#c10000",
      },
      {
        idProduto: "1.3",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-3.png",
        titulo: "Conheça a Umbro PRO 5 Stable",
        corFundo: "#240746",
      },
    ],
    nike: [
      {
        idProduto: "2.5",
        imagem: "/assets/media/images/marcas/nike/card-nike-1.png",
        titulo: "Air Jordan 5 Retro OG <br><small>White Metallic</small>",
        corFundo: "#0d0f14",
      },
      {
        idProduto: "1.2",
        imagem: "/assets/media/images/marcas/nike/card-nike-2.png",
        titulo: "Conheça o Nike Pegasus 42",
        corFundo: "#9c1521",
      },
      {
        idProduto: "1.3",
        imagem: "/assets/media/images/marcas/nike/card-nike-3.png",
        titulo: "Camisa do Galo Nike II 26/27 <br><small>Torcedor Pro</small>",
        corFundo: "#080c14",
      },
    ],
    adidas: [
      {
        idProduto: "2.5",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-1.png",
        titulo: "Umbro Adamant Master<br><small>Class Pro Kintsugi</small>",
        corFundo: "#145c8f",
      },
      {
        idProduto: "1.2",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-2.png",
        titulo: "Camisa England 1998 com 30% OFF",
        corFundo: "#c10000",
      },
      {
        idProduto: "1.3",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-3.png",
        titulo: "Conheça a Umbro PRO 5 Stable",
        corFundo: "#23083d",
      },
    ],
    puma: [
      {
        idProduto: "2.5",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-1.png",
        titulo: "Umbro Adamant Master<br><small>Class Pro Kintsugi</small>",
        corFundo: "#145c8f",
      },
      {
        idProduto: "1.2",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-2.png",
        titulo: "Camisa England 1998 com 30% OFF",
        corFundo: "#c10000",
      },
      {
        idProduto: "1.3",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-3.png",
        titulo: "Conheça a Umbro PRO 5 Stable",
        corFundo: "#23083d",
      },
    ],
    underarmour: [
      {
        idProduto: "2.5",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-1.png",
        titulo: "Umbro Adamant Master<br><small>Class Pro Kintsugi</small>",
        corFundo: "#145c8f",
      },
      {
        idProduto: "1.2",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-2.png",
        titulo: "Camisa England 1998 com 30% OFF",
        corFundo: "#c10000",
      },
      {
        idProduto: "1.3",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-3.png",
        titulo: "Conheça a Umbro PRO 5 Stable",
        corFundo: "#23083d",
      },
    ],
    newbalance: [
      {
        idProduto: "2.5",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-1.png",
        titulo: "Umbro Adamant Master<br><small>Class Pro Kintsugi</small>",
        corFundo: "#1B628E",
      },
      {
        idProduto: "1.2",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-2.png",
        titulo: "Camisa England 1998 com 30% OFF",
        corFundo: "#B90504",
      },
      {
        idProduto: "1.3",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-3.png",
        titulo: "Conheça a Umbro PRO 5 Stable",
        corFundo: "#1B0737",
      },
    ],
  };

  // ESTRUTURA PRODUTOS EM DESTAQUE
  function renderizarDestaquesCurados(listaDestaques) {
    if (!containerDestaques || !listaDestaques) return;

    let htmlDesktop = `<div class="d-none d-md-flex w-100 marcaDestaque">`;

    listaDestaques.forEach((item) => {
      htmlDesktop += `
        <a href="/produto/index.html?id=${item.idProduto}" class="cardDestaque flex-fill text-decoration-none" style="background-color: ${item.corFundo};">
          <figure class="d-flex flex-column align-items-center justify-content-center h-100 m-0 p-4">
            <img src="${item.imagem}" alt="Destaque" class="img-fluid destaqueImg mb-4" />
            <figcaption class="destaqueTitle text-white text-center fw-medium">
              ${item.titulo}
            </figcaption>
          </figure>
        </a>
      `;
    });
    htmlDesktop += `</div>`;
    let htmlMobile = `
      <div id="carouselDestaquesMobile" class="carousel slide d-block d-md-none w-100" data-bs-ride="carousel">
        <div class="carousel-inner h-100">
    `;

    listaDestaques.forEach((item, index) => {
      const activeClass = index === 0 ? "active" : "";
      htmlMobile += `
          <div class="carousel-item h-100 ${activeClass}">
            <a href="/produto/index.html?id=${item.idProduto}" class="cardDestaque d-flex text-decoration-none" style="background-color: ${item.corFundo};">
              <figure class="d-flex flex-column align-items-center justify-content-center w-100 h-100 m-0 p-4">
                <img src="${item.imagem}" alt="Destaque" class="img-fluid destaqueImg mb-4" />
                <figcaption class="destaqueTitle text-white text-center fw-medium">
                  ${item.titulo}
                </figcaption>
              </figure>
            </a>
          </div>
      `;
    });

    htmlMobile += `
        </div>
      </div>
    `;

    containerDestaques.innerHTML = htmlDesktop + htmlMobile;
  }

  renderizarDestaquesCurados(produtoDestaques[keyMarca]);

  // CARROSEL OFERTAS
  async function renderizarOfertasDaMarca() {
    const sliderWrapper = document.getElementById("sliderWrapperOfertasMarca");
    const btnLeft = document.getElementById("btnLeftOfertasMarca");
    const btnRight = document.getElementById("btnRightOfertasMarca");
    const sliderTrack = document.getElementById("sliderTrackOfertasMarca");

    if (!sliderTrack || !sliderWrapper || !btnLeft || !btnRight) return;

    const linkVejaMais = document.querySelector(".ofertas .vejaMais");
    if (linkVejaMais) {
      linkVejaMais.href = `/busca/busca-produto.html?promocao=ofertas&marca=${marcaAtual.toLowerCase()}`;
    }

    try {
      sliderTrack.innerHTML = `
        <div class="w-100 text-center py-4">
           <div class="spinner-border text-danger" role="status"></div>
        </div>`;


      const produtosDaApi = await getProductsFilter({
        limit: 200,
        order: "desc",
      });

      const ofertasDaMarca = produtosDaApi
        .filter(
          (produto) =>
            produto.brand.toLowerCase() === marcaAtual.toLowerCase() &&
            produto.hasDiscount === true,
        )
     
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
       
        .slice(0, 10);

      sliderTrack.innerHTML = "";

      if (ofertasDaMarca.length === 0) {
        sliderTrack.innerHTML = `<p class="text-muted py-3 px-4">No momento não temos produtos da ${marcaAtual} em oferta.</p>`;
        return;
      }

      ofertasDaMarca.forEach((produto) => {
        sliderTrack.innerHTML += criarCardProduto(produto);
      });

      setTimeout(() => {
        iniciarCarrossel(
          "sliderWrapperOfertasMarca",
          "btnLeftOfertasMarca",
          "btnRightOfertasMarca",
        );
      }, 100);
    } catch (erro) {
      console.error(`Erro ao carregar as ofertas da marca:`, erro);
      sliderTrack.innerHTML =
        '<p class="text-danger py-3 px-4">Não foi possível carregar as ofertas.</p>';
    }
  }

  renderizarOfertasDaMarca();
});
