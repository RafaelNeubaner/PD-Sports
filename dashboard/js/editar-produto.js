
import { getProductById, updateProduct } from "/js/products/useProducts.js";

let currentEditId = null;
let editImagesSelected = [];
let editVariants = [];
let editCaracteristicas = new Map();

const formEdit = document.querySelector("#formEditarProduto");
const modalEditarElement = document.getElementById('editarProduto');

if (formEdit && modalEditarElement) {
    const imagesSection = formEdit.querySelector(".imagesSec");
    const variantsSec = formEdit.querySelector(".variantsSec");
    const characteristicsSec = formEdit.querySelector(".characteristicsSec");

    modalEditarElement.addEventListener('show.bs.modal', async (event) => {

        const button = event.relatedTarget; 
        currentEditId = button.getAttribute('data-id');

        try {

            const produto = await getProductById(currentEditId);

            formEdit.querySelector(".nameProdInput").value = produto.name || "";
            formEdit.querySelector(".brandProdInput").value = produto.brand || "";
            formEdit.querySelector(".price").value = produto.price ? produto.price.toString().replace(".", ",") : "";
            formEdit.querySelector(".discountPrice").value = produto.discount ? produto.discount.toString().replace(".", ",") : "";
            formEdit.querySelector(".genderSelect").value = produto.gender || "";
            formEdit.querySelector(".categoryInput").value = produto.category || "";
            formEdit.querySelector(".suitableForInput").value = produto.suitableFor || "";
            formEdit.querySelector(".descriptionInput").value = produto.description || "";

            editImagesSelected = produto.images ? [...produto.images] : [];
            editVariants = produto.variants ? [...produto.variants] : [];
            

            editCaracteristicas.clear();
            if (produto.characteristics && produto.characteristics.length > 0) {
                const charObj = produto.characteristics[0];
                for (const [key, value] of Object.entries(charObj)) {
                    editCaracteristicas.set(key, value);
                }
            }

            renderEditImages();
            renderEditVariants();
            renderEditCharacteristics();

        } catch (error) {
            console.error("Erro ao buscar produto para edição:", error);
            alert("Erro ao carregar dados do produto.");

            const modalInstance = bootstrap.Modal.getInstance(modalEditarElement);
            if (modalInstance) modalInstance.hide();
        }
    });


    function renderEditImages() {
        imagesSection.replaceChildren();
        editImagesSelected.forEach(url => {
            const divImg = document.createElement("div");
            divImg.classList.add("imgAddProduct");
            
            const img = document.createElement("img");
            img.height = 80;
            img.src = url;

            const icon = document.createElement("i");
            icon.classList.add("bi", "bi-trash");
            icon.addEventListener("click", () => {
                editImagesSelected = editImagesSelected.filter(urlImg => urlImg !== url);
                renderEditImages();
            });

            divImg.appendChild(img);
            divImg.appendChild(icon);
            imagesSection.appendChild(divImg);
        });
    }

    function renderEditVariants() {
        variantsSec.replaceChildren();
        editVariants.forEach(variant => {
            const span = document.createElement("span");
            span.classList.add("variantItem");

            const text = document.createElement("span");
            text.textContent = variant;

            const icon = document.createElement("i");
            icon.classList.add("bi", "bi-trash");
            icon.addEventListener("click", () => {
                editVariants = editVariants.filter(v => v !== variant);
                renderEditVariants();
            });

            span.appendChild(text);
            span.appendChild(icon);
            variantsSec.append(span);
        });
    }

    function renderEditCharacteristics() {
        characteristicsSec.replaceChildren();
        editCaracteristicas.forEach((value, key) => {
            const span = document.createElement("span");
            span.classList.add("variantItem");

            const text = document.createElement("span");
            text.textContent = `${key}: ${value}`;

            const icon = document.createElement("i");
            icon.classList.add("bi", "bi-trash");
            icon.addEventListener("click", () => {
                editCaracteristicas.delete(key);
                renderEditCharacteristics();
            });

            span.appendChild(text);
            span.appendChild(icon);
            characteristicsSec.append(span);
        });
    }


    const btnAddImage = formEdit.querySelector(".imagesForm .btnPrimary");
    const urlInput = formEdit.querySelector("#urlImageInput");
    if(btnAddImage) {
        btnAddImage.addEventListener("click", (e) => {
            e.preventDefault();
            if (editImagesSelected.length > 4) return alert("Máximo de 5 imagens.");
            try {
                new URL(urlInput.value); // Valida a URL
                editImagesSelected.push(urlInput.value);
                renderEditImages();
                urlInput.value = "";
            } catch (err) {
                alert("Insira uma URL válida");
            }
        });
    }

    const variantsInputSec = formEdit.querySelector(".variantsInputSec");
    if(variantsInputSec) {
        const btnAddVariant = variantsInputSec.querySelector("button");
        const inputVariant = variantsInputSec.querySelector("input");
        
        const addVariant = (e) => {
            e?.preventDefault();
            const val = inputVariant.value.trim();
            if (!val) return;
            if (editVariants.includes(val)) return alert("Variante já existe.");
            editVariants.push(val);
            inputVariant.value = "";
            renderEditVariants();
        };

        btnAddVariant.addEventListener("click", addVariant);
        inputVariant.addEventListener("focusout", addVariant);
    }

    const characteristicsInputSec = formEdit.querySelector(".characteristicsInputSec");
    if(characteristicsInputSec) {
        const btnAddChar = characteristicsInputSec.querySelector("button");
        const titleChar = characteristicsInputSec.querySelector(".titleInputCharacteristics");
        const valueChar = characteristicsInputSec.querySelector(".valueInputCharacteristics");

        const addChar = (e) => {
            e?.preventDefault();
            if (!titleChar.value.trim() || !valueChar.value.trim()) return;
            editCaracteristicas.set(titleChar.value.trim(), valueChar.value.trim());
            renderEditCharacteristics();
            titleChar.value = "";
            valueChar.value = "";
        };

        btnAddChar.addEventListener("click", addChar);
        titleChar.addEventListener("focusout", addChar);
        valueChar.addEventListener("focusout", addChar);
    }

    const btnCleanDiscount = formEdit.querySelector(".cleanDiscount");
    if(btnCleanDiscount) {
        btnCleanDiscount.addEventListener("click", () => {
            formEdit.querySelector(".discountPrice").value = "";
        });
    }


    formEdit.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (editImagesSelected.length <= 0) return alert("Insira ao menos uma imagem");
        
        const nameProduct = formEdit.querySelector(".nameProdInput").value;
        const brandProduct = formEdit.querySelector(".brandProdInput").value;
        let price = formEdit.querySelector(".price").value;
        let discountPrice = formEdit.querySelector(".discountPrice").value;
        const gender = formEdit.querySelector(".genderSelect").value;
        let category = formEdit.querySelector(".categoryInput").value;
        const suitableFor = formEdit.querySelector(".suitableForInput").value;
        const description = formEdit.querySelector(".descriptionInput").value;

        if (!nameProduct) return alert("Insira o nome do produto");
        if (!brandProduct) return alert("Insira a marca do produto");
        if (!price) return alert("Insira o preço");
        if (!gender) return alert("Insira o gênero do produto");
        if (!category) return alert("Insira uma categoria");
        if (!suitableFor) return alert("Especifique para qual esporte é indicado");
        if (editCaracteristicas.size <= 0) return alert("Insira ao menos uma característica");
        if (!description) return alert("Insira uma descrição do produto");

        price = Number(price.replace(",", "."));
        if (discountPrice) discountPrice = Number(discountPrice.replace(",", "."));

        category = category.toLowerCase();
        category = category.charAt(0).toUpperCase() + category.slice(1);

        const isProduct2 = currentEditId.endsWith(".2");

        const updatedProductData = {
            name: nameProduct,
            price: price,
            discount: discountPrice || price, // Se não tiver desconto, o discount iguala o price na lógica do BD
            discountPercentage: discountPrice ? Math.ceil(100 - (discountPrice / price * 100)) : 0,
            noDiscount: !discountPrice,
            brand: brandProduct,
            description: description,
            characteristics: [Object.fromEntries(editCaracteristicas)],
            variants: editVariants,
            images: editImagesSelected,
            category: category,
            gender: gender,
            suitableFor: suitableFor,
            isProduct2: isProduct2
        };

        try {

            const submitBtn = formEdit.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = "Salvando...";
            submitBtn.disabled = true;

            await updateProduct(currentEditId, updatedProductData);
            
            alert("Produto atualizado com sucesso!");
            
            window.location.reload(); 

        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Falha ao salvar as edições. Tente novamente.");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}