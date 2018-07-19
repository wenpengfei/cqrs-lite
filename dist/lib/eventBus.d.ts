/// <reference types="node" />
import events = require('events');
export default class EventBus extends events.EventEmitter {
    _pubSubQueue: any;
    publish(options: {
        message: string;
        exchangeName: string;
        routeKey: string;
    }): Promise<any>;
    startListening(options: {
        exchangeName: string;
        routeKey: string;
    }, onMessage: any): Promise<any>;
    connect(url: string): Promise<void>;
}
