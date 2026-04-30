import {getUserAuthenticated} from './useAuth.js'

var user = await getUserAuthenticated()

if(user == null){
    window.location = '/unauthorized.html'
}