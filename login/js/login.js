const fecharModalSenha = document.getElementById('sairModalSenha');
const abrirModalSenha = document.getElementById('abrirModalSenha');
const modalRecuperarSenha = document.querySelector('.modalRecuperarSenha');
const enviarInstrucoes = document.getElementById('enviar');

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