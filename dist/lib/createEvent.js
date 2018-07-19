"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = (command, domainEvent) => {
    const { commandId, aggregateId, version, timestamp } = command;
    return Object.assign({ commandId,
        aggregateId,
        version,
        timestamp }, domainEvent);
};
