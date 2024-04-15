const express=require("express");
const reviewRouter= express.Router();
const {protectRoute} = require("../controller/UserController");
const reviewModel = require("../model/reviewModel");
// const newlyProductModel = require("../model/ProductModel");
const ProductModel=require("../model/ProductModel")

reviewRouter.post("/:productId",protectRoute,async(req,res)=>{
    try{
    const productId=req.params.productId;
    const userId= req.userId;
    const {review, rating }= req.body;

    const object={
        review,
        rating,
        user:userId,
        product: productId
    }
    const reviewObject= await reviewModel.create(object);
    const productObject =await ProductModel.findById(productId);
    if(productObject.averageRating){
        const avgRating=(productObject.averageRating * productObject.review.length);
        const average=(avgRating+rating)/(productObject.review.length+1);
        productObject.averageRating=average;
    }
    else{
        productObject.averageRating=rating; 
    }
    productObject.review.push(reviewObject._id);
    await productObject.save();
    res.status(200).json({
        status:"success",
        message:reviewObject
     })

    }catch(err){
     res.status(404).json({
        message:err.message
     })
    }


})
module.exports=reviewRouter;