document.addEventListener("DOMContentLoaded", () => {
  
  const formNewsletter = document.getElementById("formNewsletter");

  if (formNewsletter) {
   
    formNewsletter.addEventListener("submit", (evento) => {
    
      evento.preventDefault(); 

      alert("Cadastro realizado com sucesso! Fique de olho no seu e-mail para novidades e ofertas.");
      formNewsletter.reset();
    });
  }
});