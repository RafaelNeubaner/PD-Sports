/**
 * @typedef {Object} Atendimento
 * 
 * @property {string} id
 * @property {string} idPedido
 * @property {string} tipoProblema
 * @property {string} createdAt
 * @property {string} status
 * @property {string} descricao
 */

const ATENDIMENTO_KEY = "atendimentos-cliente"

export function getAtendimentos(){
    const atendimentos = localStorage.getItem(ATENDIMENTO_KEY)

    return atendimentos ? JSON.parse(atendimentos) : []
}

export function abrirAtendimento(atendimento){
    const atendimentos = getAtendimentos()

    atendimentos.push(atendimento)
    atendimentos.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt))

    localStorage.setItem(ATENDIMENTO_KEY, JSON.stringify(atendimentos))
}
