const mongoose = require("mongoose");
const UserModel= require("./userModal");
const ProductModel = require("./ProductModel");

const bookingSchemaRules={
    bookedAt:{
        type:Date,
        default: Date.now()
    },
    status:{
        type:String,
        enum:["pending","cancelled","confirmed"],
        default:"pending"
    },
    priceAtBooking:{
        type:Number,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel",
        // required: true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newlyProductModel",
        // required: true
    },
    paymentOrderId: String
}
const bookingSchema =new mongoose.Schema(bookingSchemaRules);
const bookingModel = mongoose.model("bookingModel", bookingSchema);

module.exports=bookingModel;