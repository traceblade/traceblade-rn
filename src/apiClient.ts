import axios from 'axios';
import { Event } from './types';

const BASE_URL = 'https://api.traceblade.xyz/api';

export const sendEventToBackend = async (event: Event): Promise<void> => {
  try {
    const response = await axios.post(`${BASE_URL}/user-events`, event, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Event sent successfully:', response.data);
  } catch (error) {
    console.error('Failed to send event:', error);
  }
};
