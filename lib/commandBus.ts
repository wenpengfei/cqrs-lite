import { Message } from 'amqplib'
import events = require('events')
import cqrsLite from '../types'

const { WorkQueue } = require('rabbitmq-broker')

export default class CommandBus extends events.EventEmitter {
    private _workerQueue: any

    publish(queueName: string, command: cqrsLite.Command) {
        if (this._workerQueue) {
            if (!queueName) {
                throw 'queueName is mandatory'
            }
            return this._workerQueue.send(queueName, JSON.stringify(command))
        }
        throw 'connection is mandatory'
    }

    async startListening(queueName: string, onMessage: (msg: Message | null) => any) {
        if (this._workerQueue) {
            if (!queueName) {
                throw 'queueName is mandatory'
            }
            return this._workerQueue.receive(queueName, onMessage)
        }
        throw 'connection is mandatory'
    }

    async connect(url?: string) {
        const workQueue = new WorkQueue()
        try {
            this.emit('connecting')
            await workQueue.connect(url)
            this._workerQueue = workQueue
            this.emit('connected')
        } catch (error) {
            this.emit('error')
        }
    }

    ack(message: Message) {
        this._workerQueue.ack(message)
    }

}
