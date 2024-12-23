"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniqueTraceId = void 0;
const createUniqueTraceId = () => {
    return (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15));
};
exports.createUniqueTraceId = createUniqueTraceId;
