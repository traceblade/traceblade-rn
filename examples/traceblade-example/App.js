import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import TracebladeSDK from 'traceblade-rn';

const traceblade = new TracebladeSDK('your-api-key');

export default function App() {
  return (
    <View style={styles.container}>
      <Text>I will test the tracebladeness of this app</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
