import { client } from "../lib/redis.js";
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
        // const products=await Product.find({isFeatured:true});
        // if(!products){
        //     res.status(404).json({message:"No featured products found"});
        // }
        // res.json({message:"Featured products fetched successfully",products});
        let featuredProducts = await  client.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await client.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);

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
export const getRecommendedProducts=async(req,res)=>{
    try {
        const products=await Product.aggregate([
            {
                $sample:{size:2}

            },
            {
                $project:{
                    name:1,
                    image:1,
                    price:1,
                    _id:0,
                    description:1,
                }
            }
        ])
        res.json({message:"Recommended products fetched successfully",products});
    } catch (error) {
        res.status(500).send("Error fetching recommended products");
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
export const toggleFeaturedProduct=async (req,res) => {
    try {
        const product =await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"no product found"});
        }
        product.isFeatured=!product.isFeatured;
        const updatedProduct = await product.save();
        await updateFeaturedProductsCache();
        res.json({message:"Product updated successfully",updatedProduct});
    } catch (error) {
        res.status(500).send("Error updating product");
    }
}
async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured:true }).lean();
		await client.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}