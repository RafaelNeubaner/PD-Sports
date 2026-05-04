import {createUser, isPasswordValid} from "../../js/users/useAuth.js"
import { initTermsModal } from "./termos-modal.js"

const formCadastro = document.querySelector(".regForm")

// Validação de Requisitos de Senha
function initPasswordRequirements() {
  const passwordInput = document.getElementById('login-password');
  const requirementsContainer = document.getElementById('passwordRequirements');
  
  if (!passwordInput || !requirementsContainer) return;

  const requirements = {
    minLength: (password) => password.length >= 8,
    uppercase: (password) => /[A-Z]/.test(password),
    lowercase: (password) => /[a-z]/.test(password),
    number: (password) => /\d/.test(password),
    special: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  function updateRequirements() {
    const password = passwordInput.value;
    
    // Mostrar o container se houver entrada
    if (password.length > 0) {
      requirementsContainer.style.display = 'block';
    } else {
      requirementsContainer.style.display = 'none';
    }

    // Atualizar cada requisito
    Object.entries(requirements).forEach(([key, test]) => {
      const requirementEl = requirementsContainer.querySelector(`[data-requirement="${key}"]`);
      if (requirementEl) {
        const isMet = test(password);
        if (isMet) {
          requirementEl.classList.add('met');
          const icon = requirementEl.querySelector('i');
          if (icon) {
            icon.classList.remove('bi-circle');
            icon.classList.add('bi-check-circle-fill');
          }
        } else {
          requirementEl.classList.remove('met');
          const icon = requirementEl.querySelector('i');
          if (icon) {
            icon.classList.remove('bi-check-circle-fill');
            icon.classList.add('bi-circle');
          }
        }
      }
    });
  }

  // Adicionar listener para validação em tempo real
  passwordInput.addEventListener('input', updateRequirements);
  
  // Inicializar na carga
  updateRequirements();
}

initTermsModal({
    openSelector: '#abrirModalTermos',
    modalSelector: '#termosModal',
    closeSelector: '#fecharModalTermos'
})

initPasswordRequirements();

const bday = formCadastro.querySelector("#login-bday")

const minDate = new Date()
const maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 100)
maxDate.setFullYear(maxDate.getFullYear() - 0)

bday.min = minDate.toISOString().split("T")[0]
bday.max = maxDate.toISOString().split("T")[0]

formCadastro.addEventListener("submit", async (event)=>{
    event.preventDefault()
    console.log("SUBMITED")

    var email = formCadastro.querySelector("#login-user").value
    if(!validator.isEmail(email)){
        return alert("Email inválido");
    }

    var phone = formCadastro.querySelector("#login-phone").value
    if(!validator.isMobilePhone(phone, "pt-BR")){
        return alert("Telefone inválido")
    }

    var cpf = formCadastro.querySelector("#login-cpf").value
    var regexCPF = /^(([0-9]{3}\.)[0-9]{3}\.)[0-9]{3}-([0-9]{2})$/;
    if(!regexCPF.test(cpf) && cpf.length !== 11){
        return alert("CPF inválido");
    }
    
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")

    var firstname = formCadastro.querySelector("#login-name").value
    var lastname = formCadastro.querySelector("#login-lastname").value
    if(!firstname || firstname.length < 5){
        return alert("Nome inválido");
    }
    if(!lastname || lastname.length<5){
        return alert("Sobrenome inválido")
    }

    var password = formCadastro.querySelector("#login-password").value
    var confirmPassword = formCadastro.querySelector("#login-confirm-password").value
    if(!isPasswordValid(password)) {
        return alert("Senha não cumpre os requisitos");
    }

    if(password!=confirmPassword){
        return alert("Senhas não coincidem");
    }

    try{
        await createUser({
            birthday: new Date(bday.value),
            cpf: cpf,
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password,
            phone: phone,       
        })
        window.location = "/login"
    }catch(e){
        alert(e.name)
    }
})


document.querySelectorAll(".passwordWithEye").forEach(passwordContainer=>passwordContainer.querySelector("i").addEventListener('click', ()=>{
    passwordContainer.querySelector("i").classList.toggle("bi-eye-slash") 
    passwordContainer.querySelector("i").classList.toggle("bi-eye") 

    if(passwordContainer.querySelector("i").classList.contains("bi-eye")){
    passwordContainer.querySelector("input").type="text"
    }else{
    passwordContainer.querySelector("input").type="password"
    }
}))