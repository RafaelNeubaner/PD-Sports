import {createUser, isPasswordValid} from "../../js/users/useAuth.js"

const formCadastro = document.querySelector(".regForm")

const bday = formCadastro.querySelector("#login-bday")

const minDate = new Date()
const maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 100)
maxDate.setFullYear(maxDate.getFullYear() - 18)

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