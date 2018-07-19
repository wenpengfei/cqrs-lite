/// <reference types="node" />
import events = require('events');
export default class EventStore extends events.EventEmitter {
    connect(url?: string): Promise<any>;
    getEventStream(aggregateId: string): Promise<any>;
    saveEventStream(events: Array<object>): Promise<any>;
}
