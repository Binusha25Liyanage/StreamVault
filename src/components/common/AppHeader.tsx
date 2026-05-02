import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  leftAction?: () => void;
  rightAction?: () => void;
  showLogo?: boolean;
  showSettings?: boolean;
  showAvatar?: boolean;
}

const StreamVaultLogo = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={Colors.accent.primary}>
    <Path d="M5 3l7 6-7 6v-12zm9 0l7 6-7 6v-12z" />
  </Svg>
);

const SettingsIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={Colors.text.secondary} strokeWidth={2}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m5.08-5.08l4.24-4.24" />
  </Svg>
);

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  showLogo = true,
  showSettings = false,
  showAvatar = true,
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: 56,
        backgroundColor: Colors.bg.secondary,
        borderBottomColor: Colors.border,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        justifyContent: 'space-between',
      }}
    >
      {/* Left */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        {showLogo && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <StreamVaultLogo size={24} />
            <Text
              style={{
                fontSize: Typography.fontSizes.lg,
                fontWeight: Typography.fontWeights.bold,
                color: Colors.accent.primary,
                letterSpacing: 2,
              }}
            >
              STREAMVAULT
            </Text>
          </View>
        )}
        {title && !showLogo && (
          <Text
            style={{
              fontSize: Typography.fontSizes.lg,
              fontWeight: Typography.fontWeights.bold,
              color: Colors.text.primary,
            }}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Right */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        {showSettings && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings' as any)}
            style={{ padding: Spacing.sm }}
          >
            <SettingsIcon size={24} />
          </TouchableOpacity>
        )}
        {showAvatar && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.accent.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.text.inverse }}>
              U
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
