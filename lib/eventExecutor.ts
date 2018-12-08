import { Message } from 'amqplib';
import events = require('events')
import EventBus from './eventBus'

const debug = require('debug')('eventExecutor')

export default class EventExecutor extends events.EventEmitter {
    private _eventBus: any
    private _exchangeName: any
    private _routeKey: any

    async init(options: { eventBusUrl: string, exchangeName: string, routeKey: string }) {
        const { eventBusUrl } = options

        const eventBus = new EventBus()
        await eventBus.connect(eventBusUrl)
        this._eventBus = eventBus

        this.emit('connected')
    }

    execute(eventName: string, executor: () => any) {
        this._eventBus.startListening({
            exchangeName: eventName,
            routeKey: eventName
        }, (message: Message) => {
            const event = JSON.parse(message.content.toString())
            executor.call(this, event, message)
        })
    }
}