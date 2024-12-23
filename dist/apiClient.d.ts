import { Event, LogType } from './types';
export declare const sendEventToBackend: (event: Event, baseUrl: string) => Promise<void>;
export declare const sendLogToBackend: (log: LogType, baseUrl: string) => Promise<void>;
