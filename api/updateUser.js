const BASE_URL_USERS = `https://69d3b21c336103955f8f770c.mockapi.io/api/users/`

export default async function handler(req, res){

    const responseUser = await fetch(`${BASE_URL_USERS}/${req.body.id}`)

    if(!responseUser.ok) return res.status(404).json("Usuário não encontrado")

    var actualUser = await responseUser.json()

    var userUpdate = {
        ...req.body,
        "password": actualUser.password
    }

    const response = await fetch(`${BASE_URL_USERS}/${userUpdate.id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userUpdate)
    })

    if(!response.ok){
        return res.status(response.status).json(response.body)
    }

    const userResponse = await response.json()

    delete userResponse.password;

    return res.json(userResponse);
}