import {session_get_login_userId,session_logout_user,db_get_cart,product,session_get_login_userName} from './class.js';
$(document).ready(function () {
    if(session_get_login_userId()){
        var uid = session_get_login_userId();
        var name= session_get_login_userName();
    $('#login_btn').html('Logout<i class="fa-solid fa-right-from-bracket fa-lg"> ');
    //$('#navbar').prepend('<li>Welcome, '+name+'</li>')  
    $('#navbar').append('<li>Welcome, '+name+'</li>')   ; 
    $('#login_btn').click(function(event){
        event.preventDefault();
        if(window.confirm("are you sure you want to logout?")){
            session_logout_user();
            window.location.href=("index.html");
        }

    
    })

    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/get_cart/'+uid+'/',
        dataType:'json',
        success: function(result){
          console.log(result); 
          $('.badge').html(result.length);  
             
        }	
        	
        
 });

    $('.badge').html(1);

}else{
    $('.cart').parent().remove();
    $('#profile').parent().remove();
}
    






});