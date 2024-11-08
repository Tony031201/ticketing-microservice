import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent,OrderStatus } from "@wtytickets/common";


const setUp = async()=>{
    // create listener object
    const instance = new OrderCreatedListener(natsWrapper.client)

    // create and save a ticket
    const userId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title : 'test ticket',
        price : 28,
        userId: userId
    })
    await ticket.save()

    // create fake data structure
    const data:OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId,
        status: OrderStatus.Created,
        ticket:{
            id: ticket.id,
            price: ticket.price
        },
        expiresAt:'asdasd'
    }

    // create fake msg object
    // @ts-ignore
    const msg:Message ={
        ack: jest.fn()
    }

    return {instance,ticket,data,msg}
}

it("set the userId of the ticket",async()=>{
    const {instance,ticket,data,msg} = await setUp()

    // call onMessage function
    await instance.onMessage(data,msg)

    const updateTicket = await Ticket.findById(ticket.id)

    if(!updateTicket){
        throw new Error('Ticket does not exist')

    }

    expect(updateTicket.orderId).toEqual(data.id)
})

it('acks the message',async()=>{
    const {instance,ticket,data,msg} = await setUp()

    // call onMessage function
    await instance.onMessage(data,msg)

    const updateTicket = await Ticket.findById(ticket.id)

    if(!updateTicket){
        throw new Error('Ticket does not exist')

    }

    expect(msg.ack).toHaveBeenCalled()

})

it('publishes a ticket update event',async()=>{
    const {instance,ticket,data,msg} = await setUp()

    // call onMessage function
    await instance.onMessage(data,msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    // @ts-ignore
    console.log(natsWrapper.client.publish.mock.calls)

})