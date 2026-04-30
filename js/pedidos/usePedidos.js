
const PEDIDOS_KEY = "pd-sports-pedidos"

function getPedidos({limit}){
    localStorage.getItem
}

export function getPedidoById(id){
    const pedidos = JSON.parse(localStorage.getItem(PEDIDOS_KEY) || "[]")
    return pedidos.filter(pedido => pedido.id == id)[0] || null
}