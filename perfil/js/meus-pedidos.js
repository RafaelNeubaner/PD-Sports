
import { getProductById } from "/js/products/useProducts.js";

document.addEventListener("DOMContentLoaded", async () => {
    const containerPedidos = document.getElementById("containerPedidos");
    

    const BASE_URL = "https://69c284407518bf8facbe9c12.mockapi.io/api/";


    const idUsuarioLogado = "1"; 


    function gerarTimelineStatus() {
        return `
            <div class="timeline">
                <div class="timeline-line"></div>
                <div class="step active"><i class="bi bi-receipt-cutoff"></i></div>
                <div class="step active"><i class="bi bi-wallet2"></i></div>
                <div class="step active"><i class="bi bi-box-seam"></i></div>
                <div class="step active"><i class="bi bi-truck"></i></div>
                <div class="step active"><i class="bi bi-house-door"></i></div>
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
            // ... (Código de tela vazia original mantido)
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
                <article class="pedido-card">
                    <div class="pedido-col col-produto">
                        <figure class="produto-imagem-wrapper">
                            <img src="${imgProduto}" alt="${nomeProduto}" class="produto-imagem">
                        </figure>
                        <figcaption class="produto-nome">${nomeProduto}</figcaption>
                    </div>

                    <div class="pedido-col col-status">
                        ${gerarTimelineStatus()}
                        <div class="status-botoes">
                            <button class="btnOutline">Trocar ou devolver</button>
                            <button class="btnOutline">Baixar nota fiscal</button>
                        </div>
                    </div>

                    <div class="pedido-col col-resumo">
                        <hgroup class="resumo-header">
                            <h3 class="resumo-titulo">Resumo da compra</h3>
                            <ul class="resumo-lista">
                                <li>Pedido: <span>#${idExibicao}</span></li>
                                <li>Data do pedido: <span>${new Date(dataPedido).toLocaleDateString('pt-BR')}</span></li>
                                <li>Valor total: <span class="destaque-valor">R$ ${Number(valorTotal).toFixed(2).replace('.', ',')}</span></li>
                                <li>Pagamento: <span>${formaPagamento}</span></li>
                                <li>CEP de Entrega: <span>${cepEntrega}</span></li>
                            </ul>
                        </hgroup>
                        
                        <a href="/busca/busca-produto.html" class="btnPrimary btn-comprar-novamente">
                            Comprar novamente
                        </a>
                    </div>
                </article>
            `;
            containerPedidos.innerHTML += cardHTML;
        }

    } catch (error) {
        console.error("Erro fatal no script de pedidos:", error);
        containerPedidos.innerHTML = `<div class="alert alert-danger text-center">Não foi possível carregar o histórico de pedidos.</div>`;
    }
});