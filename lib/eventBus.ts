import events = require('events')
const { PubSubQueue } = require('rabbitmq-broker')

export default class EventBus extends events.EventEmitter {
    _pubSubQueue: any

    async publish(options: { message: string, exchangeName: string, routeKey: string }) {
        const { message, exchangeName, routeKey } = options
        if (this._pubSubQueue) {
            if (!exchangeName) {
                throw 'exchangeName is mandatory'
            }
            if (!routeKey) {
                throw 'routeKey is mandatory'
            }
            return this._pubSubQueue.publish(exchangeName, routeKey, JSON.stringify(message))
        }
        throw 'connection is mandatory'
    }

    async startListening(options: { exchangeName: string, routeKey: string }, onMessage) {
        const { exchangeName, routeKey } = options
        if (this._pubSubQueue) {
            if (!exchangeName) {
                throw 'exchangeName is mandatory'
            }
            if (!routeKey) {
                throw 'exchangeName is mandatory'
            }
            return this._pubSubQueue.subscribe(exchangeName, routeKey, onMessage)
        }
        throw 'eventBus connection is mandatory'
    }

    async connect(url: string) {
        const pubSubQueue = new PubSubQueue()
        try {
            this.emit('connecting')
            await pubSubQueue.connect(url)
            this._pubSubQueue = pubSubQueue
            this.emit('connected')
        } catch (error) {
            this.emit('error')
        }
    }

}
