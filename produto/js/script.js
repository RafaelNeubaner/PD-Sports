/**
 * @typedef {import('../../js/products/useProducts.js').Product} Product
 */
import { calcularFrete } from "../../js/fretes/useFretes.js";
import { getProductById, getProductsByCategory } from "../../js/products/useProducts.js"
import { compreJunto } from "/js/product-card.js"

const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
if (!id) {
    id = "1.1"
}

const product = await getProductById(id)
let productImages = product.images
const categoryProducts = await getProductsByCategory(product.category)
const relatedProducts = categoryProducts.filter(p => p.id != id).slice(0, 10)
compreJunto(relatedProducts)
const cartApi = window.PDSportsCart

const last_cep = localStorage.getItem("LAST_CEP")
if (last_cep){
    document.querySelector("#cepInput").value = last_cep
    calculateFrete()
}
const principalImageDesktop = document.querySelector(".principalImageDesktop")
const sliderWrapperPhotos = document.getElementById("sliderWrapperPhotos")
const sliderTrackPhotos = document.getElementById("sliderTrackPhotos")
const photoDots = document.getElementById("photoDots")

let mobileCurrentIndex = 0
let startX = 0
let isDragging = false

let selectedPrincipalImage = productImages[0]

setupAddToCartButton()

setPrincipalImage(selectedPrincipalImage)
setupMobilePhotosCarousel()

document.querySelector(".productFullPrice").textContent = product.hasDiscount ? product.fullPrice.toLocaleString('pt-BR', { style: 'currency', currency: "BRL", minimumFractionDigits: 2 }) : ''
document.querySelector(".productName").textContent = product.name
document.querySelector(".productPrice").textContent = product.price.toLocaleString('pt-BR', { style: 'currency', currency: "BRL", minimumFractionDigits: 2 })
document.querySelectorAll(".suitableFor").forEach(cont => cont.textContent = product.suitableFor)
document.querySelector(".productGender").textContent = product.gender
document.querySelector(".brandName").textContent = product.brand

const qtdParc = 6
const precoTotal = (product.price * 1.15)
const precoParc = (precoTotal / qtdParc)

document.querySelector(".priceTotalParc").textContent = precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: "BRL", minimumFractionDigits: 2 })
document.querySelector(".qtdParc").textContent = qtdParc
document.querySelector(".priceParc").textContent = precoParc.toLocaleString('pt-BR', { style: 'currency', currency: "BRL", minimumFractionDigits: 2 })

if (product.variants && product.variants.length > 0) {
    document.querySelector(".variantesTitle").classList.remove("d-none")
    const variantesSec = document.querySelector(".variantesSec")

    product.variants.forEach(variant => {
        const varBtn = document.createElement("p")

        varBtn.classList.add("btnTamanho")
        if (document.body.classList.contains("darkMode")) {
            varBtn.classList.add("darkmode")
        }
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

function setupAddToCartButton(){
    const addCartButton = document.getElementById("addCart")
    if (!addCartButton) return

    addCartButton.addEventListener("click", () => {
        const nome = product.name?.trim() || "Produto"
        const idProduto = String(product.id || nome.toLowerCase().replace(/\s+/g, "-"))
        const preco = Number(product.price) || 0
        const img = selectedPrincipalImage || productImages[0] || ""

        if (cartApi?.addToCart) {
            cartApi.addToCart({ id: idProduto, nome, preco, img }, 1)
            cartApi.atualizarBadgeGlobal?.()
        }
    })
}
    
document.querySelector(".btnCalcularFrete").addEventListener('click', calculateFrete)
document.querySelector("#formFrete").addEventListener('submit', (event) => {
    event.preventDefault()
    calculateFrete()
})

function setSecondaryImages() {
    const secondaryImagesUrl = productImages.filter(link => link != selectedPrincipalImage)

    const imagesSection = document.getElementById("photosColumn")

    imagesSection.replaceChildren()
    secondaryImagesUrl.forEach(imageUrl => {
        const img = document.createElement("img")
        img.classList.add("secondaryImage")
        img.src = imageUrl

        img.addEventListener('click', () => {
            setPrincipalImage(imageUrl)
        })

        imagesSection.appendChild(img)
    })
}

function setPrincipalImage(url) {
    if (!productImages.includes(url)) return;

    selectedPrincipalImage = url;
    if (principalImageDesktop) {
        principalImageDesktop.src = url
    }
    setSecondaryImages()
    syncMobileCarouselByUrl(url)
}

var isLoading = false;
async function calculateFrete() {
    if (isLoading) return
    const cep = document.querySelector("#cepInput").value
    if (!cep) return;

    localStorage.setItem("LAST_CEP", cep)
    isLoading = true
    document.querySelector(".btnCalcularFrete").textContent = "Carregando..."
    const fretesOptions = await calcularFrete(cep, product.price)
    isLoading = false
    document.querySelector(".btnCalcularFrete").textContent = "Calcular"

    const fretesSec = document.querySelector(".fretesOptions")
    const freteTemp = document.getElementById("tempFreteOption")
    fretesSec.replaceChildren()
    fretesOptions.forEach(frete => {
        if (frete.error) return;
        const li = freteTemp.content.cloneNode(true)
        li.querySelector("input").id = `${frete.name}Op`
        li.querySelector("label").setAttribute("for", `${frete.name}Op`)
        li.querySelector("img").src = frete.company.picture
        li.querySelector("h4").textContent = frete.name
        li.querySelector("p").textContent = `${frete.currency} ${frete.price.toString().replace(".", ",")}`

        fretesSec.appendChild(li)
    })
}

function setupMobilePhotosCarousel() {
    if (!sliderTrackPhotos || !sliderWrapperPhotos || !photoDots) {
        return
    }

    sliderTrackPhotos.replaceChildren()
    photoDots.replaceChildren()

    productImages.forEach((imageUrl, index) => {
        const slide = document.createElement("img")
        slide.classList.add("mobilePhotoSlide")
        slide.src = imageUrl
        slide.alt = `${product.name} - imagem ${index + 1}`

        sliderTrackPhotos.appendChild(slide)

        const dot = document.createElement("button")
        dot.classList.add("photoDot")
        dot.type = "button"
        dot.setAttribute("aria-label", `Ver imagem ${index + 1}`)
        dot.addEventListener("click", () => {
            goToMobileImage(index, true)
        })

        photoDots.appendChild(dot)
    })

    goToMobileImage(0, false)

    sliderWrapperPhotos.addEventListener("touchstart", handleTouchStart, { passive: true })
    sliderWrapperPhotos.addEventListener("touchend", handleTouchEnd)
    sliderWrapperPhotos.addEventListener("mousedown", handleMouseDown)
    sliderWrapperPhotos.addEventListener("mouseup", handleMouseUp)
    sliderWrapperPhotos.addEventListener("mouseleave", handleMouseLeave)
}

function goToMobileImage(index, syncPrincipal) {
    if (!sliderTrackPhotos || !photoDots || productImages.length === 0) {
        return
    }

    mobileCurrentIndex = Math.max(0, Math.min(index, productImages.length - 1))
    sliderTrackPhotos.style.transform = `translateX(-${mobileCurrentIndex * 100}%)`

    photoDots.querySelectorAll(".photoDot").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === mobileCurrentIndex)
    })

    if (syncPrincipal) {
        setPrincipalImage(productImages[mobileCurrentIndex])
    }
}

function syncMobileCarouselByUrl(url) {
    const imageIndex = productImages.indexOf(url)
    if (imageIndex === -1 || imageIndex === mobileCurrentIndex) {
        return
    }

    goToMobileImage(imageIndex, false)
}

function handleTouchStart(event) {
    startX = event.touches[0].clientX
}

function handleTouchEnd(event) {
    const endX = event.changedTouches[0].clientX
    handleSwipe(endX)
}

function handleMouseDown(event) {
    isDragging = true
    startX = event.clientX
}

function handleMouseUp(event) {
    if (!isDragging) return
    isDragging = false
    handleSwipe(event.clientX)
}

function handleMouseLeave(event) {
    if (!isDragging) return
    isDragging = false
    handleSwipe(event.clientX)
}

function handleSwipe(endX) {
    const distance = endX - startX
    const threshold = 40

    if (Math.abs(distance) < threshold) {
        goToMobileImage(mobileCurrentIndex, false)
        return
    }

    if (distance < 0) {
        goToMobileImage(mobileCurrentIndex + 1, true)
        return
    }

    goToMobileImage(mobileCurrentIndex - 1, true)
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

