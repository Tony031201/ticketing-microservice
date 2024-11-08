import { Subjects,Listener,chargeCreateEvent,OrderStatus } from "@wtytickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

class ChargeCreatedListener extends Listener<chargeCreateEvent>{
    subject: Subjects.ChargeCreate = Subjects.ChargeCreate;
    queueGroupName = queueGroupName;
    async onMessage(data: chargeCreateEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')

        if (!order){
            throw new Error('Order not found')
        }

        order.set({
            status:OrderStatus.Complete,
        })

        await order.save()


        msg.ack()
    }
}

export {ChargeCreatedListener}