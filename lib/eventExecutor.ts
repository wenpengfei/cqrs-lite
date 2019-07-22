import { Message } from 'amqplib'
import events = require('events')
import EventBus from './eventBus'
import EventStore from './eventStore'
const debug = require('debug')('eventExecutor')

export default class EventExecutor extends events.EventEmitter {
  private _eventBus: any
  private _eventStore: any

  async init(options: { eventBusUrl: string; eventStoreUrl: string }) {
    const { eventBusUrl, eventStoreUrl } = options

    const eventBus = new EventBus()
    await eventBus.connect(eventBusUrl)
    this._eventBus = eventBus

    const eventStore = new EventStore()
    await eventStore.connect(eventStoreUrl)
    this._eventStore = eventStore

    this.emit('connected')
  }

  execute(eventName: string, executor: (event: cqrsLite.Event, message: Message) => any) {
    this._eventBus.startListening(
      {
        exchangeName: eventName,
        routeKey: eventName
      },
      async (message: Message) => {
        const event: cqrsLite.Event = JSON.parse(message.content.toString())
        try {
          await executor.call(this, event, message)
          await this._eventStore.processSuccess(event.commandId)
        } catch (error) {
          await this._eventStore.processError(event.commandId, error.message)
        }
      }
    )
  }
}
