import events = require('events')
import cqrsLite from '../types';
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commandSchema = new Schema({
    name: String,
    commandId: { type: String, unique: true },
    aggregateId: String,
    version: Number,
    timestamp: Date,
    payload: Object,
}, { versionKey: false })

commandSchema.index({ aggregateId: 1, version: 1 }, { unique: true })

const CommandEntity = mongoose.model('Command', commandSchema)

export default class CommandStore extends events.EventEmitter {
    async connect(url = 'mongodb://localhost:27017/event-source') {
        return mongoose.connect(url, { useNewUrlParser: true })
    }
    async saveCommand(command: cqrsLite.Command) {
        const { aggregateId, version } = command
        const [latestCommand] = await CommandEntity.find({ aggregateId }).sort({ version: -1 }).limit(1)
        let exceptVersion = 1
        if (latestCommand) {
            exceptVersion = latestCommand.version + 1
        }
        if (version !== exceptVersion) {
            throw new Error(`illegal command version, except ${exceptVersion} but ${version}`)
        }
        return CommandEntity.create(command)
    }
}