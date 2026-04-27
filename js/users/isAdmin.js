import {getUserAuthenticated} from './useAuth.js'

var user = await getUserAuthenticated()

if(user == null || !user.isAdmin){
    window.location = '/unauthorized.html'
}