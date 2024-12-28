import { AppState, AppStateStatus } from 'react-native';
import { processEventQueue, queueEvent } from './eventQueue';
import { sendEventToBackend, sendLogToBackend } from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomId } from './helper/helper';
import { BASE_URL } from './constants/api';

class TracebladeSDK {
  private apiKey: string;
  private currentAppState: AppStateStatus;
  private appStateSubscription: { remove: () => void } | null = null;
  private baseUrl: string;
  private userId: string | null = null;
  private userInfo: object | null = null;
  private anonymousId: string | null = null;

  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) {
      throw new Error('API key is required to initialize Traceblade SDK.');
    }
    this.apiKey = apiKey;
    this.currentAppState = AppState.currentState;
    this.baseUrl = baseUrl || BASE_URL;

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
    try {
      const anonymousId = await this.getAnonymousId();
      const event = {
        eventName: eventName,
        timestamp: Date.now(),
        anonymousId: anonymousId || 'null',
        userId: this.userId || 'null',
        createdAt: Date.now(),
        // userInfo: this.userInfo || null,
        metadata,
        apiKey: this.apiKey,
      };
      await sendEventToBackend(event, this.baseUrl);
      console.log('Event sent to backend:', this.currentAppState);
      if (this.currentAppState.match(/inactive|background/)) {
        await queueEvent(event);
      }
      console.log('Tracking event:', event);
    } catch (error) {
      console.error('Error tracking event:', error);
    }

    // Logic to queue and send events
  }

  public log({
    level,
    message,
    requestBody,
    requestResponse,
    statusCode,
    metadata,
  }: {
    level: string;
    message: string;
    requestBody: any;
    requestResponse: any;
    statusCode: number;
    metadata?: object;
  }): void {
    try {
      sendLogToBackend(
        {
          level,
          message,
          requestBody,
          requestResponse,
          statusCode,
          apiKey: this.apiKey,
          metadata,
        },
        this.baseUrl,
      );
    } catch (error) {
      console.error('Error sending log:', error);
    }
  }

  public async flushEvents(): Promise<void> {
    console.log('Flushing events...');
    await processEventQueue(this.apiKey, this.baseUrl);
    // Logic to flush events
  }

  public identify(userId: string, userInfo: object): void {
    this.userId = userId;
    this.userInfo = userInfo;
  }

  private async getAnonymousId(): Promise<string | null> {
    try {
      const anonymouseId = await AsyncStorage.getItem('tb-anonymousId');
      console.log('ANONYMOUS_ID', anonymouseId);
      if (!anonymouseId) {
        const newAnonymousId = getRandomId();
        await AsyncStorage.setItem('tb-anonymousId', newAnonymousId);
        return newAnonymousId;
      }
      console.log('EXISTING_ANONYMOUS_ID', anonymouseId);
      return anonymouseId;
    } catch (error) {
      console.error('Error getting anonymous id:', error);
      throw error;
    }
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
