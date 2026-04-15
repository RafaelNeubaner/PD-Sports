import {loginUser} from "../../js/users/useAuth.js"

const fecharModalSenha = document.getElementById('sairModalSenha');
const abrirModalSenha = document.getElementById('abrirModalSenha');
const modalRecuperarSenha = document.querySelector('.modalRecuperarSenha');
const enviarInstrucoes = document.getElementById('enviar');
const formLogin = document.querySelector('.login-form')

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


formLogin.addEventListener("submit", async (event)=>{
    event.preventDefault()
    console.log("SUBMITED")

    var email = formLogin.querySelector("#login-user").value
    if(!validator.isEmail(email)){
        return alert("Email inválido")
    }

    var password = formLogin.querySelector("#login-password").value
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/;   
    if(!regex.test(password)){
        return alert("Senha não cumpre os requisitos")
    }

    const result = await loginUser({email, password})

    try{
        await loginUser({email, password})
        window.location = "/"
    }catch(e){
        alert(e.name)
    }
})