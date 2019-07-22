import events = require('events')
const mongoose = require('mongoose')
const R = require('ramda')

const Schema = mongoose.Schema

const eventSchema = new Schema(
  {
    commandId: String,
    aggregateId: String,
    version: Number,
    timestamp: Number,
    type: String,
    payload: Object,
    processStatus: { type: String, enum: ['pending', 'success', 'error'], default: 'pending' },
    processMessage: String
  },
  { versionKey: false }
)

eventSchema.index({ aggregateId: 1, version: 1 }, { unique: true })

const EventEntity = mongoose.model('Event', eventSchema)

export default class EventStore extends events.EventEmitter {
  async connect(url = 'mongodb://localhost:27017/event-source') {
    return mongoose.connect(url, { useNewUrlParser: true })
  }

  async getEventStream(aggregateId: string) {
    return EventEntity.find({ aggregateId }).sort({ timestamp: 1 })
  }

  async saveEventStream(events: Array<cqrsLite.Event>) {
    return EventEntity.collection.insert(events)
  }

  async processSuccess(commandId: string) {
    return EventEntity.findOneAndUpdate(
      {
        commandId
      },
      {
        $set: { processStatus: 'success', processMessage: 'OK' }
      },
      {
        new: true
      }
    )
  }

  async processError(commandId: string, processMessage: string) {
    // const firstCommand = await EventEntity.findOne({ commandId }).sort({ version: 1 })
    return EventEntity.findOneAndUpdate(
      {
        commandId
      },
      {
        // $set: { processStatus: 'error', processMessage, version: firstCommand.version - 1 }
        $set: { processStatus: 'error', processMessage }
      },
      {
        new: true
      }
    )
  }
}
