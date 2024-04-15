const UserModel=require("../model/userModal");
const allowedUser=["ceo","admin","user"];
const {forgotPasswordHandler,resetPasswordHandler,signupController,loginController,isAuthorized}=require("../utility/crudFactory")
const forgotPassword=forgotPasswordHandler(UserModel);
const resetPassword=resetPasswordHandler(UserModel);
const signup=signupController(UserModel);
const login=loginController(UserModel);
const isAuthorizedUser =isAuthorized(allowedUser,UserModel);

module.exports={forgotPassword,resetPassword, signup, login,isAuthorizedUser};

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
//     module.exports={forgotPasswordHandler,resetPasswordHandler};