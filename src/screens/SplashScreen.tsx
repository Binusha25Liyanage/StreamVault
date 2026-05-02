import React, { useEffect } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { Svg, Path, G, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { RootStackScreenProps } from '../navigation/types';

const SplashScreen: React.FC<RootStackScreenProps<'Splash'>> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.85);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to main tabs after delay
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <LinearGradient
      colors={['#1a0805', '#0D0D0D']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Ambient glow behind icon */}
        <View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: Colors.accent.primary,
            opacity: 0.08,
            shadowColor: Colors.accent.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 50,
          }}
        />

        {/* Animated container */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: 'center',
          }}
        >
          {/* App Icon */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              backgroundColor: Colors.bg.surface,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
              shadowColor: Colors.accent.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
            }}
          >
            <Svg width={60} height={60} viewBox="0 0 60 60">
              {/* Play triangle */}
              <Path
                d="M 20 15 L 45 30 L 20 45 Z"
                fill={Colors.accent.primary}
              />
              {/* Downward arrow merged with play */}
              <Path
                d="M 30 35 L 30 50 M 25 45 L 30 50 L 35 45"
                stroke={Colors.accent.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </View>

          {/* App Name */}
          <Text
            style={{
              fontSize: Typography.fontSizes.hero,
              fontWeight: '800',
              color: Colors.text.primary,
              letterSpacing: 4,
              marginBottom: 8,
            }}
          >
            STREAMVAULT
          </Text>

          {/* Tagline */}
          <Text
            style={{
              fontSize: 16,
              color: Colors.text.secondary,
              marginBottom: 64,
            }}
          >
            Your media, offline.
          </Text>
        </Animated.View>

        {/* Bottom text */}
        <View style={{ position: 'absolute', bottom: 40 }}>
          <Text
            style={{
              fontSize: Typography.fontSizes.xs,
              letterSpacing: 3,
              color: Colors.text.muted,
              fontWeight: '600',
            }}
          >
            PREMIUM HIGH FIDELITY
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;
