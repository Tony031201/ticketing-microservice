import request from "supertest";
import { app } from "../../app";


it('can fetch a list of tickets',async()=>{
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title1',
            price:1
        })
        .expect(201)

    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title2',
            price:2
        })
        .expect(201)

    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title:'title3',
            price:3
        })
        .expect(201)

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)

    
    
})