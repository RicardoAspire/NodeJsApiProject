const express = require('express');
const routes = require('express').Router();
const conection = require('../connection/conection');

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
routes.post('/login',(req,res)=>{
    const userData = {
        userName: req.body.userName,
        password: req.body.password,
    }
    let sql = `SELECT userName, role FROM restaurant_users WHERE userName=? and password=?`
    conection.query(sql,[userData.userName,userData.password],(err, rows, fields) =>{
        if(!err){
            if(rows.length > 0){
                let data = JSON.stringify(rows[0]);
                const token = jwt.sign(data, SECRET_KEY);
                res.json({token});
            }else{
                res.json('User or password incorrect.');
            }
        }else{
            console.log(err);
        }
    });
});

routes.post('/signIn',verifyToken,(req,res)=>{
    res.json(req.data);
});

function verifyToken(req,res,next){
    if(!req.headers.authorization) return res.status(401).json('Not authorized');
    const token = req.headers.authorization.substr(7);
    if(token !== ''){
        const content = jwt.verify(token,SECRET_KEY);
        req.data = content;
        next();
    }else{
        res.status(401).json("Empty token");
    }
}

//Create user
routes.post('/register',(req,res)=>{
    const {userName,password,role} = req.body
    let sql = "INSERT INTO `restaurant_users` (userName, password, role)"+
    `VALUES ('${userName}','${password}','${role}')`;
    createUpdateDeleteQuery(sql,res,'category added');
});

//Get all users
routes.get('/users',(req,res)=>{
    let sql = 'SELECT * FROM restaurant_users';
    getAllQuery(sql,res);
});

//Get user by id
routes.get('/user/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM restaurant_users WHERE id = ?';
    getByIdQuery(sql,res,id);
});

//Update user 
routes.put('/user/:id',(req,res)=>{
    const {id} = req.params
    const {userName,password,role} = req.body
    let sql = `UPDATE restaurant_users SET userName ='${userName}', password ='${password}', role ='${role}' WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'user updated');
});

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
    const {category_name} = req.body
    let sql = `INSERT INTO restaurant_categories (category_name) VALUES ('${category_name}')`
    createUpdateDeleteQuery(sql,res,'category added');
});
//Delete category
routes.delete('/category/:id',(req,res)=>{
    const {id} = req.params
    let sql = `DELETE FROM restaurant_categories WHERE id = '${id}'`
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
    let sql = `SELECT * FROM restaurant_products WHERE category_id = '${category}'`
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
    const {category_id,name,description,price,stock} = req.body
    let sql = `INSERT INTO restaurant_products (category_id,name,description,price,stock) 
               VALUES ('${category_id}','${name}','${description}','${price}','${stock}')`
    createUpdateDeleteQuery(sql,res,'product added');
});
//Delete Product
routes.delete('/product/:id',(req,res)=>{
    const {id} = req.params
    let sql = `DELETE FROM restaurant_products WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'product deleted'); 
});
//Update Product
routes.put('/product/:id',(req,res)=>{
    const {id} = req.params
    const {stock} = req.body
    let sql = `UPDATE restaurant_products SET stock ='${stock}' WHERE id = '${id}'`
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
    const {name,status,total} = req.body
    let sql = "INSERT INTO `restaurant_table` (name,status,total)"+`VALUES ('${name}','${status}','${total}')`;
    createUpdateDeleteQuery(sql,res,'table created');
});

//Delete Table
routes.delete('/tables/:id',(req,res)=>{
    const {id} = req.params
    let sql1 = "DELETE FROM restaurant_tickets "+ `WHERE table_id = '${id}'`;
    let sql2 = "DELETE FROM restaurant_orders "+ `WHERE table_id = '${id}'`;
    let sql3 = "DELETE FROM restaurant_table "+ `WHERE id = '${id}'`;
    conection.query(sql1,(err, rows, fields) =>{
        if(err){throw err}
        else{
            conection.query(sql2,(err, rows, fields) =>{
                if(err){throw err}
                else{
                    conection.query(sql3,(err, rows, fields) =>{
                        if(err){throw err}
                        else{res.json({status:`${'table deleted'}`})}
                    }) 
                }
            })
        }
    });
});

//Update Table status 
routes.put('/table-status/:id',(req,res)=>{
    const {id} = req.params
    const {status} = req.body
    let sql = "UPDATE `restaurant_table`"+`SET status = '${status}' WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'table updated');
});

//Update Table
routes.put('/tables/:id',(req,res)=>{
    const {id} = req.params
    const {name,status,total} = req.body
    let sql = "UPDATE `restaurant_table`"+`SET name ='${name}', status ='${status}', total ='${total}' WHERE id = '${id}'`
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

//Get today by date
routes.get('/bills/startDate/:startDate/endDate/:endDate',(req,res)=>{
    const {startDate, endDate} = req.params
    if(endDate == 0){
        var sql =`SELECT * FROM restaurant_bills WHERE date = '${startDate}'`
    }else{    
        var sql =`SELECT * FROM restaurant_bills WHERE date BETWEEN '${startDate}' AND '${endDate}'`
    }
    getAllQuery(sql,res); 
});

//Create Bill
routes.post('/bills',(req,res)=>{
    const {description,amount,date,hour} = req.body
    let sql = "INSERT INTO `restaurant_bills` (description,amount,date,hour)"+`VALUES ('${description}','${amount}','${date}','${hour}')`;
    createUpdateDeleteQuery(sql,res,'bill created');
});
//Delete Bill
routes.delete('/bills/:id',(req,res)=>{
    const {id} = req.params
    let sql = "DELETE FROM `restaurant_bills`"+`WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'bill deleted'); 
});
//Update Bill
routes.put('/bills/:id',(req,res)=>{
    const {id} = req.params
    const {description,amount,date,hour} = req.body
    let sql = "UPDATE `restaurant_bills`"+`SET description ='${description}', amount ='${amount}', date ='${date}', hour ='${hour}' WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'bill updated');
});
// ------------------- Bills end ---------------------

// ------------------- Orders start -------------------
//Get all Orders table
routes.get('/orders/table',(req,res)=>{
    let sql = `SELECT 
                    restaurant_orders.id, 
                    restaurant_orders.table_id, 
                    restaurant_orders.comments,
                    restaurant_orders.amount, 
                    restaurant_orders.status, 
                    restaurant_products.name 

                    FROM restaurant_orders 
                    INNER JOIN restaurant_products 
                    ON restaurant_orders.product_id = restaurant_products.id`
    getAllQuery(sql,res);
});

//Get Orders by id
routes.get('/orders/:id',(req,res)=>{
    const {id} = req.params
    let sql = 'SELECT * FROM `restaurant_orders` WHERE id = ? '
    getByIdQuery(sql,res,id);
});

//Get Orders by table
routes.get('/orders-by-table/:id',(req,res)=>{
    const {id} = req.params
    let sql =`SELECT 
                restaurant_orders.id, 
                restaurant_orders.comments,
                restaurant_orders.amount, 
                restaurant_orders.status, 
                restaurant_products.name, 
                restaurant_products.price 

                FROM restaurant_orders 
                INNER JOIN restaurant_products 
                ON restaurant_orders.product_id = restaurant_products.id
                WHERE table_id = ? 
                AND status != 2`
    getByIdQuery(sql,res,id);
});

//Create Orders
routes.post('/orders',(req,res)=>{
    const {table_id,product_id,amount,status,comments,ticket_number} = req.body
    let sql = "INSERT INTO `restaurant_orders` (table_id, product_id, amount, status, comments, ticket_number)"+
    `VALUES ('${table_id}','${product_id}','${amount}','${status}','${comments}','${ticket_number}')`;
    let sql2 = `UPDATE restaurant_table SET status = 1 WHERE id = '${table_id}'`;
    conection.query(sql,(err, rows, fields) =>{
        if(err){throw err}
        else{
            conection.query(sql2,(err, rows, fields) =>{
                if(err){throw err}
                else{res.json({status:`${'order created'}`})}
            })
        }
    });
});

//Delete Orders
routes.delete('/orders/:id',(req,res)=>{
    const {id} = req.params
    let sql = "DELETE FROM `restaurant_orders`"+`WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'order deleted'); 
});

//Change status of order
routes.put('/orders/status/:id',(req,res)=>{
    const {id} = req.params
    const {status} = req.body
    let sql = "UPDATE `restaurant_orders`"+`SET status ='${status}' WHERE id = '${id}'`
     createUpdateDeleteQuery(sql,res,'status updated');
});

//Update Orders
routes.put('/orders/:id',(req,res)=>{
    const {id} = req.params
    const {table_id,product_id,amount,status,comments,ticket_number} = req.body
    let sql = "UPDATE `restaurant_orders`"+`SET table_id ='${table_id}', product_id ='${product_id}', amount ='${amount}', status ='${status}', comments ='${comments}', ticket_number ='${ticket_number}'
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

//Get today by date
routes.get('/tickets/startDate/:startDate/endDate/:endDate',(req,res)=>{
    const {startDate, endDate} = req.params
    if(endDate == 0){
        var sql =`SELECT 
        restaurant_tickets.*,
        restaurant_table.name

        FROM restaurant_tickets
        INNER JOIN restaurant_table
        ON restaurant_table.id = restaurant_tickets.table_id
        WHERE date = '${startDate}'`
    }else{    
        var sql =`SELECT 
        restaurant_tickets.*,
        restaurant_table.name

        FROM restaurant_tickets
        INNER JOIN restaurant_table
        ON restaurant_table.id = restaurant_tickets.table_id
        WHERE date BETWEEN '${startDate}' AND '${endDate}'`
    }
    getAllQuery(sql,res); 
});
//Get Ticket by id
routes.get('/tickets/:id',(req,res)=>{
    const {id} = req.params
    let sql = `SELECT * FROM restaurant_tickets WHERE id = '${id}' `
    getByIdQuery(sql,res,id);
});
//Create Ticket
routes.post('/tickets',(req,res)=>{
    const {table_id,date,hour,total} = req.body
    let sql = "INSERT INTO `restaurant_tickets` (table_id, date, hour, total)"+
    `VALUES ('${table_id}','${date}','${hour}','${total}')`;
    createUpdateDeleteQuery(sql,res,'ticket created');
});
//Delete Ticket
routes.delete('/tickets/:id',(req,res)=>{
    const {id} = req.params
    let sql = "DELETE FROM `restaurant_tickets`"+`WHERE id = '${id}'`
    createUpdateDeleteQuery(sql,res,'ticket deleted'); 
});
//Update Ticket
routes.put('/tickets/:id',(req,res)=>{
    const {id} = req.params
    const {table_id,date,hour,total} = req.body
    let sql = "UPDATE `restaurant_tickets`"+`SET table_id ='${table_id}', date ='${date}', hour ='${hour}', total ='${total}'
     WHERE id = '${id}'`
     createUpdateDeleteQuery(sql,res,'ticket updated');
});
// ------------------- Ticket end ---------------------



// ------------------------- Routes -------------------------



module.exports = routes;