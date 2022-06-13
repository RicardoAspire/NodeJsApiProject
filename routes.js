const routes = require('express').Router()
const conection = require('./config/conection');
const Users = require('./auth.routes');

//Auth
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const SECRET_KEY = 'secretkey12345678';



// ------------------------- Functions -------------------------
function getAllQuery(sql,res){
    conection.query(sql,(err, rows) =>{
        if(err){console.log(err)}
        else{res.json(rows)}
    });
}
function getByIdQuery(sql,res,id){
    conection.query(sql,[id],(err, rows, fields) =>{
        if(err){console.log(err)}
        else{res.json(rows)}
    });
}
function createUpdateDeleteQuery(sql,res,message){
    conection.query(sql,(err, rows, fields) =>{
        if(err){throw err}
        else{res.json({status:`${message}`})}
    });
}
// ------------------------- Functions -------------------------




// ------------------------- Routes -------------------------

// ------------------- AUTH login start -------------------

routes.post('/register',(req,res)=>{
    const {name,email,password,role} = req.body

    let sql = `INSERT INTO users (name,email,password,role) 
    VALUES ('${name}','${email}','${password}','${role}')`
    conection.query(sql,(err, rows, fields) =>{
    if(err){console.log(err)}
    else{
    const expiresIn = 24*60*60;
    const accessToken = jwt.sign(
        {
            id:"a"
        },
        SECRET_KEY,{
            expiresIn: expiresIn
        });
    //Response to frontend  
    response.send({user});
    }
    });
});


routes.post('/login',(req,res)=>{
    const userData = {
        email: req.body.email,
        password: req.body.password,
    }

    let sql = `SELECT * FROM users WHERE email = ${userData.email}`
    conection.query(sql,[userData.email],(err, rows, fields) =>{
        if(err){ return res.status(500).send("Server error finding user")}
        if(!conection){ 
            //Email doesn't exist
            res.status(409),send({message: 'Something is wrong'})
        }
        else{
            const resultPassword = userData.password;
            if(resultPassword){
                const expiresIn = 24*60*60;
                const accessToken = jwt.sign(
                    {
                        id:"a"
                    },
                    SECRET_KEY,{
                        expiresIn: expiresIn
                    });
                res.send(userData);
            }else{
                //Password wrong
                res.status(409),send({message: 'Something is wrong'}); 
            }
        }
    });
});

/* 
exports.createUser = (req, res, next)=>{
    const {name,email,password,role} = req.body
    let sql = `INSERT INTO users (name,email,password,role) 
               VALUES ('${name}','${email}','${password}','${role}')`
    conection.query(sql,(err, rows, fields) =>{
        if(err){console.log(err)}
        else{
            const expiresIn = 24*60*60;
            const accessToken = jwt.sign(
                {
                    id:user.id
                },
                SECRET_KEY,{
                    expiresIn: expiresIn
                });
            //Response to frontend  
            response.send({user});
        }
    });
} 

exports.loginUser = (req, res, next)=>{
    const userData = {
        email: req.body.email,
        password: req.body.password,
    }

    let sql = `SELECT * FROM users WHERE email = ${userData.email}`
    conection.query(sql,[userData.email],(err, rows, fields) =>{
        if(err){ return res.status(500).send("Server error finding user")}
        if(!conection){ 
            //Email doesn't exist
            res.status(409),send({message: 'Something is wrong'})
        }
        else{
            const resultPassword = userData.password;
            if(resultPassword){
                const expiresIn = 24*60*60;
                const accessToken = jwt.sign(
                    {
                        id:user.id
                    },
                    SECRET_KEY,{
                        expiresIn: expiresIn
                    });
                res.send(userData);
            }else{
                //Password wrong
                res.status(409),send({message: 'Something is wrong'}); 
            }
        }
    });
}


module.exports = (router) => {
    routes.post('/register',Users.createUser);
    routes.post('/login',Users.loginUser);
}
*/
// ------------------- AUTH end start ---------------------

// ------------------- Categories start -------------------
//Get all categories
routes.get('/categories',(req,res)=>{
    let sql = 'SELECT * FROM restaurant_categories';
    getAllQuery(sql,res);
});
//Get category by id
routes.get('/category/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM restaurant_categories WHERE id = ? ';
    getByIdQuery(sql,res,id);
});
//Create category
routes.post('/category',(req,res)=>{
    const {name} = req.body
    let sql = `INSERT INTO restaurant_categories (category_name) VALUES ('${name}')`
    createUpdateDeleteQuery(sql,res,'category added');
});
//Delete category
routes.delete('/category/:id',(req,res)=>{
    const {id} = req.params
    let sql = `DELETE FROM restaurant_categories WHERE Id = '${id}'`
    createUpdateDeleteQuery(sql,res,'category deleted');    
});
//Update category
routes.put('/category/:id',(req,res)=>{
    const {id} = req.params
    const {name} = req.body
    let sql = `UPDATE restaurant_categories SET category_name ='${name}' WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'category updated');
});
// ------------------- Categories end ---------------------

// ------------------- Products start -------------------
//Get all Products
routes.get('/products',(req,res)=>{
    let sql = 'SELECT * FROM restaurant_products'
    getAllQuery(sql,res);
});
//Get all Products by category
routes.get('/products-category/:category',(req,res)=>{
    const {category} = req.params
    let sql = `SELECT * FROM restaurant_products WHERE Category_Id = '${category}'`
    conection.query(sql,(err, rows, fields) =>{
        if(err){console.log(err)}
        else{res.json(rows)}
    });
});
//Get Product by id
routes.get('/product/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM restaurant_products WHERE id = ? '
    getByIdQuery(sql,res,id);
});
//Create Product
routes.post('/products',(req,res)=>{
    const {Category_id,Name,Description,Price,Stock} = req.body
    let sql = `INSERT INTO restaurant_products (Category_id,Name,Description,Price,Stock) 
               VALUES ('${Category_id}','${Name}','${Description}','${Price}','${Stock}')`
    createUpdateDeleteQuery(sql,res,'product added');
});
//Delete Product
routes.delete('/product/:id',(req,res)=>{
    const {id} = req.params
    let sql = `DELETE FROM restaurant_products WHERE Id = '${id}'`
    createUpdateDeleteQuery(sql,res,'product deleted'); 
});
//Update Product
routes.put('/product/:id',(req,res)=>{
    const {id} = req.params
    const {Category_id,Name,Description,Price,Stock} = req.body
    let sql = `UPDATE restaurant_products SET Category_id ='${Category_id}', Name ='${Name}', Description ='${Description}', Price ='${Price}', Stock ='${Stock}' WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'product updated');
});
// ------------------- Products end ---------------------

// ------------------- Tables start -------------------
//Get all Tables
routes.get('/tables',(req,res)=>{
    let sql = 'SELECT * FROM `restaurant_table`'
    getAllQuery(sql,res);
});
//Get Table by id
routes.get('/tables/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM `restaurant_table` WHERE id = ? '
    getByIdQuery(sql,res,id);
});
//Create Table
routes.post('/tables',(req,res)=>{
    const {Name,Status,Total} = req.body
    let sql = "INSERT INTO `restaurant_table` (Name,Status,Total)"+`VALUES ('${Name}','${Status}','${Total}')`;
    createUpdateDeleteQuery(sql,res,'table created');
});
//Delete Table
routes.delete('/tables/:id',(req,res)=>{
    const {id} = req.params
    let sql = "DELETE FROM `restaurant_table`"+`WHERE Id = '${id}'`
    createUpdateDeleteQuery(sql,res,'table deleted'); 
});
//Update Table
routes.put('/tables/:id',(req,res)=>{
    const {id} = req.params
    const {Name,Status,Total} = req.body
    let sql = "UPDATE `restaurant_table`"+`SET Name ='${Name}', Status ='${Status}', Total ='${Total}' WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'table updated');
});
// ------------------- Tables end ---------------------

// ------------------- Bills start -------------------
//Get all Bill
routes.get('/bills',(req,res)=>{
    let sql = 'SELECT * FROM restaurant_bills'
    getAllQuery(sql,res);
});
//Get Bill by id
routes.get('/bills/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM `restaurant_bills` WHERE id = ? '
    getByIdQuery(sql,res,id);
});
//Create Bill
routes.post('/bills',(req,res)=>{
    const {Description,Amount,Date,Hour} = req.body
    let sql = "INSERT INTO `restaurant_bills` (Description,Amount,Date,Hour)"+`VALUES ('${Description}','${Amount}','${Date}','${Hour}')`;
    createUpdateDeleteQuery(sql,res,'bill created');
});
//Delete Bill
routes.delete('/bills/:id',(req,res)=>{
    const {id} = req.params
    let sql = "DELETE FROM `restaurant_bills`"+`WHERE Id = '${id}'`
    createUpdateDeleteQuery(sql,res,'bill deleted'); 
});
//Update Bill
routes.put('/bills/:id',(req,res)=>{
    const {id} = req.params
    const {Description,Amount,Date,Hour} = req.body
    let sql = "UPDATE `restaurant_bills`"+`SET Description ='${Description}', Amount ='${Amount}', Date ='${Date}', Hour ='${Hour}' WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'bill updated');
});
// ------------------- Bills end ---------------------

// ------------------- Orders start -------------------
//Get all Orders
routes.get('/orders',(req,res)=>{
    let sql = 'SELECT * FROM `restaurant_orders`'
    getAllQuery(sql,res);
});
//Get Orders by id
routes.get('/orders/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM `restaurant_orders` WHERE id = ? '
    getByIdQuery(sql,res,id);
});
//Create Orders
routes.post('/orders',(req,res)=>{
    const {Table_id,Product_id,Amount,Status,Comments,TicketNumber} = req.body
    let sql = "INSERT INTO `restaurant_orders` (Table_id, Product_id, Amount, Status, Comments, TicketNumber)"+
    `VALUES ('${Table_id}','${Product_id}','${Amount}','${Status}','${Comments}','${TicketNumber}')`;
    createUpdateDeleteQuery(sql,res,'order created');
});
//Delete Orders
routes.delete('/orders/:id',(req,res)=>{
    const {id} = req.params
    let sql = "DELETE FROM `restaurant_orders`"+`WHERE Id = '${id}'`
    createUpdateDeleteQuery(sql,res,'order deleted'); 
});
//Update Orders
routes.put('/orders/:id',(req,res)=>{
    const {id} = req.params
    const {Table_id,Product_id,Amount,Status,Comments,TicketNumber} = req.body
    let sql = "UPDATE `restaurant_orders`"+`SET Table_id ='${Table_id}', Product_id ='${Product_id}', Amount ='${Amount}', Status ='${Status}', Comments ='${Comments}', TicketNumber ='${TicketNumber}'
     WHERE id = '${id}'`
     createUpdateDeleteQuery(sql,res,'order updated');
});
// ------------------- Orders end ---------------------

// ------------------- Ticket start -------------------
//Get all Ticket
routes.get('/tickets',(req,res)=>{
    let sql = 'SELECT * FROM `restaurant_tickets`'
    getAllQuery(sql,res);
});
//Get Ticket by id
routes.get('/tickets/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM `restaurant_tickets` WHERE id = ? '
    getByIdQuery(sql,res,id);
});
//Create Ticket
routes.post('/tickets',(req,res)=>{
    const {Table_id,Date,Hour,Total} = req.body
    let sql = "INSERT INTO `restaurant_tickets` (Table_id, Date, Hour, Total)"+
    `VALUES ('${Table_id}','${Date}','${Hour}','${Total}')`;
    createUpdateDeleteQuery(sql,res,'ticket created');
});
//Delete Ticket
routes.delete('/tickets/:id',(req,res)=>{
    const {id} = req.params
    let sql = "DELETE FROM `restaurant_tickets`"+`WHERE Id = '${id}'`
    createUpdateDeleteQuery(sql,res,'ticket deleted'); 
});
//Update Ticket
routes.put('/tickets/:id',(req,res)=>{
    const {id} = req.params
    const {Table_id,Date,Hour,Total} = req.body
    let sql = "UPDATE `restaurant_tickets`"+`SET Table_id ='${Table_id}', Date ='${Date}', Hour ='${Hour}', Total ='${Total}'
     WHERE id = '${id}'`
     createUpdateDeleteQuery(sql,res,'ticket updated');
});
// ------------------- Ticket end ---------------------



// ------------------------- Routes -------------------------



module.exports = routes;