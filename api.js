const express = require("express");
const UserModel = require("./model/userModal");
const ProductModel = require("./model/ProductModel");

const fs = require("fs");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const app = express();
console.log("Hello");

// const short = require('short-uuid');
const strContent = fs.readFileSync("./dev_data.json", "utf-8");
const userDataStore = JSON.parse(strContent);
const dotenv = require("dotenv");
dotenv.config();
const { PORT, DB_PASSWORD, DB_USER } = process.env

const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@hanussyacluster.iv9bzry.mongodb.net/?retryWrites=true&w=majority`;
const port = PORT;
console.log("port", port)
mongoose.connect(dbURL).then(function (connection) {
    console.log("connected to db")
}).catch(err => console.log(err));
app.use(express.json());

app.get("/api/products", getAllProductHandler);
app.use(cookieParser());

async function getAllProductHandler(req, res) {
    try {
        let query = req.query;
        let selectParam = query.select;
        let sortParam = query.sort;
        let myQuery = query.myQuery;
        console.log("selectParam", selectParam);
        console.log("sortParam", sortParam);
        const parsedQuery = JSON.parse(myQuery);
        const queryResPromise = ProductModel.find(parsedQuery);
        if (sortParam) {
            let order = sortParam.split(" ")[1];
            let sortBy = sortParam.split(" ")[0];
            if (order == "inc") {
                queryResPromise = queryResPromise.sort(sortBy);
            }
            else {
                queryResPromise = queryResPromise.sort(-sortBy);
            }

        }
        if (selectParam) {
            queryResPromise = queryResPromise.select(selectParam)
        }
        let page = page || 1;
        let limit = limit || 2;
        const elementstoskip = (page - 1) * limit;
        console.log(elementstoskip);
        queryResPromise = queryResPromise.skip(elementstoskip).limit(limit);
        // .limit()
        // .skip()

        const result = await queryResPromise;
        res.status(200).json({
            message: result,
            status: "success"
        })
    } catch (err) {
        res.status(404).json({
            message: req.err,
            status: "Error"
        })
    }
}

// function transformQueryHelper(myQuery) {
//     const parseQuery = JSON.parse(myQuery);
//     const queryOperators = {
//         eq: '$eq',
//         gt: '$gt',
//         gte: '$gte',
//         in: '$in',
//         lt: '$lt',
//         lte: '$lte',
//         in: '$nin',
//     };
//     for (let key in parseQuery){
//         let keyPresent= queryOperators[key];
//         if(keyPresent){
//             queryOperators[`${key}`]=parseQuery[key]
//             delete key;
//         }
//     }

//     console.log(parseQuery);
//     return transformedQuery;

// }
function transformQueryHelper(myQuery) {
    const parseQuery = JSON.parse(myQuery);
    const queryOperators = {
        gt: '$gt',
        gte: '$gte',
        lt: '$lt',
        lte: '$lte',
        // Add more operators as needed
    };
    for (let key in parseQuery) {

        let internalObject = parseQuery[key];
        if (typeof internalObject == "object") {
            // in the inner obj -> operators 
            for (let innerKey in internalObject) {
                if (queryOperators[innerKey]) {
                    internalObject[`$${innerKey}`] = internalObject[innerKey];
                    delete internalObject[innerKey];
                }
            }
        }

    }
    return parseQuery;
}

// module.exports =UserModel;
// module.exports =ProductModel;

// app.use-> a method -> express
// app.use(function (req,res,next){
//     console.log("before", req.body);
//     next();
// })
// app.use()

// function createFactory(ElementModel){

//     return async function(){try{

//         console.log("I am inside app.get");
//         const userDataStore=await ElementModel.find();
//         // console.log("userData", userDataStore);
//         if(userDataStore.length==0 || userDataStore== undefined){
//             throw new Error("Not Found Exception")
//         }
//         res.status(200).json({
//             status:"Success",
//             message:userDataStore
//         })



//     }catch(err){
//         res.status(404).json({
//             status:"Not Found",
//             message:err.message
//         })
//     }
// }
// }
// const getAllProductHandler =createFactory(ProductModel);
// const getAllUserHandler =createFactory(UserModel);


//  async function(req, res){
//     // const id= short.generate();
//     try{


//     const userDetails =req.body;
//     // userDataStore.push(userDetails);
//     // const struserStore =JSON.stringify(userDataStore);
//     // fs.writeFileSync("./dev_data.json",struserStore);
//     const user = await UserModel.create(userDetails);
//     // userDetails.id=id;

//     console.log("I am inside app.post", req.body);
//     res.status(200).json({
//         status:"Success",
//         message:`update the user with `,
//         user:user
//     })
// }
// catch(err){
//     res.status(500).json({
//         status:"Page Not Found",
//         message:err.message
//     })
// }
// }


// async function(req, res){
//     try{

//      console.log("I am inside app.get");
//      const userDataStore=await UserModel.find();
//      // console.log("userData", userDataStore);
//      if(userDataStore.length==0 || userDataStore== undefined){
//          throw new Error("Not Found Exception")
//      }
//      res.status(200).json({
//          status:"Success",
//          message:userDataStore
//      })



//  }catch(err){
//      res.status(404).json({
//          status:"Not Found",
//          message:err.message
//      })
//  }
//  }

//  async function(req, res){
//     try{
//     const userIdparam=req.params.userId;
//     const userDetails=await UserModel.findById(userIdparam);
//     if(userDetails== "no user found"){
// throw new Error (`user not found ${userIdparam}`)
//     }
//     console.log("I am inside app.getparam", req.params);
//     res.status(200).json({
//         status:"Success",
//         message:userDetails
//     })
// }catch(err){
//     res.status(404).json({
//         status:"user not found",
//         message:err.message
//     })
// }
// }


// async function(req,res){
//     try{

//         const userIdparam=req.params.userId;
//     const userDetails=await UserModel.findByIdAndDelete(userIdparam);
//     console.log("I am inside app.delete");
//     res.status(200).json({
//         status:"Successfully deleted",
//         message:userDetails
//     })
// }
//     catch(err){
//         res.status(404).json({
//             status:"user not found",
//             message:err.message
//         })
//     }

// }
// *************************ProductHandlers********************


// async function(req, res){
//     // const id= short.generate();
//     try{


//     const productDetails =req.body;
//     // userDataStore.push(userDetails);
//     // const struserStore =JSON.stringify(userDataStore);
//     // fs.writeFileSync("./dev_data.json",struserStore);
//     const product = await ProductModel.create(productDetails);
//     // userDetails.id=id;

//     console.log("I am inside app.post", req.body);
//     res.status(200).json({
//         status:"Success",
//         message:`update the user with `,
//         user:product
//     })
// }
// catch(err){
//     res.status(500).json({
//         status:"Page Not Found",
//         message:err.message
//     })
// }
// }


// async function(req, res){
//     try{

//      console.log("I am inside app.get");
//      const productDataStore=await ProductModel.find();
//      // console.log("userData", userDataStore);
//      if(productDataStore.length==0 || productDataStore== undefined){
//          throw new Error("Not Found Exception")
//      }
//      res.status(200).json({
//          status:"Success",
//          message:productDataStore
//      })



//  }catch(err){
//      res.status(404).json({
//          status:"Not Found",
//          message:err.message
//      })
//  }
//  }

//  async function(req, res){
//     try{
//     const productIdparam=req.params.userId;
//     const vDetails=await ProductModel.findById(productIdparam);
//     if(productDetails== "no user found"){
// throw new Error (`user not found ${productIdparam}`)
//     }
//     console.log("I am inside app.getparam", req.params);
//     res.status(200).json({
//         status:"Success",
//         message:productDetails
//     })
// }catch(err){
//     res.status(404).json({
//         status:"user not found",
//         message:err.message
//     })
// }
// }


// async function(req,res){
//     try{

//         const productIdparam=req.params.userId;
//     const productDetails=await ProductModel.findByIdAndDelete(productIdparam);
//     console.log("I am inside app.delete");
//     res.status(200).json({
//         status:"Successfully deleted",
//         message:productDetails
//     })
// }
//     catch(err){
//         res.status(404).json({
//             status:"user not found",
//             message:err.message
//         })
//     }

// }
const cors = require("cors");
// app.use(cors());
app.use(cors({ origin: true,
credentials: true }));
const UserRouter = require("./router/UserRouter");
const ProductRouter = require("./router/ProductRouter");
const authRouter = require("./router/authRouter");
const bookingRouter = require("./router/bookingRouter");
const reviewRouter = require("./router/reviewRouter");
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter);
app.use("/api/auth", authRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);
// ************userModel***********
app.use(express.json());


// ************ProductModel************
app.use(express.json());





app.use(function cb(req, res) {
    console.log("I am inside app.use");
    res.status(404).json({
        status: "Not FOUND",
        message: "Route not found"
    })
})
// const =process.env.PORT;
app.listen(port, function () {
    console.log(`server is listening to port ${port}`)
})


function getUserById(id) {
    const user = userDataStore.find((user) => {
        return user.id == id;
    })
    if (user == undefined) {
        return "no user found";

    } else {
        return user;
    }
}

