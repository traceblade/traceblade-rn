import { Event } from './types';
export declare const queueEvent: (event: Event) => Promise<void>;
export declare const processEventQueue: (apiKey: string, baseUrl: string) => Promise<void>;
