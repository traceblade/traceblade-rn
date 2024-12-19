import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendEventToBackend } from './apiClient';
import { Event } from './types';

const EVENT_QUEUE_KEY = 'traceblade_event_queue';

// Add an event to the queue
export const queueEvent = async (event: Event): Promise<void> => {
  try {
    const existingQueue = await AsyncStorage.getItem(EVENT_QUEUE_KEY);
    const events: Event[] = existingQueue ? JSON.parse(existingQueue) : [];
    events.push(event);
    await AsyncStorage.setItem(EVENT_QUEUE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to queue event:', error);
  }
};

// Process all queued events
export const processEventQueue = async (apiKey: string): Promise<void> => {
  try {
    const existingQueue = await AsyncStorage.getItem(EVENT_QUEUE_KEY);
    const events: Event[] = existingQueue ? JSON.parse(existingQueue) : [];

    for (const event of events) {
      await sendEventToBackend(event);
    }

    // Clear the queue after processing
    await AsyncStorage.removeItem(EVENT_QUEUE_KEY);
  } catch (error) {
    console.error('Failed to process event queue:', error);
  }
};
