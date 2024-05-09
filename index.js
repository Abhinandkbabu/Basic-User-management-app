const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const PORT= process.env.PORT||4000;
const path = require('path');
const nocache = require('nocache');

//middleware

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(nocache())
app.use(session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false
})); 

app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})

//set template engine 
app.set('view engine','ejs');

//database connection

const con = mongoose.connect( "mongodb://localhost:27017/node_crud")

con.then(()=>{
    console.log('connected to db')
}).catch((err)=>{
    console.log(err);
})

//route prefix
app.use("",require('./routs/routes'))

app.listen(4000,()=>console.log(`server is running http://localhost:${PORT}`)); 