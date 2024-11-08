import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from '@wtytickets/common'

console.clear()

const stan = nats.connect('ticketing','abc',{
    url:'http://localhost:4222'
})

stan.on('connect',async()=>{
    console.log('Publisher connect to NATS')

    const publisher = new TicketCreatedPublisher(stan)

    try{
        await publisher.publish({
            id:'123',
            title:'connect',
            price:20,
            userId:"dsdsdas"
        })
    }catch(err){    
        console.error(err)
    }
    
    // const data = JSON.stringify({
    //     id:'123',
    //     title: 'connect',
    //     price: 20
    // })

    // stan.publish(Subjects.TicketCreated,data,()=>{
    //     console.log('Event publish')
    // })
    
})

