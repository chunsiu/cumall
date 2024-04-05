const mysql =require('mysql')
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    // password:'',
    database:'fyp',
    // port:4330
})

db.connect((err)=>{
    if(err){
       throw err
    }
    console.log('mysql connected');
 
})

let createNewUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkEmailUser(user.email);
            let check2 = await checkuserName(user.userName);

            if(check === false && check2 === false) {
                //hash user's password
                let data = {
                    userName: user.userName,
                    password: user.password,
                    email: user.email,
                    type: "commercial"
                };

                //create a new user
                db.query("INSERT INTO user set ? ", data, function(error, rows) {
                    if (error) reject(error);
                    resolve("create a new user successfully");
                })
            }
            if(check === true)
                reject(`The email ${user.email} has already exist. Please choose another email`)

            if(check2 === true)
                reject(`The username ${user.userName} has already exist. Please choose another username`)

        } catch (e) {
            reject(e);
        }
    });
};

let checkEmailUser = (email) => {
return new Promise((resolve, reject) => {
    try{
        db.query("SELECT * from user where email = ?", email, function(error, rows) {
            if(error) reject(error);
            if(rows.length > 0) resolve(true);
            resolve(false);
        })
    }catch (e) {
        reject(e);
    }
}) ;
};

let checkuserName = (userName) => {
    return new Promise((resolve, reject) => {
        try{
            db.query("SELECT * from user where userName = ?", userName, function(error, rows) {
                if(error) reject(error);
                if(rows.length > 0) resolve(true);
                resolve(false);
            })
        }catch (e) {
            reject(e);
        }
    }) ;
    };

module.exports = {
    createNewUser: createNewUser
};