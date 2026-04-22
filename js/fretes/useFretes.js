
/**
 * 
 * @param {string} to 
 */
export async function calcularFrete(to, insurance){

    const response = await fetch("/api/calcularFrete", {
        method: "POST",
        body: JSON.stringify({
            "to": to,
            "insurance": insurance
        })
    })

    return await response.json()
}

/**
 * 
 * @param {string} cep 
 */
export async function getLocationByCEP(cep){
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    return await response.json();
}