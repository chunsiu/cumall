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

//upload picture setting

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const id = req.params.id; 
    const uploadPath = `../img/product/${id}/`; 
    if (!fs.existsSync(uploadPath)) {
       
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, 'cover.png');  
  }
});
const upload = multer({ storage: storage });


//user function
// Register function
app.post('/register', (req, res) => {
  const { username, password, email, iconpath } = req.body;
  const sql = 'INSERT INTO users (username, password, email, iconpath) VALUES (?, ?, ?, ?)';
  const params = [username, password, email, iconpath];

  db.query(sql, params, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});

// Login function
app.post('/login', (req, res) => {
  console.log('hihi');
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  const params = [username, password];

  db.query(sql, params, (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.length > 0) {
          res.json({ status: 'success', message: 'Login successful', user: result[0] });
      } else {
          res.json({ status: 'error', message: 'Invalid email or password' });
      }
  });
});

//kenneth

//admin login
app.post('/admin_login', (req, res) => {
  console.log('hihi');
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';
  const params = [username, password];

  db.query(sql, params, (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.length > 0) {
          res.json({ status: 'success', message: 'Login successful', user: result[0] });
      } else {
          res.json({ status: 'error', message: 'Invalid email or password' });
      }
  });
});



app.get('/check_email/:email/' ,(req,res)=>{
  var email = req.params.email;
  
  sql = 'select * from users where email = ?  ' ; 
  var params = [email]; 
  db.query(sql,params,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})

app.get('/update_profile/:id/:name/:gender/:age/' ,(req,res)=>{
  var id = req.params.id;
  var name = req.params.name;
  var gender = req.params.gender;
  var age= req.params.age;
  console.log("hihi");
  sql = 'update users set username = ?  , age = ?  , gender = ? where userid = ? ' ; 
  var params = [name,age,gender,id]; 
  db.query(sql,params,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})

app.post('/change_pw/' ,(req,res)=>{
  var old_pw = req.body.old_pw;
  var new_pw = req.body.new_pw;
  var uid = req.body.uid;
  console.log(uid);
  console.log(old_pw);
  console.log('pw changed');
  sql = 'update users set password = ? where userid = ? and password = ? ' ; 
  var params = [new_pw,uid,old_pw]; 
  db.query(sql,params,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
  
 
})








//



// Admin function
app.get('/get_all_users/' ,(req,res)=>{
  
  sql = 'select userid,username,email,iconpath,age,gender from users  ' ; 
   
  db.query(sql,(err,result)=>{

      if(err){
        console.log(err); 
        throw err;
      }
      console.log(result);
       res.json(
          result 
      );
  })
 
})

app.get('/get_user/:keyword/' ,(req,res)=>{
  var keyword = "%"+req.params.keyword+"%";
  sql = 'select userid,username,email,iconpath,age,gender from users where  username like ? or userid like ?  ' ; 
  params = [keyword,keyword];
  db.query(sql,params ,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})

app.get('/get_user2/:id/' ,(req,res)=>{
  var uid = req.params.id;
  sql = 'select * from users where  userid =?  ' ; 
  params = [uid];
  db.query(sql,params ,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})
app.post('/insert_new_user/' ,(req,res)=>{
  var name = req.body.name;
  var email = req.body.email;
  var gender = req.body.gender;
  var age = req.body.age;
  var pw = req.body.pw;
  sql = 'insert into users (username,email,gender,age,password) values(?,?,?,?,?)  ' ; 
  params = [name,email,gender,age,pw];
  db.query(sql,params ,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})


app.get('/update_user_info/:id/:name/:email/:gender/:age' ,(req,res)=>{
  var uid = req.params.id;
  var name = req.params.name;
  var email = req.params.email;
  var gender = req.params.gender;
  var age = req.params.age;
  sql = 'update users set username=? , email=?, gender=? ,age=? where  userid =?  ' ; 
  params = [name,email,gender,age,uid];
  db.query(sql,params ,(err,result)=>{

       if(err){
        console.log(err); 
        throw err;
      }
      console.log(result);
       res.json(
          result 
      );
  })
})
  

   
  app.get('/delete_user_by_Id/:id/' ,(req,res)=>{
    var uid = req.params.id;
     
    sql = 'delete from users  where  userid =?  ' ; 
    params = [uid];
    db.query(sql,params ,(err,result)=>{
  
         if(err){
          console.log(err); 
          throw err;
        }
        console.log(result);
         res.json(
            result 
        );
    })
})
//
//admin product
app.get('/insert_new_product/:name/:price/:quantity/:desc/:type' ,(req,res)=>{
  var name = req.params.name;
  var price = req.params.price;
  var quantity = req.params.quantity;
  var desc = req.params.desc;
  var type = req.params.type;
  sql = 'insert into product (productname,price,quantity,description,type) values(?,?,?,?,?)  ' ; 
  params = [name,price,quantity,desc,type];
  db.query(sql,params ,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })

 
})

app.post('/upload_cover/:id/',upload.single('file'),(req,res)=>{
  console.log(req.params.id);
  console.log(req.files);
   console.log('cover');
   

     
      
       res.json(
          
      );
  

 
})

 
app.get('/update_product_info/:id/:name/:price/:quantity/:description/:type' ,(req,res)=>{
  var pid = req.params.id;
  var name = req.params.name;
  var price = req.params.price;
  var quantity = req.params.quantity;
  var description = req.params.description;
  sql = 'update product set productname=? , price=?, quantity=? ,description=? where  productid =?  ' ; 
  params = [name,price,quantity,description,pid];
  db.query(sql,params ,(err,result)=>{

       if(err){
        console.log(err); 
        throw err;
      }
      console.log(result);
       res.json(
          result 
      );
  })
})

   
  app.get('/delete_product_by_Id/:id/' ,(req,res)=>{
    var id = req.params.id;
     
    sql = 'delete from product  where  productid =?  ' ; 
    params = [id];
    db.query(sql,params ,(err,result)=>{
  
         if(err){
          console.log(err); 
          throw err;
        }
        console.log(result);
         res.json(
            result 
        );
    })
})



//


//Product function

app.get('/get_all_products/' ,(req,res)=>{
  
  sql = 'select p.productid,productname,price,quantity,description,rating,type from product p   ' ; 
   
  db.query(sql,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})
app.get('/recommend_product/' ,(req,res)=>{
  
  sql = 'select * from product where rating = (select MAX(rating) from product );   ' ; 
   
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


app.get('/get_product_by_id/:id/' ,(req,res)=>{
  var id = req.params.id;
  sql = 'select * from product where  productId = ?  ' ; 
  params = [id];
  db.query(sql,params ,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
 
})




 


//

//Order function
app.get('/product_minus/:id/:qty/' ,(req,res)=>{
  var id = req.params.id;
  var qty = req.params.qty;
  sql= "update product set quantity = quantity - ? where productid = ?";
          params=[qty,id];
  db.query(sql,params,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
})

app.get('/insert_op/:oid/:pid/:qty' ,(req,res)=>{
  var oid = req.params.oid;
  var pid = req.params.pid;
  var qty = req.params.qty;
  sql= "insert into orderproduct (orderid,productid,quantity) values(?,?,?)";

          params=[oid,pid,qty];
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
        
        
        res.json(
          {"orderid":orderid}
        )
  
})

})
app.get('/product_minus/:pid/:qty' ,(req,res)=>{
  var pid = req.params.pid;
  var qty = req.params.qty;
   
  
  
  sql= "update product set quantity = quantity - ? where productid = ?";
          params=[qty,pid];
 db.query(sql,params,(err,result)=>{
     
  if(err){
    throw err
 }else{
  console.log(result);
  res.json(
    result
  )
 }


        })
       
        
  
})

//cart function
app.get('/cart_product_qty_change/:pid/:qty/:uid' ,(req,res)=>{
  var pid = req.params.pid;
  var qty = req.params.qty;
  var uid = req.params.uid; 
  
  
  sql= "update cart set quantity = ? where productid = ? and userid = ?";
          params=[qty,pid,uid];
 db.query(sql,params,(err,result)=>{
  if(err){
    throw err
 }else{
  console.log(result);
  res.json(
    result
  )
 }

        


        })
       
        
  
})

app.get('/delete_cart/:uid' ,(req,res)=>{
 
  try {
    var uid = req.params.uid; 
    console.log(uid);
    
    sql= "delete from cart where userid = ?";
            params=[uid];
   db.query(sql,params,(err,result)=>{
    if(err){
      throw err
   }else{
    console.log('delete');
    console.log(result);
    res.json(
      result
    )
   }
  
          
  
  
          })
  } catch (err) {
    throw err;
  }
       
        
  
})




//review
app.get('/update_rating_by_id/:pid' ,(req,res)=>{
   
  var pid = req.params.pid; 
  
  console.log('update rating ')
  sql= "update product set rating = (select avg(rating) from review where productid=? ) where productid = ?";
          params=[pid,pid];
 db.query(sql,params,(err,result)=>{
  if(err){
    throw err
 }else{
  console.log(result);
  res.json(
    result
  )
 }

        })
            
})



app.get('/get_review/:pid' ,(req,res)=>{
   
  var pid = req.params.pid; 
  
  
  sql= "select r.*,u.username from review r,users u   where r.userid=u.userid and productid= ?";
          params=[pid];
 db.query(sql,params,(err,result)=>{
  if(err){
    throw err
 }else{
  console.log(result);
  res.json(
    result
  )
 }

        })
            
})

app.post('/insert_review/' ,(req,res)=>{
  var uid = req.body.uid;
  var pid = req.body.pid;
  var content = req.body.content;
  var rating  =req.body.rating;
 
  sql = 'insert into review (content,rating,userid,productid) values(?,?,?,?)  ' ; 
  var params = [content,rating,uid,pid]; 
  db.query(sql,params,(err,result)=>{

      if(err) throw err;
      console.log(result);
       res.json(
          result 
      );
  })
  
 
})



app.get('/get_cart/:uid' ,(req,res)=>{
   
  var uid = req.params.uid; 
  
  
  sql= "select c.*,p.productname,p.price,p.description,p.rating from cart c, product p  where p.productid= c.productid   and userid = ? ";
          params=[uid];
 db.query(sql,params,(err,result)=>{
  if(err){
    throw err
 }else{
  console.log(result);
  res.json(
    result
  )
 }


        })
       
         
  
})

app.get('/cart_add_product/:uid/:pid/:qty/' ,(req,res)=>{
   
  var pid = req.params.pid;
  var qty = req.params.qty;
  var uid = req.params.uid;  
  
  
  sql= "INSERT INTO cart (productid,userid,quantity)SELECT ?,?,? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM cart WHERE productid = ? and userid=?);";
          params=[pid,uid,qty,pid,uid];
 db.query(sql,params,(err,result)=>{
     
  if(err){
    throw err
 }else{
  console.log(result);
  res.json(
    result
  )
 }

        })
       
         
  
})
app.get('/cart_remove_product/:uid/:pid/' ,(req,res)=>{
   
  var pid = req.params.pid;
   
  var uid = req.params.uid;  
  
  
  sql= "delete from cart where userid = ? and productid = ? ";
          params=[uid,pid];
 db.query(sql,params,(err,result)=>{
  if(err){
    throw err
 }else{
  console.log(result);
  res.json(
    result
  )
 }
        


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