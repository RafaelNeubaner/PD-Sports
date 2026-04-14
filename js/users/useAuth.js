
/**
 * @typedef {import("./useUsers").User} User
 */
import {createUser as createUserAPI, updateUser as updateUserAPI, getUserByEmail, getUserById} from "../users/useUsers.js"

const USER_VARIABLE = "userAuth"

/**
 * 
 * @returns {User | null}
 */
export function getUserAuthenticated(){
    const userAuthStr = localStorage.getItem(USER_VARIABLE)

    if(!userAuthStr) return null;

    return JSON.parse(userAuthStr)
}

/**
 * 
 * @returns {boolean}
 */
export function isAuthenticated(){
    return localStorage.getItem(USER_VARIABLE) != null;
}

/**
 * 
 * @param {User} user 
 * 
 * @returns {Promise<User>}
 */
export async function createUser(user){
    try{
        return await createUserAPI(user);

    }catch(e){
        console.log(e)
        throw new Error("Ocorreu um erro ao criar o usuário")
    }
}


/**
 * 
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<User>}
 */
export async function loginUser({email, password}){
    try{
        let user = await getUserByEmail(email);

        if(user.password !== password) throw new Error("Senha inválida")
        
        delete user.password;

        localStorage.setItem(USER_VARIABLE, JSON.stringify(user))

        return user;
    }catch(e){
        throw new Error("Email ou senha inválidos");
    }
}
/**
 * 
 * @param {number} id 
 * @param {User} user 
 */
export async function updateUser(id, user){
    try{
        let userUpdated = await updateUserAPI(id, user)
        return userUpdated;
    }catch(e){
        console.log(e)
        throw new Error("Erro ao atualizar o usuário");
    }
}

/**
 * @return {void}
 */
export function signOut(){
    localStorage.removeItem(USER_VARIABLE);
}