const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:'3306',
    database:'soft_restaurant'
});

connection.connect((err)=>{
    if((err)){
        console.log(err)
    }else{
        console.log('Connection done')
    }
});

module.exports = connection;