import { Publisher,Subjects,ExpirationCompletedEvent } from "@wtytickets/common";

class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{
    subject: Subjects.expirationCompleted = Subjects.expirationCompleted ;

}

export {ExpirationCompletedPublisher}