import {product,ProductList,CartList,getProductById,session_save_List,session_get_List,session_save_Cart} from './class.js';
$(document).ready(function(){
     
     var productList=[];
     var productList1=[];

    function add_product(product){
        var name = product.name;
        var description=product.desc ;
        var price = product.price;
        var rating = product.rating;
        var cover = product.cover;
        var html="";
        html+='<div class="content">';
        html+='<img src="'+cover+'">';
        html+='<h3>'+name+'</h3>';
        html+='<p>'+description+'</p>';
        html+='<h6>$'+price+'</h6>';
        html+='<ul>';
        for(var i=0;i<5;i++){
           if(rating>0){
            html+='    <li><i class="fa fa-star checked"></i></li>';
            rating--;
           } else{
            html+='    <li><i class="fa fa-star"></i></li>';
           }
        }
         
        html+='</ul>';
        html+='<button class="buy-1">Buy Now</button>';
        html+=' </div>"';

        return html;

    }


    function get_all_product(){
        $.ajax({
            type: 'get',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
            url:'http://localhost:3100/get_all_products/',
            dataType:'json',
            success: function(result){
              console.log(result);
              for(var i=0;i<result.length;i++){
                productList.push(new product(result[i].productid,result[i].productname,result[i].price,result[i].quantity,result[i].description,result[i].rating,result[i].path));

              }
              for(var i=0;i<productList.length;i++){
                 
               $('#productList').append(add_product(productList[i]));  
              }
              session_save_List(productList);
              session_save_Cart(productList);  //test  // 

                 
            }		
         
         
     });

    }


    get_all_product();
     
    //test   session     will remove after product detail page finished


    //





})