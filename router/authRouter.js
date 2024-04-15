const express=require("express");
const authRouter= express.Router();
// const {forgotPasswordHandler, resetPasswordHandler}=require("../controller/authController");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const promisify = require("util").promisify;
const promisifiedJWTSign=promisify(jwt.sign);
const promisifiedJWTVerify=promisify(jwt.verify);
const UserModel= require("../model/userModal");

const {forgotPassword,resetPassword, signup, login, isAuthorizedUser} =require("../controller/authController");


    const otpGenerator = () => {
        return Math.floor(100000 + Math.random() * 900000);
        };
       
           
        authRouter.post("/signup", signup);
        authRouter.post("/login", isAuthorizedUser,login);
        authRouter.post("/forgotPassword", forgotPassword);
        authRouter.patch("/resetPassword/:userId", resetPassword);
        authRouter.get("/logout", function(req, res){
            res.clearCookie("jwt");
            res.status(200).json({
                message:"Suceess loggedout",
            })
        })
module.exports=authRouter;
