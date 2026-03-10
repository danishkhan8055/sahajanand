import { UserSchema } from "../model/user-model.js"
import bcrypt from "bcrypt"

export const createDefaultAdmin = async()=>{
try{
const adminExists = await UserSchema.findOne({role:"admin"})

if(!adminExists){
    const hashedPassword = await bcrypt.hash("admin123",10);
    await UserSchema.create({
        name:"Surat",
        email:"admin@gmail.com",
        password:hashedPassword,
        role:"admin",
    })
    console.log("DEfault admin created ");
    
}
else{
    console.log("Admin already existed");
    
}
}
catch(error){
    console.log(error);
    
}
}