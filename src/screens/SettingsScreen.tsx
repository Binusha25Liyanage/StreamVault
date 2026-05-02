import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { AppHeader } from '../components/common/AppHeader';
import { useSettingsStore } from '../store/settingsStore';
import { youtubeApi } from '../api/youtubeApi';
import { TabScreenProps } from '../navigation/types';

type SettingsScreenProps = TabScreenProps<'Settings'>;

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const settings = useSettingsStore();
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | null>(null);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const isOnline = await youtubeApi.testConnection(settings.serverUrl);
      setConnectionStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      setConnectionStatus('offline');
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary }}>
      <AppHeader showLogo showSettings={false} showAvatar />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
        <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
          <Text
            style={{
              fontSize: Typography.fontSizes.xxl,
              fontWeight: Typography.fontWeights.bold,
              color: Colors.text.primary,
              marginBottom: Spacing.sm,
            }}
          >
            Settings
          </Text>
          <Text
            style={{
              fontSize: Typography.fontSizes.md,
              color: Colors.text.secondary,
              marginBottom: Spacing.xxl,
            }}
          >
            Configure your experience
          </Text>

          {/* SERVER SECTION */}
          <Text
            style={{
              fontSize: Typography.fontSizes.sm,
              fontWeight: Typography.fontWeights.semibold,
              color: Colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: Spacing.md,
            }}
          >
            Backend Server
          </Text>

          <View
            style={{
              backgroundColor: Colors.bg.surface,
              borderRadius: 12,
              padding: Spacing.lg,
              marginBottom: Spacing.xxl,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSizes.sm,
                color: Colors.text.secondary,
                marginBottom: Spacing.sm,
              }}
            >
              Server URL
            </Text>
            <TextInput
              style={{
                backgroundColor: Colors.bg.elevated,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.border,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.md,
                color: Colors.text.primary,
                fontSize: Typography.fontSizes.sm,
                marginBottom: Spacing.md,
              }}
              value={settings.serverUrl}
              onChangeText={settings.setServerUrl}
              placeholder="http://192.168.1.x:8000"
              placeholderTextColor={Colors.text.muted}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.sm,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor:
                      connectionStatus === 'online'
                        ? Colors.status.success
                        : connectionStatus === 'offline'
                        ? Colors.status.error
                        : Colors.text.muted,
                  }}
                />
                <Text
                  style={{
                    fontSize: Typography.fontSizes.sm,
                    color: Colors.text.secondary,
                  }}
                >
                  STATUS:{' '}
                  {connectionStatus === 'online'
                    ? 'ONLINE'
                    : connectionStatus === 'offline'
                    ? 'OFFLINE'
                    : 'UNKNOWN'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleTestConnection}
              disabled={testingConnection}
              style={{
                borderWidth: 1,
                borderColor: Colors.accent.primary,
                borderRadius: 8,
                paddingVertical: Spacing.md,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors.accent.primary,
                  fontWeight: Typography.fontWeights.semibold,
                }}
              >
                {testingConnection ? 'TESTING...' : 'TEST CONNECTION'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* DOWNLOAD SECTION */}
          <Text
            style={{
              fontSize: Typography.fontSizes.sm,
              fontWeight: Typography.fontWeights.semibold,
              color: Colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: Spacing.md,
            }}
          >
            Downloads
          </Text>

          <View
            style={{
              backgroundColor: Colors.bg.surface,
              borderRadius: 12,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
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
              <Text style={{ color: Colors.text.primary }}>Download Quality</Text>
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                {(['4K', '1080p', '720p', '480p'] as const).map((q) => (
                  <TouchableOpacity
                    key={q}
                    onPress={() => settings.setDefaultQuality(q)}
                    style={{
                      paddingHorizontal: Spacing.md,
                      paddingVertical: Spacing.xs,
                      borderRadius: 6,
                      backgroundColor:
                        settings.defaultQuality === q
                          ? Colors.accent.primary
                          : Colors.bg.elevated,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Typography.fontSizes.xs,
                        color:
                          settings.defaultQuality === q
                            ? Colors.text.inverse
                            : Colors.text.secondary,
                        fontWeight: Typography.fontWeights.semibold,
                      }}
                    >
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Spacing.md,
                paddingVertical: Spacing.md,
                borderTopWidth: 1,
                borderTopColor: Colors.border,
              }}
            >
              <Text style={{ color: Colors.text.primary }}>Wi-Fi Only</Text>
              <Switch
                value={settings.downloadOnWifiOnly}
                onValueChange={settings.setDownloadOnWifiOnly}
                trackColor={{
                  false: Colors.bg.elevated,
                  true: Colors.accent.glow,
                }}
                thumbColor={settings.downloadOnWifiOnly ? Colors.accent.primary : Colors.border}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: Spacing.md,
                borderTopWidth: 1,
                borderTopColor: Colors.border,
              }}
            >
              <Text style={{ color: Colors.text.primary }}>Max Concurrent</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.md,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    settings.setMaxConcurrentDownloads(
                      Math.max(1, settings.maxConcurrentDownloads - 1)
                    )
                  }
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: Colors.bg.elevated,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: Colors.text.primary, fontSize: 18 }}>−</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    width: 30,
                    textAlign: 'center',
                    color: Colors.text.primary,
                    fontWeight: Typography.fontWeights.semibold,
                  }}
                >
                  {settings.maxConcurrentDownloads}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    settings.setMaxConcurrentDownloads(
                      Math.min(10, settings.maxConcurrentDownloads + 1)
                    )
                  }
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: Colors.bg.elevated,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: Colors.text.primary, fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ABOUT SECTION */}
          <Text
            style={{
              fontSize: Typography.fontSizes.sm,
              fontWeight: Typography.fontWeights.semibold,
              color: Colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: Spacing.md,
              marginTop: Spacing.xxl,
            }}
          >
            About
          </Text>

          <View
            style={{
              backgroundColor: Colors.bg.surface,
              borderRadius: 12,
              padding: Spacing.lg,
            }}
          >
            <View
              style={{
                paddingVertical: Spacing.md,
              }}
            >
              <Text style={{ color: Colors.text.secondary, marginBottom: Spacing.xs }}>
                Version
              </Text>
              <Text style={{ color: Colors.text.primary, fontWeight: Typography.fontWeights.semibold }}>
                1.0.0
              </Text>
            </View>

            <View
              style={{
                paddingVertical: Spacing.md,
                borderTopWidth: 1,
                borderTopColor: Colors.border,
              }}
            >
              <Text style={{ color: Colors.text.secondary, marginBottom: Spacing.xs }}>
                Built for Cinephiles
              </Text>
              <Text style={{ color: Colors.text.primary, fontSize: Typography.fontSizes.sm }}>
                Premium High Fidelity Offline Media
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
