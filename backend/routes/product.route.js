import express from "express";
import { getAllProducts ,addProducts} from "../controllers/product.controller.js";
import{protectRoute,adminRoute} from "../middleware/auth.middleware.js"
const router = express.Router();
router.get("/",protectRoute,adminRoute,getAllProducts);
router.post("/",protectRoute,adminRoute,addProducts);
export default router