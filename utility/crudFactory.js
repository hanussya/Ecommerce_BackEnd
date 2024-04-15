const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const promisify = require("util").promisify;
const promisifiedJWTSign=promisify(jwt.sign);
const promisifiedJWTVerify=promisify(jwt.verify);
const { JWT_SECRET } = process.env;
const secretKey =JWT_SECRET;

// const cookieParser =require("cookie-parser");

const createFactory =(ElementModel)=>{

    return async function(req,res){
        try{
    
        console.log("I am inside app.get");
        // const elementDataStore=await ElementModel.find();
        // console.log("elementData", elementDataStore);
        if(req.body.length==0 || req.body== undefined){
            throw new Error("Not Found Exception")
        }
        else{
             
            const elementDataStore=await ElementModel.create(req.body);
        
        res.status(200).json({
            status:"Success",
            message:elementDataStore
        })
    }

        
    }catch(err){
        res.status(404).json({
            status:"Not Found",
            message:err.message
        })
    }
}
}

const getAllFactory=(ElementModel)=>{
   return async function(req,res){ try{
    
        console.log("I am inside app.get");
        const elementDataStore=await ElementModel.find();
        // console.log("elementData", elementDataStore);
        if(elementDataStore.length==0 || elementDataStore== undefined){
            throw new Error("Not Found Exception")
        }
        res.status(200).json({
            status:"Success",
            message:elementDataStore
        })
    
       
        
    }catch(err){
        res.status(404).json({
            status:"Not Found",
            message:err.message
        })
    }
}
}

const getByIdFactory=(ElementModel)=>{
   return async function(req,res){ 
    try{
        const elementIdparam=req.params.elementId;
        const elementDetails=await ElementModel.findById(elementIdparam);
        if(elementDetails== "no element found"){
    throw new Error (`element not found ${elementIdparam}`)
        }
        console.log("I am inside app.getparam", req.params);
        res.status(200).json({
            status:"Success",
            message:elementDetails
        })
    }catch(err){
        res.status(404).json({
            status:"element not found",
            message:err.message
        })
    }
}
}
const deleteByIdFactory=(ElementModel)=>{
    return async function(req,res){
        try{
        
            const elementIdparam=req.params.elementId;
        const elementDetails=await ElementModel.findByIdAndDelete(elementIdparam);
        console.log("I am inside app.delete");
        res.status(200).json({
            status:"Successfully deleted",
            message:elementDetails
        })
    }
        catch(err){
            res.status(404).json({
                status:"element not found",
                message:err.message
            })
        }
    
    }
    }
    const signupController=(ElementModel)=>{
       return async function(req,res){ try{
            let userObject=req.body;
        
            let newUser=await ElementModel.create(userObject);
            if(newUser.length ==0 ||newUser ==undefined){
                throw new Error("No Data");
            }
            res.status(200).json({
                message:"New user registered",
                UserDeatils:newUser,
            })
        
        }catch(err){
            res.status(404).json({
                message:err.message
            })
        }
        }
    }
    const loginController=(ElementModel)=>{
        return async function (req, res){
            try {
        
                /***
                 * 1. enable login -> tell the client that user is logged In
                 *      a. email and password 
                 **/
        
                let { email, password } = req.body;
                let user = await ElementModel.findOne({ email });
                if (user) {
                    let areEqual = password == user.password;
                    if (areEqual) {
                        // user is authenticated
                        /* 2. Sending the token -> people remember them
                               * */
                        // payload : id of that user 
                        console.log("JWT_SECRET", JWT_SECRET);
                        let token = await promisifiedJWTSign({ id: user["_id"] }, JWT_SECRET);
                        console.log("sendning token");
                        res.cookie("jwt", token, { maxAge: 90000000, httpOnly: true, path: "/" });
                        res.status(200).json({
                            status: "success",
                            message: "user logged In",
                            user:{
                                email:user.email,
                                name: user.name,
                                role: user.role
                            }
                        })
                    } else {
                        console.log("err", err)
                        res.status(404).json({
                            status: "failure",
                            message: "email or password is incorrect"
                        })
                    }
        
        
                } else {
                    res.status(404).json({
                        status: "failure",
                        message:
                            "user not found with creds"
                    })
                }
        
        
            } catch (err) {
                console.error(err);
                res.status(500).json({
                    status: "failure",
                    message: err.message
                })
            }
        }
    }
        const forgotPasswordHandler=(ElementModel)=>{
            return async function (req, res ){
                try{
                const email= req.body.email;
                console.log('email', req.body.email);
                const user= await ElementModel.findOne({email});
                if(user){
            user.token=otpGenerator();
            const token=user.token;
            user.otpExpiry=Date.now()+1000*60*5;
            await user.save();
            const to=email;
            const text=token;
            const subject="OTP to reset the password"
            sendEmailHelper(to,text,subject).then(()=>{
                console.log("Email sent");
            })
            }
            else{
                res.status(400).json({
                    message:"User Not found"
                 })
               
            }
                res.status(200).json({
                    message:"OTP sent to mailId"
                 })
            
            }catch(err){
                res.status(400).json({
                   message:`error is ${err.message}`
                })
            
            }
        }
            }
            const resetPasswordHandler=(ElementModel)=>{
            return async function (req,res){
                const email= req.body.email;
                const user= await ElementModel.findOne({email});
                const otp=req.body.token;
                const password=req.body.password;
                if(user){
                    if(Date.now()> user.otpExpiry){
                        res.status(400).json({
                            message:"otp Expired"
                         })
                    }
                   else{
                        if(user.token!==otp){
                            res.status(400).json({
                                message:"otp mismatch"
                             })
                        }
                        
                         else{
                            if(user.token===otp){
                                user.password=password;
                                user.token=null;
                                user.confirmPassword=null;
                                user.otpExpiry=null;
                                await user.save();
                                res.status(200).json({
                                    message: "success",
                                    data: "Password is updated",
                                    });
                                    
                            }
                         }
                    }
            
            
                }else{
                    res.status(400).json({
                        message:"User Not found"
                     })
                }
            
            }
        }

        const protectRouteMiddleWare=()=>{
           return async function (req, res, next){ try{
                const jwtToken=req.cookies.jwt;
                console.log("jwtToken", jwtToken);
                console.log("JWT_SECRET", JWT_SECRET);
                 let decodedToken = await promisifiedJWTVerify(jwtToken,JWT_SECRET);
                 console.log("decodedToken", decodedToken);
                 if(decodedToken){
                    req.userId=decodedToken.id;
                 }
             
        next();
        
            }catch(err){
                res.status(404).json({
                    message:err.message
                })
            }
        }
    }
    const isAuthorized =(allowedUser,ElementModel)=>{
        return async function(req, res,next){
            // const userId= req.userId;
            const email=req.body.email;
           const user= await ElementModel.findOne({email});
           console.log("user", user);
           console.log("user", user);
           if(allowedUser.includes(user.role)){
            console.log("authorized");
            next();
           }
           else{
            res.status(401).json({
                message: "You are not authorized to access this route",
              });
           }
        }
    }
// }


// const createelementHandler= async function(req, res){
//     // const id= short.generate();
//     try{

    
//     const elementDetails =req.body;
//     // elementDataStore.push(elementDetails);
//     // const strelementStore =JSON.stringify(elementDataStore);
//     // fs.writeFileSync("./dev_data.json",strelementStore);
//     const element = await elementModel.create(elementDetails);
//     // elementDetails.id=id;

//     console.log("I am inside app.post", req.body);
//     res.status(200).json({
//         status:"Success",
//         message:`update the element with `,
//         element:element
//     })
// }
// catch(err){
//     res.status(500).json({
//         status:"Page Not Found",
//         message:err.message
//     })
// }
// }

// const getAllelementHandler= async function(req, res){
//     try{
    
//      console.log("I am inside app.get");
//      const elementDataStore=await elementModel.find();
//      // console.log("elementData", elementDataStore);
//      if(elementDataStore.length==0 || elementDataStore== undefined){
//          throw new Error("Not Found Exception")
//      }
//      res.status(200).json({
//          status:"Success",
//          message:elementDataStore
//      })
 
    
     
//  }catch(err){
//      res.status(404).json({
//          status:"Not Found",
//          message:err.message
//      })
//  }
//  }
//  const getelementByIdHandler= async function(req, res){
//     try{
//     const elementIdparam=req.params.elementId;
//     const elementDetails=await elementModel.findById(elementIdparam);
//     if(elementDetails== "no element found"){
// throw new Error (`element not found ${elementIdparam}`)
//     }
//     console.log("I am inside app.getparam", req.params);
//     res.status(200).json({
//         status:"Success",
//         message:elementDetails
//     })
// }catch(err){
//     res.status(404).json({
//         status:"element not found",
//         message:err.message
//     })
// }
// }

// const deleteelementById = async function(req,res){
//     try{
        
//         const elementIdparam=req.params.elementId;
//     const elementDetails=await elementModel.findByIdAndDelete(elementIdparam);
//     console.log("I am inside app.delete");
//     res.status(200).json({
//         status:"Successfully deleted",
//         message:elementDetails
//     })
// }
//     catch(err){
//         res.status(404).json({
//             status:"element not found",
//             message:err.message
//         })
//     }

// }
module.exports={isAuthorized,createFactory,getAllFactory,getByIdFactory,deleteByIdFactory,forgotPasswordHandler,protectRouteMiddleWare,resetPasswordHandler,signupController,loginController};