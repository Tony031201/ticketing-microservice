import { Listener,Subjects,OrderCancelledEvent,OrderStatus } from "@wtytickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName; 
    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const order = await Order.findByElement({
            id:data.id,
            version:data.version
        })

        if(!order){
            throw new Error('order does not exist')
        }

        order.set({status:OrderStatus.Cancelled})
        await order.save()

        msg.ack()
    }

}

export {OrderCancelledListener}