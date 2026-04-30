import {getUserAuthenticated, signOut} from "./users/useAuth.js"
import {cartApi} from "./carrinho/useCart.js"
const user = await getUserAuthenticated()

if(user){
    document.querySelectorAll(".loginLink").forEach(link=>{
        link.classList.remove("block")
        link.classList.remove("d-md-block")
        link.classList.add("d-none")
    })
    document.querySelectorAll(".logoutLink").forEach(link=>{
        link.classList.remove("d-none")
    })
}else{
    document.querySelectorAll(".iconProfile").forEach(el=>{
        el.classList.remove("d-md-block")
        el.classList.add("d-none")
    })
    document.querySelectorAll(".logoutLink").forEach(link=>{
        link.classList.add("d-none")
    })
}

document.querySelectorAll(".logoutBtn").forEach(btn=>{
    btn.addEventListener("click", (event)=>{
        event.preventDefault()
        signOut()
        window.location.href = "/index.html"
    })
})

cartApi.atualizarBadgeGlobal()