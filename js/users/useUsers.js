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
 * 
 * @returns {Promise<User>}
 */
export async function createUser(user){
    const response  = await fetch(
        `/api/signUp`,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'content-type': "application/json"
            },
            body: JSON.stringify(user)
        }
    )

    if(!response.ok){
        throw new Error("Ocorreu um erro ao cadastrar esse usuário")
    }

    const newUser = await response.json()
    return newUser;
}

/**
 * Função para atualizar informações de um usuário já cadastrado
 * 
 * @param {string} id
 * @param {User} user
 * 
 * @returns {Promise<User>}
 */
export async function updateUser(id, user){
    const response = await fetch(`/api/updateUser`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })

    if(!response.ok){
        throw new Error("Ocorreu um erro ao atualizar o usuário")
    }

    const userResponse = await response.json()

    return userResponse;
}

/**
 * Função para apagar o cadastro de um usuário
 * 
 * @param {string} id
 * 
 * @returns {Promise<User>}
 */
export async function deleteUser(id){
    const response = await fetch(`${BASE_URL}users/${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok){
        throw new Error("Usuário não encontrado")
    }

    const userResponse = await response.json()

    return userResponse;
}

/**
 * Função para buscar um usuário pelo ID
 * 
 * @param {string} id
 * 
 * @return {Promise<User>}
 */
export async function getUserById(id){
    const response = await fetch(`/api/getUser?id=${id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok){
        throw new Error("Usuário não encontrado")
    }

    const userResponse = await response.json()
    return userResponse
}

/**
 * Função para buscar um usuário pelo email
 * 
 * @param {string} email
 * 
 * @return {Promise<User>}
 */
export async function getUserByEmail(email){
    console.log("useUsers: "+email)
    const response = await fetch(`${BASE_URL}users?email=${email}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok){
        throw new Error("Email não encontrado")
    }

    const userResponse = await response.json()
    return userResponse
}

export async function signIn(email, password){
    const response = await fetch('/api/signIn', {
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const json = await response.json()
    if(!response.ok) throw new Error (json.message);

    return json;
}

export async function changePassword(id, oldPassword, newPassword){
    const response = await fetch('/api/changePassword', {
        method: "POST",
        body: JSON.stringify({
            "id": id,
            "actualPassword": oldPassword,
            "newPassword": newPassword
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const json = await response.json()
    if(!response.ok) throw new Error (json.message);

    return json;
}