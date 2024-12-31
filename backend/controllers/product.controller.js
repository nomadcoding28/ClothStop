import Product from "../models/product.model.js";
export const addProducts=async(req,res)=>{
    try{
        const product=new Product(req.body);
        await product.save();
        res.json({message:"Product added successfully"});
    }
    catch(error){
        res.status(500).send("Error adding product");
    }
}
export const getAllProducts =async(req,res)=>{
    try { 
        const products = await Product.find();
        if(!products){
            return res.status(404).json({message:"No products found",});
        }
        res.json({message:"Products fetched successfully"});
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
    
}