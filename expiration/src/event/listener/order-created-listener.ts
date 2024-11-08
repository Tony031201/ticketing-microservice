import { Listener,Subjects,OrderCreatedEvent, OrderStatus } from "@wtytickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { expirationQueue } from "../../queues/expiration-queue";

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName= queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()    
        console.log('waiting this many milliseconds to process the job:', delay)
        await expirationQueue.add({
            orderId:data.id
        },
        {
            delay
        }
        )

        msg.ack()
    }


}


export {OrderCreatedListener}