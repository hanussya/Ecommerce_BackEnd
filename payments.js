const express = require("express");
const Razorpay = require("razorpay");
const app= express();
require("dotenv").config();
const short = require('shortid');
const cors= require("cors");
const crypto =require("crypto");

// Quick start with flickrBase58 format
app.use(cors());
app.use(express.json());
app.listen("3000",()=>{
    console.log("server is running on port 3000")
})
var instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })


  app.post("/checkout",(req, res)=>{
    try{
    var options = {
        amount: 60000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: short.generate()
      };
      instance.orders.create(options, function(err, order) {
        if(err){
            console.error(err);
               }
        console.log(order);
        res.status(200).json({
            message:"Order placed",
            data: order
      });
     
    })
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
  })

  app.post("/verification",(req,res)=>{
   
try{
  console.log("secret",process.env.WEBHOOK_SECRET)
const shasum = crypto.createHmac("sha256",
process.env.WEBHOOK_SECRET);
shasum.update(JSON.stringify(req.body));
console.log("req.body",req.body); // adding payload to the hash
// shasum.update(JSON.stringify(req.body));
const freshSignature = shasum.digest("hex");

console.log("freshSignature",freshSignature); 
console.log(`req.headers["x-razorpay-signature"]`,req.headers["x-razorpay-signature"]); 
if(freshSignature === req.headers["x-razorpay-signature"]){
  console.log("Reqeust is legit");

  res.json({status: "ok"})
}
else{
  return res.status(400).json({ message: "Invalid signature" });
}
console.log("webhook called",req.body);
res.json({status: "ok"})
}catch(err){
  console.log("webhook err",err.message);
}
  })