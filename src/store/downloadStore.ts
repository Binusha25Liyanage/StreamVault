import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { v4 as uuid } from 'uuid';

export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'completed' | 'failed';

export interface DownloadItem {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
  formatLabel: string;
  resolution: string;
  codec: string;
  fileSize: number;
  fileSizeLabel: string;
  filePath: string;
  streamUrl: string;
  status: DownloadStatus;
  progress: number;
  downloadedBytes: number;
  speed: string;
  createdAt: number;
  completedAt?: number;
}

interface DownloadStore {
  downloads: DownloadItem[];
  addDownload: (item: Omit<DownloadItem, 'id' | 'progress' | 'downloadedBytes' | 'speed' | 'createdAt'>) => string;
  updateProgress: (id: string, progress: number, downloadedBytes: number) => void;
  updateSpeed: (id: string, speed: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  retryDownload: (id: string) => void;
  removeDownload: (id: string) => void;
  markCompleted: (id: string, filePath: string) => void;
  markFailed: (id: string) => void;
  getDownload: (id: string) => DownloadItem | undefined;
  getDownloadsByStatus: (status: DownloadStatus) => DownloadItem[];
  hydrate: () => void;
}

const storage = new MMKV();
const STORAGE_KEY = 'streamvault_downloads';

export const useDownloadStore = create<DownloadStore>((set, get) => ({
  downloads: [],

  addDownload: (item) => {
    const id = uuid();
    const newItem: DownloadItem = {
      ...item,
      id,
      progress: 0,
      downloadedBytes: 0,
      speed: '0 MB/s',
      createdAt: Date.now(),
      status: 'queued',
    };

    set((state) => {
      const updated = [...state.downloads, newItem];
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });

    return id;
  },

  updateProgress: (id, progress, downloadedBytes) => {
    set((state) => {
      const updated = state.downloads.map((item) =>
        item.id === id
          ? { ...item, progress: Math.min(100, progress), downloadedBytes, status: 'downloading' as const }
          : item
      );
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  updateSpeed: (id, speed) => {
    set((state) => {
      const updated = state.downloads.map((item) =>
        item.id === id ? { ...item, speed } : item
      );
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  pauseDownload: (id) => {
    set((state) => {
      const updated = state.downloads.map((item) =>
        item.id === id ? { ...item, status: 'paused' as const } : item
      );
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  resumeDownload: (id) => {
    set((state) => {
      const updated = state.downloads.map((item) =>
        item.id === id ? { ...item, status: 'downloading' as const } : item
      );
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  retryDownload: (id) => {
    set((state) => {
      const updated = state.downloads.map((item) =>
        item.id === id ? { ...item, status: 'queued' as const, progress: 0, downloadedBytes: 0 } : item
      );
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  removeDownload: (id) => {
    set((state) => {
      const updated = state.downloads.filter((item) => item.id !== id);
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  markCompleted: (id, filePath) => {
    set((state) => {
      const updated = state.downloads.map((item) =>
        item.id === id
          ? { ...item, status: 'completed' as const, filePath, progress: 100, completedAt: Date.now() }
          : item
      );
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  markFailed: (id) => {
    set((state) => {
      const updated = state.downloads.map((item) =>
        item.id === id ? { ...item, status: 'failed' as const } : item
      );
      storage.set(STORAGE_KEY, JSON.stringify(updated));
      return { downloads: updated };
    });
  },

  getDownload: (id) => {
    return get().downloads.find((item) => item.id === id);
  },

  getDownloadsByStatus: (status) => {
    return get().downloads.filter((item) => item.status === status);
  },

  hydrate: () => {
    try {
      const stored = storage.getString(STORAGE_KEY);
      if (stored) {
        const downloads = JSON.parse(stored) as DownloadItem[];
        set({ downloads });
      }
    } catch (error) {
      console.error('Error hydrating download store:', error);
    }
  },
}));
