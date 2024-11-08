import mongoose from "mongoose";
import { OrderStatus } from "@wtytickets/common";
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface OrderAttrs{
    id:string
    status:OrderStatus
    version:number
    userId:string
    price:number
}

interface OrderDoc extends  mongoose.Document{
    status:OrderStatus
    version:number
    userId:string
    price:number
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs:OrderAttrs):OrderDoc,
    findByElement(event:{id:string,version:number}):OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.set('versionKey','version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs:OrderAttrs)=>{
    return new Order({
        _id:attrs.id,
        version:attrs.version,
        price: attrs.price,
        status: attrs.status,
        userId:attrs.userId
    })
}

orderSchema.statics.findByElement = async (event:{id:string,version:number})=>{
    return await Order.findOne({
        _id:event.id,
        version: event.version-1
    })
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema)

export {Order}