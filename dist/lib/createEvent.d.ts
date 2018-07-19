declare const _default: (command: {
    commandId: string;
    aggregateId: string;
    version: number;
    timestamp: Date;
}, domainEvent: {
    type: string;
}) => {
    type: string;
    commandId: string;
    aggregateId: string;
    version: number;
    timestamp: Date;
};
export default _default;
