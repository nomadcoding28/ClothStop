import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app= express();
const PORT=process.env.PORT || 5000;



app.use(express.json());// it is used to parse the json data from the request body
app.use(express.urlencoded({ extended: true }));// it is used to parse the url encoded data from the request body
app.use("/api/auth",authRoutes);
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

app.get("/",(req,res)=>{
    res.send("Home route called");
})
app.post("/signup",(req,res)=>{
    res.send("Sign up route called");});

app.listen(PORT,() =>{
    console.log("Server is running on http://localhost:"+PORT);
    connectDB();
})

