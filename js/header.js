import {getUserAuthenticated} from "./users/useAuth.js"

const user = await getUserAuthenticated()

if(user){
    document.querySelectorAll(".loginLink").forEach(link=>{
        link.classList.remove("block")
        link.classList.remove("d-md-block")
        link.classList.add("d-none")
    })
}