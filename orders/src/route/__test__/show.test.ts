import request from "supertest";
import { app } from "../../app";
import { Order,OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

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

it("return not authorized error if user does not sign in",async()=>{
    await request(app)
        .get("/api/orders/:orderId")
        .send({})
        .expect(401)
})

it("return bad request error if the orderId is invalid",async()=>{
    await request(app)
        .get("/api/orders/33")
        .set("Cookie",signin())
        .send({})
        .expect(400)
})

it("return not found error if the order is not exist",async()=>{
    const orderId = new mongoose.Types.ObjectId()
    await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Cookie",signin())
        .send({})
        .expect(404)
})

it("return bad request error if user does not own this order",async()=>{
    const ticket = await buildticket()
    const order = Order.build({
        userId : "user1", 
        status : OrderStatus.Created, 
        expiresAt: new Date(), 
        ticket:ticket
    })
    await order.save()

    await request(app)
        .get(`/api/orders/${order._id}`)
        .set("Cookie",signin())
        .send({})
        .expect(400)
})

it("return order",async()=>{
    const ticket = await buildticket()
    const order = Order.build({
        userId : "ij121ij31", 
        status : OrderStatus.Created, 
        expiresAt: new Date(), 
        ticket:ticket
    })
    await order.save()

    await request(app)
        .get(`/api/orders/${order._id}`)
        .set("Cookie",signin())
        .send({})
        .expect(201)

})