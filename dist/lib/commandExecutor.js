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
const domainError_1 = require("./domainError");
const commandBus_1 = require("./commandBus");
const eventBus_1 = require("./eventBus");
const eventStore_1 = require("./eventStore");
const commandStore_1 = require("./commandStore");
const createEvent_1 = require("./createEvent");
const debug = require('debug')('commandExecutor');
const R = require('ramda');
class CommandExecutor extends events.EventEmitter {
    init(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { commandBusUrl, eventBusUrl, eventStoreUrl, commandStoreUrl } = options;
            const commandBus = new commandBus_1.default();
            yield commandBus.connect(commandBusUrl);
            this._commandBus = commandBus;
            const eventBus = new eventBus_1.default();
            yield eventBus.connect(eventBusUrl);
            this._eventBus = eventBus;
            const eventStore = new eventStore_1.default();
            yield eventStore.connect(eventStoreUrl);
            this._eventStore = eventStore;
            const commandStore = new commandStore_1.default();
            yield commandStore.connect(commandStoreUrl);
            this._commandStore = commandStore;
            this.emit('connected');
        });
    }
    execute(commandName, executor) {
        this._commandBus.startListening(commandName, (message) => __awaiter(this, void 0, void 0, function* () {
            const command = JSON.parse(message.content.toString());
            try {
                yield this._commandStore.saveCommand(command);
                const domainEvent = executor.call(this, command, message);
                const event = createEvent_1.default(command, domainEvent);
                yield this._eventStore.saveEventStream(event);
                yield this._eventBus.publish({
                    exchangeName: event.type,
                    routeKey: event.type,
                    message: R.dissoc('_id', event)
                });
                this._commandBus.ack(message);
            }
            catch (error) {
                debug(error.message);
                console.error(error);
                if (error.message) {
                    if (error.message.indexOf('duplicate key error') !== -1) {
                        this._commandBus.ack(message);
                    }
                    if (error.message.indexOf('illegal command version') !== -1) {
                        this._commandBus.ack(message);
                    }
                }
                if (error instanceof domainError_1.default) {
                    console.log(['CommandExecutor', 'DomainError'], error);
                    this._commandBus.ack(message);
                }
            }
        }));
    }
}
exports.default = CommandExecutor;
