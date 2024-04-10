import { product } from './class.js';
$(document).ready(function () {

    //testing userid

    var userid = 1;
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
                     for(var i = 0 ; i<result.length;i++){
                  $('.reviews-container').append(append_review(result[i].content,result[i].username,result[i].rating,result[i].review_date)) ;
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
              product1=  new product(result[0].productid, result[0].productname, result[0].price, result[0].quantity, result[0].description, result[0].rating);
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
            }		
            
     });

        ///cart_add_product/:uid/:pid/:qty/
     }

     $('#cart_btn').click(function(){
        if(check_stock()){
        db_add_product_to_cart(userid,productId,1);
        }else{
            alert('sorry, not enough stock');
        }



     });

     $('.review-form').on('submit', function(event) {
        event.preventDefault();
        var pid=productId ;
         
        var content =$('#comment').val();
        var rating = $('#rating').val();
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
                alert("review submitted");
              }
              location.reload();
              
               
                 
            }		
         
         
     }); 

     })
      
     function display_product_info(product){
        $('.product-name').html(product.name);
        $('.product-price').html('$'+product.price);
        $('.description').html(product.desc);
        var qty = product.qty;
        $('.product-image').attr('src','../img/product/'+product.id+'/cover.png')


     }
     function check_stock(){
        
        return product1.qty>0;

     }









});