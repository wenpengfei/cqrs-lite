declare namespace cqrsLite {
    interface Command {
        name: string,
        commandId: string,
        aggregateId: string,
        version: number,
        timestamp: string,
        payload: any,
    }

    interface Event {
        type: string,
        commandId: string,
        aggregateId: string,
        version: number,
        timestamp: string,
        payload: any,
    }
}
export default cqrsLite