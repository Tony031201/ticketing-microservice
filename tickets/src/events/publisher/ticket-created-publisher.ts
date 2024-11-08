import {Publisher, Subjects,TicketCreatedEvent} from '@wtytickets/common'


class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

export {TicketCreatedPublisher}