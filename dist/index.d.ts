declare class TracebladeSDK {
    private apiKey;
    private currentAppState;
    private appStateSubscription;
    private baseUrl;
    private userId;
    private userInfo;
    constructor(apiKey: string, baseUrl?: string);
    private handleAppStateChange;
    trackEvent(eventName: string, metadata: object): Promise<void>;
    flushEvents(): Promise<void>;
    identify(userId: string, userInfo: object): void;
    private getAnonymousId;
    destroy(): void;
}
export default TracebladeSDK;
