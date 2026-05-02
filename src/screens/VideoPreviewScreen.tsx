import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../theme/colors';
import { RootStackScreenProps } from '../navigation/types';

const VideoPreviewScreen: React.FC<RootStackScreenProps<'VideoPreview'>> = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      <Text>Video Preview Screen - Coming Soon</Text>
    </View>
  );
};

export default VideoPreviewScreen;
