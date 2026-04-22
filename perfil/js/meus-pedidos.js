
import { getProductById } from "/js/products/useProducts.js";

document.addEventListener("DOMContentLoaded", async () => {
    const containerPedidos = document.getElementById("containerPedidos");
    

    const BASE_URL = "https://69c284407518bf8facbe9c12.mockapi.io/api/";


    const idUsuarioLogado = "1"; 


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

        const pedidosDaAPI = [
            {
                id: "998877", 
                createdAt: "2026-03-15T14:30:00Z", 
                total: "199.90",
                paymentMethod: "Cartão de Crédito",
                cep: "10100-000",
                productId: "1.1" 
            },
            {
                id: "998878",
                createdAt: "2026-02-28T09:15:00Z",
                total: "349.50",
                paymentMethod: "Pix",
                cep: "10100-000",
                productId: "2.1" 
            }
        ];

        containerPedidos.innerHTML = ""; 

        if (!pedidosDaAPI || pedidosDaAPI.length === 0) {
            containerPedidos.innerHTML = `
                <div class="text-center py-5 bg-white rounded-3 shadow-sm border">
                    <i class="bi bi-bag-x fs-1 text-muted d-block mb-3"></i>
                    <h3 class="fs-4 fw-medium">Nenhum pedido encontrado</h3>
                    <p class="text-muted">Você ainda não fez nenhuma compra conosco.</p>
                </div>`;
            return;
        }

        for (const pedido of pedidosDaAPI) {
            
            const idExibicao = pedido.id || "N/A";
            const dataPedido = pedido.createdAt || new Date().toISOString();
            const valorTotal = pedido.total || "0.00";
            const formaPagamento = pedido.paymentMethod || "Cartão";
            const cepEntrega = pedido.cep || "Não informado";
            
            let produtoReal = null;
            let nomeProduto = "Carregando Produto...";
            let imgProduto = "/assets/media/img/default.png";

            if (pedido.productId) {
                try {

                    produtoReal = await getProductById(pedido.productId);
                    
                    if (produtoReal) {
                        nomeProduto = produtoReal.name || "Produto sem nome";
                        imgProduto = (produtoReal.images && produtoReal.images.length > 0) 
                                     ? produtoReal.images[0] 
                                     : imgProduto;
                    }
                } catch (err) {
                    console.error(`Erro ao buscar detalhes do produto ID ${pedido.productId}:`, err);
                    nomeProduto = "Produto Indisponível (ID não encontrado)";
                }
            }

            // CARD PEDIDOS
            const cardHTML = `
                <article class="pedidoCard">
                    <div class="pedidoCol colProduto">
                        <figure class="produtoImagemWrapper">
                            <img src="${imgProduto}" alt="${nomeProduto}" class="produtoImagem">
                        </figure>
                        <figcaption class="produtoNome">${nomeProduto}</figcaption>
                    </div>

                    <div class="pedidoCol colStatus">
                        ${gerarTimelineStatus()}
                        <div class="statusBotoes">
                            <button type="button" class="btnOutline btnTrocarDevolver">Trocar ou devolver</button>
                            <button class="btnOutline">Baixar nota fiscal</button>
                        </div>
                    </div>

                    <div class="pedidoCol colResumo">
                        <hgroup class="resumoHeader">
                            <h3 class="resumoTitulo">Resumo da compra</h3>
                            <ul class="resumoLista">
                                <li>Pedido: <span>#${idExibicao}</span></li>
                                <li>Data do pedido: <span>${new Date(dataPedido).toLocaleDateString('pt-BR')}</span></li>
                                <li>Valor total: <span class="destaqueValor">R$ ${Number(valorTotal).toFixed(2).replace('.', ',')}</span></li>
                                <li>Pagamento: <span>${formaPagamento}</span></li>
                                <li>CEP de Entrega: <span>${cepEntrega}</span></li>
                            </ul>
                        </hgroup>
                        
                        <a href="/busca/busca-produto.html" class="btnPrimary btnComprarNovamente">
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