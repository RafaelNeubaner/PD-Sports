import { getUserAuthenticated, updatePassword, updateUser } from "../../js/users/useAuth.js";

const loadingPage = document.querySelector(".loadingPage")

// SELEÇÃO DADOS PESSOAIS
const formPessoais = document.querySelector("#dadosPessoais form");
const inputNome = document.getElementById('nome');
const inputSobrenome = document.getElementById('sobrenome');
const inputCpf = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');
const inputDataNascimento = document.getElementById('data-nascimento');
const inputEmail = document.getElementById("emailInput")
const inputNovoEmail = document.getElementById("newEmailInput")
const inputSenha = document.getElementById("senhaInput")
const inputNovaSenha = document.getElementById("novaSenhaInput")

const btnEditarPessoais = formPessoais.querySelector("button");
const btnEditarEmail = document.querySelector(".btnAlterarEmail")
const btnEditarSenha = document.querySelector(".btnAlterarSenha")
const passwordContainers = document.querySelectorAll(".passwordWithEye")

const inputsPessoais = [inputNome, inputSobrenome, inputCpf, inputTelefone, inputDataNascimento];

function bloquearCampos() {
    inputsPessoais.forEach(input => input.setAttribute("readonly", true));
}

function desbloquearCampos() {
    inputsPessoais.forEach(input => input.removeAttribute("readonly"));
}

function updateUserOnScreen(user){
    inputNome.value = user.firstname;
    inputSobrenome.value = user.lastname;
    inputCpf.value = user.cpf;
    inputTelefone.value = user.phone;
    inputEmail.value = user.email
    inputDataNascimento.value = user.birthday.split("T")[0]; 
    inputNovoEmail.value = ""
    inputSenha.value=""
    inputNovaSenha.value=""
}

document.addEventListener("DOMContentLoaded", async () => {
    
    var user = await getUserAuthenticated();
   
    updateUserOnScreen(user);
    
    bloquearCampos();    

    loadingPage.classList.remove("show")

    // BOTÃO EDITAR / SALVAR
    btnEditarPessoais.addEventListener("click", async () => {
        const modoAtual = btnEditarPessoais.textContent.trim();

        if (modoAtual === "Editar dados") {

            desbloquearCampos();
            
            inputNome.focus(); 
            
            btnEditarPessoais.textContent = "Salvar alterações";
            btnEditarPessoais.classList.remove("btnOutline");
            btnEditarPessoais.classList.add("btnPrimary"); 

        } else if (modoAtual === "Salvar alterações") {
            // ALVAR: 

            btnEditarPessoais.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Salvando...';
            btnEditarPessoais.disabled = true;

            const dadosAtualizados = {
                ...user,
                firstname: inputNome.value,
                lastname: inputSobrenome.value,
                cpf: inputCpf.value,
                phone: inputTelefone.value,
                birthday: new Date(inputDataNascimento.value),
                email: inputEmail.value
            };

            user = await updateUser(dadosAtualizados.id, dadosAtualizados)
            updateUserOnScreen(user)
            
            alert("Dados atualizados com sucesso!");
            
            bloquearCampos();
            
            btnEditarPessoais.textContent = "Editar dados";
            btnEditarPessoais.classList.remove("btnPrimary");
            btnEditarPessoais.classList.add("btnOutline");
            btnEditarPessoais.disabled = false;
        }
    });

    passwordContainers.forEach(passwordContainer=>passwordContainer.querySelector("i").addEventListener('click', ()=>{
       passwordContainer.querySelector("i").classList.toggle("bi-eye-slash") 
       passwordContainer.querySelector("i").classList.toggle("bi-eye") 

       if(passwordContainer.querySelector("i").classList.contains("bi-eye")){
        passwordContainer.querySelector("input").type="text"
       }else{
        passwordContainer.querySelector("input").type="password"
       }
    }))


    btnEditarEmail.addEventListener('click', async ()=>{
        if(!inputNovoEmail || !inputNovoEmail.value) return alert("Digite o novo email");

        btnEditarEmail.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Salvando...';
        btnEditarEmail.disabled = true;

        const updatedUser = {
            ...user,
            email: inputNovoEmail.value
        }

        try{
            user = await updateUser(updatedUser.id, updatedUser)
            updateUserOnScreen(user)
        }catch(e){
            alert("Ocorreu um erro: "+ e.message)
        }

        btnEditarEmail.innerHTML = 'Alterar E-mail';
        btnEditarEmail.disabled = false;

        alert("Email atualizado")
    })

    btnEditarSenha.addEventListener('click', async ()=>{
        console.log(inputSenha)
        console.log(inputNovaSenha)
        if(!inputSenha || inputSenha.value.trim() == "" || !inputNovaSenha || inputNovaSenha.value.trim() == "") return alert("Digite a nova senha");

        btnEditarSenha.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Salvando...';
        btnEditarSenha.disabled = true;
        try{
            user = await updatePassword(user.id, inputSenha.value, inputNovaSenha.value)
            updateUserOnScreen(user)
        }catch(e){
            alert("Ocorreu um erro: "+ e.message)
        }

        btnEditarSenha.innerHTML = 'Alterar Senha';
        btnEditarSenha.disabled = false;
        
        alert("Senha atualizada")
    })
});





// SE USUÁRIO ADM MOSTRA BTN ADMIN
const user = await getUserAuthenticated();

const btnAdmin = document.querySelector(".js-btn-admin");

if (user && user.isAdmin) {

    btnAdmin.classList.remove("d-none");
}