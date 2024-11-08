import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from '@wtytickets/common'

console.clear()

const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url: 'http://localhost:4222'
})

stan.on('connect',()=>{
    console.log('Listener connected to NATS')

    stan.on('close',()=>{
        console.log('NATS connection closed')
        process.exit()
    })

    const options = stan.subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service')
    const subscription = stan.subscribe(
        'ticket:created',
        'order-service-queue-group',
        options
    )

    new TicketCreatedListener(stan).listen()
})

//
process.on('SIGINT',()=>{stan.close()})
process.on('SIGTERM',()=>{stan.close()})


