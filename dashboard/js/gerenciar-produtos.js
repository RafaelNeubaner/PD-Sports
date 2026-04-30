import { getProductsFilter } from "../../js/products/useProducts.js";

// CARD ADM
function criarCardProdutoAdmin(produto) {
  const imagem =
    produto.images && produto.images.length > 0
      ? produto.images[0]
      : "/assets/media/img/default.png";
  const precoFormatado = produto.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return `
    <article class="admin-card rounded-3 shadow-sm p-3 mb-3 d-flex align-items-center gap-3">
        <div class="admin-card-img-wrapper">
            <img src="${imagem}" alt="${produto.name}" class="admin-card-img">
        </div>
        <hgroup class="admin-card-info flex-grow-1">
            <h5 class="admin-card-title m-0 fw-medium">${produto.name}</h5>
            <span class="admin-card-id d-block mb-3">#${produto.id}</span>
            <span class="admin-card-price fw-medium">${precoFormatado}</span>
        </hgroup>
        <div class="admin-card-actions d-flex flex-column flex-md-row align-items-end align-items-md-center gap-3 gap-md-4">
            <button class="btn btn-link text-danger text-decoration-none p-0 btn-editar" 
              data-id="${produto.id}"
              data-bs-toggle="modal" 
              data-bs-target="#editarProduto">
              Editar
            </button>
            <button class="btn btn-danger btn-excluir rounded-3 px-3 py-2" data-id="${produto.id}" data-name="${produto.name}">
              Excluir
            </button>
        </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", () => {

  const linksMenu = document.querySelectorAll(
    ".admin-sidebar .nav-link, .d-md-none a[href='#loja']",
  );
  const conteudos = document.querySelectorAll("main > section");

  function ocultarTodasAsTelas() {
    conteudos.forEach((section) => section.classList.add("d-none"));
    linksMenu.forEach((link) => link.classList.remove("active"));
  }

  async function navegarPara(idTela) {
    ocultarTodasAsTelas();

    if (idTela === "#loja") {
      window.location.href = "/index.html";
      return;
    }

    const telaAlvo = document.querySelector(idTela);
    if (telaAlvo) telaAlvo.classList.remove("d-none");

    const linkAtivo = document.querySelector(
      `.admin-sidebar .nav-link[href="${idTela}"]`,
    );
    if (linkAtivo) linkAtivo.classList.add("active");

    if (idTela === "#gerenciarProdutos") {
      await listarProdutosAdmin();
    }
  }

  linksMenu.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navegarPara(link.getAttribute("href"));
    });
  });

  // EXIBIR PRODUTOS
  async function listarProdutosAdmin(termoBusca = "") {
    const containerLista = document.getElementById("listaProdutosAdmin");
    if (!containerLista) return;

    try {
      containerLista.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-danger" role="status"></div>
                    <p class="text-muted mt-2">Buscando produtos...</p>
                </div>`;


      let produtos = await getProductsFilter({query: termoBusca});

      console.log(produtos)
      containerLista.innerHTML = "";

      if (!produtos || produtos.length === 0) {
        containerLista.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-box-seam fs-1 d-block mb-3 text-muted"></i>
                        <p class="text-muted">Nenhum produto encontrado.</p>
                    </div>`;
        return;
      }

      produtos.forEach((produto) => {
        const div = document.createElement("div");
        div.innerHTML = criarCardProdutoAdmin(produto);
        containerLista.appendChild(div);
      });

      ativarBotoesExclusao();
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      containerLista.innerHTML =
        '<p class="text-danger text-center py-4">Erro ao carregar os produtos. Tente novamente.</p>';
    }
  }

  // EXCLUIR PRODUTO
  async function deletarProdutoDireto(idComposto) {
    const BASE_URL = "https://69c284407518bf8facbe9c12.mockapi.io/api/";
    const partes = idComposto.split(".");
    const idApenas = partes[0];
    const endpoint = partes[1] === "2" ? "product2" : "product";

    const response = await fetch(`${BASE_URL}${endpoint}/${idApenas}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao deletar na API");
    return await response.json();
  }

  function ativarBotoesExclusao() {
    const botoesExcluir = document.querySelectorAll(".btn-excluir");

    botoesExcluir.forEach((botao) => {
      botao.addEventListener("click", async (event) => {
        const btn = event.currentTarget;
        const idProduto = btn.getAttribute("data-id");
        const nomeProduto = btn.getAttribute("data-name");

        const confirmacao = confirm(
          `⚠️ ATENÇÃO!!!\nTem certeza que deseja EXCLUIR "${nomeProduto}"?`,
        );

        if (confirmacao) {
          const textoOriginal = btn.innerHTML;

          try {
            btn.innerHTML =
              '<span class="spinner-border spinner-border-sm"></span>...';
            btn.disabled = true;

            await deletarProdutoDireto(idProduto);

            const card = btn.closest("article");
            card.style.transition = "opacity 0.3s ease";
            card.style.opacity = "0";
            setTimeout(() => card.remove(), 300);
          } catch (error) {
            console.error(error);
            alert(
              "Ocorreu um erro ao tentar excluir o produto.",
            );
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
          }
        }
      });
    });
  }

  const buscaInput = document.getElementById("buscaInput");
  let timeoutBusca;

  if (buscaInput) {
    const formBusca = buscaInput.closest("form");
    if (formBusca) {
      formBusca.addEventListener("submit", (e) => e.preventDefault());
    }

    buscaInput.addEventListener("input", (e) => {
      const termo = e.target.value;
      clearTimeout(timeoutBusca);

      timeoutBusca = setTimeout(() => {
        listarProdutosAdmin(termo);
      }, 500);
    });
  }

  navegarPara("#dashboard");
});
