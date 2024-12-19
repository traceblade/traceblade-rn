export interface EventMetadata {
  eventName: string;
  [key: string]: any;
}

export interface Event {
  apiKey: string;
  eventMetadata: EventMetadata;
}
