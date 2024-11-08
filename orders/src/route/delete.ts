import express, {Request,Response} from "express"
import { Order } from "../models/order"
import { requireAuth,BadRequestError,NotFoundError, OrderStatus } from "@wtytickets/common"
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.delete("/api/orders/:orderId",requireAuth,async(req:Request,res:Response)=>{
    const orderId = req.params.orderId

    let order
    try{
        order = await Order.findById(orderId)
    }catch(err){throw new BadRequestError('Invalid order ID');}

    
    if (!order){
        throw new NotFoundError()
    }

    if(order.userId!==req.currentUser?.id ){
        throw new BadRequestError("Not right to delete this ticket")
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id:order.id,
        version: order.version,
        ticket:{
            id:order.ticket.id
        }
    })

    res.status(201).send({})
})

export {router as deleteOrderRouter}