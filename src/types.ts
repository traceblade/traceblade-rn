export interface EventMetadata {
  eventName: string;
  [key: string]: any;
}

export interface Event {
  eventName: string;
  timestamp: number;
  anonymousId?: string;
  createdAt?: number;
  userInfo?: object | null;
  metadata?: object;
  apiKey: string;
}

export interface LogType {
  level: string;
  message: string;
  requestBody: any;
  requestResponse: any;
  statusCode: number;
  apiKey: string;
  metadata?: object;
}
