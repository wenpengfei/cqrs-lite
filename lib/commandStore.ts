import events = require('events')
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

const Command = mongoose.model('Command', commandSchema)

export default class CommandStore extends events.EventEmitter {
    async connect(url = 'mongodb://localhost:27017/event-source') {
        return mongoose.connect(url, { useNewUrlParser: true })
    }
    async saveCommand(command: any) {
        const { aggregateId, version } = command
        const [latestCommand] = await Command.find({ aggregateId }).sort({ version: -1 }).limit(1)
        let exceptVersion = 1
        if (latestCommand) {
            exceptVersion = latestCommand.version + 1
            if (version !== exceptVersion) {
                const message = `illegal command version, except ${exceptVersion} but ${version}`
                throw new Error(message)
            }
        } else {
            if (version !== exceptVersion) {
                const message = `illegal command version, except ${exceptVersion} but ${version}`
                throw new Error(message)
            }
        }
        return Command.create(command)
    }
}