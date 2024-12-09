import User from "../models/user.model.js";
export const signup=async(req,res)=>{
    console.log(req);
    const {email,password,name}=req.body;
    const userexists= await User.findOne({email});
    try{if(userexists){
        return res.status(400).send("User already exsists");
    }
    const createUser =await User.create({email,password,name});
    if (!createUser){
        return res.status(201).send("User not created");
    }}
    catch(error){
        console.log(error);
        return res.status(500).send("Error creating user");
    }
    

    res.send("Sign up route called");
}
export const login=async(req,res)=>{
    res.send("LogIn route called");
}
export const logout=async(req,res)=>{
    res.send("LogOut route called");
}