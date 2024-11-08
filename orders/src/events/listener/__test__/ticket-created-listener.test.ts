import { Ticket } from "../../../models/ticket"
import { TicketCreatedListener } from "../ticket-created-listener"
import { Stan,Message } from "node-nats-streaming"
import { natsWrapper } from "../../../nats-wrapper"
import { Listener, TicketCreatedEvent } from "@wtytickets/common"
import mongoose from "mongoose"

const setup = async()=>{
    // CREATE AN INSTANCE OF THE LISTENER
    const listener = new TicketCreatedListener(natsWrapper.client)

    // create a fake data event
    const data:TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    
    return {listener,data,msg}
}

it("creates and saves a ticket",async()=>{
    const {listener,data,msg} = await setup()

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg)

    // write assertions to make sure a ticket was createdcosn
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it("acks the message",async()=>{
    const {listener,data,msg} = await setup()
    // call the onMessage function with the data object + message object
    listener.onMessage(data,msg)

    // write assertions to make sure the ack function is call
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(msg.ack).toHaveBeenCalled()

})