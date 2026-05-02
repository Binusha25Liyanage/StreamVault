import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../theme/colors';
import { RootStackScreenProps } from '../navigation/types';

const VideoPlayerScreen: React.FC<RootStackScreenProps<'VideoPlayer'>> = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      <Text>Video Player Screen - Coming Soon</Text>
    </View>
  );
};

export default VideoPlayerScreen;
