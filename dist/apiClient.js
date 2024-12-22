"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEventToBackend = void 0;
const axios_1 = require("axios");
const api_1 = require("./constants/api");
const helper_1 = require("./constants/helper");
const getUserEventsPath = () => (0, helper_1.getPath)(api_1.API_PATH.PUSH_EVENTS);
const sendEventToBackend = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(getUserEventsPath(), event, {
            headers: {
                'Content-Type': 'application/json',
                'traceblade-api-key': event.apiKey,
            },
        });
        console.log('Event sent successfully:', response.data);
    }
    catch (error) {
        console.error('Failed to send event:', error);
    }
});
exports.sendEventToBackend = sendEventToBackend;
