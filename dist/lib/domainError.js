"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.default = DomainError;
