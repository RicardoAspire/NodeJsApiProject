require('./api/connection/conection');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended : true });
const port = (process.env.port || 3000);

//Datatypes
app.use(express.json());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
app.use(cors());

//Config
app.set('port',port);

//Routes
app.use('/api',require('./api/routes/routes'));

//Express initialization
app.listen(app.get('port'),(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Listening in port'+port)
    }
})