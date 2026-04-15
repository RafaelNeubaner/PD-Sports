
// 1. SINCRONIZAR CHECKBOXES  URL

export function sincronizarCheckboxes(params) {

  document.querySelectorAll('.form-check-input').forEach(cb => cb.checked = false);

  const marcas = params.getAll('marca').map(m => m.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  const generos = params.getAll('genero').map(g => g.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  let categorias = params.getAll('categoria').map(c => c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  if(categorias.includes("academia")){
    categorias.push("musculacao")
  }

  document.querySelectorAll('.form-check-input').forEach(cb => {

      if (!cb.name || !cb.value) return; 

      const valorLimpo = cb.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (cb.name === 'marca' && marcas.includes(valorLimpo)) cb.checked = true;
      if (cb.name === 'genero' && generos.includes(valorLimpo)) cb.checked = true;
      if (cb.name === 'categoria' && categorias.includes(valorLimpo)) cb.checked = true;
  });
}


// EVENTOS DA BARRA LATERAL

export function iniciarFiltrosLateral(callbackAtualizarVitrine) {
  
  function aplicarFiltros() {
      const params = new URLSearchParams();

      const urlAntiga = new URLSearchParams(window.location.search);
      if (urlAntiga.has('promocao')) 
        params.set('promocao', urlAntiga.get('promocao'));

      if(urlAntiga.get("query"))
        params.append("query", urlAntiga.get("query"))

      document.querySelectorAll('input[name="marca"]:checked').forEach(cb => params.append('marca', cb.value));
      document.querySelectorAll('input[name="genero"]:checked').forEach(cb => params.append('genero', cb.value));
      document.querySelectorAll('input[name="categoria"]:checked').forEach(cb => params.append('categoria', cb.value));

      const novaURL = window.location.pathname + '?' + params.toString();
      window.history.pushState({ path: novaURL }, '', novaURL);

      if (typeof callbackAtualizarVitrine === 'function') callbackAtualizarVitrine();
  }

  const btnAplicar = document.querySelector('.btn-aplicar');
  if (btnAplicar) {
      btnAplicar.addEventListener('click', () => {
          aplicarFiltros();

          const offcanvasElement = document.getElementById('filtrosOffcanvas');
          if (offcanvasElement && typeof bootstrap !== 'undefined') {
              const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
              if (offcanvasInstance) offcanvasInstance.hide();
          }
      });
  }
}