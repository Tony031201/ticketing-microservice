import nats,{Message, Stan} from 'node-nats-streaming'
import {Subjects} from '@wtytickets/common'

interface Event{
    subject: Subjects
    data:any

}

abstract class Listener <T extends Event>{
    abstract subject: T['subject']
    abstract queueGroupName:string;
    private client: Stan;
    protected ackWait= 5 * 1000;
    abstract onMessage(data:T['data'],msg:Message):void

    constructor(client: Stan){
        this.client=client

    }

    subscriptionOptions(){
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setDurableName(this.queueGroupName)
            .setAckWait(this.ackWait)
    }

    listen(){
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )

        subscription.on('message',(msg:Message)=>{
            console.log(`Message recieved: #${this.subject} / ${this.queueGroupName}`)

            const parsedData = this.parseMessage(msg)
            this.onMessage(parsedData,msg)
        })

        
    }

    parseMessage(msg:Message){
        const data = msg.getData()

        return typeof data ==="string" ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
    }
}

export {Listener}