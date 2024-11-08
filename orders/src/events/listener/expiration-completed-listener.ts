import { Subjects,Listener,ExpirationCompletedEvent,OrderStatus } from "@wtytickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

class expirationCompletedListener extends Listener<ExpirationCompletedEvent>{
    subject: Subjects.expirationCompleted = Subjects.expirationCompleted;
    queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')

        if (!order){
            throw new Error('Order not found')
        }

        if (order.status === OrderStatus.Complete){
            return msg.ack()
        }
        order.set({
            status:OrderStatus.Cancelled,
        })

        await order.save()

        await new OrderCancelledPublisher(natsWrapper.client).publish(
            {
                id: order.id,
                version: order.version,
                ticket: {
                    id: order.ticket.id
                }
            }
        )

        msg.ack()
    }
}

export {expirationCompletedListener}