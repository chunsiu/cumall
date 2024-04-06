export class product{
    constructor(id,name,price,qty,desc,rating,cover){
        this.id=id;
        this.name=name;
        this.price=price;
        this.qty=qty;
        this.desc=desc;
        this.rating=rating;
        this.cover=cover;

    }
}
export var ProductList=[];

export var CartList=[];

export function session_save_List(productList){
        sessionStorage.setItem('ProductList',JSON.stringify(productList));
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



