import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DefaultIcon = () => (
  <Svg width={64} height={64} viewBox="0 0 64 64">
    <Circle cx="32" cy="32" r="30" fill="none" stroke={Colors.text.muted} strokeWidth="2" />
    <Circle cx="20" cy="24" r="3" fill={Colors.text.muted} />
    <Circle cx="44" cy="24" r="3" fill={Colors.text.muted} />
  </Svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View style={{ marginBottom: Spacing.lg }}>
        {icon || <DefaultIcon />}
      </View>
      <Text
        style={{
          fontSize: Typography.fontSizes.lg,
          fontWeight: Typography.fontWeights.semibold,
          color: Colors.text.primary,
          marginBottom: Spacing.sm,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: Typography.fontSizes.md,
            color: Colors.text.secondary,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};
