declare namespace cqrsLite {
    interface Command {
        name: string,
        commandId: string,
        aggregateId: string,
        version: number,
        timestamp: string,
        payload: object,
    }

    interface Event {
        name: string,
        commandId: string,
        aggregateId: string,
        version: number,
        timestamp: string,
        payload: object,
    }
}
export default cqrsLite