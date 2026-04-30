import { isPasswordValid, loginUser } from "../../js/users/useAuth.js"
import { initTermsModal } from "./termos-modal.js"

const urlParams = new URLSearchParams(window.location.search);

const fecharModalSenha = document.getElementById('sairModalSenha');
const abrirModalSenha = document.getElementById('abrirModalSenha');
const modalRecuperarSenha = document.querySelector('.modalRecuperarSenha');
const enviarInstrucoes = document.getElementById('enviar');
const formLogin = document.querySelector('.login-form')

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

const abrirModal = () => {
    modalRecuperarSenha.classList.add('is-open');
};

const fecharModal = () => {
    modalRecuperarSenha.classList.remove('is-open');
};

abrirModalSenha.addEventListener('click', (event) => {
    event.preventDefault();
    abrirModal();
});

fecharModalSenha.addEventListener('click', fecharModal);

enviarInstrucoes.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Instruções de redefinição de senha enviadas para o email fornecido.');
    fecharModal();
});

modalRecuperarSenha.addEventListener('click', (event) => {
    if (event.target === modalRecuperarSenha) {
        fecharModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        fecharModal();
    }
});


formLogin.addEventListener("submit", async (event) => {
    event.preventDefault()
    console.log("SUBMITED")

    var email = formLogin.querySelector("#login-user").value
    if (!validator.isEmail(email)) {
        return alert("Email inválido")
    }

    var password = formLogin.querySelector("#login-password").value
    if (!isPasswordValid(password)) {
        return alert("Senha não cumpre os requisitos")
    }

    try {
        var user = await loginUser({ email, password })
        var back = urlParams.get("back_to")
        if(back){
            window.location = back
            return;
        }

        if (user.isAdmin) {
            window.location = "/dashboard"
            return;
        }
        window.location = "/"
    } catch (e) {
        alert(e.message)
    }
})