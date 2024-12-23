"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = void 0;
const api_1 = require("../constants/api");
const getPath = (path, baseUrl) => {
    if (baseUrl.length > 0) {
        const url = `${baseUrl}${path}`;
        console.log('url', url);
        return url;
    }
    return `${api_1.BASE_URL}${path}`;
};
exports.getPath = getPath;
