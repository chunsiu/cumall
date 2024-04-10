import { product, session_get_login_userId, getProductById, db_update_product_qty_by_Id, removeProductById, db_remove_product_by_Id, } from './class.js';
$(document).ready(function () {


$.ajax({
    type: 'get',
    headers: { 'Access-Control-Allow-Origin': 'http://localhost' },
    url: 'http://localhost:3100/recommend_product/',
    dataType: 'json',
    success: function (result) {
      console.log(result);
      
        var product1 = new product(result[0].productid, result[0].productname, result[0].price, result[0].quantity, result[0].description, result[0].rating);

        $('#cover').attr('src','../img/product/'+product1.id+'/cover.png');
      //  $('#tpye').html(product.type);
        var html1 =""
        console.log(product1.rating);
        for(var i = 0 ; i <product1.rating;i++){
            html1+='<i class="fa fa-star"></i>' ;
        }
        $('#name').html(product1.name);
        $('.star1').html(html1);
        $('#price').html('$'+product1.price);


      
      
      
     
    }})
});

  