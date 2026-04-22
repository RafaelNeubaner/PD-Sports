require('dotenv').config();
const BASE_URL_USERS = `${process.env.BASE_URL_USERS}users`

export default async function handler(req, res){
    const response = await fetch(
        BASE_URL_USERS,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'content-type': "application/json"
            },
            body: JSON.stringify(user)
        }
    )

    const result = await response.json()

    delete result.password;

    return result;
}