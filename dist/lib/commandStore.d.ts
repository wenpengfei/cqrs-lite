/// <reference types="node" />
import events = require('events');
export default class CommandStore extends events.EventEmitter {
    connect(url?: string): Promise<any>;
    saveCommand(command: any): Promise<any>;
}
