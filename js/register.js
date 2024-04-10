
import {db_insert_user} from './class.js';
$(document).ready(function () {
console.log('hi');


$('#registerForm').validate({
    rules: {
      user_name: 'required',
      user_age: {
        required: true,
        number: true
      },
      password: 'required',
      user_email:'required',
    //  user_image: 'required',
      gender: 'required'
       
    },
    messages: {
      user_name: 'please input username',
      user_age: {
        required: 'please input age',
        number: 'age must be number'
      },
      password: 'please input password',
      gender: 'please select gender',
  //    user_image: 'please upload icon',
      user_email: 'please input user email'
       
    },
    errorPlacement: function(error, element) {
         
        $('#form_error').append(error);
        error.after('<br>');
      },
    submitHandler: function(form) {
      //upload database
       
            var name=$('input[name="user_name"]').val();
            console.log(name);
             
             var pw =$('input[name="password"]').val();
            var email=$('input[name="user_email"]').val();
            var gender=$('input[name="gender"]').val();
            var age=$('input[name="user_age"]').val();
     
            $.ajax({
                type: 'get',
                headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
                url:'http://localhost:3100/check_email/'+email+'/',
                dataType:'json',
                success: function(result){
                  console.log(result);    
                  if(result.length==0){
                    alert('email address is already registerd , please try another one!');
                  }else{
                    
                    db_insert_user(name,email,gender,age,pw);
                    alert('register success!');
                    window.location.href = "login.html";
                  }
                  
                }		
                
         }); 
           

       
       
    }
});




});
 