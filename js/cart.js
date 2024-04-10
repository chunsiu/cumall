import { product, session_get_login_userId, getProductById, db_update_product_qty_by_Id, removeProductById, db_remove_product_by_Id, } from './class.js';
$(document).ready(function () {
    //main
   // var userid = 1; //test 
   var userid =  session_get_login_userId();

    var cartList = [];


    var final_total = 0;
    cartList = db_get_cart(userid);

    //

    function db_get_cart(uid) {
        var cartList = [];
        $.ajax({
            type: 'get',
            headers: { 'Access-Control-Allow-Origin': 'http://localhost' },
            url: 'http://localhost:3100/get_cart/' + uid + '/',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                for (var i = 0; i < result.length; i++) {
                    cartList.push(new product(result[i].productid, result[i].productname, result[i].price, result[i].quantity, result[i].description, result[i].rating, result[i].path));

                }
                add_cart_product(cartList);
                update_total();
                console.log(cartList);
                // ui listeners 
                //minus button 
                $('.minus-btn').click(function () {
                    console.log('hi');
                    var id = $(this).parent().parent().parent().attr('productid');
                    var product = getProductById(cartList, id);


                    var qty = $(this).siblings('.qtyInput').val();
                    if (qty == 1) {
                        alert('the quantity cannot be less than 1, you can remove the item if needed');
                        return;
                    }
                    //update ui qty
                    $(this).siblings('.qtyInput').val(qty - 1);
                    //update ui price
                    update_subtotal(id, product.price, qty - 1);
                    //update db    
                    db_update_product_qty_by_Id(id, userid, qty - 1);


                });

                // add button 
                $('.plus-btn').click(function () {
                    var id = $(this).parent().parent().parent().attr('productid');
                    var product = getProductById(cartList, id);


                    var qty = Number($(this).siblings('.qtyInput').val());
                     
                    //update db
                    $.ajax({
                        type: 'get',
                        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
                        url:'http://localhost:3100/get_product_by_Id/'+id+'/' ,
                        
                        success: function(result){
                             
                          console.log(result);  
                          var db_qty=result[0].quantity;
                          if(db_qty>=qty+1){
                            console.log("test");
                            qty++;
                            console.log("test");
                            console.log(qty);
                            db_update_product_qty_by_Id(id, userid, qty);

                            //update ui qty
                            

                            $('.plus-btn').siblings('.qtyInput').val(qty.toString());
                            //update ui price
                            update_subtotal(id, product.price, qty);
                          }else{
                            alert('sorry, not enough stock');
                          }

                        }		
                        
                 }); 

                  
                });

                //  

                //input box on change

                $('.qtyInput').change(function () {
                    var id = $(this).parent().parent().parent().attr('productid');
                    var input_box = $(this);
                    var product = getProductById(cartList, id);
                    var value = $(this).val();
                    if (value < 1) {
                        $(this).val("1");
                        value = 1;
                        alert('the quantity cannot be less than 1, you can remove the item if needed');
                        return;
                    }

                    $.ajax({
                        type: 'get',
                        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
                        url:'http://localhost:3100/get_product_by_Id/'+id+'/' ,
                        
                        success: function(result){
                             
                          console.log(result);  
                         var db_qty=result[0].quantity;
                          if(db_qty>=value){
                             

                            //update db
                            db_update_product_qty_by_Id(id, userid, value);

                            //update price
                            update_subtotal(id, product.price, value);
                          }else{
                             
                            input_box.val(db_qty.toString());
                            alert('sorry, not enough stock');
                          }

                        }		
                        
                 }); 
                     
                     

                });





                //

                //remove button 
                $('.remove').click(function () {
                    var id = $(this).parent().parent().parent().attr('productid');
                    var product = getProductById(cartList, id);
                    var value = Number($(this).siblings('.qtyInput').val());

                     

                     
                    console.log(id);
                    //remove product from cartlist 
                    cartList = removeProductById(cartList, id);
                    //remove product from ui 
                    $(this).parent().parent().parent().remove();
                    //update price
                    update_subtotal(id, product.price, value);
                    //update db cartlist 
                    db_remove_product_by_Id(id, userid);


                });






                //

                //checkout button 
                $('.checkout').click(function () {
                    var data = {
                        uid: userid,
                        price: final_total,
                        list: cartList

                    };
                    //if payment function is available, the connection part is here

                    //

                    //below assumed payment success  
                    create_order(data);

                    // remove cartList item not done    for testing 





                })

                return cartList;
            }


        });
    }

    function add_cart_product(cartList) {
        var html = "";
        var product;
        for (var i = 0; i < cartList.length; i++) {
            html = "";
            product = cartList[i];
            html += '<div class="cartItem" productid="' + product.id + '">  ';
            html += '<img src="../img/product/' + product.id + '/cover.png" alt="Product">';
            html += '<div class="itemDetails">';
            html += '   <p class="itemName">' + product.name + '</p>';
            /*  html+='    <div class="itemInfo">';
             html+='        <p class="infoKey">Color:</p>';
             html+='        <p class="infoValue">Black</p>';
             html+='    </div>';
             html+='    <div class="itemInfo">';
             html+='        <p class="infoKey">Size:</p>';
             html+='        <p class="infoValue">M</p>';
             html+='    </div>'; */
            html += '    <p class="itemPrice" id="price">$' + product.price * product.qty + '</p>';
            html += '    <div class="itemQuantity">';

            html += '        <button class="minus-btn"><i class="fas fa-minus"></i></button><input type="number" class="qtyInput" min = "1" value="' + product.qty + '"  ><button class="plus-btn"><i class="fas fa-plus"></i></button>';
            html += '    </div>';
            html += '    <div class="itemActions">';
            html += '       <button class="remove">Remove</button>';

            html += '   </div>';
            html += '</div>';
            html += '</div>';
            $("#cartItems").append(html);

        }

    }





    function create_order(data) {
        var orderid = 0;
        $.ajax({
            type: 'post',
            headers: { 'Access-Control-Allow-Origin': 'http://localhost' },
            url: 'http://localhost:3100/create_order2',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (result) {
                console.log(result);
                orderid = result.orderid;
                for (var i = 0; i < cartList.length; i++) {
                    minus_product(cartList[i].id, cartList[i].qty);
                    insert_op(orderid, cartList[i].id, cartList[i].qty);

                }

                alert('puchase success');
                window.sessionStorage.removeItem('CartList');
                window.location.href = 'http://localhost/3100project/html/index.html';





            }


        });

    }
    // minus the stock in db 
    function minus_product(pid, qty) {
        $.ajax({
            type: 'get',
            headers: { 'Access-Control-Allow-Origin': 'http://localhost' },
            url: 'http://localhost:3100/product_minus/' + pid + '/' + qty + '/',
            dataType: 'json',
            success: function (result) {
                console.log(result);



            }


        });
    }
    // insert orderproduct table 
    function insert_op(oid, pid, qty) {
        $.ajax({
            type: 'get',
            headers: { 'Access-Control-Allow-Origin': 'http://localhost' },
            url: 'http://localhost:3100/insert_op/' + oid + '/' + pid + '/' + qty,
            dataType: 'json',
            success: function (result) {
                console.log(result);



            }


        });
    }


    function update_total() {
        var total = 0;
        $('.itemPrice').each(function () {

            total += Number($(this).html().slice(1));
        })
        $('.total').html('Total : $' + total);
        final_total = total;


    }


    function update_subtotal(id, qty, price) {

        $('[productid="' + id + '"]').children('.itemDetails').children('.itemPrice').html('$' + qty * price);

        update_total();
    }




    //add_cart_product();

    //update_total();







})