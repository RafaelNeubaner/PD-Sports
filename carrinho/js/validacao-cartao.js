document.addEventListener("DOMContentLoaded", () => {
  const radioPix = document.getElementById("pix");
  const radioCartao = document.getElementById("cartao");

  const inputsCartaoContainer = document.getElementById("camposCartao");

  const inputNumCartao = document.getElementById("n-cartao");
  const inputVencimento = document.getElementById("vencimento");
  const inputCvv = document.getElementById("cvv");
  const formCheckout = document.querySelector("form");


  function toggleCamposCartao() {
    if (radioCartao.checked) {
      inputsCartaoContainer.classList.remove("d-none");

      inputNumCartao.required = true;
      inputVencimento.required = true;
      inputCvv.required = true;
    } else {

      inputsCartaoContainer.classList.add("d-none");

      inputNumCartao.required = false;
      inputVencimento.required = false;
      inputCvv.required = false;
    }
  }

  radioPix.addEventListener("change", toggleCamposCartao);
  radioCartao.addEventListener("change", toggleCamposCartao);

  toggleCamposCartao();


  inputNumCartao.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); 
    value = value.replace(/(\d{4})/g, "$1 ").trim(); 
    e.target.value = value.substring(0, 19); 
  });


  inputVencimento.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    e.target.value = value;
  });

  inputCvv.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = value.substring(0, 4);
  });


  formCheckout.addEventListener("submit", (e) => {

    if (radioCartao.checked) {
      const numCartaoLimpo = inputNumCartao.value.replace(/\s/g, "");
      const vencimento = inputVencimento.value;
      const cvv = inputCvv.value;


      if (numCartaoLimpo.length < 13 || numCartaoLimpo.length > 16) {
        e.preventDefault(); 
        alert("Por favor, insira um número de cartão válido.");
        inputNumCartao.focus();
        return;
      }


      const regexData = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regexData.test(vencimento)) {
        e.preventDefault();
        alert("Data de vencimento inválida. Use o formato MM/AA.");
        inputVencimento.focus();
        return;
      }


      if (cvv.length < 3) {
        e.preventDefault();
        alert("CVV inválido. Geralmente possui 3 ou 4 dígitos.");
        inputCvv.focus();
        return;
      }
    }

  });
});
