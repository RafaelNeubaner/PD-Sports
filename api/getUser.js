const BASE_URL_USERS = `https://69d3b21c336103955f8f770c.mockapi.io/api/users/`

export default async function handler(req, res){
    const response = await fetch(BASE_URL_USERS+req.query.id)
    if(!response.ok) return res.status(404).json({"message": "Usuário não encontrado"})
    const user = await response.json()

    delete user.password

    res.json(user)

}