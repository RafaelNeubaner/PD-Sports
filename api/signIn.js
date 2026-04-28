const BASE_URL_USERS = `https://69d3b21c336103955f8f770c.mockapi.io/api/users/`

export default async function handler(req, res){
    const { body } = req

    if(!body.email || !body.password) return res.status(400).json({"message": "email and password obrigatórios"})

    const response = await fetch(`${BASE_URL_USERS}?email=${body.email}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const user = await response.json()

    if(!user[0] || user[0].password !== body.password) res.status(403).json({"message": "Senha ou email inválido"})
        
    delete user[0].password;
    
    res.json(user[0]);
}