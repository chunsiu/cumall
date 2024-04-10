import {product,db_update_product_by_Id,db_delete_product_by_Id,db_insert_product} from './class.js';
$(document).ready(function () {

    var isEditing = false;
    
    //functions 
    //get product info from database

    //
    //append html function

    //

    // alter product info function


    //




    //
    db_get_productList();

    $('.toggle-btn').click(function () {
        $('#add_product_form').toggle();
        $('.toggle-icon').html() == '+' ? $('.toggle-icon').html('-') : $('.toggle-icon').html('+')
    });






    function db_get_productList(){
        var productList=[];
        $.ajax({
            type: 'get',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
            url:'http://localhost:3100/get_all_products/',
            dataType:'json',
            success: function(result){
              console.log(result); 
              for(var i=0;i<result.length;i++){
                productList.push(new product(result[i].productid,result[i].productname,result[i].price,result[i].quantity,result[i].description,result[i].rating,result[i].type));
    //id,name,price,qty,desc,rating,cover
              }  
              console.log(productList);
              add_product_to_ui(productList);


              //ui Listener
             
        
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
                        //save product info to database function 
                        var id=$(this).parent().siblings('.id').html();
                        var name=$(this).parent().siblings('.name').html();
                        var price=$(this).parent().siblings('.price').html();
                        var type=$(this).parent().siblings('.type').html();
                        var quantity=$(this).parent().siblings('.qty').html();
                        var desc=$(this).parent().siblings('.desc').html();

                        console.log('name : ' +name);
                        console.log('id : ' +id);
                        console.log('emaik : ' +price);
                        console.log('gender : ' +quantity);
                        console.log('age : ' +desc);
                        db_update_product_by_Id(id,name,price,quantity,desc,type);
                         
        
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
                        //remvoe product from database 
                        db_delete_product_by_Id(uid);
                        row.remove();
             } });
             $('#add_product_form').validate({
                
                rules: {
                  product_name: 'required',
                  price: {
                    required: true,
                    number: true
                  },
                  quantity:'required',
                //  product_image: 'required',
                  description: 'required'
                   
                },
                messages: {
                  product_name: 'please input productname',
                  price: {
                    required: 'please input price',
                    number: 'price must be number'
                  },
                  quantity: 'please input quantity',
              //    product_image: 'please upload icon',
                  description: 'please input description'
                   
                },
                errorPlacement: function(error, element) {
                     
                    $('#form_error').append(error);
                    error.after('<br>');
                  },
                submitHandler: function(form) {
                  //upload database
                  
                  var fd = new FormData();
                  
                       var files = $('#cover')[0].files;
                        fd.append('file',files[0]);
                       
                         var name=$('input[name="product_name"]').val();
                        console.log(name);
                         
                        var type=$('#type1').val();
                        
                        var price=$('input[name="price"]').val();
                        var desc=$('textarea[name="description"]').val();
                        var qty=$('input[name="quantity"]').val();
                        
                  db_insert_product(name,price,qty,desc,fd,type);
                 alert('product created'); 
                  
                    form.submit();
                  
                }
              });
                       
        
                             
        
    
    
              return productList;    
            }	
                
            
     }); 
    }
    //id,name,price,qty,desc,rating,cover
    function add_product_to_ui(productList){
        for(var i=0;i<productList.length;i++){
        var html='';
        html+='<tr>';
        html+='        <td class="id" contenteditable="false">'+productList[i].id +'</td> ';  
        html+='        <td class="name" contenteditable="false">'+productList[i].name +'</td>';
        html+='        <td class="price" contenteditable="false">'+productList[i].price +'</td> ';  
        html+='        <td class="type" contenteditable="false">'+productList[i].type +'</td> ';   
        html+='        <td class="desc" contenteditable="false">'+productList[i].desc +'</td>';
        html+='        <td class="qty" contenteditable="false">'+productList[i].qty +'</td>';
        html+='        <td>';
        html+='            <button class="btn edit-btn"  >Edit</button>';
        html+='    <button class="btn delete-btn" onclick="deleteRow(this)"><i class="fa-solid fa-trash"></i>Delete</button>';
        html+='        </td>';
        html+='    </tr>';
    
        $('.display-product-table').append(html);
        }
     
    }
    


})