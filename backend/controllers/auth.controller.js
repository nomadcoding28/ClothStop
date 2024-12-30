import Redis from "ioredis";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { client } from "../lib/redis.js";

export const getToken = (user) => {
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

const storeToken = async (userId, refreshToken) => {
    await client.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days expiry
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // Prevents XSS
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict", // Prevents CSRF
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevents XSS
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict", // Prevents CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send("User already exists");
        }

        // Create user
        const createUser = await User.create({ email, password, name });
        if (!createUser) {
            return res.status(500).send("User not created");
        }

        // Generate tokens
        const { accessToken, refreshToken } = getToken(createUser);

        // Store refresh token
        await storeToken(createUser._id, refreshToken);

        // Set cookies
        setCookies(res, accessToken, refreshToken);

        // Respond with user details
        res.status(201).json({
            user: {
                _id: createUser._id,
                name: createUser.name,
                email: createUser.email,
                role: createUser.role || "user" // Assuming a default role
            },
            message: "Sign up successful"
        });
    } catch (error) {
        console.error("Error creating user:", error.message || error);
        res.status(500).send("Error creating user");
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }
        const { accessToken, refreshToken } = getToken(user);
        await storeToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user" // Assuming a default role
            },
            message: "Login successful"
        });
        
    } catch (error) {
        console.error("Error logging in user:", error.message || error);
        res.status(500).send("Error logging in");
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decode=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
            await client.del(`refreshToken:${decode.userId}`);
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message:"LogOut successful"});
    } catch (error) {
        res.status(500).send("Error logging out");
    }
    // res.send("LogOut route called");
};
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).send("Unauthorized: No refresh token provided");
        }

        const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const storedToken = await client.get(`refreshToken:${decode.userId}`);
        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decode.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({ accessToken });
    } catch (error) {
        console.error("Error refreshing token:", error.message || error);
        res.status(500).json({ message: "Error refreshing token" });
    }
};

export const getProfile= async(req,res)=>{
    try{
        res.json(req.user);   
    }catch(error){
        res.status(500).send("Error getting profile");
    }
    // res.send("working"); // for debugging
};
