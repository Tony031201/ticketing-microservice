import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { OrderStatus } from "@wtytickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";




it('return 404 when purchasing the order does not exist',async()=>{
    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin())
        .send({
            token:'aasdsa',
            orderId:new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it('return 401 when purchasing the order doesnt belong to the user',async()=>{
    const order = Order.build({
        id:new mongoose.Types.ObjectId().toHexString() ,
        status:OrderStatus.Created, 
        version:0, 
        userId:new mongoose.Types.ObjectId().toHexString(), 
        price:22
    })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin())
        .send({
            token:'aasdsa',
            orderId:order.id
        })
        .expect(401)
})

it('return 400 when purchasing a cancelled order',async()=>{
    const userId = new mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id:new mongoose.Types.ObjectId().toHexString() ,
        status:OrderStatus.Cancelled, 
        version:0, 
        userId:userId, 
        price:22
    })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin(userId))
        .send({
            token:'aasdsa',
            orderId:order.id
        })
        .expect(400)
})

it('returns a 204 with valid input',async()=>{
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id:new mongoose.Types.ObjectId().toHexString() ,
        status:OrderStatus.Created, 
        version:0, 
        userId:userId, 
        price:22
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin(userId))
        .send({
            token:'tok_visa',
            orderId:order.id
        })
        .expect(201)



    const payment = await Payment.findOne({
        orderId:order.id,
    })
    expect(payment).not.toBeNull()
})

it('publish an event when the input valid',async()=>{
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id:new mongoose.Types.ObjectId().toHexString() ,
        status:OrderStatus.Created, 
        version:0, 
        userId:userId, 
        price:22
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin(userId))
        .send({
            token:'tok_visa',
            orderId:order.id
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
    
})