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
const react_native_threads_1 = require("react-native-threads");
const axios_1 = require("axios");
if (react_native_threads_1.parentPort) {
    // Listen for messages from the main thread
    react_native_threads_1.parentPort.onmessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { type, payload } = message;
        if (type === 'sendEvent') {
            const { event, apiKey, baseUrl } = payload;
            try {
                // Make the API call
                const response = yield axios_1.default.post(`${baseUrl}/user-events`, event, {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceblade-api-key': apiKey,
                    },
                });
                // Notify the main thread of success
                react_native_threads_1.parentPort === null || react_native_threads_1.parentPort === void 0 ? void 0 : react_native_threads_1.parentPort.postMessage({ type: 'success', payload: response.data });
            }
            catch (error) {
                // Notify the main thread of the error
                react_native_threads_1.parentPort === null || react_native_threads_1.parentPort === void 0 ? void 0 : react_native_threads_1.parentPort.postMessage({ type: 'error', payload: error.message });
            }
        }
    });
}
