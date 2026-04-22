
export default async function handler(req, res){
    let { body } = req;

    body = JSON.parse(body)
    console.log({
            from: {
                "postal_code": "34006065"
            },
            to:{
                "postal_code": body["to"]
            },
            volumes: [
                {
                    "width": 11,
                    "height": 8,
                    "length": 11,
                    "weight": 0.3,
                    "insurance": body["insurance"]
                },
            ],
            options: {
                "receipt": false,
                "own_hand": false
            },
            services: "1,2,18"
        })
    var response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'PDSports pedroferreiramanoel@gmail.com',
            'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`
        },
        body: JSON.stringify({
            from: {
                "postal_code": "34006065"
            },
            to:{
                "postal_code": body["to"]
            },
            volumes: [
                {
                    "width": 11,
                    "height": 8,
                    "length": 11,
                    "weight": 0.3,
                    "insurance": body["insurance"]
                },
            ],
            options: {
                "receipt": false,
                "own_hand": false
            },
            services: "1,2,18"
        })
    })

    return res.status(response.status).json(await response.json())
}