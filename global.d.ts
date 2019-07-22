declare namespace cqrsLite {
  interface Command {
    name: string
    commandId: string
    aggregateId: string
    version: number
    timestamp: number
    payload: object
  }
  interface Event {
    type: string
    commandId: string
    aggregateId: string
    version: number
    timestamp: number
    payload: object
  }
}
