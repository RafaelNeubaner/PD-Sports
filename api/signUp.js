const BASE_URL_USERS = `https://69d3b21c336103955f8f770c.mockapi.io/api/users/`

export default async function handler(req, res){
    const response = await fetch(
        BASE_URL_USERS,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'content-type': "application/json"
            },
            body: JSON.stringify(req.body)
        }
    )

    const result = await response.json()

    delete result.password;

    return res.json(result);
}