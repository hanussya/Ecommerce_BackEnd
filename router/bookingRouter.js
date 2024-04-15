const express=require("express");
const bookingRouter= express.Router();
const {protectRouteMiddle} = require("../controller/bookingController");
const {protectRoute} = require("../controller/UserController");
const Razorpay = require("razorpay");
// const app= express();
require("dotenv").config();
// const short = require('shortid');
const cors= require("cors");
const crypto =require("crypto");
const bookingModel = require("../model/bookingModel");


var instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })
bookingRouter.use(express.json());
// bookingRouter.use(protectRoute);
bookingRouter.post('/:productId',protectRoute,async (req, res) => {
    try{
    const prodId=req.params.productId;
    const userId=req.userId;
    const priceAtBooking=req.body.priceAtBooking;
    var bookingObject = {
        priceAtBooking: priceAtBooking,  // amount in the smallest currency unit
        user: userId,
        product: prodId
      };
      const booking=await bookingModel.create(bookingObject);
      const user=await UserModel.findById(userId);
      user.booking.push(booking._id);
      await user.save();
      var options = {
        amount: priceAtBooking,  // amount in the smallest currency unit
        currency: "INR",
        receipt: booking._id.toString()
      };
      const razorpayOrder=await instance.orders.create(options);
    //  function(err, order) {
    //     if(err){
    //         console.error(err);
    //            }
        console.log(razorpayOrder);
        booking.paymentOrderId=order.id;
        await booking.save();
       
        res.status(200).json({
            message:"Order placed",
            data: booking,
            razorpayOrder,
      });
     
    

    }catch(err){
        console.log("error",err.message);
    }
// }


});

bookingRouter.post("/verification",async (req,res)=>{
   
    try{
      console.log("secret",process.env.WEBHOOK_SECRET)
    const shasum = crypto.createHmac("sha256",process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    console.log("req.body",req.body); // adding payload to the hash
    // shasum.update(JSON.stringify(req.body));
    const freshSignature = shasum.digest("hex");
    
    console.log("freshSignature",freshSignature); 
    console.log(`req.headers["x-razorpay-signature"]`,req.headers["x-razorpay-signature"]); 
    if(freshSignature === req.headers["x-razorpay-signature"]){
      console.log("Reqeust is legit");
    
      
      const booking=await bookingModel.findOne({
        paymentOrderId:req.body.payload.payment.entity.id
      })
      booking.status='confirmed';
      delete booking.paymentOrderId
    await booking.save();
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

bookingRouter.get("/",protectRoute,async (req,res)=>{
    try{
    const bookings=await bookingModel.find().populate({path:"user",select:"name role email"}).populate({path:"product", select:"name categories brand"});
    if(!bookings){
        console.log("Error!")
    }
    else{
        res.status(200).json({
            message:bookings
        })
    }
}catch(err){
    res.status(400).json({
        message:err.message
    })
}



})
module.exports=bookingRouter;