import express,{ Request, Response} from 'express';
import { body } from 'express-validator'
import {User} from '../models/user'
import jwt from 'jsonwebtoken';

import { validateRequest } from '@wtytickets/common/build/middlewares/validate-request';
import {BadRequestError} from '@wtytickets/common/build/errors/bad-request-error'

const router = express.Router();

router.post('/api/user/signup',[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:4, max:20}).withMessage('Password must be between 4 to 20 digits.')
],validateRequest,async(req:Request,res:Response)=>{
    

    const { email,password } = req.body
    const existingUser = await User.findOne({email})

    if (existingUser){
        throw new BadRequestError('Email in use')
    }

    const user = User.build({email,password})
    await user.save()

    // Generate JWT
    if (!process.env.JWT_KEY){
        throw new Error('no process env JWT_KEY')
    }

    const userJwt = jwt.sign({
        id:user.id,
        email:user.email
    },process.env.JWT_KEY!)

    // Store it on session object
    req.session = {
        jwt:userJwt
    }
    console.log('server side. req.session is : ',req.session)
    res.status(201).send(user)
    
})

export { router as signupRouter }