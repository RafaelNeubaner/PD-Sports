import {getUserAuthenticated} from "./users/useAuth.js"
import {cartApi} from "./carrinho/useCart.js"
const user = await getUserAuthenticated()

if(user){
    document.querySelectorAll(".loginLink").forEach(link=>{
        link.classList.remove("block")
        link.classList.remove("d-md-block")
        link.classList.add("d-none")
    })
}else{
    document.querySelector(".iconProfile").classList.remove("d-md-block")
}

cartApi.atualizarBadgeGlobal()