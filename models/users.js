const mongoose = require('mongoose');
const userschema= new mongoose.Schema({
    name:{
        type:String,
        requred:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const Userdb=mongoose.model('users',userschema) 
module.exports=Userdb;