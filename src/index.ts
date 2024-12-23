import { AppState, AppStateStatus } from 'react-native';
import { processEventQueue, queueEvent } from './eventQueue';
import { sendEventToBackend } from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { CONSTANTS } from './constants/api';

class TracebladeSDK {
  private apiKey: string;
  private currentAppState: AppStateStatus;
  private appStateSubscription: { remove: () => void } | null = null;
  private baseUrl: string;
  private userId: string | null = null;
  private userInfo: object | null = null;
  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) {
      throw new Error('API key is required to initialize Traceblade SDK.');
    }
    this.apiKey = apiKey;
    this.currentAppState = AppState.currentState;
    this.baseUrl = baseUrl || CONSTANTS.BASE_URL;

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
    const anonymousId = await this.getAnonymousId();
    const event = {
      eventName: eventName,
      timestamp: Date.now(),
      anonymousId,
      userId: this.userId || 'null',
      createdAt: Date.now(),
      userInfo: this.userInfo || {},
      metadata,
      apiKey: this.apiKey,
    };
    await sendEventToBackend(event, this.baseUrl);
    console.log('Event sent to backend:', this.currentAppState);
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

  public identify(userId: string, userInfo: object): void {
    this.userId = userId;
    this.userInfo = userInfo;
  }

  private async getAnonymousId(): Promise<string> {
    const anonymouseId = await AsyncStorage.getItem('tb-anonymousId');
    if (!anonymouseId) {
      const newAnonymousId = uuidv4();
      await AsyncStorage.setItem('tb-anonymousId', newAnonymousId);
      return newAnonymousId;
    }
    return anonymouseId;
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
