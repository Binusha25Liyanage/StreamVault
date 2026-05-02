import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { AppHeader } from '../components/common/AppHeader';
import { URLInputBar } from '../components/home/URLInputBar';
import { ProgressBar } from '../components/common/ProgressBar';
import { EmptyState } from '../components/common/EmptyState';
import { youtubeApi } from '../api/youtubeApi';
import { useDownloadStore } from '../store/downloadStore';
import { TabScreenProps } from '../navigation/types';
import { formatFileSize, formatDuration } from '../utils/formatUtils';

type HomeScreenProps = TabScreenProps<'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const downloads = useDownloadStore((state) => state.downloads);
  const activeNav = useNavigation();

  const handleFetchVideo = async (url: string) => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const videoInfo = await youtubeApi.fetchVideoInfo(url);
      // Navigate to preview screen
      activeNav.navigate('VideoPreview' as any, { videoInfo });
    } catch (err) {
      setError('Failed to fetch video information. Please try again.');
      console.error('Error fetching video:', err);
    } finally {
      setLoading(false);
    }
  };

  const queuedDownloads = downloads.filter((d) => d.status === 'queued' || d.status === 'downloading');
  const recentDownloads = downloads
    .filter((d) => d.status === 'completed')
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
    .slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      <AppHeader showLogo showSettings showAvatar />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* URL Input */}
        <URLInputBar onFetch={handleFetchVideo} loading={loading} />

        {/* Error Message */}
        {error && (
          <View
            style={{
              marginHorizontal: Spacing.lg,
              marginTop: Spacing.md,
              padding: Spacing.md,
              backgroundColor: Colors.status.error,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: Colors.text.inverse, fontSize: Typography.fontSizes.sm }}>
              {error}
            </Text>
          </View>
        )}

        {/* Download Queue Section */}
        {queuedDownloads.length > 0 && (
          <View style={{ marginTop: Spacing.xxl }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: Spacing.lg,
                marginBottom: Spacing.md,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Text
                  style={{
                    fontSize: Typography.fontSizes.sm,
                    fontWeight: Typography.fontWeights.semibold,
                    color: Colors.text.secondary,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Download Queue
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: Colors.accent.primary,
                  paddingHorizontal: Spacing.sm,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.fontSizes.xs,
                    fontWeight: Typography.fontWeights.bold,
                    color: Colors.text.inverse,
                  }}
                >
                  {queuedDownloads.length}
                </Text>
              </View>
            </View>

            {queuedDownloads.map((download) => (
              <View
                key={download.id}
                style={{
                  backgroundColor: Colors.bg.surface,
                  borderRadius: 12,
                  padding: Spacing.md,
                  marginHorizontal: Spacing.lg,
                  marginBottom: Spacing.md,
                  flexDirection: 'row',
                  gap: Spacing.md,
                }}
              >
                {download.thumbnail && (
                  <FastImage
                    source={{ uri: download.thumbnail }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                    }}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: Colors.text.primary,
                      fontWeight: Typography.fontWeights.semibold,
                      marginBottom: Spacing.xs,
                    }}
                  >
                    {download.title}
                  </Text>
                  <ProgressBar progress={download.progress} height={3} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: Spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Typography.fontSizes.xs,
                        color:
                          download.status === 'downloading'
                            ? Colors.accent.primary
                            : Colors.text.muted,
                      }}
                    >
                      {download.status === 'downloading'
                        ? `${download.progress}%`
                        : 'Pending...'}
                    </Text>
                    <Text
                      style={{
                        fontSize: Typography.fontSizes.xs,
                        color: Colors.accent.primary,
                        fontWeight: Typography.fontWeights.semibold,
                      }}
                    >
                      {download.speed}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Downloads Section */}
        {recentDownloads.length > 0 && (
          <View style={{ marginTop: Spacing.xxl }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: Spacing.lg,
                marginBottom: Spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSizes.sm,
                  fontWeight: Typography.fontWeights.semibold,
                  color: Colors.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Recent Downloads
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Downloads')}>
                <Text
                  style={{
                    fontSize: Typography.fontSizes.sm,
                    fontWeight: Typography.fontWeights.bold,
                    color: Colors.accent.primary,
                  }}
                >
                  VIEW ALL
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: Spacing.lg }}
              contentContainerStyle={{ gap: Spacing.md }}
            >
              {recentDownloads.map((download) => (
                <TouchableOpacity
                  key={download.id}
                  onPress={() =>
                    navigation.navigate('VideoPlayer' as any, {
                      filePath: download.filePath,
                      title: download.title,
                    })
                  }
                  style={{ width: 180 }}
                >
                  {download.thumbnail && (
                    <View style={{ position: 'relative', marginBottom: Spacing.sm }}>
                      <FastImage
                        source={{ uri: download.thumbnail }}
                        style={{
                          width: 180,
                          height: 120,
                          borderRadius: 12,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          bottom: Spacing.sm,
                          right: Spacing.sm,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          paddingHorizontal: Spacing.xs,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: Typography.fontSizes.xs,
                            color: Colors.text.inverse,
                            fontWeight: Typography.fontWeights.semibold,
                          }}
                        >
                          {download.duration}
                        </Text>
                      </View>
                    </View>
                  )}
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: Typography.fontSizes.sm,
                      color: Colors.text.primary,
                      fontWeight: Typography.fontWeights.medium,
                      marginBottom: 2,
                    }}
                  >
                    {download.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: Typography.fontSizes.xs,
                      color: Colors.text.muted,
                    }}
                  >
                    {download.fileSizeLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty State */}
        {queuedDownloads.length === 0 && recentDownloads.length === 0 && !loading && (
          <View style={{ marginTop: Spacing.xxl * 2 }}>
            <EmptyState
              title="No Downloads Yet"
              subtitle="Start by pasting a YouTube link above"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
