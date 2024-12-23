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
const sendEventToBackend = (event, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const path = (0, helper_1.getPath)(api_1.API_PATH.PUSH_EVENTS, baseUrl);
    console.log('path', path);
    console.log('event', event);
    const response = yield axios_1.default.post(path, event, {
        headers: {
            'Content-Type': 'application/json',
            'traceblade-api-key': event.apiKey,
        },
    });
    console.log('Event sent successfully:', response.data);
});
exports.sendEventToBackend = sendEventToBackend;