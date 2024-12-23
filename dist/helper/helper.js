"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = void 0;
const getRandomId = () => {
    return (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15));
};
exports.getRandomId = getRandomId;
