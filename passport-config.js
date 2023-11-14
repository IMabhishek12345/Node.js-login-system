const { authenticate } = require("passport");
const localStratergy=require("passport-local");

function initialize(passport){
    const authenticateUser=(email,password,done)=>{
      const user=getUserByEmail(email)
      if(user== null){
        return done(null,false,{message:"No user witn that email exists"});
      }
    }
    passport.use(new localStratergy({usernameField: "email"}),authenticateUser)

    passport.serializeUser((user,done)=>{});
    passport.deserializeUser((id,done)=>{});
}