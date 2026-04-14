
// SINCRONIZAR CHECK COM URL

export function sincronizarCheckboxes(params) {
    // Desmarca tudo primeiro
    document.querySelectorAll('.filtro-checkbox').forEach(cb => cb.checked = false);

    const marcas = params.getAll('marca').map(m => m.toLowerCase());
    const generos = params.getAll('genero').map(g => g.toLowerCase());
    const categorias = params.getAll('categoria').map(c => c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());

  
    document.querySelectorAll('.filtro-checkbox').forEach(cb => {
        const valorLimpo = cb.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        if (cb.name === 'marca' && marcas.includes(valorLimpo)) cb.checked = true;
        if (cb.name === 'genero' && generos.includes(valorLimpo)) cb.checked = true;
        if (cb.name === 'categoria' && categorias.includes(valorLimpo)) cb.checked = true;
    });
}

// EVENTOS ASIDE

export function iniciarFiltrosLateral(callbackAtualizarVitrine) {
    
    function atualizarURLPelaSidebar() {
        const params = new URLSearchParams();


        const urlAntiga = new URLSearchParams(window.location.search);
        if (urlAntiga.has('promocao')) params.set('promocao', urlAntiga.get('promocao'));


        document.querySelectorAll('input[name="marca"]:checked').forEach(cb => params.append('marca', cb.value));
        document.querySelectorAll('input[name="genero"]:checked').forEach(cb => params.append('genero', cb.value));
        document.querySelectorAll('input[name="categoria"]:checked').forEach(cb => params.append('categoria', cb.value));

        const novaURL = window.location.pathname + '?' + params.toString();
        window.history.pushState({ path: novaURL }, '', novaURL);


        if (typeof callbackAtualizarVitrine === 'function') {
            callbackAtualizarVitrine();
        }
    }

    document.querySelectorAll('.filtro-checkbox').forEach(cb => {
        cb.addEventListener('change', atualizarURLPelaSidebar);
    });


    const btnAplicar = document.getElementById('btnAplicarFiltros');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', () => {
            atualizarURLPelaSidebar();
            

            const offcanvasElement = document.getElementById('filtrosOffcanvas');
            if (offcanvasElement && typeof bootstrap !== 'undefined') {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvasInstance) offcanvasInstance.hide();
            }
        });
    }
}