const express = require('express');
const router=express.Router();
const User = require('../models/users');
const mongoose = require('mongoose');

//home 
router.get('/',(req,res)=>{
    if(req.session.user){
        res.render("dashbord",{
            message:req.session.name
        })
    }else if(req.session.admin){
        res.redirect("/admin")
    }
    else res.render("login")
})
//user authorization
router.post('/Userlogin',async(req,res)=>{
    let a=await User.findOne({email:req.body.Username})
    if(a==null){
        req.session.message={
            type:'success',
            message:"incorrect username or password"
        }
        res.redirect('/')
    }
    
        else if(a.email==req.body.Username&&a.password==req.body.password){
            req.session.user=req.body.Username
            req.session.name=a.name
            res.render('dashbord',{
                message:req.session.name
            }) 
        }else{
            req.session.message={
                type:'success',
                message:"incorrect username or password"
            }
            res.redirect('/')
        }
        
    })


//admin login
router.get("/adminlogin",(req,res)=>{
    if(req.session.admin){
        res.redirect('/admin')
    }else res.render("adminlogin")
})
router.post("/admin-login",(req,res)=>{
    const admin_id="admin@gmail.com";
    const admin_password='admin123'
    if(admin_id==req.body.Username&&admin_password==req.body.password){
        req.session.admin=true
        res.redirect("/admin")
    }
    
})
//logout
router.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})
//get all users 
router.get("/admin",(req,res)=>{
    let data=User.find()
    data.exec()
    .then((Users)=>{
        res.render("index",{
            title:"Admin page",
            Users:Users ,data
        })
    })
    .catch((err)=>{
        console.log(err.message);
    })
});

//adding data to database by admin

router.get('/add',(req,res)=>{
    res.render('add_users',{title:"Add Users"})
})

router.post("/addUser",async(req,res)=>{
    const data= await User.findOne({email:req.body.email})
    if(data!=null){
        req.session.message={
            type:'success',
            message:"email is already existing"
        }
         res.redirect('/add')
    } 
    if(data==null){
        const userData = await User.create(req.body);
    req.session.message={
            type:'success',
            message:"User Added Successfully"
        }
        if(req.session.admin) res.redirect('/admin')
        else res.redirect('/') 
    
    }
    
})
//edit an User 

router.get("/edit/:id",(req,res)=>{ 
    let id=req.params.id;
User.findById(id)
.then((user)=>{
    if(user==null) res.render('/')
        else {
            res.render("edit_user",{
                title:"Edit User",
                Users:user
            })
    }
})
.catch((err)=>{
    if(err) res.redirect('/admin');
})
})
 router.post('/update/:id',(req,res)=>{
    let id=req.params.id;
    User.findByIdAndUpdate(id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    })
    .then(()=>{
        req.session.message={
            type:'success',
            message:'User Updated Successfully'
        }
        res.redirect('/admin')
    })
    .catch(()=>{
        res.json({message:err.message, type:"danger"})
    })
 })

 //delete user
router.get('/delete/:id',(req,res)=>{
    let id=req.params.id;
    User.findByIdAndDelete(id)
    .then(()=>{
        req.session.message={
            type:'success',
            message:"User deleted successfully"
        }
        res.redirect('/admin')
    })
    .catch((err)=>{
        res.json({message:err.message})
    })
})

module.exports=router;     