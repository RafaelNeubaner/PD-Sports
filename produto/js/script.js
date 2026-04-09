import {getProductById} from "/js/products/useProducts.js"

const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');

if(!id){
    id="1.1"
}

const product = await getProductById(id)
let productImages = product.images

const principalImage = document.querySelector(".principalImage")

principalImage.src = productImages[0]

const secondaryImagesUrl = productImages.filter(link=>link!=productImages[0])
console.log(secondaryImagesUrl)

const imagesSection = document.getElementById("photosColumn")

for(const imageUrl of secondaryImagesUrl){
    const img = document.createElement("img")
    img.classList.add("secondaryImage")
    img.src = imageUrl

    imagesSection.appendChild(img)
}

document.querySelector(".productName").textContent = product.name
document.querySelector(".productPrice").textContent = product.price.toLocaleString('pt-BR', {style: 'currency', currency: "BRL", minimumFractionDigits: 2})
document.querySelector(".suitableFor").textContent = product.suitableFor
document.querySelector(".brandName").textContent = product.brand

if(product.variants && product.variants.length>0){
    document.querySelector(".variantesTitle").classList.remove("d-none")
    const variantesSec = document.querySelector(".variantesSec")
    
    product.variants.forEach(variant =>{
        const varBtn = document.createElement("p")
    
        varBtn.classList.add("btnTamanho")
        varBtn.textContent = variant
    
        variantesSec.appendChild(varBtn)
    })
}



document.querySelectorAll(".btnTamanho").forEach((button) => {
    button.addEventListener("click", () => {
        const group = button.parentElement;

        if (!group) {
            return;
        }

        group.querySelectorAll(".btnTamanho").forEach((otherButton) => {
            otherButton.classList.remove("active");
        });

        button.classList.add("active");
    });
});