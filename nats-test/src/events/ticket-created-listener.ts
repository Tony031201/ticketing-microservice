import {Listener} from './base-listener'
import nats,{Message, Stan} from 'node-nats-streaming'
import { TicketCreatedEvent } from '@wtytickets/common';
import { Subjects } from '@wtytickets/common';

class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName= 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log('Event data!',data)

        msg.ack()   
    }
}

export{TicketCreatedListener}