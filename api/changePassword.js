const BASE_URL_USERS = `https://69d3b21c336103955f8f770c.mockapi.io/api/users/`

export default async function handler(req, res){

    const responseUser = await fetch(`${BASE_URL_USERS}/${req.body.id}`)

    if(!responseUser.ok) return res.status(404).json({"message": "Usuário não encontrado"})

    var actualUser = await responseUser.json()

    if(actualUser.password != req.body.actualPassword) return res.status(400).json({"message": "Senha inválida"});

    const userUpdate = {
        ...actualUser,
        "password": req.body.newPassword
    }        

    const response = await fetch(`${BASE_URL_USERS}/${req.body.id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userUpdate)
    })

    if(!response.ok){
        return res.status(400).json({"message": "Ocorreu um erro ao atualizar o usuário"})
    }

    const userResponse = await response.json()

    delete userResponse.password;

    return res.json(userResponse);
}