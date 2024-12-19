declare module 'react-native-threads' {
  export class Worker {
    constructor(workerPath: string);

    postMessage(message: any): void;
    onmessage: (message: any) => void;
    terminate(): void;
  }

  export const parentPort: {
    onmessage: (message: any) => void;
    postMessage: (message: any) => void;
  } | null;
}
