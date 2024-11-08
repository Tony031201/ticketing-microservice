import express, {Request,Response} from "express"
import { Order } from "../models/order"
import { body } from 'express-validator'
import { requireAuth,BadRequestError,NotFoundError } from "@wtytickets/common"

const router = express.Router()

router.get("/api/orders/:orderId",requireAuth,async(req:Request,res:Response)=>{
    const orderId = req.params.orderId

    let order
    try{
        order = await Order.findById(orderId)
    }catch(err){throw new BadRequestError('Invalid order ID');}

    
    if (!order){
        throw new NotFoundError()
    }

    if(order.userId!==req.currentUser?.id ){
        throw new BadRequestError("Not right to check this ticket")
    }

    res.status(201).send(order)
       
})

export {router as showOrderRouter}