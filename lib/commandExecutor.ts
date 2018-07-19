import { Message } from 'amqplib';
import events = require('events')
import DomainError from './domainError'
import CommandBus from './commandBus'
import EventBus from './eventBus'
import EventStore from './eventStore'
import CommandStore from './commandStore'
import createEvent from './createEvent'

const debug = require('debug')('commandExecutor')
const R = require('ramda');

export default class CommandExecutor extends events.EventEmitter {

    private _commandBus: any
    private _eventBus: any
    private _eventStore: any
    private _commandStore: any

    async init(options: { commandBusUrl: string, eventBusUrl: string, eventStoreUrl: string, commandStoreUrl: string  }) {

        const { commandBusUrl, eventBusUrl, eventStoreUrl, commandStoreUrl } = options

        const commandBus = new CommandBus()
        await commandBus.connect(commandBusUrl)
        this._commandBus = commandBus

        const eventBus = new EventBus()
        await eventBus.connect(eventBusUrl)
        this._eventBus = eventBus

        const eventStore = new EventStore()
        await eventStore.connect(eventStoreUrl)
        this._eventStore = eventStore

        const commandStore = new CommandStore()
        await commandStore.connect(commandStoreUrl)
        this._commandStore = commandStore

        this.emit('connected')
    }

    execute(commandName: string, executor: () => any) {
        this._commandBus.startListening(commandName, async (message: Message) => {
            const command = JSON.parse(message.content.toString())
            try {
                await this._commandStore.saveCommand(command);
                const domainEvent = executor.call(this, command, message)
                const event = createEvent(command, domainEvent)
                await this._eventStore.saveEventStream(event)
                await this._eventBus.publish({
                    exchangeName: event.type,
                    routeKey: event.type,
                    message: R.dissoc('_id', event)
                })
                this._commandBus.ack(message)
            } catch (error) {
                debug(error.message)
                console.error(error)
                if (error.message) {
                    if (error.message.indexOf('duplicate key error') !== -1) {
                        this._commandBus.ack(message)
                    }
                    if (error.message.indexOf('illegal command version') !== -1) {
                        this._commandBus.ack(message)
                    }
                }
                if (error instanceof DomainError) {
                    console.log(['CommandExecutor', 'DomainError'], error)
                    this._commandBus.ack(message)
                }
            }
        })
    }
}