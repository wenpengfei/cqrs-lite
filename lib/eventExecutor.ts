import { Message } from 'amqplib';
import events = require('events')
import EventBus from './eventBus'

const debug = require('debug')('eventExecutor')

export default class EventExecutor extends events.EventEmitter {
    private _eventBus: any
    private _exchangeName: any
    private _routeKey: any

    async init(options: { eventBusUrl: string, exchangeName: string, routeKey: string }) {
        const { eventBusUrl, exchangeName, routeKey } = options

        const eventBus = new EventBus()
        await eventBus.connect(eventBusUrl)
        this._eventBus = eventBus

        this._exchangeName = exchangeName
        this._routeKey = routeKey

        this.emit('connected')
    }

    execute(eventName: string, executor: () => any) {
        this._eventBus.startListening({
            exchangeName: this._exchangeName,
            routeKey: this._routeKey
        }, (message: Message) => {
            const event = JSON.parse(message.content.toString())
            executor.call(this, event, message)
        })
    }
}