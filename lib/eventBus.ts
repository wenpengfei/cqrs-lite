import events = require('events')
import { Message } from 'amqplib'
const { PubSubQueue } = require('rabbitmq-broker')

export default class EventBus extends events.EventEmitter {
  _pubSubQueue: any

  async publish(options: { message: Object; exchangeName: string; routeKey: string }) {
    const { message, exchangeName, routeKey } = options
    if (!this._pubSubQueue) {
      throw new Error(`queue is not connected`)
    }
    if (!exchangeName) {
      throw new Error(`exchangeName is required`)
    }
    if (!routeKey) {
      throw new Error(`routeKey is required`)
    }
    return this._pubSubQueue.publish(exchangeName, routeKey, JSON.stringify(message))
  }

  async startListening(options: { exchangeName: string; routeKey: string }, onMessage: (msg: Message | null) => any) {
    const { exchangeName, routeKey } = options
    if (!this._pubSubQueue) {
      throw new Error(`queue is not connected`)
    }
    if (!exchangeName) {
      throw new Error(`exchangeName is required`)
    }
    if (!routeKey) {
      throw new Error(`routeKey is required`)
    }
    return this._pubSubQueue.subscribe(exchangeName, routeKey, onMessage)
  }

  async connect(url?: string) {
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
