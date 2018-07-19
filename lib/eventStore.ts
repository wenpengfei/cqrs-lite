import events = require('events')
const mongoose = require('mongoose')
const R = require('ramda')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    commandId: String,
    aggregateId: String,
    version: Number,
    timestamp: Date,
    type: String,
    payload: Object,
}, { versionKey: false })

eventSchema.index({ aggregateId: 1, version: 1 }, { unique: true })

const Event = mongoose.model('Event', eventSchema)

export default class EventStore extends events.EventEmitter {

    async connect(url = 'mongodb://localhost:27017/event-source') {
        return mongoose.connect(url, { useNewUrlParser: true })
    }

    async getEventStream(aggregateId: string) {
        return Event.find({ aggregateId }).sort({ timestamp: 1 })
    }

    async saveEventStream(events: Array<object>) {
        return Event.collection.insert(events)
    }
}