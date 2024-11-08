import express from 'express';
import 'express-async-errors'


import {errorHandler,NotFoundError,currentUser} from '@wtytickets/common'
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { deleteOrderRouter } from './route/delete'; 
import { showOrderRouter } from './route/show';
import { indexOrderRouter } from './route';
import { createOrderRouter } from './route/new';


const app = express()
app.set('trust proxy',true)
app.use(express.json())
app.use(cookieSession({
    signed:false,
    secure:process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async(req,res)=>{
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}