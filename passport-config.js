const {authenticate}=require("passport");
const localStrategy=require("passport-local").Strategy;
const bcrypt=require("bcrypt");

function initialize(passport,getUserByEmail,getUserbyId){
      const authenticateUser=async(email,password,done)=>{
      const user=getUserByEmail(email);
      
      console.log(user);
      if(user==null){
      //In done(err,userexist,object):- err is the error in the server 
      return done(null,false,{message:"No user witn that email exists"});
      }
      try {
        if (await bcrypt.compare(password,user.password)){
          return done(null,user)
        }else{
          return done(null,false,{message: "Password Incorrect"})
        }
      } 
      catch (err) {
        return done(err);//return the error in our application
      }
    }
    passport.use(new localStrategy({usernameField: "email"},authenticateUser));

    passport.serializeUser((user,done)=>done(null,user.id));
    passport.deserializeUser((id,done)=>{ return done(null,getUserbyId(id))});
}
//serializeUser determines which data of the user object should be stored 
//in the session. The result of the serializeUser method is attached to the
//session as req.session.passport.user = {}. Here for instance, 
//it would be (as we provide the user id as the key) req.session.passport.user 
//= {id: 'xyz'}

//The first argument of deserializeUser corresponds to the key of the user
//object that was given to the done function (see 1.). So your whole object
//is retrieved with help of that key. That key here is the user id (key can 
//be any key of the user object i.e. name,email etc). 
//In deserializeUser that key is matched with the in memory 
//array / database or any data resource.

module.exports=initialize;