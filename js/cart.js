import {product,ProductList,CartList,  session_get_Cart,getProductById,session_save_Cart,removeProductById} from './class.js';
$(document).ready(function(){

    var userid = 1 ; //test 

var cartList =[];
 cartList= session_get_Cart();
 console.log(cartList);
 var final_total=0;

 function create_order(data){
    var orderid =0;
    $.ajax({
        type: 'post',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/create_order2',
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify(data),
        dataType:'json',
        success: function(result){
          console.log(result);
         orderid=result.orderid;
         for(var i=0;i<cartList.length;i++){
            minus_product(cartList[i].id,cartList[i].qty);
            insert_op(orderid,cartList[i].id,cartList[i].qty);

         }

         alert('puchase success');
            window.sessionStorage.removeItem('CartList');
            window.location.href = 'http://localhost/3100project/html/index.html';

           
          
           
             
        }		
     
     
 }); 

 }

 function minus_product(pid,qty){
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/product_minus/'+pid+'/'+qty+'/',
        dataType:'json',
        success: function(result){
          console.log(result);
           
           
             
        }		
     
     
 }); 
 }
 function insert_op(oid,pid,qty){
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/insert_op/'+oid+'/'+pid+'/'+qty,
        dataType:'json',
        success: function(result){
          console.log(result);
          
           
             
        }		
     
     
 }); 
 }


 function update_total(){
    var total=0;
     $('.itemPrice').each(function(){
         
        total+=  Number( $(this).html().slice(1));
     })
     $('.total').html('Total : $'+total);
     final_total=total;
     

 }


 function update_subtotal(id,qty,price){
    
    $('[productid="'+id+'"]').children('.itemDetails').children('.itemPrice').html('$'+qty*price);
     
     update_total();
 }


 function add_cart_product(){
    var html="";
    var product;
    for(var i =0;i<cartList.length;i++){
        html="";
        product=cartList[i];
        html+='<div class="cartItem" productid="'+product.id+'">  ';
        html+='<img src="'+product.cover+'" alt="Product">';
        html+='<div class="itemDetails">';
        html+='   <p class="itemName">'+product.name+'</p>';
       /*  html+='    <div class="itemInfo">';
        html+='        <p class="infoKey">Color:</p>';
        html+='        <p class="infoValue">Black</p>';
        html+='    </div>';
        html+='    <div class="itemInfo">';
        html+='        <p class="infoKey">Size:</p>';
        html+='        <p class="infoValue">M</p>';
        html+='    </div>'; */
        html+='    <p class="itemPrice" id="price">$'+product.price*product.qty+'</p>';
        html+='    <div class="itemQuantity">';
                
        html+='        <button class="minus-btn"><i class="fas fa-minus"></i></button><input type="number" class="qtyInput" min = "1" value="'+product.qty+'"  ><button class="plus-btn"><i class="fas fa-plus"></i></button>';
        html+='    </div>';
        html+='    <div class="itemActions">';
        html+='       <button class="remove">Remove</button>';
                  
        html+='   </div>';
        html+='</div>';
        html+='</div>';
        $("#cartItems").append(html);

    }

 }

        add_cart_product();

        update_total();
         

// minus button 
        $('.minus-btn').click(function() {
            var id = $(this).parent().parent().parent().attr('productid');
            var product = getProductById(cartList,id);

             
            var qty = $(this).siblings('.qtyInput').val();
            if(qty==1){
                alert('the quantity cannot be less than 1, you can remove the item if needed');
                return;
            }
            //update ui qty
            $(this).siblings('.qtyInput').val(qty-1);
            //update ui price
            update_subtotal(id,product.price,qty-1);
            //update session
             
             
            product.qty = qty-1;
            session_save_Cart(cartList);
             

          });
// add button 
          $('.plus-btn').click(function() {
            var id = $(this).parent().parent().parent().attr('productid');
            var product = getProductById(cartList,id);

             
            var qty = Number($(this).siblings('.qtyInput').val());
            //update ui qty
            $(this).siblings('.qtyInput').val(qty+1);
            //update ui price
            update_subtotal(id,product.price,qty+1);
            //update session
             
             
            product.qty = qty+1;
            session_save_Cart(cartList);
          });

//  

//input box on change

$('.qtyInput').change(function() {
    var id = $(this).parent().parent().parent().attr('productid');
    var product = getProductById(cartList,id);
    var value = $(this).val();
    if(value<1){
        $(this).val(1);
        value=1;
        alert('the quantity cannot be less than 1, you can remove the item if needed');
    }
    //update price
    update_subtotal(id,product.price,value);
    //update session
    product.qty = value;
            session_save_Cart(cartList);
     
  });





//

//remove button 
    $('.remove').click(function() {
        
         
        var id = $(this).parent().parent().parent().attr('productid');
        console.log(id);
        //remove product from cartlist 
        cartList = removeProductById(cartList,id);
        //remove product from ui 
        $(this).parent().parent().parent().remove();
        //update session cartlist 
        session_save_Cart(cartList);
         

    });






//

//checkout button 
$('.checkout').click(function(){
    var data={
        uid:userid,
        price: final_total,
        list: cartList

    };
    //if payment function is available, the connection part is here

    //

    //below assumed payment success  
     create_order(data);

      



})


//




})