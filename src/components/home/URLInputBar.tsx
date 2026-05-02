import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface URLInputBarProps {
  onFetch: (url: string) => void;
  loading?: boolean;
}

const ChainLinkIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.text.muted} strokeWidth={2}>
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

const PasteIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.text.secondary} strokeWidth={2}>
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <Path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
  </Svg>
);

const ClearIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.text.secondary} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export const URLInputBar: React.FC<URLInputBarProps> = ({ onFetch, loading = false }) => {
  const [url, setUrl] = useState('');
  const borderColorAnim = new Animated.Value(0);

  const handlePaste = async () => {
    try {
      const { Clipboard } = require('react-native');
      const clipboardText = await Clipboard.getString();
      setUrl(clipboardText);
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  const handleFocus = () => {
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.accent.primary],
  });

  return (
    <View>
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.bg.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
          paddingHorizontal: Spacing.md,
          height: 56,
          marginHorizontal: Spacing.lg,
          marginTop: Spacing.lg,
          marginBottom: Spacing.md,
        }}
      >
        <ChainLinkIcon />

        <TextInput
          style={{
            flex: 1,
            marginHorizontal: Spacing.md,
            fontSize: Typography.fontSizes.md,
            color: Colors.text.primary,
            fontFamily: 'System',
          }}
          placeholder="Paste YouTube link here..."
          placeholderTextColor={Colors.text.muted}
          value={url}
          onChangeText={setUrl}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!loading}
        />

        {url.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={{ padding: Spacing.sm }}>
            <ClearIcon />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handlePaste} style={{ padding: Spacing.sm }} disabled={loading}>
          <PasteIcon />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        onPress={() => onFetch(url)}
        disabled={!url.trim() || loading}
        style={{
          marginHorizontal: Spacing.lg,
          height: 56,
          backgroundColor: url.trim() && !loading ? Colors.accent.primary : Colors.bg.elevated,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: url.trim() && !loading ? 1 : 0.6,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill={Colors.text.inverse} strokeWidth={2}>
            <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke={Colors.text.inverse} />
            <Path d="M7 10l5 5 5-5" fill="none" stroke={Colors.text.inverse} strokeWidth={2} />
            <Path d="M12 15V3" fill="none" stroke={Colors.text.inverse} strokeWidth={2} />
          </Svg>
        </View>
      </TouchableOpacity>
    </View>
  );
};
