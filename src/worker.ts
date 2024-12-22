import { parentPort } from 'react-native-threads';
import axios from 'axios';

interface WorkerMessage {
  type: string;
  payload: any;
}
if (parentPort) {
  // Listen for messages from the main thread
  parentPort.onmessage = async (message: WorkerMessage) => {
    const { type, payload } = message;

    if (type === 'sendEvent') {
      const { event, apiKey, baseUrl } = payload;

      try {
        // Make the API call
        const response = await axios.post(`${baseUrl}/user-events`, event, {
          headers: {
            'Content-Type': 'application/json',
            'traceblade-api-key': apiKey,
          },
        });

        // Notify the main thread of success
        parentPort?.postMessage({ type: 'success', payload: response.data });
      } catch (error: any) {
        // Notify the main thread of the error
        parentPort?.postMessage({ type: 'error', payload: error.message });
      }
    }
  };
}
