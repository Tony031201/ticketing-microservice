import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current"

// interface
interface ticketAttrs{
    title:string
    price:number
    userId:string
   
}

interface ticketDoc extends mongoose.Document{
    title:string
    price:number
    userId:string
    version:number
    orderId?:string
}

interface ticketModel extends mongoose.Model<ticketDoc>{
    build(attrs:ticketAttrs):ticketDoc;
    findByElement(data:{id:string,version:number}):ticketDoc;
}

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    userId:{
        type:String,
        require:true
    },
    orderId:{
        type:String
    }   
},
{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id
            delete ret._id

        }
    }
})

ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs:ticketAttrs)=>{
    return new Ticket(attrs)
}

ticketSchema.statics.findByElement = async(data:{id:string,version:number})=>{
    return Ticket.findOne({
        _id: data.id,
        version:data.version + 1
    })
}

const Ticket = mongoose.model<ticketDoc,ticketModel>('User',ticketSchema)
export {Ticket}