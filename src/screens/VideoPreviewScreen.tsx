import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { RootStackScreenProps } from '../navigation/types';
import { useDownloadStore } from '../store/downloadStore';
import { formatNumber } from '../utils/formatUtils';

type VideoPreviewScreenProps = RootStackScreenProps<'VideoPreview'>;

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={Colors.text.primary} strokeWidth={2}>
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const PlayIcon = () => (
  <Svg width={72} height={72} viewBox="0 0 72 72">
    <circle cx="36" cy="36" r="36" fill={Colors.accent.primary} />
    <Path d="M30 24l18 12-18 12V24z" fill={Colors.text.inverse} />
  </Svg>
);

const VideoPreviewScreen: React.FC<VideoPreviewScreenProps> = ({ navigation, route }) => {
  const { videoInfo } = route.params;
  const insets = useSafeAreaInsets();
  const [selectedFormatId, setSelectedFormatId] = useState(videoInfo.formats[0]?.format_id || '');
  const [downloading, setDownloading] = useState(false);
  const addDownload = useDownloadStore((state) => state.addDownload);
  const screenWidth = Dimensions.get('window').width;

  const selectedFormat = videoInfo.formats.find((f) => f.format_id === selectedFormatId);

  const handleDownload = async () => {
    if (!selectedFormat) return;

    setDownloading(true);
    try {
      addDownload({
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        channelName: videoInfo.channel_name,
        duration: videoInfo.duration,
        formatLabel: selectedFormat.label,
        resolution: selectedFormat.resolution,
        codec: selectedFormat.codec,
        fileSize: selectedFormat.file_size,
        fileSizeLabel: selectedFormat.file_size_label,
        filePath: '',
        streamUrl: selectedFormat.stream_url,
        status: 'queued',
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error starting download:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: Spacing.lg,
          paddingTop: insets.top + Spacing.md,
          paddingBottom: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
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
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Thumbnail */}
        {videoInfo.thumbnail && (
          <View
            style={{
              width: screenWidth,
              aspectRatio: 16 / 9,
              backgroundColor: Colors.bg.surface,
            }}
          >
            <FastImage
              source={{ uri: videoInfo.thumbnail }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PlayIcon />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: Spacing.md,
                right: Spacing.md,
                backgroundColor: 'rgba(0,0,0,0.8)',
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.xs,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSizes.sm,
                  color: Colors.text.inverse,
                  fontWeight: Typography.fontWeights.semibold,
                }}
              >
                {videoInfo.duration}
              </Text>
            </View>
          </View>
        )}

        {/* Video Info */}
        <View style={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg }}>
          <Text
            style={{
              fontSize: Typography.fontSizes.lg,
              fontWeight: Typography.fontWeights.bold,
              color: Colors.text.primary,
              marginBottom: Spacing.md,
              lineHeight: 24,
            }}
          >
            {videoInfo.title}
          </Text>

          {/* Channel Info */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
              marginBottom: Spacing.md,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.accent.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: Typography.fontWeights.bold,
                  color: Colors.text.inverse,
                }}
              >
                {videoInfo.channel_name[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: Colors.text.primary,
                  fontWeight: Typography.fontWeights.semibold,
                }}
              >
                {videoInfo.channel_name}
              </Text>
              <Text
                style={{
                  fontSize: Typography.fontSizes.xs,
                  color: Colors.text.muted,
                }}
              >
                {videoInfo.subscriber_count} subscribers
              </Text>
            </View>
          </View>

          {/* Metadata */}
          <View
            style={{
              flexDirection: 'row',
              gap: Spacing.lg,
              marginBottom: Spacing.xxl,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSizes.sm,
                color: Colors.text.muted,
              }}
            >
              👁 {videoInfo.view_count} views
            </Text>
            <Text
              style={{
                fontSize: Typography.fontSizes.sm,
                color: Colors.text.muted,
              }}
            >
              📅 {videoInfo.upload_date}
            </Text>
          </View>

          {/* Format Selection */}
          <View style={{ marginBottom: Spacing.lg }}>
            <Text
              style={{
                fontSize: Typography.fontSizes.xs,
                fontWeight: Typography.fontWeights.semibold,
                color: Colors.text.muted,
                letterSpacing: 1.5,
                marginBottom: Spacing.md,
                textTransform: 'uppercase',
              }}
            >
              SELECT FORMAT
            </Text>

            <View style={{ gap: Spacing.md }}>
              {videoInfo.formats.slice(0, 4).map((format) => (
                <TouchableOpacity
                  key={format.format_id}
                  onPress={() => setSelectedFormatId(format.format_id)}
                  style={{
                    backgroundColor: selectedFormatId === format.format_id ? '#1a0805' : Colors.bg.surface,
                    borderWidth: 2,
                    borderColor: selectedFormatId === format.format_id ? Colors.accent.primary : Colors.border,
                    borderRadius: 12,
                    padding: Spacing.md,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: Typography.fontSizes.md,
                        fontWeight: Typography.fontWeights.semibold,
                        color: Colors.text.primary,
                        marginBottom: Spacing.xs,
                      }}
                    >
                      {format.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: Typography.fontSizes.xs,
                        color: Colors.text.muted,
                      }}
                    >
                      {format.resolution} · {format.codec} · {format.file_size_label}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor:
                        selectedFormatId === format.format_id
                          ? Colors.accent.primary
                          : Colors.border,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {selectedFormatId === format.format_id && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: Colors.accent.primary,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Download Button */}
      <View
        style={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: Spacing.xl,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        }}
      >
        <TouchableOpacity
          onPress={handleDownload}
          disabled={downloading || !selectedFormat}
          style={{
            backgroundColor: Colors.accent.primary,
            height: 56,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: downloading || !selectedFormat ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              color: Colors.text.inverse,
              fontSize: Typography.fontSizes.md,
              fontWeight: Typography.fontWeights.bold,
            }}
          >
            {downloading ? 'ADDING TO QUEUE...' : 'DOWNLOAD NOW'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoPreviewScreen;
