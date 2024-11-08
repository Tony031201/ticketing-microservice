import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it('return a 404 if the provided id is not exist',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',global.signin())
        .send({
            title: "new title",
            price: 999
        })
        .expect(404)  
})

it('return a 401 if the user is not authenticated',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .send({
            title: "new title",
            price: 999

        })
        .expect(401)
})

it('return a 401 if the user does not own this ticket',async()=>{
    // someone publish a ticket
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    // others try to modify this ticket
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin2())
        .send({
            title: "new title",
            price: 999
        })
    .expect(401) 
    
})

it('return a 400 if the user provide a invalid title',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title: "",
            price: 999
        })
    .expect(400) 

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            price: 999
        })
    .expect(400) 
})

it('return a 400 if the user provide a invalid price',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title: "new title",
            price: -999
        })
        .expect(400) 

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title: "new title",
        })
        .expect(400) 
})

it('update a ticket provided valid inputs',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    const response2 = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title: "new title",
            price: 99
        })
        .expect(200) 

    expect(response2.body.title).toEqual("new title")
    
})

it('publish an event',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    const response2 = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title: "new title",
            price: 99
        })
        .expect(200) 

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('reject to update if the ticket is reserved',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    const ticket = await Ticket.findById(response.body.id)

    if(!ticket){
        throw new Error('Ticket does noe exist')
    }

    ticket.set({
        orderId: new mongoose.Types.ObjectId().toHexString()
    })
    
    await ticket.save()

    const response2 = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title: "new title",
            price: 99
        })
        .expect(400)
})