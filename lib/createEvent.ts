import cqrsLite from "../types";

// export default (command: any, domainEvents: Array<object>): Array<{ commandId: string, aggregateId: string, version: number, timestamp: Date }> => {
//     const { commandId, aggregateId, version, timestamp } = command
//     return domainEvents.map((item: { type }) => {
//         return {
//             commandId,
//             aggregateId,
//             version,
//             timestamp,
//             ...item
//         }
//     })
// }
export default (command: cqrsLite.Command, domainEvent: { type: string }) => {
    const { commandId, aggregateId, version, timestamp } = command
    return {
        commandId,
        aggregateId,
        version,
        timestamp,
        ...domainEvent
    }
}