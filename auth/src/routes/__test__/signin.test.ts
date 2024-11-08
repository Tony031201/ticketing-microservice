import request from 'supertest'
import {app} from '../../app'

it('fails with an email that does not exist is supplied',async()=>{
    return request(app)
        .post('/api/user/signin')
        .send({
            email:"sasadASDDADSasdasdasad@ada.com",
            password:"dasadadd"
        })
        .expect(400)
})

it('fails when an incorrect password is supplied',async()=>{
    await request(app)
    .post('/api/user/signup')
    .send({
        email:"sasadASDDADSasdasdasad@ada.com",
        password:"dasadadd"
    })
    .expect(201)

    return request(app)
        .post('/api/user/signin')
        .send({
            email:"sasadASDDADSasdasdasad@ada.com",
            password:"dasasd"
        })
        .expect(400)
})

it('responds with a cookie when given valid credential',async()=>{
    await request(app)
    .post('/api/user/signup')
    .send({
        email:"sasadASDDADSasdasdasad@ada.com",
        password:"dasadadd"
    })
    .expect(201)

    const response = await request(app)
        .post('/api/user/signin')
        .send({
            email:"sasadASDDADSasdasdasad@ada.com",
            password:"dasadadd"
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})