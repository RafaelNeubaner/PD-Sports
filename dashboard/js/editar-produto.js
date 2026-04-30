import { getProductById, updateProduct } from "../../js/products/useProducts.js";

document.addEventListener("DOMContentLoaded", () => {
  const modalEditarElement = document.getElementById("editarProduto");
  const formEdit = document.getElementById("formEditarProduto");

  if (!modalEditarElement || !formEdit) return;

  let currentEditId = null;
  let editImagesSelected = [];
  let editVariants = [];
  let editCaracteristicas = new Map();


  const imagesSection = formEdit.querySelector(".imagesSec");
  const variantsSec = formEdit.querySelector(".variantsSec");
  const characteristicsSec = formEdit.querySelector(".characteristicsSec");
  const btnSubmit = formEdit.querySelector('button[type="submit"]');


  modalEditarElement.addEventListener("show.bs.modal", async (event) => {
    const button = event.relatedTarget;
    currentEditId = button.getAttribute("data-id");

    try {

      btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Carregando...';
      btnSubmit.disabled = true;

      const produto = await getProductById(currentEditId);

      document.getElementById("editName").value = produto.name || "";
      document.getElementById("editBrand").value = produto.brand || "";
      document.getElementById("editPrice").value = produto.fullPrice ? produto.fullPrice: "";
      document.getElementById("editDiscount").value = produto.price ? produto.price: "";
      document.getElementById("editGender").value = produto.gender || "";
      document.getElementById("editCategory").value = produto.category || "";
      document.getElementById("editSuitable").value = produto.suitableFor || "";
      document.getElementById("editDesc").value = produto.description || "";


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

      btnSubmit.innerHTML = "Salvar Alterações";
      btnSubmit.disabled = false;

    } catch (error) {
      console.error("Erro ao carregar dados para edição:", error);
      alert("Não foi possível carregar os dados do produto. Tente novamente.");

      const modalInstance = bootstrap.Modal.getInstance(modalEditarElement);
      if (modalInstance) modalInstance.hide();
    }
  });


  function renderEditImages() {
    imagesSection.innerHTML = "";
    editImagesSelected.forEach((url) => {
      const divImg = document.createElement("div");
      divImg.classList.add("imgAddProduct");

      const img = document.createElement("img");
      img.height = 80;
      img.src = url;

      const icon = document.createElement("i");
      icon.classList.add("bi", "bi-trash");
      icon.addEventListener("click", () => {
        editImagesSelected = editImagesSelected.filter((u) => u !== url);
        renderEditImages();
      });

      divImg.appendChild(img);
      divImg.appendChild(icon);
      imagesSection.appendChild(divImg);
    });
  }

  function renderEditVariants() {
    variantsSec.innerHTML = "";
    editVariants.forEach((variant) => {
      const span = document.createElement("span");
      span.classList.add("variantItem");

      const text = document.createElement("span");
      text.textContent = variant;

      const icon = document.createElement("i");
      icon.classList.add("bi", "bi-trash");
      icon.addEventListener("click", () => {
        editVariants = editVariants.filter((v) => v !== variant);
        renderEditVariants();
      });

      span.appendChild(text);
      span.appendChild(icon);
      variantsSec.append(span);
    });
  }

  function renderEditCharacteristics() {
    characteristicsSec.innerHTML = "";
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
  const urlInput = document.getElementById("editUrlImageInput");
  if (btnAddImage && urlInput) {
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

  const btnAddVariant = formEdit.querySelector(".addVariant");
  const inputVariant = document.getElementById("editVariants");
  if (btnAddVariant && inputVariant) {
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

  const btnAddChar = formEdit.querySelector(".characteristicsInputSec .btnPrimary");
  const titleChar = document.getElementById("charTitle");
  const valueChar = document.getElementById("charValue");
  if (btnAddChar && titleChar && valueChar) {
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
  const discountInput = document.getElementById("editDiscount");
  if (btnCleanDiscount && discountInput) {
    btnCleanDiscount.addEventListener("click", () => {
      discountInput.value = "";
    });
  }




  formEdit.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (editImagesSelected.length < 2) return alert("Insira ao menos 2 imagens");

    const nameProduct = document.getElementById("editName").value;
    const brandProduct = document.getElementById("editBrand").value;
    let price = document.getElementById("editPrice").value;
    let discountPrice = document.getElementById("editDiscount").value;
    const gender = document.getElementById("editGender").value;
    let category = document.getElementById("editCategory").value;
    const suitableFor = document.getElementById("editSuitable").value;
    const description = document.getElementById("editDesc").value;

    if(!nameProduct || nameProduct == ""){
        return alert("Insira o nome do produto")
    }

    if(!brandProduct || brandProduct == ""){
        return alert("Insira a marca do produto")
    }

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

    if(!gender || gender == ""){
        return alert("Insira o gênero do produto")
    }

    if(!category || category == ""){
        return alert("Insira uma categoria")
    }

    category = category.toLowerCase()
    category = category.charAt(0).toUpperCase() + category.slice(1)

    if(!suitableFor || suitableFor == ""){
        return alert("Especifique para qual esporte é indicado o produto")
    }

    if(editCaracteristicas.length<=0){
        return alert("Insira ao menos uma característica")
    }

    if(!description || description==""){
        return alert("Insira uma descrição do produto")
    }

    const isProduct2 = currentEditId.endsWith(".2");

    const updatedProductData = {
      name: nameProduct,
      price: discountPrice || price,
      fullPrice: price,
      discountPercentage: discountPrice ? Math.ceil(100 - (discountPrice / price) * 100) : 0,
      qtSales: Math.random() * 5000,
      hasDiscount: discountPrice ? true : false,
      brand: brandProduct,
      description: description,
      characteristics: [Object.fromEntries(editCaracteristicas)],
      variants: editVariants,
      images: editImagesSelected,
      category: category,
      gender: gender,
      suitableFor: suitableFor,
      isProduct2: isProduct2,
    };

    try {
      btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Salvando...';
      btnSubmit.disabled = true;

      const idNumerico = currentEditId.split(".")[0];

      await updateProduct(idNumerico, updatedProductData);

      alert("Produto atualizado com sucesso!");
      window.location.reload();

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Falha ao salvar as edições. Tente novamente.");
      btnSubmit.innerHTML = "Salvar Alterações";
      btnSubmit.disabled = false;
    }
  });
});