import { Listener,TicketUpdatedEvent,Subjects } from "@wtytickets/common"
import { Ticket } from "../../../models/ticket"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose from "mongoose"
import { natsWrapper } from "../../../nats-wrapper"
import { Message } from "node-nats-streaming"

const setup = async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()

    // create a ticket
    const ticket = Ticket.build({
        id:id,
        price:20,
        title:'test ticket'
    })

    await ticket.save()

    // create a instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create fake data structure
    const data:TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "new title",
        price: 30,
        userId: 'abc'
    }

    // create msg function
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,data,msg,ticket}
    
}

it('update a ticket',async()=>{

    const {listener,data,msg} = await setup()

    // call onMessage function 
    await listener.onMessage(data,msg)

    // make assertion if the ticket is update
    const ticket2 = await Ticket.findById(data.id)

    if(!ticket2){
        throw new Error('Ticket not found')
    }

    expect(ticket2.price).toEqual(data.price)
})

it('acks the message',async()=>{
    const {listener,data,msg} = await setup()
    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg)

    // write assertions to make sure the ack function is call
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(msg.ack).toHaveBeenCalled()


})

it('does not call ack if the event has a skipped version number',async()=>{
    const {msg,listener,data,ticket} = await setup()

    data.version = 10
    
    try{
        await listener.onMessage(data,msg)
    }catch(err){

    }

    expect(msg.ack).not.toHaveBeenCalled()
    


})