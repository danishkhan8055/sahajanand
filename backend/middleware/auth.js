import jwt from "jsonwebtoken";
export const auth =  (req,res,next)=>{
    try{
        let token;

        if(req.headers.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }
        else if (req.cookies?.token){
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({
                status:false,
                message:"ACess DEnied, no token provided"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decoded
        next()
    }
    catch(error){
        console.error(error);
        
    }
}