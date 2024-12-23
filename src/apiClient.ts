import axios from 'axios';
import { Event, LogType } from './types';

import { API_PATH } from './constants/api';
import { getPath } from './constants/helper';
import { createUniqueTraceId } from './helper/logs';

export const sendEventToBackend = async (
  event: Event,
  baseUrl: string,
): Promise<void> => {
  const path = getPath(API_PATH.PUSH_EVENTS, baseUrl);
  console.log('path', path);
  console.log('event', event);
  try {
    const response = await axios.post(path, event, {
      headers: {
        'Content-Type': 'application/json',
        'traceblade-api-key': event.apiKey,
      },
    });
    console.log('Event sent successfully:', response.data);
  } catch (error) {
    console.error('SEND_EVENT_TO_BACKEND:', error);
  }
};

export const sendLogToBackend = async (
  log: LogType,
  baseUrl: string,
): Promise<void> => {
  const path = getPath(API_PATH.PUSH_EVENTS, baseUrl);
  const temp = {
    ...log,
    traceId: createUniqueTraceId(),
    source: 'traceblade-rn-sdk',
  };
  try {
    const response = await axios.post(path, temp, {
      headers: {
        'Content-Type': 'application/json',
        'traceblade-api-key': log.apiKey,
        'traceblade-trace-id': temp.traceId,
      },
    });
    console.log('Log sent successfully:', response.data);
  } catch (error) {
    console.error('SEND_LOG_TO_BACKEND:', error);
  }
};
