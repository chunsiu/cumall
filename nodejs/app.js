const express = require('express')
var cors = require('cors')
const dayjs = require('dayjs')
const fs = require('fs');               //changed
const multer = require('multer')
const path = require('path')
var test_array = []; 
 

const bodyParser = require ('body-parser');
const app = express()
app.use(cors())
app.set('view engine','ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//database
const mysql =require('mysql')
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'3100',
    
})

db.connect((err)=>{
    if(err){
       throw err
    }else{
        console.log('mysql connected');
    } 
})

app.get('/user_addphoto_icon/:rid/' ,(req,res)=>{
  var rid = req.params.rid;

  sql = 'select file_path from photo where restaurant_id = ? and image_type = "icon" ' ; 
   
  params = [rid];
  db.query(sql,params,(err,result)=>{

       



      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})


// Admin function
app.get('/get_all_users/' ,(req,res)=>{
  
  sql = 'select * from users  ' ; 
   
  db.query(sql,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})

app.get('/get_user/:keyword/' ,(req,res)=>{
  var keyword = "%"+req.params.keyword+"%";
  sql = 'select * from users where  username like ? or userid like ?  ' ; 
  params = [keyword,keyword];
  db.query(sql,params ,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})

//Product function

app.get('/get_all_products/' ,(req,res)=>{
  
  sql = 'select * from product  ' ; 
   
  db.query(sql,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})

app.get('/get_product/:keyword/' ,(req,res)=>{
  var keyword = "%"+req.params.keyword+"%";
  sql = 'select * from product where  productname like ? or productid like ?  ' ; 
  params = [keyword,keyword];
  db.query(sql,params ,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})


//Order function
app.get('/create_order/:uid/:price/' ,(req,res)=>{
  var uid = req.params.uid;
  var price = req.params.price;
  sql = 'insert into orders (orderprice,orderdate,userid) values (?,now(),?)  ' ; 
  var params= [price,uid]
  db.query(sql,params,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})
app.post('/create_order2/' ,(req,res)=>{
  var uid = req.body.uid;
  var price = req.body.price;
  var list = req.body.list;
  
  console.log(list);
  sql = 'insert into orders (orderprice,orderdate,userid) values (?,now(),?)  ' ; 
  var params= [price,uid];
 db.query(sql,params,(err,result)=>{
        var orderid = result.insertId;
        console.log("order created");
        for(var i=0;i<list.length;i++){
          sql= "update product set quantity = quantity - ? where productid = ?";
          params=[list[i].qty,list[i].productid];
          db.query(sql,params,(err,result)=>{
            console.log("qty minus");
      })


        }
        for(var i=0;i<list.length;i++){
          sql= "insert into orderproduct (orderid,productid,quantity) values(?,?,?)";

          params=[orderid,list[i].productid,list[i].qty];
          db.query(sql,params,(err,result)=>{
            console.log("op inserted");
      })


        }

        
        res.json(
          {"message":"order created"}
        )
  
})

  

   
 
})












app.use((req,res)=>{
    // 404 method must be in bottom
    // res.status(404).sendFile('./page/404.html',{root:_dirname})
    // res.sendFile('./page/404.html',{root:_dirname})
    // res.status(404)
    res.status(404).render('404')
})


 

 

 

app.listen(3100)