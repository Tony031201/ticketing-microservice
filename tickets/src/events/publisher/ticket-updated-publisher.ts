import {Subjects,Publisher,TicketUpdatedEvent} from "@wtytickets/common"

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated

}
    
export {TicketUpdatedPublisher}
