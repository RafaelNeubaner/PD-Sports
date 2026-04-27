import { getUserAuthenticated } from './useAuth.js'

var user = await getUserAuthenticated()

if (user != null) {
    if (user.isAdmin) {
        window.location = "/dashboard/index.html"
    }
    window.location = '/index.html'
}