import { product,session_get_login_userId } from './class.js';
$(document).ready(function(){


//test user id      will change after login function completed
//var userid = 1;
//

var userid = session_get_login_userId(); 

function load_profile(){
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/get_user2/'+userid,
        dataType:'json',
        success: function(result){
          console.log(result);
           
          var name = result[0].username;
          var email= result[0].email;
          var age = result[0].age;
          var gender = result[0].gender;

          $("#name").val(name);
          $("#email").val(email);
          $("#age").val(age);
          $("#gender").val(gender);
             
        }		
     
     
 }); 

}

function save_profile(name,age,gender){
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/update_profile/'+userid+'/'+name+'/'+gender+'/'+age+'/',
        dataType:'json',
        success: function(result){
          console.log(result);
          alert("profile updated");
          location.reload();
             
        }		
     
     
 }); 



}

function change_password(){
    var old_pw = $("#currentPassword").val();
    var new_pw = $("#newPassword").val();
    var new_pw2 = $("#newPassword2").val();
    if(new_pw!=new_pw2){
        alert("ensure new password incorrect");
        location.reload();
        return;
    }
    var data={
        uid:userid,
        old_pw : old_pw,
        new_pw : new_pw

    };
    $.ajax({
        type: 'post',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/change_pw',
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(data),
        dataType:'json',
        success: function(result){
          console.log(result);
          if(result.affectedRows==0){
            alert("wrong present password");
             
          }else{
            alert("password updated");
          }
          location.reload();
          
           
             
        }		
     
     
 }); 

}


load_profile();


$("#info_save_btn").click(function() {
     
    var name = $("#name").val();
          
    var age =  $("#age").val();
    var gender =  $("#gender").val();
     save_profile(name,age,gender);


});

$("#change_pw_btn").click(function() {
     
    change_password();


});




})