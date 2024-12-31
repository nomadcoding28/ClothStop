import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js"
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js"; // Ensure this function establishes a proper DB connection

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON , URL-encoded data and cookies from the request
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Mount authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes);

// Debugging Route for Testing GET Requests
app.get("/api/auth/signup", (req, res) => {
    res.send("GET request to /api/auth/signup is working.");
});

// Home Route
app.get("/", (req, res) => {
    res.send("Home route is working."); 
});

// Error Handling Middleware (for debugging)
app.use((err, req, res, next) => {
    console.error("Error stack:", err.stack); // Logs full error stack
    res.status(500).send("Something broke!");
});

// Start the server and connect to the database
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    // Attempt to connect to the database and log the status
    try {
        await connectDB();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
});

export default app;
