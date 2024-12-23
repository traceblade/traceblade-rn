"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEventToBackend = void 0;
const axios_1 = require("axios");
const api_1 = require("./constants/api");
const helper_1 = require("./constants/helper");
const sendEventToBackend = async (event, baseUrl) => {
    const path = (0, helper_1.getPath)(api_1.API_PATH.PUSH_EVENTS, baseUrl);
    console.log('path', path);
    console.log('event', event);
    try {
        const response = await axios_1.default.post(path, event, {
            headers: {
                'Content-Type': 'application/json',
                'traceblade-api-key': event.apiKey,
            },
        });
        console.log('Event sent successfully:', response.data);
    }
    catch (error) {
        console.error('SEND_EVENT_TO_BACKEND:', error);
    }
};
exports.sendEventToBackend = sendEventToBackend;
