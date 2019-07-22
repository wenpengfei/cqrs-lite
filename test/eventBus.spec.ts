import * as uuid from 'uuid/v1'
import EventBus from '../lib/eventBus'
const eventBus = new EventBus()

const textQueueName = 'text_event_queue'
const options = { exchangeName: textQueueName, routeKey: textQueueName }

const event = {
  type: 'eventName',
  commandId: uuid(),
  aggregateId: uuid(),
  version: 1,
  timestamp: new Date().valueOf(),
  payload: {}
}

test('publish', async () => {
  await eventBus.connect()
  await eventBus.publish({ ...options, message: event })
})
