import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest';
import jwt from 'jsonwebtoken'

declare global{
    var signin:() => string[]
    var signin2:() => string[]
}

jest.mock('../nats-wrapper')

let mongo: any;
beforeAll(async()=>{
    process.env.JWT_KEY = 'asdf'

    mongo = await MongoMemoryServer.create()
    const mongoUri =  mongo.getUri()

    await mongoose.connect(mongoUri,{})

})

beforeEach(async()=>{
    jest.clearAllMocks()
    const collections = await mongoose.connection.db?.collections();

    for (let collection of collections!){
        await collection.deleteMany({})
    }
})

afterAll(async()=>{
    if(mongo){await mongo.stop()}
    await mongoose.connection.close()
})

global.signin = ()=>{
    // build a JWT payload. { id,email }
    const payload = {
        id: 'ij121ij31',
        email: 'test4@test4.com',

    }
    
    // create the JWT
    const token = jwt.sign(payload,process.env.JWT_KEY!)

    // build session obj. {jwt:MY_JWT}
    const session = {jwt:token}

    // turn that session into json
    const sessionJSON = JSON.stringify(session)

    // take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`]
}

global.signin2 = ()=>{
    // build a JWT payload. { id,email }
    const payload = {
        id: 'ij128ik31',
        email: 'test2@test2.com',

    }
    
    // create the JWT
    const token = jwt.sign(payload,process.env.JWT_KEY!)

    // build session obj. {jwt:MY_JWT}
    const session = {jwt:token}

    // turn that session into json
    const sessionJSON = JSON.stringify(session)

    // take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`]
}