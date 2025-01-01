import express from "express";
import { getAllProducts ,addProducts, getFeaturedProducts, deleteProduct} from "../controllers/product.controller.js";
// import{protectRoute,adminRoute} from "../middleware/auth.middleware.js"
const router = express.Router();
router.get("/",getAllProducts);
router.post("/",addProducts);
router.get("/featured",getFeaturedProducts)
router.delete("/:id",deleteProduct)
export default router