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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEventQueue = exports.queueEvent = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const apiClient_1 = require("./apiClient");
const EVENT_QUEUE_KEY = 'traceblade_event_queue';
// Add an event to the queue
const queueEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingQueue = yield async_storage_1.default.getItem(EVENT_QUEUE_KEY);
        const events = existingQueue ? JSON.parse(existingQueue) : [];
        events.push(event);
        yield async_storage_1.default.setItem(EVENT_QUEUE_KEY, JSON.stringify(events));
    }
    catch (error) {
        console.error('Failed to queue event:', error);
    }
});
exports.queueEvent = queueEvent;
// Process all queued events
const processEventQueue = (apiKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingQueue = yield async_storage_1.default.getItem(EVENT_QUEUE_KEY);
        const events = existingQueue ? JSON.parse(existingQueue) : [];
        for (const event of events) {
            yield (0, apiClient_1.sendEventToBackend)(event);
        }
        // Clear the queue after processing
        yield async_storage_1.default.removeItem(EVENT_QUEUE_KEY);
    }
    catch (error) {
        console.error('Failed to process event queue:', error);
    }
});
exports.processEventQueue = processEventQueue;
