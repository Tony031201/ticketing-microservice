import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

import {errorHandler} from '@wtytickets/common/build/middlewares/error-handler'
import {NotFoundError} from '@wtytickets/common/build/errors/not-found-error'
import cookieSession from 'cookie-session';


const app = express()
app.set('trust proxy',true)
app.use(json())

app.use( 
    cookieSession({
      signed: false,
      secure: false,
      sameSite: 'none'
    })
  );

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)   

app.all('*', async(req,res)=>{
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}