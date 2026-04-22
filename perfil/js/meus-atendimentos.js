document.getElementById("voltar").addEventListener("click", function() {
    window.location.href = "perfil.html"; 
});


import { getProductById } from "/js/products/useProducts.js";

document.addEventListener("DOMContentLoaded", async () => {
    const containerAtendimentos = document.getElementById("containerAtendimentos");

    const chamadosAPI = [
        {
            id: "1001",
            productId: "1.1", 
            tipoProblema: "defeito",
            status: "Em andamento",
            detalheCliente: "veio com o tecido descascado." 
        },
        {
            id: "1002",
            productId: "2.1", 
            tipoProblema: "entrega_incompleta",
            status: "Sob análise",
            detalheCliente: "recebi apenas uma parte do kit."
        },
        {
            id: "1003",
            productId: "3.1",
            tipoProblema: "estorno",
            status: "Resolvido",
            detalheCliente: "não identifiquei o valor na fatura."
        }
    ];

    function gerarTextosChamado(tipoProblema, nomeProduto, detalheCliente) {
        let motivo = "";
        let situacao = "";
        let descricao = "";

        switch (tipoProblema) {
            case "defeito":
                motivo = "Problema com o produto";
                situacao = "Aguardando resposta do vendedor.";
                descricao = `O produto "${nomeProduto}" apresentou defeito: ${detalheCliente}`;
                break;
            case "entrega_incompleta":
                motivo = "Pedido incompleto";
                situacao = "Analisando imagens enviadas.";
                descricao = `Na entrega do item "${nomeProduto}", o cliente relatou: ${detalheCliente}`;
                break;
            case "estorno":
                motivo = "Dúvida sobre Pagamento/Estorno";
                situacao = "Encaminhado ao setor financeiro.";
                descricao = `Referente à compra de "${nomeProduto}", o cliente informou que ${detalheCliente}`;
                break;
            default:
                motivo = "Dúvida geral";
                situacao = "Em triagem.";
                descricao = `Atendimento referente ao produto "${nomeProduto}".`;
        }
        return { motivo, situacao, descricao };
    }

    function getBadgeClass(status) {
        if (status === "Resolvido") return "bg-success";
        if (status === "Sob análise") return "bg-info text-dark";
        return "bg-warning text-dark"; 
    }

    try {
        containerAtendimentos.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
                <p class="text-muted mt-2">Carregando seus atendimentos...</p>
            </div>
        `;

        if (chamadosAPI.length === 0) {
            containerAtendimentos.innerHTML = `<p class="text-center text-muted py-5">Você não possui chamados em aberto.</p>`;
            return;
        }

        let htmlFinal = "";

        for (const chamado of chamadosAPI) {
            let imgProduto = "/assets/media/img/default.png";
            let nomeProduto = "Produto Indisponível";

            if (chamado.productId) {
                try {
                    const produtoReal = await getProductById(chamado.productId);
                    if (produtoReal) {
                        nomeProduto = produtoReal.name;
                        imgProduto = (produtoReal.images && produtoReal.images.length > 0) 
                                     ? produtoReal.images[0] 
                                     : imgProduto;
                    }
                } catch (err) {
                    console.warn(`Produto ID ${chamado.productId} não encontrado.`);
                }
            }

            const textos = gerarTextosChamado(chamado.tipoProblema, nomeProduto, chamado.detalheCliente);
            const badgeClass = getBadgeClass(chamado.status);

            htmlFinal += `
                <article class="atendimento-card">
                    <img src="${imgProduto}" alt="${nomeProduto}" />
                    <ul>
                        <li>
                            <strong>Status:</strong> <span class="badge ${badgeClass}">${chamado.status}</span>
                        </li>
                        <li>
                            <strong>Motivo do chamado:</strong> ${textos.motivo}
                        </li>
                        <li>
                            <strong>Situação do chamado:</strong> ${textos.situacao}
                        </li>
                        <li>
                            <strong>Descrição do chamado:</strong> ${textos.descricao}
                        </li>
                    </ul>
                </article>
            `;
        }

        containerAtendimentos.innerHTML = htmlFinal;

    } catch (error) {
        console.error("Erro ao renderizar chamados:", error);
        containerAtendimentos.innerHTML = `<div class="alert alert-danger text-center">Não foi possível carregar os atendimentos.</div>`;
    }
});
