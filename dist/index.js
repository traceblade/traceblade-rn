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
const react_native_1 = require("react-native");
const eventQueue_1 = require("./eventQueue");
const apiClient_1 = require("./apiClient");
class TracebladeSDK {
    constructor(apiKey, baseUrl) {
        this.appStateSubscription = null;
        this.handleAppStateChange = (nextAppState) => __awaiter(this, void 0, void 0, function* () {
            if (this.currentAppState.match(/inactive|background/) &&
                nextAppState === 'active') {
                console.log('App is now in the foreground. Processing queued events...');
                yield this.flushEvents();
            }
            this.currentAppState = nextAppState;
        });
        if (!apiKey) {
            throw new Error('API key is required to initialize Traceblade SDK.');
        }
        this.apiKey = apiKey;
        this.currentAppState = react_native_1.AppState.currentState;
        this.baseUrl = baseUrl;
        // Add event listener and store the subscription
        this.appStateSubscription = react_native_1.AppState.addEventListener('change', this.handleAppStateChange);
    }
    trackEvent(eventName, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = {
                apiKey: this.apiKey,
                eventMetadata: {
                    eventName: eventName,
                    timestamp: Date.now(),
                    anonymousId: 'some_id_for_now',
                    createdAt: Date.now(),
                    userInfo: {},
                    properties: {
                        message: 'Hello, world!',
                    },
                },
            };
            yield (0, apiClient_1.sendEventToBackend)(event, this.baseUrl);
            console.log('Event sent to backend:', { event, baseUrl: this.baseUrl });
            if (this.currentAppState.match(/inactive|background/)) {
                yield (0, eventQueue_1.queueEvent)(event);
            }
            // Logic to queue and send events
            console.log('Tracking event:', event);
        });
    }
    flushEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Flushing events...');
            yield (0, eventQueue_1.processEventQueue)(this.apiKey, this.baseUrl);
            // Logic to flush events
        });
    }
    destroy() {
        // Properly clean up the AppState listener
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
    }
}
exports.default = TracebladeSDK;
