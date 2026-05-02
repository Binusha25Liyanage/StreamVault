import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { AppHeader } from '../components/common/AppHeader';
import { ProgressBar } from '../components/common/ProgressBar';
import { EmptyState } from '../components/common/EmptyState';
import { useDownloadStore } from '../store/downloadStore';
import { TabScreenProps } from '../navigation/types';

type DownloadsScreenProps = TabScreenProps<'Downloads'>;

const DownloadsScreen: React.FC<DownloadsScreenProps> = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'downloading' | 'failed'>('all');
  const navigation = useNavigation();
  const downloads = useDownloadStore((state) => state.downloads);

  const filteredDownloads = downloads.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter || (filter === 'downloading' && d.status === 'downloading');
  });

  const filters: Array<'all' | 'completed' | 'downloading' | 'failed'> = ['all', 'completed', 'downloading', 'failed'];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      <AppHeader showLogo showSettings showAvatar />

      <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
        <Text
          style={{
            fontSize: Typography.fontSizes.xxl,
            fontWeight: Typography.fontWeights.bold,
            color: Colors.text.primary,
            marginBottom: Spacing.md,
          }}
        >
          Downloads
        </Text>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: Spacing.lg }}
          contentContainerStyle={{ gap: Spacing.sm }}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: 20,
                backgroundColor: filter === f ? Colors.accent.primary : Colors.bg.surface,
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSizes.sm,
                  fontWeight: Typography.fontWeights.semibold,
                  color: filter === f ? Colors.text.inverse : Colors.text.secondary,
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredDownloads.length > 0 ? (
        <FlashList
          data={filteredDownloads}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (item.status === 'completed') {
                  navigation.navigate('VideoPlayer' as any, {
                    filePath: item.filePath,
                    title: item.title,
                  });
                }
              }}
              style={{
                backgroundColor: Colors.bg.surface,
                borderRadius: 16,
                padding: Spacing.md,
                marginHorizontal: Spacing.lg,
                marginBottom: Spacing.md,
                flexDirection: 'row',
                gap: Spacing.md,
              }}
            >
              {item.thumbnail && (
                <FastImage
                  source={{ uri: item.thumbnail }}
                  style={{
                    width: 100,
                    height: 70,
                    borderRadius: 10,
                  }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: Colors.text.primary,
                    fontWeight: Typography.fontWeights.medium,
                    marginBottom: Spacing.xs,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: Typography.fontSizes.xs,
                    color: Colors.text.muted,
                    marginBottom: Spacing.sm,
                  }}
                >
                  {item.formatLabel} · {item.fileSizeLabel}
                </Text>

                {item.status === 'downloading' && (
                  <>
                    <ProgressBar progress={item.progress} height={3} />
                    <Text
                      style={{
                        fontSize: Typography.fontSizes.xs,
                        color: Colors.accent.primary,
                        marginTop: Spacing.xs,
                        fontWeight: Typography.fontWeights.semibold,
                      }}
                    >
                      DOWNLOADING {item.progress}%
                    </Text>
                  </>
                )}

                {item.status === 'completed' && (
                  <Text
                    style={{
                      fontSize: Typography.fontSizes.xs,
                      color: Colors.status.success,
                      fontWeight: Typography.fontWeights.semibold,
                    }}
                  >
                    ● COMPLETED
                  </Text>
                )}

                {item.status === 'failed' && (
                  <Text
                    style={{
                      fontSize: Typography.fontSizes.xs,
                      color: Colors.status.error,
                      fontWeight: Typography.fontWeights.semibold,
                    }}
                  >
                    ● DOWNLOAD FAILED
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <EmptyState title="No Downloads" subtitle={`No ${filter} downloads yet`} />
      )}
    </View>
  );
};

export default DownloadsScreen;
