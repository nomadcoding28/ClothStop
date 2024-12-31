import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Name is required"]
    },
    price:{
        type: Number,
        min:0,
        required:[true,"Price is required"]
    },
    description:{
        type: String,
        required:[true,"Description is required"]
    },
    category:{
        type: String,
        required:[true,"Category is required"]
    },
    image:{
        type: String,
        required:[true,"Image is required"]
    },
    isFeatured:{
        type:Boolean,
        default:false
    },},{timestamps:true});
    
const Product=mongoose.model("products",productSchema);  //exporting the model to use it in other
export default Product;