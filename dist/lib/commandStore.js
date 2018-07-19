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
const Schema = mongoose.Schema;
const commandSchema = new Schema({
    name: String,
    commandId: { type: String, unique: true },
    aggregateId: String,
    version: Number,
    timestamp: Date,
    payload: Object,
}, { versionKey: false });
commandSchema.index({ aggregateId: 1, version: 1 }, { unique: true });
const Command = mongoose.model('Command', commandSchema);
class CommandStore extends events.EventEmitter {
    connect(url = 'mongodb://localhost:27017/event-source') {
        return __awaiter(this, void 0, void 0, function* () {
            return mongoose.connect(url, { useNewUrlParser: true });
        });
    }
    saveCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const { aggregateId, version } = command;
            const [latestCommand] = yield Command.find({ aggregateId }).sort({ version: -1 }).limit(1);
            let exceptVersion = 1;
            if (latestCommand) {
                exceptVersion = latestCommand.version + 1;
                if (version !== exceptVersion) {
                    const message = `illegal command version, except ${exceptVersion} but ${version}`;
                    throw new Error(message);
                }
            }
            else {
                if (version !== exceptVersion) {
                    const message = `illegal command version, except ${exceptVersion} but ${version}`;
                    throw new Error(message);
                }
            }
            return Command.create(command);
        });
    }
}
exports.default = CommandStore;
