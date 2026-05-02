import { useCallback, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export interface VideoPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  isFullScreen: boolean;
  showControls: boolean;
  playbackRate: number;
}

export const useVideoPlayer = () => {
  const { width, height } = useWindowDimensions();
  const playerRef = useRef(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    playing: true,
    currentTime: 0,
    duration: 0,
    isFullScreen: false,
    showControls: true,
    playbackRate: 1,
  });

  const togglePlayPause = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      playing: !prev.playing,
    }));
  }, []);

  const seek = useCallback((time: number) => {
    setPlayerState((prev) => ({
      ...prev,
      currentTime: Math.max(0, Math.min(time, prev.duration)),
    }));
  }, []);

  const skipForward = useCallback((seconds: number = 30) => {
    setPlayerState((prev) => ({
      ...prev,
      currentTime: Math.min(prev.currentTime + seconds, prev.duration),
    }));
  }, []);

  const skipBackward = useCallback((seconds: number = 10) => {
    setPlayerState((prev) => ({
      ...prev,
      currentTime: Math.max(prev.currentTime - seconds, 0),
    }));
  }, []);

  const toggleFullScreen = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      isFullScreen: !prev.isFullScreen,
    }));
  }, []);

  const toggleControls = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      showControls: !prev.showControls,
    }));

    // Auto-hide controls after 3 seconds
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    if (!playerState.showControls) {
      controlsTimerRef.current = setTimeout(() => {
        setPlayerState((prev) => ({
          ...prev,
          showControls: false,
        }));
      }, 3000);
    }
  }, [playerState.showControls]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlayerState((prev) => ({
      ...prev,
      playbackRate: rate,
    }));
  }, []);

  const onProgress = useCallback(
    (data: { currentTime: number }) => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: data.currentTime,
      }));
    },
    []
  );

  const onLoad = useCallback(
    (data: { duration: number }) => {
      setPlayerState((prev) => ({
        ...prev,
        duration: data.duration,
      }));
    },
    []
  );

  const onEnd = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      playing: false,
      currentTime: prev.duration,
    }));
  }, []);

  const onError = useCallback((error: any) => {
    console.error('Video player error:', error);
  }, []);

  return {
    playerRef,
    playerState,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    toggleFullScreen,
    toggleControls,
    setPlaybackRate,
    onProgress,
    onLoad,
    onEnd,
    onError,
  };
};
