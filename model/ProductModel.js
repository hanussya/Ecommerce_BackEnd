const mongoose = require("mongoose");


const productSchemaRules = {
    name: {
        type: String,
        required: [true, "kindly pass the name"],
        unique: [true, "product name should be unique"],
        maxlength: [40, "Your product length is more than 40 characters"]
    },
    price: {
        type: String,
        required: [true, "kindly pass the price"],
        validate: {
            validator: function () {
                return this.price > 0;
            },
            message: "price can't be neatives"
        },
        unique: true

    },
    categories: {
        type: String,
        required: true
    },
    productImages: {
        type: [String]
    },
    averageRating: Number,
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price
            },
            message: "Discount must be less than actual price"
        },
    },
    description: {
        type: String,
        required: [true, "Kindly add desc"],
        maxlength: [2000, "description can't be bigger than 2000 characters"]

    },
    stock_quantity: {
        type: String,
        required: [true, "You should enter stock of the product should be atleast 1"],
        unique: true
    },
    brand: {
        type: String,
        unique: true,
        required: [true, "Kindly provide brand name"]
    },
    review: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "reviewModel"
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    }
    //     password:{type:String,
    //     required: true,
    //     minLength: 8,
    //     }
    //     ,
    //     confirmPassword:{type:String,
    //         required: true,
    //         minLength: 8,
    //         validate: function(){
    //               return this.password == this.confirmPassword
    //         }
    // },
    //     createdAt:{
    //         type:Date,
    //         Default: Date.now()
    //     },

}
const productSchema = new mongoose.Schema(productSchemaRules);
const validcategories = ['Electronics', 'Audio', 'Clothing', 'Kitchen', 'Cosmetics'];
// productSchema.pre("save", function (next) {
//     const product = this;
//     const invalidCategoriesArr = product.categories.filter((category) => {
//         return !validcategories.includes(category);
//       });
//     if (invalidCategoriesArr.length) {
//         const err = new Error(`product from ${invalidCategoriesArr[0]}  categories are not being accepted right now`);
//         return next(err);
//     } else {
//         next();
//     }

// })
// productSchema.pre("save", function(next){
//     const product= this;
//     const invalidCategories = product.categoroes.filter(category=>{
//         re
//     })
// })
// const ProductModel = mongoose.model("productModel", productSchema);
const newlyProductModel = mongoose.model("newlyProductModel", productSchema);
module.exports = newlyProductModel;