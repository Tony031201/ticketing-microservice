import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order,OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("return an error if the ticket does not exist",async()=>{
    const ticketId = new mongoose.Types.ObjectId()

    await request(app)
        .post("/api/orders")
        .set("Cookie",global.signin())
        .send({ticketId})
        .expect(404)
})

it("return an error if the ticket is already reserved",async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        id:id,
        title:'Test ticket',
        price:50
    })

    await ticket.save()

    const order = Order.build({
        userId : "DSADSAD",
        status : OrderStatus.Created,
        expiresAt:new Date(),
        ticket:ticket
    })

    await order.save()

    await request(app)
        .post("/api/orders")
        .set("Cookie",global.signin())
        .send({ ticketId:ticket.id })
        .expect(400)
})

it("reserves a ticket",async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        id:id,
        title:'Test ticket',
        price:50
    })

    await ticket.save()

    await request(app)
        .post("/api/orders")
        .set("Cookie",global.signin())
        .send({ ticketId:ticket.id })
        .expect(201)

    await request(app)
        .post("/api/orders")
        .set("Cookie",global.signin())
        .send({ ticketId:ticket.id })
        .expect(400 )    
})

it("emits an order created event",async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        id:id,
        title:'Test ticket',
        price:50
    })

    await ticket.save()

    await request(app)
        .post("/api/orders")
        .set("Cookie",global.signin())
        .send({ ticketId:ticket.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})