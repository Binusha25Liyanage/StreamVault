import React from 'react';
import { View } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 3,
  color = Colors.accent.primary,
  backgroundColor = Colors.bg.elevated,
  borderRadius = 0,
}) => {
  return (
    <View
      style={{
        height,
        backgroundColor,
        borderRadius,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <View
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
};
