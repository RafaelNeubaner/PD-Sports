import { getProductById } from "/js/products/useProducts.js"
import { compreJunto } from "/js/product-card.js"

const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');

if(!id){
    id="1.1"
}

const product = await getProductById(id)
let productImages = product.images

const principalImage = document.querySelector(".principalImage")

let selectedPrincipalImage = productImages[0]

setPrincipalImage(selectedPrincipalImage)

document.querySelector(".productName").textContent = product.name
document.querySelector(".productPrice").textContent = product.price.toLocaleString('pt-BR', {style: 'currency', currency: "BRL", minimumFractionDigits: 2})
document.querySelectorAll(".suitableFor").forEach(cont => cont.textContent = product.suitableFor)
document.querySelector(".productGender").textContent = product.gender
document.querySelector(".brandName").textContent = product.brand

const qtdParc = 6
const precoTotal = (product.price * 1.15)
const precoParc = (precoTotal / qtdParc)

document.querySelector(".priceTotalParc").textContent = precoTotal.toLocaleString('pt-BR', {style: 'currency', currency: "BRL", minimumFractionDigits: 2})
document.querySelector(".qtdParc").textContent  = qtdParc
document.querySelector(".priceParc").textContent = precoParc.toLocaleString('pt-BR', {style: 'currency', currency: "BRL", minimumFractionDigits: 2})

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

function setSecondaryImages(){
    const secondaryImagesUrl = productImages.filter(link=>link!=selectedPrincipalImage)
    
    const imagesSection = document.getElementById("photosColumn")
    
    imagesSection.replaceChildren()
    secondaryImagesUrl.forEach(imageUrl=> {
        const img = document.createElement("img")
        img.classList.add("secondaryImage")
        img.src = imageUrl
    
        img.addEventListener('click', ()=>{
            setPrincipalImage(imageUrl)
        })
    
        imagesSection.appendChild(img)
    })
}

function setPrincipalImage(url){
    if(!productImages.includes(url)) return;

    selectedPrincipalImage = url;
    principalImage.src = url
    setSecondaryImages()
}


document.querySelector(".productDescription").textContent = product.description;


const specsGrid = document.getElementById('specsGrid');
const specs = product.characteristics[0];  

if (specs && specsGrid) {
    specsGrid.innerHTML = ''; 

    Object.entries(specs).forEach(([chave, valor]) => {
        const col = document.createElement('div');

        col.className = 'col-6 col-md-4 col-lg-3'; 
        
        col.innerHTML = `
            <div class="spec-item">
                <span class="spec-label">${chave}</span>
                <span class="spec-value">${valor}</span>
            </div>
        `;
        
        specsGrid.appendChild(col);
    });
}

