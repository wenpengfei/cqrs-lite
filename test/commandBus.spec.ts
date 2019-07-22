import * as uuid from 'uuid/v1'
import CommandBus from '../lib/commandBus'
const commandBus = new CommandBus()
const textQueueName = 'text_queue'

const command = {
  name: 'command2',
  commandId: uuid(),
  aggregateId: uuid(),
  version: 1,
  timestamp: new Date().valueOf(),
  payload: {}
}

beforeAll(async () => {
  await commandBus.connect()
  await commandBus.publish(textQueueName, command)
})

test('listen', async done => {
  commandBus.startListening(textQueueName, msg => {
    commandBus.ack(msg)
    const jsonData = JSON.parse(msg.content.toString())
    expect(jsonData.name).toEqual('command2')
    done()
  })
})
