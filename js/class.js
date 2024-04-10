export class product{
    constructor(id,name,price,qty,desc,rating){
        this.id=id;
        this.name=name;
        this.price=price;
        this.qty=qty;
        this.desc=desc;
        this.rating=rating;
         

    }
}

export class user{
    constructor(id,name,email,age,gender){
        this.id=id;
        this.name=name;
        this.email=email;
        this.age=age;
        this.gender=gender;
    }
}



export var ProductList=[];

export var CartList=[];

export function session_save_List(productList){
        sessionStorage.setItem('ProductList',JSON.stringify(productList));
}

export function db_update_product_qty_by_Id(pid,uid,qty){
    console.log("qty: "+qty);
    console.log("pid : " +pid);
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/cart_product_qty_change/'+pid+'/'+qty+'/'+uid+'/',
        dataType:'json',
        success: function(result){
          console.log(result);           
        }		
        
 }); 
}

export function db_remove_product_by_Id(pid,uid){
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/cart_remove_product/'+uid+'/'+pid+'/',
        dataType:'json',
        success: function(result){
          console.log(result);           
        }		
        
 }); 
}
function add_cart_product(cartList){
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

export function db_get_cart(uid){
    var cartList=[];
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/get_cart/'+uid+'/',
        dataType:'json',
        success: function(result){
          console.log(result); 
          for(var i=0;i<result.length;i++){
            cartList.push(new product(result[i].productid,result[i].productname,result[i].price,result[i].quantity,result[i].description,result[i].rating,result[i].path));

          }  
          add_cart_product(cartList);
          return cartList;    
        }	
        	
        
 }); 
}

export function db_insert_user(name,email,gender,age,pw){
    var data={
        name:name,
        pw:pw,
        gender:gender,
        age:age,
        email:email

    };
   $.ajax({
       type: 'post',
       headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
       data:JSON.stringify(data),
       contentType: "application/json; charset=utf-8",
       url:'http://localhost:3100/insert_new_user/' ,
       
       success: function(result){
            
         console.log(result);           
       }		
       
}); 
}

export function db_update_user_by_Id(uid,name,email,gender,age){
     console.log('here 1');
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/update_user_info/'+uid+'/'+name+'/'+email+'/'+gender+'/'+age,
        
        success: function(result){
            console.log('here 2');
          console.log(result);           
        }		
        
 }); 
}

export function db_update_product_by_Id(id,name,price,qty,desc){
     
   $.ajax({
       type: 'get',
       headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
       url:'http://localhost:3100/update_product_info/'+id+'/'+name+'/'+price+'/'+qty+'/'+desc,
       
       success: function(result){
            
         console.log(result);           
       }		
       
}); 
} 


export function db_delete_user_by_Id(uid,name,email,gender,age){
    
   $.ajax({
       type: 'get',
       headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
       url:'http://localhost:3100/delete_user_by_Id/'+uid+'/' ,
       
       success: function(result){
            
         console.log(result);           
       }		
       
}); 
}

export function db_delete_product_by_Id(uid){
    
    $.ajax({
        type: 'get',
        headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
        url:'http://localhost:3100/delete_product_by_Id/'+uid+'/' ,
        
        success: function(result){
             
          console.log(result);           
        }		
        
 }); 
 }

export function db_insert_product(name,price,quantity,desc){
    console.log('here 1');
   $.ajax({
       type: 'get',
       headers: {  'Access-Control-Allow-Origin': 'http://localhost' },
       url:'http://localhost:3100/insert_new_product/'+name+'/'+price+'/'+quantity+'/'+desc ,
       
       success: function(result){
            
         console.log(result);           
       }		
       
}); 
}
// product page  get product


 


//get all product

export function session_login_user(id,name){
    sessionStorage.setItem('login_user_id', id);
    sessionStorage.setItem('login_user_name', name);
}
export function session_logout_user(){
    sessionStorage.removeItem('login_user_id');
    sessionStorage.removeItem('login_user_name');
    sessionStorage.clear();
}

export function session_get_login_userId(){
    return  sessionStorage.getItem('login_user_id');
}
export function session_get_login_userName(){
    return  sessionStorage.getItem('login_user_name');
}


export function session_get_List(){
    return  JSON.parse(sessionStorage.getItem('ProductList'));
}

export function session_save_Cart(productList){
    sessionStorage.setItem('CartList',JSON.stringify(productList));
}


export function session_get_Cart(){
    return  JSON.parse(sessionStorage.getItem('CartList'));
}




export function getProductById(productList,id){
    return productList.find(product=>product.id==id);
}

export function removeProductById(productList,id){
    return productList.filter(product=>product.id!=id);
     
}



