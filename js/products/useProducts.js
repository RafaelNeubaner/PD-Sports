/**
 * Definição da estrutura do Produto
 * 
 * @typedef {Object} Product
 * 
 * @property {string} id - O ID é uma string composta separada por `.`, primeira parte ID e segunda o endpoint a ser buscado `id.endpoint`
 * @property {string} name - nome do produto
 * @property {number} price - preço principal do produto
 * @property {number} discount - preço com desconto
 * @property {number} discountPercentage - porcentagem do desconto
 * @property {number} qtSales  - Quantidade de vendas do produto
 * @property {boolean} noDiscount - verificar se possui desconto
 * @property {string} brand - nome da marca do produto
 * @property {string} description - descrição do produto
 * @property {Object} characteristics - características específicas do produto
 * @property {string[]} variants - Opções de variação do produto
 * @property {string[]} images - Links das imagens do produto
 * @property {string} category - Categoria do produto
 * @property {string} gender - Gênero do produto
 * @property {?boolean} isProduct2  - Qual endpoint o produto está salvo
 */


const BASE_URL = "https://69c284407518bf8facbe9c12.mockapi.io/api/"

function formatIdProduct(product) {
    product.id = `${product.id}.${product.isProduct2 ? "2" : '1'}`
}

/**
 * Função para inserir produto novo na API
 * 
 * @param {Product} product - objeto de produto com as propriedades * 
 * @param {string} endpoint - Qual endpoint o produto será salvo
 */
export async function createProduct(product, endpoint = "product2") {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    const productResponse = await response.json()
    formatIdProduct(productResponse)

    return productResponse;
}

/**
 * Função para atualizar dados do produto existente na API
 * 
 * @param {string} id - ID do produto a ser atualizado no formato `id.endpoint`
 * @param {Product} product - objeto de produto com as propriedades
 * 
 * @returns {Product}
 * @example
 * Ex: updateProduct("20.1", produto) #ID 20 no endpoint 1(/product)
 * Ex: updateProduct("20.2", produto) #ID 20 no endpoint 2(/product2)
 */
export async function updateProduct(id, product) {
    const response = await fetch(`${BASE_URL}${product.isProduct2 == true ? "product2/" : "product/"}${id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })

    const productResponse = await response.json()
    formatIdProduct(productResponse)

    return productResponse;
}

/**
 * Apaga um produto baseado no seu ID
 * 
 * @param {string} id - ID do produto no formato `id.endpoint`
 * 
 * @returns {Product}
 * 
 * @example
 * Ex: deleteProduct("20.1") #ID 20 no endpoint 1(/product)
 * Ex: deleteProduct("20.2") #ID 20 no endpoint 2(/product2)
 */
export async function deleteProduct(id) {
    const response = await fetch(`${BASE_URL}${product.isProduct2 == true ? "product2/" : "product/"}${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const productResponse = await response.json()
    formatIdProduct(productResponse)

    return productResponse;
}

/**
 * Retorna todos os produtos salvos, não há necessidade de uso, mas fica aqui
 * 
 * @returns {Product[]}  array com todos os produtos com suas propriedades
 * 
 */
export async function getAllProducts() {
    const responses = await Promise.all([
        fetch(`${BASE_URL}product`),
        fetch(`${BASE_URL}product2`),
    ])

    let produtos = [
        ...(await responses[0].json()),
        ...(await responses[1].json())
    ]

    produtos.map(produto => formatIdProduct(produto))

    return produtos;
}


/**
 * Retorna um produto baseado no seu ID. 
 * @param {string} id - id do produto no formato `id.endpoint`
 *  
 * @example
 * Ex: getProductById("20.1") #ID 20 no endpoint 1(/product)
 * Ex: getProductById("20.2") #ID 20 no endpoint 2(/product2)
 * 
 * @returns {Product[]}  array com todos os produtos com suas propriedades
 * 
 */
export async function getProductById(id) {
    const idSplit = id.split(".")
    console.log(idSplit)
    const idNum = idSplit[0]
    const endpoint = idSplit[1]

    const response = await fetch(`${BASE_URL}product${endpoint == '2' ? '2' : ''}/${idNum}`)

    if (response.status != 200) {
        throw new Error("Not found");
    }

    const productResponse = await response.json()
    formatIdProduct(productResponse)

    return productResponse;
}

/**
 * Retorna um produto baseado no nome de sua categoria.
 * 
 * @example
 * Ex: getProductsByCategory("20.1") #ID 20 no endpoint 1(/product)
 * 
 * @returns {Product[]}  array com todos os produtos com suas propriedades
 * 
 */
export async function getProductsByCategory(category){
    const url = new URL(`${BASE_URL}product`)
    url.searchParams.append("category", category)

    const url2 = new URL(`${BASE_URL}product2`)
    url2.searchParams.append("category", category)

    const responses = await Promise.all([
        fetch(url, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        }).catch(err => null),
        fetch(url2, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        }).catch(err => null)
    ])

    let produtos = []
    for (var response of responses) {
        if (response.status == 200) {
            let produtosRes = await response.json()
            console.log(produtosRes)
            produtosRes.map(produto => formatIdProduct(produto))
            produtos = [...produtos, ...produtosRes]
        }
    }

    return produtos;
}

/**
 * Busca dos produtos com filtro e categorização
 * 
 * @param {object} params
 * @param {string} params.query 
 * @param {string} params.category 
 * @param {string} params.gender
 * @param {boolean} params.hasDiscount
 * @param {'price' | 'qtSales' | 'discountPercentage' } params.sortBy
 * @param {'asc'|'desc'} params.order
 * 
 * @returns {Product[]}
 */
export async function getProductsFilter({query, category, gender, hasDiscount, sortBy, order = 'desc', limit=20, page=1}) {
    const url = new URL(`${BASE_URL}product`)
    const url2 = new URL(`${BASE_URL}product2`)
    const normalizedOrder = order === 'asc' ? 'asc' : 'desc'

    if(query){
        url.searchParams.append("search", query)
        url2.searchParams.append("search", query)
    }

    if (category) {
        url.searchParams.append("category", category)
        url2.searchParams.append("category", category)
    }
    if (gender) {
        url.searchParams.append("gender", gender)
        url2.searchParams.append("gender", gender)
    }
    if (hasDiscount) {
        url.searchParams.append("hasDiscount", !hasDiscount)
        url2.searchParams.append("hasDiscount", !hasDiscount)
    }
    if (sortBy) {
        url.searchParams.append("sortBy", sortBy)
        url2.searchParams.append("sortBy", sortBy)

        url.searchParams.append("order", normalizedOrder)
        url2.searchParams.append("order", normalizedOrder)
    }

    url.searchParams.append("limit", limit)
    url2.searchParams.append("limit", limit)

    url.searchParams.append("page", page)
    url2.searchParams.append("page", page)

    const responses = await Promise.all([
        fetch(url, { method: 'GET', headers: { 'content-type': 'application/json' } }),
        fetch(url2, { method: 'GET', headers: { 'content-type': 'application/json' } }),
    ])

    let produtos = []
    for (var response of responses) {
        if (response.status == 200) {
            let produtosRes = await response.json()
            console.log(produtosRes)
            produtosRes.map(produto => formatIdProduct(produto))
            produtos = [...produtos, ...produtosRes]
        }
    }

    switch(sortBy){
        case 'discountPercentage':
            produtos.sort((a,b)=> normalizedOrder=='asc' ? a.discountPercentage - b.discountPercentage : b.discountPercentage - a.discountPercentage);
            break;
        case 'price':
            produtos.sort((a,b)=> normalizedOrder=='asc' ? a.price - b.price : b.price - a.price);
            break;
        case 'qtSales':
            produtos.sort((a,b)=> normalizedOrder=='asc' ? a.qtSales - b.qtSales : b.qtSales - a.qtSales);
            break;
    }

    return produtos.slice(0, limit);
}