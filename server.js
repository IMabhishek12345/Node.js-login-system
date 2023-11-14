const express=require("express");
const app=express();
const bcrypt=require("bcrypt");
const passport=require("passport");
const initializePassport=require("./passport-config");
initializePassport(passport);

const users=[];//for holding different users data, if we are not 
//connected to any database

app.set("view-engine","ejs")
//a. express.json() is a method inbuilt in express to recognize the
// incoming Request Object as a JSON Object. 
//This method is called as a middleware in your application
// using the code: app.use(express.json());

// b. express.urlencoded() is a method inbuilt in express to 
//recognize the incoming Request Object as strings or arrays. 
//This method is called as a middleware in your application using the 
//code: app.use(express.urlencoded());

app.use(express.urlencoded({extended: false}));//extended:false means
//it parse only incoming request object like arrays or strings
//extended:true means it parse any incoming request object with nested objects etc.


app.get("/",(req,res)=>{
    res.render("index.ejs",{name: "abhishek"})
})
app.get("/register",(req,res)=>{
    res.render("register.ejs");
})
app.get("/login",(req,res)=>{
    res.render("login.ejs");
})

app.post("/login",(req,res)=>{
    
})
app.post("/register",async(req,res)=>{
  try {
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    users.push({
        id: Date.now().toString(),
       name:req.body.name,
       email:req.body.email,
       password:hashedPassword
    })  
    res.redirect("/login");
} catch {
    res.redirect("/register");
  }
 console.log(users);
})
app.listen(3000);
