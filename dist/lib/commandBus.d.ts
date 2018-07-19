/// <reference types="node" />
import events = require('events');
import { Message } from 'amqplib';
export default class CommandBus extends events.EventEmitter {
    private _workerQueue;
    publish(queueName: string, message: string): any;
    startListening(queueName: string, onMessage: (msg: Message | null) => any): Promise<any>;
    connect(url: string): Promise<void>;
    ack(message: Message): void;
}
