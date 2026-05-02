import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface LoadingOverlayProps {
  visible: boolean;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  transparent = true,
}) => {
  if (!visible) return null;

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: transparent ? 'rgba(0,0,0,0.4)' : Colors.bg.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <ActivityIndicator size="large" color={Colors.accent.primary} />
    </View>
  );
};
