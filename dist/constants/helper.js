"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = void 0;
const api_1 = require("../constants/api");
const getPath = (path) => {
    return `${api_1.BASE_URL}/${path}`;
};
exports.getPath = getPath;
