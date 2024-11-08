import {Publisher, Subjects, chargeCreateEvent} from '@wtytickets/common'

class ChargeCreatePublisher extends Publisher<chargeCreateEvent>{
    subject: Subjects.ChargeCreate = Subjects.ChargeCreate

}
    
export {ChargeCreatePublisher}

