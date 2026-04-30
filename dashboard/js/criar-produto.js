import { createProduct } from "/js/products/useProducts.js"

let imagesSelected = []
let variants = []
let caracteristicas = new Map()

const imagesForm = document.querySelector(".imagesForm")
const urlInput = imagesForm.querySelector("#urlImageInput")
const imagesSection = document.querySelector(".imagesSec")

const variantsInputSec = document.querySelector(".variantsInputSec")
const characteristicsInputSec = document.querySelector(".characteristicsInputSec")

const priceDiscountInput = document.querySelector(".dicountPrice")

urlInput.addEventListener('paste', (event)=>{
    event.preventDefault(); 

    if(imagesSelected.length > 4) return
    
    const pastedData = event.clipboardData.getData('text');
    try{
        var url = new URL(pastedData)
        imagesSelected.push(pastedData)
        showImagesSelected()
    }catch(e){
        alert("Insira uma URL válida")
    }
})

imagesForm.querySelector(".btnPrimary").addEventListener("click", (event)=>{
    event.preventDefault()

    if(imagesSelected.length > 4) return

    try{
        var url = new URL(urlInput.value)
        imagesSelected.push(urlInput.value)
        showImagesSelected()
        urlInput.value = ""
    }catch(e){
        alert("Insira uma URL válida")
    }
})

document.querySelector(".cleanDiscount").addEventListener("click", ()=>{
    priceDiscountInput.value= ""
})

variantsInputSec.querySelector("input").addEventListener("focusout", (event)=>{
    event.preventDefault()
    addVariantToList()
})
variantsInputSec.querySelector("input").addEventListener("submit", (event)=>{
    event.preventDefault()
    addVariantToList()
})
variantsInputSec.querySelector("button").addEventListener("click", addVariantToList)

characteristicsInputSec.querySelectorAll("input").forEach(input=>input.addEventListener("focusout", (event)=>{
    event.preventDefault()
    addCharacteristcsToList()
}))
characteristicsInputSec.querySelectorAll("input").forEach(input=>input.addEventListener("submit", (event)=>{
    event.preventDefault()
    addCharacteristcsToList()
}))
characteristicsInputSec.querySelector("button").addEventListener("click", addCharacteristcsToList)

document.querySelector("#formCreateProduct").addEventListener("submit", (event)=>{
    event.preventDefault()
    validadeForm()
})

function addVariantToList(){
    const newVariant = variantsInputSec.querySelector("input")
    if(!newVariant.value || newVariant.value=="") return

    if(variants.includes(newVariant.value)){
        alert("Não é possível existir duas variantes com mesmo nome")
        return;
    }

    variants.push(newVariant.value)

    newVariant.value = ""

    showVariantsSelected()
}

function addCharacteristcsToList(){
    const titleChar = characteristicsInputSec.querySelector(".titleInputCharacteristics")
    const valueChar = characteristicsInputSec.querySelector(".valueInputCharacteristics")

    if(!valueChar.value || valueChar.value=="" || !titleChar.value || titleChar.value=="") return

    caracteristicas.set(titleChar.value, valueChar.value)
    showCharacteristicsSelected()
    titleChar.value=""
    valueChar.value=""
}

function showImagesSelected(){
    imagesSection.replaceChildren()

    imagesSelected.forEach(url=>{
        const divImg = document.createElement("div")
        const img = document.createElement("img")
        const icon = document.createElement("i")

        icon.classList.add("bi")
        icon.classList.add("bi-trash")

        icon.addEventListener("click", ()=>{
            imagesSelected = imagesSelected.filter(urlImg=>urlImg!=url)
            showImagesSelected()
        })
        
        divImg.classList.add("imgAddProduct")
        
        img.height = 80
        img.src = url

        divImg.appendChild(img)
        divImg.appendChild(icon)
        imagesSection.appendChild(divImg)
    })
}

function showVariantsSelected(){
    const variantsSec = document.querySelector(".variantsSec")

    variantsSec.replaceChildren()

    variants.forEach(variant=>{
        const span = document.createElement("span")
        const text = document.createElement("span")
        const icon = document.createElement("i")

        text.textContent = variant
        icon.classList.add("bi")
        icon.classList.add("bi-trash")

        icon.addEventListener("click", ()=>{
            variants = variants.filter(vari=>vari!=variant)
            showVariantsSelected()
        })

        span.classList.add("variantItem")

        span.appendChild(text)
        span.appendChild(icon)

        variantsSec.append(span)
    })
}

function showCharacteristicsSelected(){
    let characteristcsSec = document.querySelector(".characteristicsSec")

    characteristcsSec.replaceChildren()
    caracteristicas.forEach((value, key)=>{
        console.log(`${key}: ${value}`)
        const span = document.createElement("span")
        const text = document.createElement("span")
        const icon = document.createElement("i")
        
        text.textContent = `${key}: ${value}`
        icon.classList.add("bi")
        icon.classList.add("bi-trash")
        
        icon.addEventListener("click", ()=>{
            caracteristicas.delete(key)
            showCharacteristicsSelected()
        })
        
        span.classList.add("variantItem")
        
        span.appendChild(text)
        span.appendChild(icon)
        
        characteristcsSec.append(span)
    })
}

async function validadeForm(){
    if(imagesSelected.length<2){
        return alert("Insira ao menos 2 imagens")
    }

    const nameProduct = document.querySelector(".nameProdInput").value
    if(!nameProduct || nameProduct == ""){
        return alert("Insira o nome do produto")
    }

    const brandProduct = document.querySelector(".brandProdInput").value
    if(!brandProduct || brandProduct == ""){
        return alert("Insira a marca do produto")
    }

    let price  = document.querySelector(".price").value
    let discountPrice  = document.querySelector(".discountPrice").value

    if(!price || price == ""){
        return alert("Insira o preço")
    }

    price = Number(price.replace(",", "."))
    if(discountPrice && discountPrice > 0){
        discountPrice = Number(discountPrice.replace(",", "."))

        if(price< discountPrice){
            return alert("O preço promocional não pode ser maior que o preço normal")
        }
    }

    const gender = document.querySelector(".genderSelect").value
    if(!gender || gender == ""){
        return alert("Insira o gênero do produto")
    }

    let category = document.querySelector(".categoryInput").value
    if(!category || category == ""){
        return alert("Insira uma categoria")
    }

    category = category.toLowerCase()
    category = category.charAt(0).toUpperCase() + category.slice(1)

    const suitableFor = document.querySelector(".suitableForInput").value
    if(!suitableFor || suitableFor == ""){
        return alert("Especifique para qual esporte é indicado o produto")
    }

    if(caracteristicas.length<=0){
        return alert("Insira ao menos uma característica")
    }

    const description = document.querySelector(".descriptionInput").value
    if(!description || description==""){
        return alert("Insira uma descrição do produto")
    }

    console.log(caracteristicas)
    console.log([caracteristicas.to])
    await createProduct({
        name: nameProduct,
        price: discountPrice || price,
        fullPrice: price,
        discountPercentage: discountPrice ?  Math.ceil(discountPrice/price * 100) : null,
        qtSales: Math.random *5000,
        hasDiscount: discountPrice ? true : false,
        brand: brandProduct,
        description: description,
        characteristics: [Object.fromEntries(caracteristicas)],
        variants:  variants,
        images: imagesSelected,
        category: category,
        gender: gender,
        suitableFor: suitableFor,
        isProduct2: true
    })
    alert("Produto cadastrado")
}