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
const { PubSubQueue } = require('rabbitmq-broker');
class EventBus extends events.EventEmitter {
    publish(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, exchangeName, routeKey } = options;
            if (this._pubSubQueue) {
                if (!exchangeName) {
                    throw 'exchangeName is mandatory';
                }
                if (!routeKey) {
                    throw 'routeKey is mandatory';
                }
                return this._pubSubQueue.publish(exchangeName, routeKey, JSON.stringify(message));
            }
            throw 'connection is mandatory';
        });
    }
    startListening(options, onMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const { exchangeName, routeKey } = options;
            if (this._pubSubQueue) {
                if (!exchangeName) {
                    throw 'exchangeName is mandatory';
                }
                if (!routeKey) {
                    throw 'exchangeName is mandatory';
                }
                return this._pubSubQueue.subscribe(exchangeName, routeKey, onMessage);
            }
            throw 'eventBus connection is mandatory';
        });
    }
    connect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const pubSubQueue = new PubSubQueue();
            try {
                this.emit('connecting');
                yield pubSubQueue.connect(url);
                this._pubSubQueue = pubSubQueue;
                this.emit('connected');
            }
            catch (error) {
                this.emit('error');
            }
        });
    }
}
exports.default = EventBus;
