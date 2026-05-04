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
        idProduto: "76.2",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-1.png",
        titulo: "Umbro Adamant Master<br><small>Class Pro Kintsugi</small>",
        corFundo: "#145c8f",
      },
      {
        idProduto: "77.2",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-2.png",
        titulo: "Camisa Umbro Seleção Inglaterra <br><small>Retrô Home 1998</small>",
        corFundo: "#c10000",
      },
      {
        idProduto: "22.1",
        imagem: "/assets/media/images/marcas/umbro/card-umbro-3.png",
        titulo: "Conheça a Umbro PRO 5 Stable",
        corFundo: "#240746",
      },
    ],
    nike: [
      {
        idProduto: "52.2",
        imagem: "/assets/media/images/marcas/nike/card-nike-1.png",
        titulo: "Air Jordan 5 Retro OG <br><small>White Metallic</small>",
        corFundo: "#0d0f14",
      },
      {
        idProduto: "53.2",
        imagem: "/assets/media/images/marcas/nike/card-nike-2.png",
        titulo: "Conheça o Nike Pegasus 42",
        corFundo: "#9c1521",
      },
      {
        idProduto: "54.2",
        imagem: "/assets/media/images/marcas/nike/card-nike-3.png",
        titulo: "Camisa do Galo Nike II 26/27 <br><small>Torcedor Pro</small>",
        corFundo: "#080c14",
      },
    ],
    adidas: [
      {
        idProduto: "62.2",
        imagem: "/assets/media/images/marcas/adidas/card-adidas-1.png",
        titulo: "Camisa I Real Madrid 25/26<br><small>Versão Jogador </small>",
        corFundo: "#ad8820"
      },
      {
        idProduto: "63.2",
        imagem: "/assets/media/images/marcas/adidas/card-adidas-2.png",
        titulo: "Adizero Drive RC M",
        corFundo:  "#ca4a17e3"
      },
      {
        idProduto: "64.2",
        imagem: "/assets/media/images/home/categoria-destaque-1.png",
        titulo: "Conheça a Bola Adidas Trionda Pro<br><small>Copa do Mundo da FIFA 26™</small>",
        corFundo: "#1a6dbbbd"
      },
    ],
    puma: [
      {
        idProduto: "58.2",
        imagem: "/assets/media/images/marcas/puma/card-puma-1.png",
        titulo: "Tênis de Corrida Feminino<br><small>MagMax NITRO™ 2</small>",
        corFundo: "#145c8f",
      },
      {
        idProduto: "59.2",
        imagem: "/assets/media/images/marcas/puma/card-puma-2.png",
        titulo: "Jaqueta BMW M Masculina<br><small>Motorsport Garage Crew</small>",
        corFundo: "#c10000",
      },
      {
        idProduto: "60.2",
        imagem: "/assets/media/images/marcas/puma/card-puma-3.png",
        titulo: "Camiseta Mclaren Masculina<br><small>Racing Graphic</small>",
        corFundo: "#c9621d",
      },
    ],
    underarmour: [
      {
        idProduto: "72.2",
        imagem: "/assets/media/images/marcas/underarmour/card-underarmour-1.png",
        titulo: "Tênis de Corrida Under Armour <br><small>Charged Wing 2 </small>",
        corFundo: "#336991c5",
      },
      {
        idProduto: "73.2",
        imagem: "/assets/media/images/marcas/underarmour/card-underarmour-2.png",
        titulo: "Tênis de Corrida Under Armour <br><small>Velociti Distance</small>",
        corFundo: "#ad5820",
      },
      {
        idProduto: "74.2",
        imagem: "/assets/media/images/marcas/underarmour/card-underarmour-3.png",
        titulo: "Bota Militar Under Armour <br><small>Charged Valsetz</small>",
        corFundo: "#2f6394",
      },
    ],
    newbalance: [
      {
        idProduto: "68.2",
        imagem: "/assets/media/images/marcas/newbalance/card-newbalance-1.png",
        titulo: "Tênis New Balance Masculino<br><small>Nb Numeric 440 V2</small>",
        corFundo: "#8e451b"
        
      },
      {
        idProduto: "69.2",
        imagem: "/assets/media/images/marcas/newbalance/card-newbalance-2.png",
        titulo: "Jaqueta New Balance Masculina<br><small>Numeric Archive </small>",
        corFundo: "#1b3f5c"
        
      },
      {
        idProduto: "70.2",
        imagem: "/assets/media/images/marcas/newbalance/card-newbalance-3.png",
        titulo: "Tênis New Balance Arishiv4 Feminino<br><small>Tecnologia Fresh Foam</small>",
        corFundo: "#11104bda"
      },
    ],
  };

  // ESTRUTURA PRODUTOS EM DESTAQUE
  function renderizarDestaques(listaDestaques) {
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

  renderizarDestaques(produtoDestaques[keyMarca]);

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
        sliderTrack.innerHTML = `<p class="textMuted py-3 px-4">No momento não temos produtos da ${marcaAtual} em oferta.</p>`;
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
