document.addEventListener("DOMContentLoaded", () => {
  const containerPedidos = document.getElementById("containerPedidos");

  function gerarTimelineStatus() {
    return `
            <div class="timeline">
                <div class="timelineLine"></div>
                <div class="timelineStep active"><i class="bi bi-receipt-cutoff"></i></div>
                <div class="timelineStep active"><i class="bi bi-wallet2"></i></div>
                <div class="timelineStep active"><i class="bi bi-box-seam"></i></div>
                <div class="timelineStep active"><i class="bi bi-truck"></i></div>
                <div class="timelineStep active"><i class="bi bi-house-door"></i></div>
            </div>
        `;
  }

  try {
    containerPedidos.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
                <p class="text-muted mt-2">Buscando seus pedidos...</p>
            </div>
        `;

    // PEDIDOS SALVOS
    const pedidosDoStorage =
      JSON.parse(localStorage.getItem("pd-sports-pedidos")) || [];

    containerPedidos.innerHTML = "";

    if (pedidosDoStorage.length === 0) {
      containerPedidos.innerHTML = `
                <div class="text-center py-5 bg-white rounded-3 shadow-sm border">
                    <i class="bi bi-bag-x fs-1 text-muted d-block mb-3"></i>
                    <h3 class="fs-4 fw-medium">Nenhum pedido encontrado</h3>
                    <p class="text-muted">Você ainda não fez nenhuma compra conosco.</p>
                </div>`;
      return;
    }

    // CARD PEDIDO
    for (const pedido of pedidosDoStorage) {
      const idExibicao = pedido.id || "N/A";
      const dataPedido = pedido.createdAt || new Date().toISOString();
      const valorTotal = pedido.total || "0.00";
      const formaPagamento = pedido.paymentMethod || "Cartão";
      const cepEntrega = pedido.cep || "Não informado";

      const itens = pedido.itens || [];

      let imgProduto = "/assets/media/img/default.png";
      let nomeProduto = "Pedido Vazio";
      let idParaRedirecionar = "";

      if (itens.length > 0) {
        imgProduto = itens[0].img;
        nomeProduto = itens[0].nome;
        idParaRedirecionar = itens[0].id;

        if (itens.length > 1) {
          nomeProduto += ` <br><small class="text-muted">e mais ${itens.length - 1} item(ns)</small>`;
        }
      }

      const linkComprarNovamente = idParaRedirecionar
        ? `/produto/index.html?id=${idParaRedirecionar}`
        : `/index.html`;

      const cardHTML = `
                <article class="pedidoCard">
                    <div class="pedidoCol colProduto">
                        <figure class="produtoImagemWrapper">
                            <img src="${imgProduto}" alt="Produto do Pedido" class="produtoImagem">
                        </figure>
                        <figcaption class="produtoNome">${nomeProduto}</figcaption>
                    </div>

                    <div class="pedidoCol colStatus">
                        ${gerarTimelineStatus()}
                        <div class="statusBotoes">
                            <div class="d-flex gap-3">
                                <button type="button" class="btnOutline btnTrocarDevolver">Trocar ou devolver</button>
                                <a href="/perfil/atendimentos.html?id=${idExibicao}#new" class="btnOutline btnTrocarDevolver">Abrir atendimento</a>
                            </div>
                            <button class="btnOutline">Baixar nota fiscal</button>
                        </div>
                    </div>

                    <div class="pedidoCol colResumo">
                        <hgroup class="resumoHeader">
                            <h3 class="resumoTitulo">Resumo da compra</h3>
                            <ul class="resumoLista">
                                <li>Pedido: <span>#${idExibicao}</span></li>
                                <li>Data do pedido: <span>${new Date(dataPedido).toLocaleDateString("pt-BR")}</span></li>
                                <li>Valor total: <span class="destaqueValor">R$ ${Number(valorTotal).toFixed(2).replace(".", ",")}</span></li>
                                <li>Pagamento: <span>${formaPagamento}</span></li>
                                <li>CEP de Entrega: <span>${cepEntrega}</span></li>
                            </ul>
                        </hgroup>
                        
                        <a href="${linkComprarNovamente}" class="btnPrimary btnComprarNovamente">
                            Comprar novamente
                        </a>
                    </div>
                </article>
            `;
      containerPedidos.innerHTML += cardHTML;
    }

    const modalTrocaDevolucao = document.getElementById("modalTrocaDevolucao");
    const abrirModalButtons = document.querySelectorAll(".btnTrocarDevolver");
    const fecharModalButtons = document.querySelectorAll("[data-close-modal]");

    const abrirModal = () => {
      modalTrocaDevolucao?.classList.add("show");
      document.body.classList.add("modalOpen");
    };

    const fecharModal = () => {
      modalTrocaDevolucao?.classList.remove("show");
      document.body.classList.remove("modalOpen");
    };

    abrirModalButtons.forEach((button) => {
      button.addEventListener("click", abrirModal);
    });

    fecharModalButtons.forEach((button) => {
      button.addEventListener("click", fecharModal);
    });

    modalTrocaDevolucao?.addEventListener("click", (event) => {
      if (event.target === modalTrocaDevolucao) {
        fecharModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        fecharModal();
      }
    });
  } catch (error) {
    console.error("Erro fatal no script de pedidos:", error);
    containerPedidos.innerHTML = `<div class="alert alert-danger text-center">Não foi possível carregar o histórico de pedidos.</div>`;
  }
});
