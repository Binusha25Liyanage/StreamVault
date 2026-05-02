import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { RootStackScreenProps } from '../navigation/types';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { formatDuration } from '../utils/formatUtils';

type VideoPlayerScreenProps = RootStackScreenProps<'VideoPlayer'>;

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={Colors.text.inverse} strokeWidth={2}>
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const PlayIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill={Colors.text.inverse}>
    <Path d="M5 3l14 9-14 9V3z" />
  </Svg>
);

const PauseIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill={Colors.text.inverse}>
    <Path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </Svg>
);

const SkipBackIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={Colors.text.inverse} strokeWidth={2}>
    <Path d="M3 10v4m9-9v4m-6 4H3m12-4h-6" />
  </Svg>
);

const SkipForwardIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={Colors.text.inverse} strokeWidth={2}>
    <Path d="M21 10v4m-9-9v4m6 4h3m-12-4h6" />
  </Svg>
);

export const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ navigation, route }) => {
  const { filePath, title } = route.params;
  const playerRef = React.useRef<any>(null);
  const {
    playerState,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    onProgress,
    onLoad,
    onEnd,
    onError,
  } = useVideoPlayer();

  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      {/* Video Player */}
      <Video
        ref={playerRef}
        source={{ uri: `file://${filePath}` }}
        style={{
          width: screenWidth,
          height: screenHeight,
        }}
        controls={false}
        paused={!playerState.playing}
        onProgress={onProgress}
        onLoad={onLoad}
        onEnd={onEnd}
        onError={onError}
        resizeMode="contain"
        rate={playerState.playbackRate}
      />

      {/* Controls Overlay */}
      {playerState.showControls && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.md,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                marginHorizontal: Spacing.md,
                color: Colors.text.inverse,
                fontSize: Typography.fontSizes.md,
                fontWeight: Typography.fontWeights.semibold,
              }}
            >
              {title}
            </Text>
          </View>

          {/* Center Controls */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: Spacing.xxl,
            }}
          >
            <TouchableOpacity onPress={() => skipBackward(10)}>
              <SkipBackIcon />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: Colors.accent.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {playerState.playing ? <PauseIcon /> : <PlayIcon />}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => skipForward(30)}>
              <SkipForwardIcon />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Spacing.md,
              }}
            >
              <Text
                style={{
                  color: Colors.text.inverse,
                  fontSize: Typography.fontSizes.sm,
                }}
              >
                {formatDuration(playerState.currentTime)}
              </Text>
              <Text
                style={{
                  color: Colors.text.inverse,
                  fontSize: Typography.fontSizes.sm,
                }}
              >
                {formatDuration(playerState.duration)}
              </Text>
            </View>

            {/* Progress Bar */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={(event) => {
                const { locationX } = event.nativeEvent;
                const percentage = locationX / screenWidth;
                seek(percentage * playerState.duration);
              }}
              style={{
                height: 4,
                backgroundColor: Colors.bg.elevated,
                borderRadius: 2,
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${(playerState.currentTime / playerState.duration) * 100}%`,
                  backgroundColor: Colors.accent.primary,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tap to toggle controls */}
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        onPress={() => {
          // Toggle controls visibility
        }}
      />
    </View>
  );
};

export default VideoPlayerScreen;
