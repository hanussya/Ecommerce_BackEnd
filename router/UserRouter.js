const express=require("express");
const {checkInputValue}= require("../controller/middleware.js");
const {createUserHandler,getAllUserHandler,getUserByIdHandler,deleteUserById,protectRoute}= require("../controller/UserController.js")
const UserRouter= express.Router();
const {SENDMAIL,HTML_TEMPLATE,sendEmailHelper}=require("../sendEmailHelper.js");
const UserModel = require("../model/userModal.js");

UserRouter.use(protectRoute);
UserRouter.post("/createUser", checkInputValue,createUserHandler);
UserRouter.get("/", getAllUserHandler);
UserRouter.get("/:userId", getUserByIdHandler);
UserRouter.delete("/:userId", deleteUserById);



UserRouter.use(express.json());


// const forgotPasswordHandler=async(req,res)=>{
//     try{
//         const email= req.body.email;
//         console.log('email', req.body.email);
//         const user= await UserModel.findOne({email});
//         if(user){
//     user.token=otpGenerator();
//     const token=user.token;
//     user.otpExpiry=Date.now()+1000*60*5;
//     await user.save();
//     const to=email;
//     const text=token;
//     const subject="OTP to reset the password"
//     sendEmailHelper(to,text,subject).then(()=>{
//         console.log("Email sent");
//     })
//     }
//     else{
//         res.status(400).json({
//             message:"User Not found"
//          })
       
//     }
//         res.status(200).json({
//             message:"OTP sent to mailId"
//          })
    
//     }catch(err){
//         res.status(400).json({
//            message:`error is ${err.message}`
//         })
    
//     }
//     }
//     const resetPasswordHandler=async(req,res)=>{
//         const email= req.body.email;
//         const user= await UserModel.findOne({email});
//         const otp=req.body.token;
//         const password=req.body.password;
//         if(user){
//             if(Date.now()> user.otpExpiry){
//                 res.status(400).json({
//                     message:"otp Expired"
//                  })
//             }
//            else{
//                 if(user.token!==otp){
//                     res.status(400).json({
//                         message:"otp mismatch"
//                      })
//                 }
                
//                  else{
//                     if(user.token===otp){
//                         user.password=password;
//                         user.token=null;
//                         user.confirmPassword=null;
//                         user.otpExpiry=null;
//                         await user.save();
//                         res.status(200).json({
//                             message: "success",
//                             data: "Password is updated",
//                             });
                            
//                     }
//                  }
//             }
    
    
//         }else{
//             res.status(400).json({
//                 message:"User Not found"
//              })
//         }
    
//     }
    const otpGenerator = () => {
        return Math.floor(100000 + Math.random() * 900000);
        };
// UserRouter.post("/forgotPassword", forgotPasswordHandler);
// UserRouter.patch("/resetPassword/:userId", resetPasswordHandler);

module.exports=UserRouter;
