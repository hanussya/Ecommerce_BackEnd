const mongoose = require("mongoose")

const userSchemaRules={
    name:{
        type: String,
        required: true},
    email:{
        type: String,
        required: true,
        unique: true

    },
    password:{type:String,
    required: true,
    minLength: 8,
    }
    ,
    confirmPassword:{type:String,
        required: true,
        minLength: 8,
        validate: function(){
              return this.password == this.confirmPassword
        }
},
    createdAt:{
        type:Date,
        Default: Date.now()
    },
    token:{
        type:String
    },
    otpExpiry:{
        type:Date
    },
    role:{
        type:String,
        default:"user",
        required: true
    },
    booking:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"bookingModel"
    }
 
};

const validRoles = ["admin","user","seller"];

const userSchema =new mongoose.Schema(userSchemaRules);
userSchema.pre("save", function(next){
    this.confirmPassword=undefined;
    // let isValid= false;
    if(this.role){
        const isValid= validRoles.includes(this.role);
        if(!isValid){
            next(new Error("User can be either admin, user, or seller"));
        }
        else{
            next();
    
        }
    }
    
})

const userModel = mongoose.model("userModel", userSchema);

module.exports=userModel;