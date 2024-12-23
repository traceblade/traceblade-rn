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
    log({ level, message, requestBody, requestResponse, statusCode, metadata, }: {
        level: string;
        message: string;
        requestBody: any;
        requestResponse: any;
        statusCode: number;
        metadata?: object;
    }): void;
    flushEvents(): Promise<void>;
    identify(userId: string, userInfo: object): void;
    private getAnonymousId;
    destroy(): void;
}
export default TracebladeSDK;
