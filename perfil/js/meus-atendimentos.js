
import { abrirAtendimento, getAtendimentos } from "../../js/atendimentos/useAtendimentos.js";
import { getPedidoById } from "../../js/pedidos/usePedidos.js";
import { getUserAuthenticated } from "../../js/users/useAuth.js";
import { getProductById, getProductsFilter } from "/js/products/useProducts.js";

document.getElementById("voltar").addEventListener("click", function () {
  window.location.href = "perfil.html";
});
document.addEventListener("DOMContentLoaded", async () => {
  var inputCodPedido = document.querySelector("#codigoPedido")
  const containerAtendimentos = document.getElementById("containerAtendimentos");
  const modal = document.getElementById("modalAtendimento");
  const abrirAtendimentoBtn = document.getElementById("abrirAtendimentoBtn");
  const btnFecharModal = document.querySelector(".btn-fechar-modal");
  const formNovoAtendimento = document.getElementById("formNovoAtendimento");

  console.log(document.location.hash)
  if(document.location.hash === "#new"){
    const params = new URLSearchParams(document.location.search)
    var idPedido = params.get("id")
    document.querySelector("#codigoPedido").style.display="block"
    document.querySelectorAll(".pedidoOption").forEach(op=>op.style.display="block")
    
    inputCodPedido.value = params.get("id")
    inputCodPedido.disabled=true
    modal.showModal()
  }

  const user = await getUserAuthenticated()

  document.querySelector(".nomeCliente").textContent = `${user.firstname} ${user.lastname}`
  document.querySelector(".telefoneCliente").textContent = user.phone

  const atendimentoList = getAtendimentos()


  function gerarTextosChamado(tipoProblema, nomeProduto, detalheCliente) {
    let motivo = "";
    let situacao = "";
    let descricao = "";

    switch (tipoProblema) {
      case "defeito":
      case "devolucao":
        motivo = "Problema com o produto";
        situacao = "Aguardando resposta do vendedor.";
        descricao = `O produto "${nomeProduto}" apresentou o seguinte relato: ${detalheCliente}`;
        break;
      case "entrega":
      case "entrega_incompleta":
        motivo = "Problema com a entrega";
        situacao = "Analisando logística.";
        descricao = `Referente ao envio de "${nomeProduto}", o cliente relatou: ${detalheCliente}`;
        break;
      case "estorno":
      case "pagamento":
        motivo = "Dúvida sobre Pagamento/Estorno";
        situacao = "Encaminhado ao setor financeiro.";
        descricao = `Referente à compra de "${nomeProduto}", o cliente informou que ${detalheCliente}`;
        break;
      default:
        motivo = "Dúvida geral";
        situacao = "Em triagem.";
        descricao = `Atendimento referente a: ${detalheCliente}`;
    }
    return { motivo, situacao, descricao };
  }

  function getBadgeClass(status) {
    if (status === "Resolvido") return "bg-success";
    if (status === "Sob análise") return "bg-info text-dark";
    return "bg-warning text-dark";
  }


  async function renderizarChamados() {
    try {
      containerAtendimentos.innerHTML = `
              <div class="text-center py-5">
                  <div class="spinner-border text-danger" role="status"></div>
                  <p class="text-muted mt-2">Atualizando atendimentos...</p>
              </div>
          `;
      if (atendimentoList.length === 0) {
        containerAtendimentos.innerHTML = `<p class="text-center txtMuted py-5">Você não possui chamados em aberto.</p>`;
        return;
      }

      let htmlFinal = "";

      for (const chamado of atendimentoList) {
        let imgProduto = "../assets/media/logo/logo-dark.svg";
        let nomeProduto = "Produto Indisponível";
        console.log(chamado)
        if (chamado.idPedido) {
          try {
            var pedido = getPedidoById(chamado.idPedido)
            console.log(pedido)
            if(pedido){
              const produtoReal = await getProductById(pedido.itens[0].id);
              if (produtoReal) {
                nomeProduto = produtoReal.name;
                imgProduto =
                produtoReal.images && produtoReal.images.length > 0
                  ? produtoReal.images[0]
                  : imgProduto;
              }
            }
          } catch (err) {
            console.warn(`Produto ID ${chamado.productId} não encontrado.`);
          }
        }

        const textos = gerarTextosChamado(
          chamado.tipoProblema,
          nomeProduto,
          chamado.descricao,
        );
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
  }

  await renderizarChamados();
 
  // MODAL NOVO ATENDIMENTO
  
  if (abrirAtendimentoBtn) {
    abrirAtendimentoBtn.addEventListener("click", () => modal.showModal());
  }

  if (btnFecharModal) {
    btnFecharModal.addEventListener("click", () => modal.close());
  }

  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isInDialog) modal.close();
  });


  formNovoAtendimento.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log(!inputCodPedido.disabled)
    let inputCodigoPedido;
    if(!inputCodPedido.disabled){
      inputCodigoPedido = document.getElementById("codigoPedido").value.trim();
      if (inputCodPedido.length > 6) {
          alert("O código do pedido deve ter no máximo 6 caracteres.");
          return;
      }
    }
    const inputArea = document.getElementById("areaAtendimento").value;
    const inputDescricao = document.getElementById("descricao").value;
    

    const btnSubmit = formNovoAtendimento.querySelector("button[type='submit']");
    const textoOriginalBtn = btnSubmit.textContent;

    try {
      btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processando...';
      btnSubmit.disabled = true;


      const listaDeProdutos = await getProductsFilter({ limit: 50, page: 1, order: 'desc' });

      if (!listaDeProdutos || listaDeProdutos.length === 0) {
          throw new Error("O banco de dados de produtos está vazio.");
      }
      const indiceSorteado = Math.floor(Math.random() * listaDeProdutos.length);
      const produtoSorteado = listaDeProdutos[indiceSorteado];
      
      const idDoProdutoReal = produtoSorteado.id; 
      const novoChamado = {
        id: atendimentoList.length+1, 
        idPedido: inputCodigoPedido || null,   
        tipoProblema: inputArea,
        createdAt: Date.now().toLocaleString("pt-BR"),
        status: "Sob análise", 
        descricao: inputDescricao,
      };

      abrirAtendimento(novoChamado)
      
      alert("Atendimento aberto com sucesso!");
      formNovoAtendimento.reset();
      modal.close();
      location.hash=""
      location.search=""

      atendimentoList = getAtendimentos()
      await renderizarChamados();

    } catch (error) {
      console.error("Erro na criação do chamado:", error);
      alert("Erro de comunicação com o servidor. Verifique se existem produtos cadastrados no sistema.");
    } finally {
      btnSubmit.textContent = textoOriginalBtn;
      btnSubmit.disabled = false;
    }
  });
});