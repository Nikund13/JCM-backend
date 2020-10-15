import { ExtractJwt } from 'passport-jwt'
// import {Users} from '../api/users'
import configKey from '../config'
import bcrypt from 'bcrypt-nodejs'
import {client} from '../server'


const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const localOptions = {
    usernameField: "email"
};

const localLogin = new LocalStrategy(
    localOptions,
    async (email, password, done)=>{
        try{
            const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(emailRegexp.test(email)){
                client.query(`select email,password from users where email='${email}'`,async(err, results) => {
                  if(err){
                    //  return res.status(400).json(err)
                     console.log("query error");
                   }
                   else if(results.rows.length>=1){
                     console.log(results.rows[0].password);
                     const validPassword = await bcrypt.compareSync(password, results.rows[0].password);
                     if(!validPassword){
                         return done("Password is Incorrect Please try Again later",false);
                     }else{
                          return done (null,results.rows[0]);
                     }
                   }
                   else{
                        console.log("email id is not found please enter valid email");
                        return done("email id is not found please enter valid email",false);
                   }
                });
    
            }
        }
        catch(err){
            console.log(err);
            return done("System was unable to process the details", false);
        }
    }
)

passport.use(localLogin);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: configKey.secrets.JWT_SECRET
}

const jwtLogin = new JwtStrategy(jwtOptions, (jwt_payload, done)=>{
    console.log("CHECKING LOGIN USING JWT");
    client.query(`select * from users where email='${jwt_payload.sub}'`,async(err, results) => {
        if(err){
            console.log("jwt find query error"); 
         }
         else if(results.rows.length>=1){
            return done(null,results.rows[0]);
         }
         else{
              console.log("email id is not found please enter valid email");
         }
      });
})
passport.use(jwtLogin);
