import axios from 'axios';
import { Event } from './types';

import TracebladeSDK from './index';

const BASE_URL = 'https://api.traceblade.xyz/api';

export const sendEventToBackend = async (event: Event): Promise<void> => {
  try {
    const response = await axios.post(`${BASE_URL}/events`, event, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Event sent successfully:', response.data);
  } catch (error) {
    console.error('Failed to send event:', error);
  }
};
