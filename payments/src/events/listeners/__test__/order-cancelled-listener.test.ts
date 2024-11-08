import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent,OrderStatus } from "@wtytickets/common";
import mongoose from "mongoose";

const setup = async()=>{
    // inital the listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    // build order
    const order = Order.build({
        id:new mongoose.Types.ObjectId().toHexString(), 
        status:OrderStatus.Created, 
        version:0, 
        userId:'sdadasds', 
        price:22
    })
    await order.save()

    // fake data 
    const data: OrderCancelledEvent['data']= {
        id :  order.id,
        version: 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
        }
    }

    //fake msg
    // @ts-ignore
    const msg:Message = {
        ack : jest.fn()
    }

    return {listener,data,msg,order}
}

it('update the order status to cancelled',async()=>{
    const {listener,data,msg,order} = await setup()
    await listener.onMessage(data,msg)

    const updateOrder = await Order.findById(order.id)
    if(!updateOrder){
        throw new Error('Order does not exist')
    }

    expect(updateOrder.status).toEqual(OrderStatus.Cancelled)
})

it('ack the message',async()=>{
    const {listener,data,msg,order} = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})