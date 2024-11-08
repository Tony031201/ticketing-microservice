import { Publisher,OrderCreatedEvent, Subjects } from "@wtytickets/common";


class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated; 
}

export {OrderCreatedPublisher}


