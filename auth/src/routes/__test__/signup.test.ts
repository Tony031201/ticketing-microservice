import request from 'supertest'
import {app} from '../../app'

it('returns a 201 on sucessful signup',async()=>{
    return request(app)
        .post('/api/user/signup')
        .send({
            email:"sasadASDDADSasdasdasad@ada.com",
            password:"dasadadd"
        })
        .expect(201)
})

it('returns a 400 with an invalid email',async()=>{
    return request(app)
        .post('/api/user/signup')
        .send({
            email:"sasadASDDADSasdasdasad@.com",
            password:"dasadadd"
        })
        .expect(400)
})

it('returns a 400 with an invalid password',async()=>{
    return request(app)
        .post('/api/user/signup')
        .send({
            email:"sasadASDDADSasdasdasad@ada.com",
            password:"p"
        })
        .expect(400)
})

it('returns a 400 with missing email and password',async()=>{
    await request(app)
        .post('/api/user/signup')
        .send({
            email:"sasadASDDADSasdasdasad@ada.com"
        })
        .expect(400)

    return request(app)
        .post('/api/user/signup')
        .send({
            password:"dasadadd"
        })
        .expect(400)
})

it('disallows duplicate email',async()=>{
    await request(app)
        .post('/api/user/signup')
        .send({
            email:"sasad@aasdda.com",
            password:"dasadadd"
        })
        .expect(201)

    return request(app)
        .post('/api/user/signup')
        .send({
            email:"sasad@aasdda.com",
            password:"dasadadd"
        })
        .expect(400)
})

it('sets a cookie after sucessful signup',async()=>{
    const response = await request(app)
        .post('/api/user/signup')
        .send({
            email:"sasad@aasdda.com",
            password:"dasadadd"
        })
        .expect(201)
    
    expect(response.get('Set-Cookie')).toBeDefined()
})