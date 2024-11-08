import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface 
interface UserAttrs{
    email:string;
    password:string;
}

// 定义build方法
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs:UserAttrs):UserDoc;
}

interface UserDoc extends mongoose.Document{
    email:string;
    password:string
}

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
},
{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id
            delete ret._id
            delete ret.password
            delete ret.__v

        }
    }
})

userSchema.pre('save',async function(done){
    if (this.isModified('password')){
        const hashed = await Password.toHash((this.get('password')) as string)
        this.set('password',hashed)
    }

    done()
})

// 实现build方法
userSchema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs)
}

const User = mongoose.model<UserDoc,UserModel>('User',userSchema)



export{User}