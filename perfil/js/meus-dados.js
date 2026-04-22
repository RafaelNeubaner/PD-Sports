document.addEventListener("DOMContentLoaded", () => {
    
    // SELEÇÃO DADOS PESSOAIS
    const formPessoais = document.querySelector("#dadosPessoais form");
    const inputNome = document.getElementById('nome');
    const inputSobrenome = document.getElementById('sobrenome');
    const inputCpf = document.getElementById('cpf');
    const inputTelefone = document.getElementById('telefone');
    const inputDataNascimento = document.getElementById('data-nascimento');
    const btnEditarPessoais = formPessoais.querySelector("button");

    const inputsPessoais = [inputNome, inputSobrenome, inputCpf, inputTelefone, inputDataNascimento];


    // SIMULAÇÃO COM DADOS 
    function carregarDadosIniciaisFake() {
        inputNome.value = "João";
        inputSobrenome.value = "Silva";
        inputCpf.value = "12345678900";
        inputTelefone.value = "11999999999";
        inputDataNascimento.value = "1990-05-15"; 
        
        bloquearCampos();
    }

    function bloquearCampos() {
        inputsPessoais.forEach(input => input.setAttribute("readonly", true));
    }

    function desbloquearCampos() {
        inputsPessoais.forEach(input => input.removeAttribute("readonly"));
    }

    carregarDadosIniciaisFake();


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
                firstname: inputNome.value,
                lastname: inputSobrenome.value,
                cpf: inputCpf.value,
                phone: inputTelefone.value,
                birthDate: inputDataNascimento.value
            };

            console.log("Dados prontos para enviar para a API:", dadosAtualizados);
            setTimeout(() => {
                
                alert("Dados atualizados com sucesso!");

                bloquearCampos();

                btnEditarPessoais.textContent = "Editar dados";
                btnEditarPessoais.classList.remove("btnPrimary");
                btnEditarPessoais.classList.add("btnOutline");
                btnEditarPessoais.disabled = false;

            }, 1500); 
        }
    });

});