const mongoose = require("mongoose");
const UserModel = require("./userModal");
const ProductModel = require("./ProductModel");

const reviewSchemaRules = {
    review: {
        type: String,
        required: [true, "Review cannot be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        // required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newlyProductModel",
        // required: true
    },

}
const reviewSchema = new mongoose.Schema(reviewSchemaRules);
const reviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = reviewModel;