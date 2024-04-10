import {session_get_login_adminId,session_logout_admin,db_get_cart,product,session_get_login_adminName} from './class.js';
$(document).ready(function () {
    if(session_get_login_adminId()){
        var uid = session_get_login_adminId();
        console.log(uid);
        var name= session_get_login_adminName();
    $('#login_btn').html('Logout<i class="fa-solid fa-right-from-bracket fa-lg"> ');
    //$('#navbar').prepend('<li>Welcome, '+name+'</li>')  
    $('#navbar').append('<li>Welcome, '+name+'</li>')   ; 
    $('#login_btn').click(function(event){
        event.preventDefault();
        if(window.confirm("are you sure you want to logout?")){
            session_logout_admin();
            window.location.href=("adminLogin.html");
        }

    
    })

 

  //  $('.badge').html(1);

}else{
   
}
    






});