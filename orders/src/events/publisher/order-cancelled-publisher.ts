import { Publisher,OrderCancelledEvent, Subjects } from "@wtytickets/common";


class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled; 
}

export {OrderCancelledPublisher}