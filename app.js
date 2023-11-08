const express =require("express")
const { users } = require("./model/index")
const app= express()
const bcrypt= require("bcryptjs")

// database connection
require("./model/index")

//form bata aako data parse gar or bujj
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

//post api for handling user registration
app.post("/register",async(req,res)=>{
    console.log(req.body)
    const email=req.body.email
    const username=req.body.username
    const password=req.body.password

    //validation from server side
     if(!email || !username ||!password){
        return res.send("Please provide email,username,password")
     }

    await users.create({
        email:email,
        username:username,
        password:bcrypt.hashSync(password,8)
    })

    res.redirect("/login")
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.post("/login",async(req,res)=>{
    const email =req.body.email
    const password =req.body.password

    //1st: tyo emial vako koi user table ma xah ki nai
const userExists = await users.findAll({
    where:{
        email:email
    }
})
if(userExists.length>0){
    //2nd : password check garne
 const isMatch= bcrypt.compareSync(password,userExists[0].password)
if (isMatch){
    res.send("Logged in succesfully")
}
    else{
    res.send("Invalid Email or Password")
}
}
else
{
    res.send("Invalid Email or password ")
}
})
app.listen(3000,function(){
    console.log("NodeJs project has started at port 3000")
    
})