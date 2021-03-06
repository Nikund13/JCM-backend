// import {jcm_user} from '../api/jcm_user'
import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import configKey from '../config'
import nodemailer from 'nodemailer'
import {client} from '../server'

// mail object
const smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "test.dds0001@gmail.com",
      pass: 'DDS1234daydreamsoft'
    }
  });
// Registration api

export const signup = async (req,res) =>{
    try{
        const {email,name,password} = req.body;
        const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(emailRegexp.test(email)){
            const emailId = email.toLowerCase();
            client.query(`select email from jcm_user where email='${email}'`, (err, results) => {
              if(err){
                 return res.status(400).json(err)
               } else if(results.rows.length) {
                    return res.status(409)
                    .json({code:409, status:false,message:'This email is already exists'})
              }
              else {
                client.query(
                  `INSERT INTO jcm_user(name, email, password)VALUES('${name}', '${email}', '${bcrypt.hashSync(password)}')`,
                  (err, results) => {
                    if(err){
                       return res.status(400).json(err)
                     } else {
                      return res.status(201)
                      .json({code:201, status:true,message:'Your account successfully registered'})
                    }
                  }
                );
              }
            });
          }else{
            return res.status(200).send({
                success: false,
                message: "write valid emailId"
              });
        }
    }
    catch(err){
        res.status(422).send({ success: false, message: err.message });
    }
}

//token genration
const expirationInterval =
    (process.env.NODE_ENV === "development")? 30 * 24 * 60 * 60: (parseInt(process.env.JWTSECRET) || 1) * 24 * 60 * 60;

const tokenForUser = (user) => {
    try {
      const timestamp = new Date().getTime();
      return jwt.sign(
        {
          sub: user,
          iat: timestamp,
          // entityDetails: loginDetails.relatedFaEntities[0],
          exp: Math.floor(Date.now() / 1000) + expirationInterval
        },
        configKey.secrets.JWT_SECRET
      );
    }
    catch (err) {
      throw err;
    }
  };

//signin api

export const signin = async (req,res) => {
    const {email} = req.body;
    try{
        const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(emailRegexp.test(email)){
               client.query(`select name,email from jcm_user where email='${email}'`, (err, results) => {
                 if(err){
                    return res.status(400).json(err)
                  }
                  else if(results.rows.length==1){
                       res.status(201).send({
                           success: true,
                           message:"login Sucessfully",
                           token: tokenForUser(results.rows[0].email),
                           data:results.rows[0]
                         })
                  }
                  else{
                    console.log("data not found");
                  }
               });
            }else{
              return res.status(401).send({
                  success: false,
                  message: "write valid id and password"
                });
            }
    }
    catch(err){
        res.status(422).send({
            success: false,
            error: `Unable to Login using email - ${email}`
          });
    }
}

//forget password Link genration
export const forgotPassword = async (req,res) =>{
  try{
    let {email} = req.body
    const emailId = email.toLowerCase();
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegexp.test(emailId)) {
        return res.status(200).send({ success: false, message: "Invalid Email" });
      }
    const isEmailExist = await client.query(`select name,email from jcm_user where email='${email}'`)
      if (!isEmailExist) {
        return res
          .status(200)
          .send({ success: false, message: "email in not registered" });
      }
      const mail = {
        emailId:email
      }
      const token = tokenForUser(mail);
      const data = {
        to: emailId,
        from: process.env.MAILER_EMAIL_ID,
        subject: "Click Below Link To Reset Password ",
        text:
          "Confirm your email address to get started.\n\n" +
          "Please click on the following link, or paste this into your browser to the reset password process:\n\n" +
          "http://localhost:4200/reset-password?token=" +
          token +
          "\n\n" +
          "If you did not need this, please ignore this email and your password will remain unchanged.\n"
      };
      await smtpTransport.sendMail(data, err => {
        return err ? res.status(422).send({
              success: false,
              message: err
            }) : res.status(201).send({
              success: true,
              message: "please check your email to reset your password!"
            });
      });
  }
  catch(err){
    res.status(422).send({ success: false, message: err.message });
  }
}


export const resetPassword = async(req,res) =>{
  try{
    const token = req.query.token;
    const newPassword = req.body.password;
    const decoded =jwt.decode(token)
    const password= bcrypt.hashSync(newPassword)
    const response = await client.query(`UPDATE jcm_user SET password = '${password}' WHERE email = '${decoded.sub.emailId}'`)
    console.log(response);
    if(response.rowCount==0){
      return res.status(401).send({
        success: false,
        message: "somthing wrong"
      });
    }else{
      return res.status(200).send({
        success: true,
        message: "your password changed successfully!"
      });
    }
  }
  catch(err){
    res.status(422).send({ success: false, message: err.message });
  }
}
