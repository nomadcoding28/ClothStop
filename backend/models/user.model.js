import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[8,"Pasword must be at least 8 characters"],
    },
    cartitems:[
        {
            quantity:{
                type:Number,
                default:1,
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            }
        

    }],
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
    //createdAt:Date,
    //updatedAt:Date
},{
timestamps:true
}
);
const User=mongoose.model("User",userSchema)
// Presave hook to hash password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    try {
        const saltRounds=parseInt(process.env.SALT_ROUNDS) || 10;
        const salt =await bcrypt.genSalt(saltRounds);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
})
userSchema.methods.comparePassword=async function (password) {
    try {
        const isMatch=await bcrypt.compare(password,this.password);
        return isMatch
    } catch (error) {
        throw new Error("Error verifying password");
    }
    
}
export default User;