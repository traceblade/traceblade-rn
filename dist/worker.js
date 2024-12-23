"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_threads_1 = require("react-native-threads");
const axios_1 = require("axios");
if (react_native_threads_1.parentPort) {
    // Listen for messages from the main thread
    react_native_threads_1.parentPort.onmessage = async (message) => {
        const { type, payload } = message;
        if (type === 'sendEvent') {
            const { event, apiKey, baseUrl } = payload;
            try {
                // Make the API call
                const response = await axios_1.default.post(`${baseUrl}/user-events`, event, {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceblade-api-key': apiKey,
                    },
                });
                // Notify the main thread of success
                react_native_threads_1.parentPort?.postMessage({ type: 'success', payload: response.data });
            }
            catch (error) {
                // Notify the main thread of the error
                react_native_threads_1.parentPort?.postMessage({ type: 'error', payload: error.message });
            }
        }
    };
}
