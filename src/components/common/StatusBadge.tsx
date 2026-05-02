import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  label: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const statusColors = {
    success: Colors.status.success,
    warning: Colors.status.warning,
    error: Colors.status.error,
    info: Colors.status.info,
    pending: Colors.text.muted,
  };

  const fontSize = size === 'sm' ? Typography.fontSizes.xs : Typography.fontSizes.sm;
  const paddingH = size === 'sm' ? Spacing.sm : Spacing.md;
  const paddingV = size === 'sm' ? 2 : Spacing.xs;

  return (
    <View
      style={{
        backgroundColor: statusColors[status],
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontSize,
          fontWeight: Typography.fontWeights.semibold,
          color: status === 'warning' ? Colors.text.primary : Colors.text.inverse,
        }}
      >
        {label}
      </Text>
    </View>
  );
};
