import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

type Quality = '4K' | '1080p' | '720p' | '480p' | 'best';
type VideoFormat = 'H.264' | 'H.265' | 'AV1';

interface SettingsStore {
  serverUrl: string;
  defaultQuality: Quality;
  downloadOnWifiOnly: boolean;
  maxConcurrentDownloads: number;
  downloadPath: string;
  videoFormat: VideoFormat;
  setServerUrl: (url: string) => void;
  setDefaultQuality: (quality: Quality) => void;
  setDownloadOnWifiOnly: (value: boolean) => void;
  setMaxConcurrentDownloads: (count: number) => void;
  setDownloadPath: (path: string) => void;
  setVideoFormat: (format: VideoFormat) => void;
  hydrate: () => void;
}

const storage = new MMKV();
const STORAGE_KEY_PREFIX = 'streamvault_settings_';

export const useSettingsStore = create<SettingsStore>((set) => ({
  serverUrl: 'http://192.168.1.100:8000',
  defaultQuality: '1080p',
  downloadOnWifiOnly: true,
  maxConcurrentDownloads: 2,
  downloadPath: '/internal/storage/StreamVault',
  videoFormat: 'H.264',

  setServerUrl: (url) => {
    storage.set(STORAGE_KEY_PREFIX + 'serverUrl', url);
    set({ serverUrl: url });
  },

  setDefaultQuality: (quality) => {
    storage.set(STORAGE_KEY_PREFIX + 'defaultQuality', quality);
    set({ defaultQuality: quality });
  },

  setDownloadOnWifiOnly: (value) => {
    storage.set(STORAGE_KEY_PREFIX + 'downloadOnWifiOnly', String(value));
    set({ downloadOnWifiOnly: value });
  },

  setMaxConcurrentDownloads: (count) => {
    storage.set(STORAGE_KEY_PREFIX + 'maxConcurrentDownloads', String(count));
    set({ maxConcurrentDownloads: count });
  },

  setDownloadPath: (path) => {
    storage.set(STORAGE_KEY_PREFIX + 'downloadPath', path);
    set({ downloadPath: path });
  },

  setVideoFormat: (format) => {
    storage.set(STORAGE_KEY_PREFIX + 'videoFormat', format);
    set({ videoFormat: format });
  },

  hydrate: () => {
    try {
      const serverUrl = storage.getString(STORAGE_KEY_PREFIX + 'serverUrl');
      const defaultQuality = storage.getString(STORAGE_KEY_PREFIX + 'defaultQuality');
      const downloadOnWifiOnly = storage.getString(STORAGE_KEY_PREFIX + 'downloadOnWifiOnly');
      const maxConcurrentDownloads = storage.getString(STORAGE_KEY_PREFIX + 'maxConcurrentDownloads');
      const downloadPath = storage.getString(STORAGE_KEY_PREFIX + 'downloadPath');
      const videoFormat = storage.getString(STORAGE_KEY_PREFIX + 'videoFormat');

      set({
        serverUrl: serverUrl || 'http://192.168.1.100:8000',
        defaultQuality: (defaultQuality as Quality) || '1080p',
        downloadOnWifiOnly: downloadOnWifiOnly !== 'false',
        maxConcurrentDownloads: parseInt(maxConcurrentDownloads || '2', 10),
        downloadPath: downloadPath || '/internal/storage/StreamVault',
        videoFormat: (videoFormat as VideoFormat) || 'H.264',
      });
    } catch (error) {
      console.error('Error hydrating settings store:', error);
    }
  },
}));
