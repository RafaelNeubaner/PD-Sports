document.addEventListener('DOMContentLoaded', () => {

    const linksMenu = document.querySelectorAll('.admin-sidebar .nav-link, .d-md-none a[href="#loja"]');
    const conteudos = document.querySelectorAll('main > section');

    function ocultarTodasAsTelas() {
        conteudos.forEach(section => {
            section.classList.add('d-none'); 
        });
        
        linksMenu.forEach(link => {
            link.classList.remove('active'); 
        });
    }

 
    function navegarPara(idTela) {
        ocultarTodasAsTelas(); 
        if (idTela === '#loja') {
            window.location.href = '/index.html';
            return;
        }

        const telaAlvo = document.querySelector(idTela);
        if (telaAlvo) {
            telaAlvo.classList.remove('d-none');
        }

        const linkAtivo = document.querySelector(`aside .nav-link[href="${idTela}"]`);
        if (linkAtivo) {
            linkAtivo.classList.add('active');
        }
    }

    linksMenu.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            const idTela = link.getAttribute('href');
            navegarPara(idTela);
        });
    });

    navegarPara('#desempenho');
});