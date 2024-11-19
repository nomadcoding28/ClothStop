export const signup=async(req,res)=>{
    const {email,pasword,name}=req.body;
    res.send("Sign up route called");
}
export const login=async(req,res)=>{
    res.send("LogIn route called");
}
export const logout=async(req,res)=>{
    res.send("LogOut route called");
}