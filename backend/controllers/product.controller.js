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

export const getFeaturedProducts=async(req,res)=>{
    try{
        const products=await Product.find({isFeatured:true});
        if(!products){
            res.status(404).json({message:"No featured products found"});
        }
        res.json({message:"Featured products fetched successfully",products});

    }catch(error){
        res.status(500).send("Error fetching featured products");
    }
}
export const deleteProduct=async(req,res)=>{
    try {
        // const product = await Product.findById(req.params.id);
        // console.log("Product found:", product);

        // console.log("ID received:", req.params.id);
        const delproduct=await Product.findByIdAndDelete(req.params.id);
        // console.log(delproduct);
        if(!delproduct){
            res.status(404).json({message:"Product not found"});
        }
        res.json({message:"Product deleted successfully"});
    } catch (error) {
        res.status(500).send("error in deleting product");
    }
}
export const getProductByCategory=async(req,res)=>{
    try{
        const product =await Product.find({category:req.params.category});
        if(!product){
            res.status(404).json({message:"No products found"});
        }
        res.json({message:"Product fetched successfully",product});
    }catch(error){
        res.status(500).send("Error fetching products");
    }
}
export const getAllProducts =async(req,res)=>{
    try { 
        const products = await Product.find();
        if(!products){
            return res.status(404).json({message:"No products found",});
        }
        res.json({message:"Products fetched successfully",products});
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
    
}