import {model, Schema } from "mongoose";


const user = new Schema ({
    name:{
        type:String,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
        required:[true,"email required"],
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    role:{
        type:String,
        trim:true,
        lowercase:true,
        default:"user"
    }
},{
    timestamps:true
})

export const UserSchema  = model("user",user) 