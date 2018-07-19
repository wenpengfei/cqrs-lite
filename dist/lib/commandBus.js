"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const WorkQueue = require('rabbitmq-broker');
class CommandBus extends events.EventEmitter {
    publish(queueName, message) {
        if (this._workerQueue) {
            if (!queueName) {
                throw 'queueName is mandatory';
            }
            return this._workerQueue.send(queueName, JSON.stringify(message));
        }
        throw 'connection is mandatory';
    }
    startListening(queueName, onMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._workerQueue) {
                if (!queueName) {
                    throw 'queueName is mandatory';
                }
                return this._workerQueue.receive(queueName, onMessage);
            }
            throw 'connection is mandatory';
        });
    }
    connect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const workQueue = new WorkQueue();
            try {
                this.emit('connecting');
                yield workQueue.connect(url);
                this._workerQueue = workQueue;
                this.emit('connected');
            }
            catch (error) {
                this.emit('error');
            }
        });
    }
    ack(message) {
        this._workerQueue.ack(message);
    }
}
exports.default = CommandBus;
