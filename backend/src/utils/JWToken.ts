import jwt from "jsonwebtoken";



 const generateJWTToken = (userId: number | string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "7d", // Default to 7 days if not specified
  });
};



export const SendToken = (user:any , statusCode:any , res:any , message:any)=>{
    
    const token = generateJWTToken(user.id)
    
      return res.status(statusCode).cookie("token",token).json({
        success:true,
        user,
        message,
        token
      })
}