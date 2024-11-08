import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "@wtytickets/common";
import { Subjects } from "@wtytickets/common";

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;


}

export {TicketCreatedPublisher}