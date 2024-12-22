declare class TracebladeSDK {
    private apiKey;
    private currentAppState;
    private appStateSubscription;
    constructor(apiKey: string);
    private handleAppStateChange;
    trackEvent(eventName: string, metadata: object): Promise<void>;
    flushEvents(): Promise<void>;
    destroy(): void;
}
export default TracebladeSDK;
