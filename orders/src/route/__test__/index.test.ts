import request from "supertest";
import { app } from "../../app";
import { Order,OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

interface order {
    userId : string,
    status : string,
    expiresAt :  Date, 
    ticket: mongoose.Types.ObjectId
}

const buildticket = async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        id:id,
        title:"Test ticket",
        price:50
    })

    await ticket.save()
    return ticket
}
it("fetch orders for a particular user",async()=>{
    // create three tickets
    const ticket1 = await buildticket()
    const ticket2 = await buildticket()
    const ticket3 = await buildticket()

    // create one order as User#1
    const order1 = Order.build({
        userId : "user1",
        status : OrderStatus.Created,
        expiresAt : new Date(), 
        ticket: ticket1
    })
    order1.save()

    // create two order as User#2
    const order2 = Order.build({
        userId : "ij121ij31",
        status : OrderStatus.Created,
        expiresAt : new Date(), 
        ticket: ticket2
    })
    order2.save()

    const order3 = Order.build({
        userId : "ij121ij31",
        status : OrderStatus.Created,
        expiresAt : new Date(), 
        ticket: ticket3
    })
    order3.save()

    // Make request to get orders for User#2
    const res = await request(app)
        .get("/api/orders")
        .set("Cookie",global.signin())
        .send()
        .expect(201)

    const orders: order[] = res.body

    // make sure we only get the orders for User#2
    expect(orders).toBeInstanceOf(Array);   // Expect orders to be an array
    expect(orders.length).toBeGreaterThan(0);  // Expect some orders to exist
    
    expect(orders[0]).toHaveProperty('userId');
    expect(orders[0]).toHaveProperty('status');
    for (let i=0;i<orders.length;i++){
        expect(orders[i].userId).toEqual("ij121ij31")
    }

})
