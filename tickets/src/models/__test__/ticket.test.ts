import { Ticket } from "../ticket";

it("implements optimistic concurrency control",async()=>{

    // create an instance of a ticket 
    const ticket = Ticket.build({
        title:'concert',
        price:5,
        userId: '123'
    })
    // save the ticket to the database
    await ticket.save()

    // fetch the ticket twice
    const ticket1 = await Ticket.findById(ticket.id)
    const ticket2 = await Ticket.findById(ticket.id)

    if (!ticket1){
        throw new Error("Unknown error on test when fetch a ticket which is saved")
    }
    // make two separate changes to the tickets we fetched
    ticket1.set({price:10})
    ticket2!.set({price:15})

    // save the first fetched ticket
    await ticket1.save()

    // save the second fetched ticket
    try{
        await ticket2!.save()
    }catch(err){
        return
    }

    throw new Error('Should not reach this point')
    

    
})

it("version number should be increased when new ticket create(actually for any event)",async()=>{
    // create a ticket 
    const ticket = Ticket.build({
        title:'test',
        price:5,
        userId:'123'
    })

    // save to the database
    await ticket.save()

    // get the instance for the ticket
    const instance = await Ticket.findById(ticket.id)

    // check the version number of this ticket
    const version = instance!.version

    // modify the information of the ticket
    instance!.set({price:15})
    await instance!.save()

    // check the version number if it increased
    const instance2 = await Ticket.findById(ticket.id)
    expect(instance2!.version).toEqual(version+1)

})