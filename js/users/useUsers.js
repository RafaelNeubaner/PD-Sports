/**
 * @typedef {Object} User
 * 
 * @property {string} id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} cpf
 * @property {string} phone
 * @property {Date} birthday
 * @property {string} email
 * @property {string} password
 */

const BASE_URL = 'https://69d3b21c336103955f8f770c.mockapi.io/api/'

/**
 * Função para cadastrar novo usuário na aplicação
 * 
 * @param {User} user 
 * @returns {User}
 */
export async function createUser(user){
    const response  = await fetch(
        `${BASE_URL}users`,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'content-type': "application/json"
            },
            body: JSON.stringify(user)
        }
    )

    const newUser = await response.json()
    return newUser;
}

/**
 * Função para atualizar informações de um usuário já cadastrado
 * 
 * @param {string} id
 * @param {User} user
 * 
 * @returns {User}
 */
export async function updateUser(id, user){
    const response = await fetch(`${BASE_URL}users/${id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })

    const userResponse = await response.json()

    return userResponse;
}

/**
 * Função para apagar o cadastro de um usuário
 * 
 * @param {string} id
 * 
 * @returns {User}
 */
export async function deleteUser(id){
    const response = await fetch(`${BASE_URL}users/${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const userResponse = await response.json()

    return userResponse;
}

/**
 * Função para buscar um usuário pelo ID
 * 
 * @param {string} id
 * 
 * @return {User}
 */
export async function getUserById(id){
    const response = await fetch(`${BASE_URL}users/${id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const userResponse = await response.json()
    return userResponse
}