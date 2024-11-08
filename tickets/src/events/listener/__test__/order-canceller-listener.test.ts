import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@wtytickets/common";
import mongoose, { get } from "mongoose";
import { Ticket } from "../../../models/ticket";


const setUp = async()=>{
    const ticket = Ticket.build({
        title:'test ticket', 
        price:24, 
        userId: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()

    const listener = new OrderCancelledListener(natsWrapper.client)
    const data:OrderCancelledEvent['data'] = {
        id:ticket.id,
        version:ticket.version,
        ticket:{
            id:ticket.id
        }
    }

    // @ts-ignore
    const msg:Message={
        ack:jest.fn()
    }
    return {listener,msg,ticket,data}
}

it('cancelled the orderId of the ticket',async()=>{
    // setUp
    const {listener,msg,ticket,data} = await setUp()

    // call onMessage function
    await listener.onMessage(data,msg)

    const getTicket = await Ticket.findById(ticket.id)

    if(!getTicket){
        throw new Error('Ticket does not exist')
    }

    expect(getTicket.orderId).toEqual(undefined)
})

it('called the ack',async()=>{
    // setUp
    const {listener,msg,data} = await setUp()

    // call onMessage function
    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publish the ticket update event',async()=>{
    // setUp
    const {listener,msg,data} = await setUp()

    // call onMessage function
    await listener.onMessage(data,msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})