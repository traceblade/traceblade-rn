export interface EventMetadata {
  eventName: string;
  [key: string]: any;
}

export interface Event {
  eventName: string;
  timestamp: number;
  anonymousId?: string;
  createdAt?: number;
  userInfo?: object;
  properties?: object;
}
