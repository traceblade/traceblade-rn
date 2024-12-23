"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEventQueue = exports.queueEvent = void 0;
const async_storage_1 = require("@react-native-async-storage/async-storage");
const apiClient_1 = require("./apiClient");
const EVENT_QUEUE_KEY = 'traceblade_event_queue';
// Add an event to the queue
const queueEvent = async (event) => {
    try {
        const existingQueue = await async_storage_1.default.getItem(EVENT_QUEUE_KEY);
        const events = existingQueue ? JSON.parse(existingQueue) : [];
        events.push(event);
        await async_storage_1.default.setItem(EVENT_QUEUE_KEY, JSON.stringify(events));
    }
    catch (error) {
        console.error('Failed to queue event:', error);
    }
};
exports.queueEvent = queueEvent;
// Process all queued events
const processEventQueue = async (apiKey, baseUrl) => {
    try {
        const existingQueue = await async_storage_1.default.getItem(EVENT_QUEUE_KEY);
        const events = existingQueue ? JSON.parse(existingQueue) : [];
        for (const event of events) {
            await (0, apiClient_1.sendEventToBackend)(event, baseUrl);
        }
        // Clear the queue after processing
        await async_storage_1.default.removeItem(EVENT_QUEUE_KEY);
    }
    catch (error) {
        console.error('Failed to process event queue:', error);
    }
};
exports.processEventQueue = processEventQueue;
