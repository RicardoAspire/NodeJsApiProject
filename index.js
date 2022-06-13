require('./config/conection');
const express = require('express');
const bodyParser = require('body-parser');
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended : true });
const port = (process.env.port || 3000);

//Express
const app = express();

//Datatypes
app.use(express.json());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

//Config
app.set('port',port);

//Routes
app.use('/api',require('./routes'));

//Express initialization
app.listen(app.get('port'),(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Listening in port'+port)
    }
})