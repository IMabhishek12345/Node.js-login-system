if (process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}

const express=require("express");
const app=express();
const bcrypt=require("bcrypt");
const passport=require("passport");
const flash=require("express-flash");
const session=require("express-session");

const initializePassport=require("./passport-config");

const users=[];//for holding different users data, if we are not 

initializePassport(passport,email =>
    users.find(user=> user.email===email),
    id => users.find(user=> user.id===id)
);

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

app.use(flash());
//HTTP is stateless; in order to associate a request to any other request,
//you need a way to store user data between HTTP requests. Cookies and URL
//parameters are both suitable ways to transport data between the client 
//and the server. But they are both readable and on the client side. 
//Sessions solve exactly this problem. You assign the client an ID and it 
//makes all further requests using that ID. Information associated with the 
//client is stored on the server linked to this ID.
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false  //This is for saving a empty value if there is
                              // no value that's why false is stored 
}))

app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res)=>{
    res.render("index.ejs",{name: "abhishek"})
})
app.get("/register",(req,res)=>{
    res.render("register.ejs");
})
app.get("/login",(req,res)=>{
    res.render("login.ejs");
})

app.post("/login",passport.authenticate("local",{
  successRedirect: "/",
  failureRedirect: "/login",
  failureflash: true
  
}))
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
