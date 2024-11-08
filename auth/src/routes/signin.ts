import express,{ Request, Response} from 'express';
import {body} from 'express-validator'

import { BadRequestError } from '@wtytickets/common/build/errors/bad-request-error';
import {validateRequest} from '@wtytickets/common/build/middlewares/validate-request'
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/user/signin',[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:4, max:20}).withMessage('Password must be between 4 to 20 digits.')
],validateRequest,async(req:Request,res:Response)=>{
    const { email,password } = req.body

    const existingUser = await User.findOne({email})
    if(!existingUser){
        throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password,password)
    if (!passwordMatch){
        throw new BadRequestError('Invalid credentials');
    }


    // Generate JWT
    if (!process.env.JWT_KEY){
        throw new Error('no process env JWT_KEY')
    }
    const userJwt = jwt.sign({
        id:existingUser.id,
        email:existingUser.email
    },process.env.JWT_KEY!)

    console.log(`signin jwt:${userJwt}`)
    // Store it on session object
    req.session = {
        jwt:userJwt
    }

    res.status(201).send(existingUser)
})

export { router as signinRouter }