import { Message } from 'amqplib';
import events = require('events')
import EventBus from './eventBus'
import cqrsLite from "../types"

const debug = require('debug')('eventExecutor')

export default class EventExecutor extends events.EventEmitter {
    private _eventBus: any

    async init(options: { eventBusUrl: string}) {
        const { eventBusUrl } = options

        const eventBus = new EventBus()
        await eventBus.connect(eventBusUrl)
        this._eventBus = eventBus

        this.emit('connected')
    }

    execute(eventName: string, executor: (event: cqrsLite.Event, message: Message) => any) {
        this._eventBus.startListening({
            exchangeName: eventName,
            routeKey: eventName
        }, (message: Message) => {
            const event = JSON.parse(message.content.toString())
            executor.call(this, event, message)
        })
    }
}