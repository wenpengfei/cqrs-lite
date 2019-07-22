import * as uuid from 'uuid/v1'
import CommandStore from '../lib/commandStore'

const commandStore = new CommandStore()

beforeAll(async () => {
  await commandStore.connect()
})

test('insert command1', async () => {
  const command = {
    name: 'command1',
    commandId: uuid(),
    aggregateId: uuid(),
    version: 1,
    timestamp: new Date().valueOf(),
    payload: {}
  }
  await commandStore.saveCommand(command)
})

test('insert command2', async () => {
  const command = {
    name: 'command2',
    commandId: uuid(),
    aggregateId: uuid(),
    version: 1,
    timestamp: new Date().valueOf(),
    payload: {}
  }
  await commandStore.saveCommand(command)
})

test('command process error', async () => {
  await commandStore.processError('command1', 'test error')
})

test('command process success', async () => {
  await commandStore.processSuccess('command2')
})
