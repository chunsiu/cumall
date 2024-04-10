import {user,db_update_user_by_Id,db_delete_user_by_Id,db_insert_user} from './class.js';
$(document).ready(function () {

    var isEditing = false;
    var userList=db_get_userList();
    //functions 
    //get user info from database

    //
    //append html function

    //

    // alter user info function


    //




    //





    function db_get_userList(){
        var userList=[];
        $.ajax({
            type: 'get',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
            url:'http://localhost:3100/get_all_users/',
            dataType:'json',
            success: function(result){
              console.log(result); 
              for(var i=0;i<result.length;i++){
                userList.push(new user(result[i].userid,result[i].username,result[i].email,result[i].age,result[i].gender));
    //id,name,email,age,gender
              }  
              console.log(userList);
              add_user_to_ui(userList);


              //ui Listener
              $('.toggle-btn').click(function () {
                $('#add_user_form').toggle();
                $('.toggle-icon').html() == '+' ? $('.toggle-icon').html('-') : $('.toggle-icon').html('+')
            });
        
        
            $(".edit-btn").on("click", function () {
                
                console.log('hi');
                 const row = $(this).parent().siblings('td').not('.id');
                 console.log(row.attr('contenteditable')=='false');
                 if(row.attr('contenteditable')=='false'&&isEditing){
                    alert("you're editing another row")
                    return;
                 }
                 
                  if (row.attr('contenteditable')=='false') {
                    row.attr('contenteditable', 'true');
                    row.addClass('editable-row');
                     $(this).text("Save"); 
                     isEditing=true;
        
                    } else {
                        //save user info to database function 
                        var uid=$(this).parent().siblings('.id').html();
                        var name=$(this).parent().siblings('.name').html();
                        var email=$(this).parent().siblings('.email').html();
                        var gender=$(this).parent().siblings('.gender').html();
                        var age=$(this).parent().siblings('.age').html();

                        console.log('name : ' +name);
                        console.log('id : ' +uid);
                        console.log('emaik : ' +email);
                        console.log('gender : ' +gender);
                        console.log('age : ' +age);
                        db_update_user_by_Id(uid,name,email,gender,age);
                        console.log('hi');
        
                        //
                        row.attr('contenteditable', 'false');
                        row.removeClass('editable-row');
                         $(this).text("Edit"); 
                         isEditing=false;
                        } 
                    }); 
        
                    $(".delete-btn").on("click", function () { 
                        var uid=$(this).parent().siblings('.id').html();
                        var name=$(this).parent().siblings('.name').html();
                        const row = $(this).parent().parent();

                       if( window.confirm('are you sure to delete information of '+name+'?') ){
                        //remvoe user from database 
                        db_delete_user_by_Id(uid);
                        row.remove();
             } });
             $('#add_user_form').validate({
                rules: {
                  user_name: 'required',
                  user_age: {
                    required: true,
                    number: true
                  },
                  user_pw:'required',
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
                         
                         
                         
                        var email=$('input[name="user_email"]').val();
                        var gender=$('input[name="gender"]').val();
                        var password=$('input[name="user_pw"]').val();
                        var age=$('input[name="user_age"]').val();
                         

                        $.ajax({
                            type: 'get',
                            headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
                            url:'http://localhost:3100/check_email/'+email+'/',
                            dataType:'json',
                            success: function(result){
                              console.log(result);    
                              if(result.length!=0){
                                alert('email address is already registerd , please try another one!');
                              }else{
                                
                                db_insert_user(name,email,gender,age,password);
                                alert('user created');
                                window.location.reload();
                              }
                              
                            }		
                            
                     }); 
                   
                }
              });
                       
        
                             
        
    
    
              return userList;    
            }	
                
            
     }); 
    }
    //id,name,email,age,gender
    function add_user_to_ui(userList){
        for(var i=0;i<userList.length;i++){
        var html='';
        html+='<tr>';
        html+='        <td class="id" contenteditable="false">'+userList[i].id +'</td> ';  
        html+='        <td class="name" contenteditable="false">'+userList[i].name +'</td>';
        html+='        <td class="email" contenteditable="false">'+userList[i].email +'</td> ';     
        html+='        <td class="gender" contenteditable="false">'+userList[i].gender +'</td>';
        html+='        <td class="age" contenteditable="false">'+userList[i].age +'</td>';
        html+='        <td>';
        html+='            <button class="btn edit-btn"  >Edit</button>';
        html+='    <button class="btn delete-btn" onclick="deleteRow(this)"><i class="fa-solid fa-trash"></i>Delete</button>';
        html+='        </td>';
        html+='    </tr>';
    
        $('.display-product-table').append(html);
        }
     
    }
    


})