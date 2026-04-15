
function criarCardProdutoAdmin(produto) {

  const imagem = produto.images && produto.images.length > 0 ? produto.images[0] : '/assets/media/img/default.png';
  
  const precoFormatado = produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return `
    <article class="admin-card bg-white rounded-3 shadow-sm p-3 mb-3 d-flex align-items-center gap-3">
        <div class="admin-card-img-wrapper">
            <img src="${imagem}" alt="${produto.name}" class="admin-card-img">
        </div>

        <div class="admin-card-info flex-grow-1">
            <h5 class="admin-card-title m-0 fw-medium text-dark">${produto.name}</h5>
            <span class="admin-card-id text-muted d-block mb-3">#${produto.id}</span>
            <span class="admin-card-price text-danger fw-medium">${precoFormatado}</span>
        </div>

        <div class="admin-card-actions d-flex flex-column flex-md-row align-items-end align-items-md-center gap-3 gap-md-4">
            <button class="btn btn-link text-danger text-decoration-none p-0 fs-7 btn-editar" data-id="${produto.id}">
              Editar Produto
            </button>
            <button class="btn btn-danger btn-excluir rounded-3 px-3 py-2 fs-7" data-id="${produto.id}">
              Excluir Produto
            </button>
        </div>
    </article>
  `;
}