import {Subjects, Listener,OrderCreatedEvent, OrderStatus, NotFoundError, BadRequestError } from "@wtytickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName =  queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)

        // if no ticket, throw error
        if (!ticket){
            throw new Error("Ticket not found")
        }

        

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({orderId:data.id})

        // save the ticket 
        await ticket.save()
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id, 
            version: ticket.version,
            title: ticket.title,
            price: ticket.price, 
            userId: ticket.userId, 
            orderId: ticket.orderId
        })

        // ack the message
        msg.ack()
    }

}

export{OrderCreatedListener}