import * as uuid from 'uuid/v1'
import EventStore from '../lib/eventStore'

const eventStore = new EventStore()

beforeAll(async () => {
  await eventStore.connect()
})

test('insert event1', async () => {
  const event = {
    type: 'event1',
    commandId: uuid(),
    aggregateId: uuid(),
    version: 1,
    timestamp: new Date().valueOf(),
    payload: {}
  }
  await eventStore.saveEventStream([event])
})

test('insert event2', async () => {
  const event = {
    type: 'event2',
    commandId: uuid(),
    aggregateId: uuid(),
    version: 1,
    timestamp: new Date().valueOf(),
    payload: {}
  }
  await eventStore.saveEventStream([event])
})

test('event process error', async () => {
  await eventStore.processError('command1', 'test error')
})

test('event process success', async () => {
  await eventStore.processSuccess('command2')
})
