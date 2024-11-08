import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent,OrderStatus } from "@wtytickets/common";
import mongoose from "mongoose";

const setup = async()=>{
    // inital the listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // fake data 
    const data: OrderCreatedEvent['data']= {
        id :  new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: 'adsddas',
        status: OrderStatus.Created,
        expiresAt: new Date().getTime().toString(),
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 22
        }
    }

    //fake msg
    // @ts-ignore
    const msg:Message = {
        ack : jest.fn()
    }

    return {listener,data,msg}
}

it('generates a order',async()=>{
    const {listener,data,msg} = await setup()
    await listener.onMessage(data,msg)

    const order = await Order.findById(data.id)
    if(!order){
        throw new Error('Order does not been created')
    }
    expect(order.price).toEqual(data.ticket.price)
})

it('ack the message',async()=>{
    const {listener,data,msg} = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})