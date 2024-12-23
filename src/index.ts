import { AppState, AppStateStatus } from 'react-native';
import { processEventQueue, queueEvent } from './eventQueue';
import { sendEventToBackend } from './apiClient';

class TracebladeSDK {
  private apiKey: string;
  private currentAppState: AppStateStatus;
  private appStateSubscription: { remove: () => void } | null = null;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    if (!apiKey) {
      throw new Error('API key is required to initialize Traceblade SDK.');
    }
    this.apiKey = apiKey;
    this.currentAppState = AppState.currentState;
    this.baseUrl = baseUrl;

    // Add event listener and store the subscription
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  private handleAppStateChange = async (
    nextAppState: AppStateStatus,
  ): Promise<void> => {
    if (
      this.currentAppState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App is now in the foreground. Processing queued events...');
      await this.flushEvents();
    }
    this.currentAppState = nextAppState;
  };

  public async trackEvent(eventName: string, metadata: object): Promise<void> {
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
    await sendEventToBackend(event, this.baseUrl);
    console.log('Event sent to backend:', { event, baseUrl: this.baseUrl });
    if (this.currentAppState.match(/inactive|background/)) {
      await queueEvent(event);
    }

    // Logic to queue and send events
    console.log('Tracking event:', event);
  }

  public async flushEvents(): Promise<void> {
    console.log('Flushing events...');
    await processEventQueue(this.apiKey, this.baseUrl);
    // Logic to flush events
  }

  public destroy(): void {
    // Properly clean up the AppState listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }
}

export default TracebladeSDK;
