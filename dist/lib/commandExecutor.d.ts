/// <reference types="node" />
import events = require('events');
export default class CommandExecutor extends events.EventEmitter {
    private _commandBus;
    private _eventBus;
    private _eventStore;
    private _commandStore;
    init(options: {
        commandBusUrl: string;
        eventBusUrl: string;
        eventStoreUrl: string;
        commandStoreUrl: string;
    }): Promise<void>;
    execute(commandName: string, executor: () => any): void;
}
