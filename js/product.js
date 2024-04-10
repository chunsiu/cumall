import { product,session_get_login_userId,update_rating,update_cart_icon } from './class.js';
$(document).ready(function () {

    //testing userid

   // var userid = 1;

   var userid =  session_get_login_userId();
   console.log("userid :"+userid);
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('pid');
     
    console.log(productId);
    var product1;
    db_get_product_by_Id(productId);
    db_get_review(productId);


    function db_get_review(pid){
         
            $.ajax({
                type: 'get',
                headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
                url:'http://localhost:3100/get_review/'+pid+'/' ,
                
                success: function(result){
                    var date ;
                    var localDate;
                    const hongKongTimeZone = 'Asia/Hong_Kong';
                    var hongkongDate
                    
                     for(var i = 0 ; i<result.length;i++){
                        date = new Date(result[i].review_date);
                        
                        hongkongDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (8 * 3600000)).toLocaleString('zh-HK', { timeZone: hongKongTimeZone });
                  $('.reviews-container').append(append_review(result[i].content,result[i].username,result[i].rating,hongkongDate )) ;
                     }
                   
                }		
                
         });
    
            ///cart_add_product/:uid/:pid/:qty/
         }
    
    function append_review(content,username,rating,date){
        console.log(rating);
        var html='';
        html+='<div class="review-item">';
        html+='<div class="review-left">';
        html+='<span class="review-author">'+username +'</span>';
        html+='<span class="review-content">'+content+'</span>';
        html+='</div>';
        html+='<div class="review-right">';
        for(var i=0;i<5;i++){
            if(i<rating){
        html+='       <span class="review-rating"><i class="fa fa-star checked"></i></span>';
            }else{
                html+='       <span class="review-rating"><i class="fa fa-star "></i></span>';
            }
        }
        html+='<span class="review-date">'+date+'</span>';
        html+='</div>';
        html+='</div>';
        return html;
    }

     function db_get_product_by_Id(id){
    
        $.ajax({
            type: 'get',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
            url:'http://localhost:3100/get_product_by_Id/'+id+'/' ,
            
            success: function(result){
                 
              console.log(result);  
              product1=  new product(result[0].productid, result[0].productname, result[0].price, result[0].quantity, result[0].description, result[0].rating,result[0].type);
                display_product_info(product1);
            }		
            
     }); 
     }

     function db_add_product_to_cart(uid,pid,qty){
        $.ajax({
            type: 'get',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
            url:'http://localhost:3100/cart_add_product/'+uid+'/' +pid+'/'+qty+'/',
            
            success: function(result){
                 
              console.log(result);  
              alert('product added to cart');
              update_cart_icon(uid);
              //location.reload();
            }		
            
     });

        ///cart_add_product/:uid/:pid/:qty/
     }

     $('#cart_btn').click(function(){
        if(session_get_login_userId()){
             
            $.ajax({
                type: 'get',
                headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
                url:'http://localhost:3100/get_product_by_Id/'+productId+'/' ,
                
                success: function(result){
                     
                  console.log(result);  
                 var db_qty=result[0].quantity;
                 if(db_qty>0){
                    db_add_product_to_cart(userid,productId,1);
                    }else{
                        alert('sorry, not enough stock');
                    }
                }		
                
         }); 



        
    }else{
        if(window.confirm("you have to login before using cart function, you want to login first?")){
            window.location.href = "login.html";
        }
    }



     });

     $('.review-form').on('submit', function(event) {
        event.preventDefault();
        var pid=productId ;
         
        var content =$('#comment').val();
        var rating = $('#rating1').val();
        
        console.log(rating);
         
        var data={
            uid: userid,
            pid : pid,
            content:content,
            rating : rating
    
        };
        $.ajax({
            type: 'post',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
            url:'http://localhost:3100/insert_review',
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify(data),
            dataType:'json',
            success: function(result){
              console.log(result);
              if(result.affectedRows==0){
                 
                 
              }else{
                update_rating(pid);
                alert("review submitted");
              }
              location.reload();
              
               
                 
            }		
         
         
     }); 

     })
      
     function display_product_info(product){
        $('.product-name').html('<h1>'+product.name+'</h1>');
        $('.product-price').html('$'+product.price);
        $('.description').html(product.desc);
        $('.type').html('<h4>'+product.type+'</h4>');
        var qty = product.qty;
        $('.product-image').attr('src','../img/product/'+product.id+'/cover.png');
        var html="";
        for(var i=0;i<5;i++){
            if(i<product.rating){
        html+='       <span class="review-rating"><i class="fa fa-star checked"></i></span>';
            }else{
                html+='       <span class="review-rating"><i class="fa fa-star "></i></span>';
            }
        }
        $('#rating').html(html);


     }
     function check_stock(){
        
        return product1.qty>0;

     }









});