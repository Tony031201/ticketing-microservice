import { Subjects,Listener,OrderCancelledEvent,TicketUpdatedEvent } from "@wtytickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'] , msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if(!ticket){
            throw new Error('Ticket does not exist')
        }

        ticket.set({
            orderId:undefined
        })

        await ticket.save()

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title, 
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        })

        msg.ack()
    }
}

export {OrderCancelledListener}