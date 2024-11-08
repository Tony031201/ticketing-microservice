import express,{Request,Response} from 'express'
import {body} from 'express-validator'
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from '@wtytickets/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { Payment } from '../models/payment'
import { ChargeCreatePublisher } from '../events/publisher/charge-create-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()
router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async(req:Request,res:Response)=>{
        const {token,orderId} = req.body

        const order = await Order.findById(orderId)

        if(!order){
            throw new NotFoundError()
        }
        
        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError()
        }

        if(order.status == OrderStatus.Cancelled){
            throw new BadRequestError('Can not pay for a cancelled order')
        }   

        
        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token
        })

        const payment = Payment.build({
            orderId:orderId,
            stripeId:charge.id
        })

        await payment.save()

        new ChargeCreatePublisher(natsWrapper.client).publish({
            orderId,
            stripeId: charge.id
        })
        
        res.status(201).send({sucess:true})
})

export {router as createChargeRouter}