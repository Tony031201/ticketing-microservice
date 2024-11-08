import express,{Request,Response} from 'express'
import { Ticket } from '../models/ticket'
import { body } from 'express-validator'
import { NotFoundError,requireAuth,BadRequestError,NotAuthorizedError,validateRequest } from '@wtytickets/common'
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put('/api/tickets/:id',requireAuth,[
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required.'),
    body('price')
        .isFloat({gt:0})
        .withMessage('Price must greater than 0.')
    ],validateRequest,async(req:Request,res:Response)=>{
    const {title,price} = req.body

    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        throw new NotFoundError()
    }

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    if(ticket.orderId){
        throw new BadRequestError('Cannot edit a reserved ticket')
    }

    if(ticket){
        ticket.title = title
        ticket.price = price
        await ticket.save()
    }

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version:ticket.version,
        title: ticket.title,
        price:ticket.price,
        userId:ticket.userId
    })

    res.send(ticket)
})

export {router as updateTicketRouter}