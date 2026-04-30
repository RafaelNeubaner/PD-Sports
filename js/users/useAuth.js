
/**
 * @typedef {import("./useUsers").User} User
 */
import { createUser as createUserAPI, updateUser as updateUserAPI, getUserByEmail, getUserById, signIn, changePassword } from "../users/useUsers.js"

const USER_ID_VARIABLE = "userIdAuth"



/**
 * 
 * @returns {Promise<User | null>}
 */
export async function getUserAuthenticatedUpdate() {
    const userIdAuthStr = localStorage.getItem(USER_ID_VARIABLE)

    if (!userIdAuthStr) {
        localStorage.removeItem("user-object")
        return null;
    }

    const user = await getUserById(userIdAuthStr)

    localStorage.setItem("user-object", JSON.stringify(user))
    return user;
}


/**
 * 
 * @returns {User | null}
 */
export async function getUserAuthenticated() {
    const userIdAuthStr = localStorage.getItem(USER_ID_VARIABLE)

    if (!userIdAuthStr) {
        localStorage.removeItem("user-object")
        return null;
    }

    const userObject = JSON.parse(localStorage.getItem("user-object"))

    if (!userObject) return null;
    return userObject;
}

/**
 * 
 * @returns {boolean}
 */
export function isAuthenticated() {
    return localStorage.getItem(USER_ID_VARIABLE) != null;
}

/**
 * 
 * @param {User} user 
 * 
 * @returns {Promise<User>}
 */
export async function createUser(user) {
    try {
        return await createUserAPI(user);

    } catch (e) {
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
export async function loginUser({ email, password }) {
    try {
        let user = await signIn(email, password);

        localStorage.setItem(USER_ID_VARIABLE, user.id)
        localStorage.setItem("user-object", JSON.stringify(user))

        return user;
    } catch (e) {
        console.log(e)
    }
    throw new Error("Email ou senha inválidos");
}
/**
 * 
 * @param {number} id 
 * @param {User} user 
 * 
 * @returns {Promise<User>}
 */
export async function updateUser(id, user) {
    try {
        let userUpdated = await updateUserAPI(id, user)
        localStorage.setItem("user-object", JSON.stringify(userUpdated))
        return userUpdated;
    } catch (e) {
        console.log(e)
        throw new Error("Erro ao atualizar o usuário");
    }
}

/**
 * 
 * @param {string} id 
 * @param {string} oldPassword 
 * @param {string} newPassword 
 * 
 * @returns {User}
 */
export async function updatePassword(id, oldPassword, newPassword) {
    var user = await changePassword(id, oldPassword, newPassword)

    return user;
}

/**
 * @return {void}
 */
export function signOut() {
    localStorage.removeItem(USER_ID_VARIABLE);
    localStorage.removeItem("user-object");
}

export function isPasswordValid(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/;
    if (regex.test(password)) {
        return true;
    }
    return false;
}