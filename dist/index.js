"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const eventQueue_1 = require("./eventQueue");
const apiClient_1 = require("./apiClient");
const async_storage_1 = require("@react-native-async-storage/async-storage");
const user_1 = require("./helper/user");
const api_1 = require("./constants/api");
class TracebladeSDK {
    apiKey;
    currentAppState;
    appStateSubscription = null;
    baseUrl;
    userId = null;
    userInfo = null;
    constructor(apiKey, baseUrl) {
        if (!apiKey) {
            throw new Error('API key is required to initialize Traceblade SDK.');
        }
        this.apiKey = apiKey;
        this.currentAppState = react_native_1.AppState.currentState;
        this.baseUrl = baseUrl || api_1.BASE_URL;
        // Add event listener and store the subscription
        this.appStateSubscription = react_native_1.AppState.addEventListener('change', this.handleAppStateChange);
    }
    handleAppStateChange = async (nextAppState) => {
        if (this.currentAppState.match(/inactive|background/) &&
            nextAppState === 'active') {
            console.log('App is now in the foreground. Processing queued events...');
            await this.flushEvents();
        }
        this.currentAppState = nextAppState;
    };
    async trackEvent(eventName, metadata) {
        try {
            const anonymousId = await this.getAnonymousId();
            const event = {
                eventName: eventName,
                timestamp: Date.now(),
                anonymousId: anonymousId || 'null',
                userId: this.userId || 'null',
                createdAt: Date.now(),
                userInfo: this.userInfo || {},
                metadata,
                apiKey: this.apiKey,
            };
            await (0, apiClient_1.sendEventToBackend)(event, this.baseUrl);
            console.log('Event sent to backend:', this.currentAppState);
            if (this.currentAppState.match(/inactive|background/)) {
                await (0, eventQueue_1.queueEvent)(event);
            }
            console.log('Tracking event:', event);
        }
        catch (error) {
            console.error('Error tracking event:', error);
        }
        // Logic to queue and send events
    }
    async flushEvents() {
        console.log('Flushing events...');
        await (0, eventQueue_1.processEventQueue)(this.apiKey, this.baseUrl);
        // Logic to flush events
    }
    identify(userId, userInfo) {
        this.userId = userId;
        this.userInfo = userInfo;
    }
    async getAnonymousId() {
        try {
            const anonymouseId = await async_storage_1.default.getItem('tb-anonymousId');
            if (!anonymouseId) {
                const newAnonymousId = (0, user_1.generateUserId)();
                await async_storage_1.default.setItem('tb-anonymousId', newAnonymousId);
                return newAnonymousId;
            }
            return anonymouseId;
        }
        catch (error) {
            console.error('Error getting anonymous id:', error);
            throw error;
        }
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
