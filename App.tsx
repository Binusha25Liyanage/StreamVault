import React, { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useDownloadStore } from './src/store/downloadStore';
import { useSettingsStore } from './src/store/settingsStore';
import { Colors } from './src/theme/colors';

export default function App() {
  useEffect(() => {
    // Hydrate stores on app start
    useDownloadStore.getState().hydrate();
    useSettingsStore.getState().hydrate();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      <RootNavigator />
    </View>
  );
}
