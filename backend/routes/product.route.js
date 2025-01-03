import express from "express";
import { getAllProducts ,addProducts, getFeaturedProducts, deleteProduct, getProductByCategory, getRecommendedProducts, toggleFeaturedProduct} from "../controllers/product.controller.js";
// import{protectRoute,adminRoute} from "../middleware/auth.middleware.js"
const router = express.Router();
router.get("/",getAllProducts);
router.post("/",addProducts);
router.get("/featured",getFeaturedProducts)
router.delete("/:id",deleteProduct)
router.get("/category/:category",getProductByCategory)
router.get("/recommended",getRecommendedProducts)
router.patch("/:id",toggleFeaturedProduct)
export default router