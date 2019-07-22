import EventBus from '../lib/eventBus'
;(async () => {
  const eventBus = new EventBus()
  await eventBus.connect()
  eventBus.startListening(
    {
      exchangeName: 'text_event_queue',
      routeKey: 'text_event_queue'
    },
    data => {
      console.log('subscribe 1', JSON.parse(data.content.toString()))
    }
  )
})()
