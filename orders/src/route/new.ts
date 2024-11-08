import { Order } from "../models/order";
import express,{Request,Response} from "express";
import { validateRequest,requireAuth, NotFoundError, OrderStatus, BadRequestError, } from "@wtytickets/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";



const router = express.Router()

const EXPIRATION_WINDOW_SEC = 1 * 60

router.post("/api/orders",requireAuth,[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string)=> mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket ID must be provided')
],validateRequest,async(req:Request,res:Response)=>{
    const {ticketId} = req.body;

    // find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId)
    if (!ticket){
        throw new NotFoundError()
    }

    // make sure the ticket is not already reserved
    // run query to look at all orders. Find an order where the ticket
    // is the ticket we just found and the order status is not cancelled
    const isReserved = await ticket.isReserved()
    if(isReserved){
        throw new BadRequestError("Ticket already reserved")
    }

    // caculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SEC);

    // build the order and save it to the database
    const order = Order.build({
        userId:req.currentUser!.id,
        status:OrderStatus.Created,
        expiresAt:expiration,
        ticket:ticket
    })
    await order.save()
    
    // publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        version: order.version,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id:ticket.id,
            price:ticket.price
        }
    })

    res.status(201).send(order)
})

export {router as createOrderRouter}