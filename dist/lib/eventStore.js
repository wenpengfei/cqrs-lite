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
const mongoose = require('mongoose');
const R = require('ramda');
const Schema = mongoose.Schema;
const eventSchema = new Schema({
    commandId: String,
    aggregateId: String,
    version: Number,
    timestamp: Date,
    type: String,
    payload: Object,
}, { versionKey: false });
eventSchema.index({ aggregateId: 1, version: 1 }, { unique: true });
const Event = mongoose.model('Event', eventSchema);
class EventStore extends events.EventEmitter {
    connect(url = 'mongodb://localhost:27017/event-source') {
        return __awaiter(this, void 0, void 0, function* () {
            return mongoose.connect(url, { useNewUrlParser: true });
        });
    }
    getEventStream(aggregateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Event.find({ aggregateId }).sort({ timestamp: 1 });
        });
    }
    saveEventStream(events) {
        return __awaiter(this, void 0, void 0, function* () {
            return Event.collection.insert(events);
        });
    }
}
exports.default = EventStore;
