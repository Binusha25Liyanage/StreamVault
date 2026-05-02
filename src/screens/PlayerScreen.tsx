import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../theme/colors';

const PlayerScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.text.primary }}>Player - No video loaded</Text>
    </View>
  );
};

export default PlayerScreen;
