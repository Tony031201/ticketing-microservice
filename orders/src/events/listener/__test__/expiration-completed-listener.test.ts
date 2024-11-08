import { natsWrapper } from "../../../nats-wrapper";
import { expirationCompletedListener } from "../expiration-completed-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus,ExpirationCompletedEvent } from "@wtytickets/common";
import { Message } from "node-nats-streaming";

const setUp = async()=>{
    // build fake ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 20
    })
    await ticket.save()

    // build fake order
    const order = Order.build({
        userId: 'asdasd', 
        status: OrderStatus.Created, 
        expiresAt: new Date(),   
        ticket:ticket
    })

    await order.save()

    // initial the listener
    const listener = new expirationCompletedListener(natsWrapper.client)

    // fake data
    const data:ExpirationCompletedEvent['data'] = {
        orderId:order.id
    }

    // fake msg
    // @ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }

    // return 
    return {listener,data,msg,ticket,order}
}

it("update the order status to cancelled",async()=>{
    const {listener,data,msg,ticket,order} = await setUp()
    await listener.onMessage(data,msg)

    const updateOrder = await Order.findById(order.id)
    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("emit an OrderCancelled event",async()=>{
    const {listener,data,msg,ticket,order} = await setUp()
    await listener.onMessage(data,msg)

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    expect(eventData.id).toEqual(order.id)
})

it("ack the message",async()=>{
    const {listener,data,msg,ticket,order} = await setUp()
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})

