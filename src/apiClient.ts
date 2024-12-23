import axios from 'axios';
import { Event } from './types';

import { API_PATH } from './constants/api';
import { getPath } from './constants/helper';

export const sendEventToBackend = async (
  event: Event,
  baseUrl: string,
): Promise<void> => {
  const path = getPath(API_PATH.PUSH_EVENTS, baseUrl);
  console.log('path', path);
  console.log('event', event);
  const response = await axios.post(path, event, {
    headers: {
      'Content-Type': 'application/json',
      'traceblade-api-key': event.apiKey,
    },
  });
  console.log('Event sent successfully:', response.data);
};
