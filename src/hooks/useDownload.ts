import { useCallback, useRef } from 'react';
import RNFetchBlob from 'react-native-blob-util';
import { useDownloadStore, DownloadItem } from '../store/downloadStore';
import { useSettingsStore } from '../store/settingsStore';
import { ensureDownloadDirectory, generateFilename, saveToGallery, deleteFile } from '../utils/fileManager';
import { checkStoragePermission, requestStoragePermission } from '../utils/permissions';
import { formatFileSize } from '../utils/formatUtils';

interface DownloadTask {
  taskId: string;
  downloadId: string;
}

export const useDownload = () => {
  const activeDownloads = useRef<Map<string, DownloadTask>>(new Map());
  const downloadStore = useDownloadStore();
  const settingsStore = useSettingsStore();

  const startDownload = useCallback(
    async (item: DownloadItem) => {
      try {
        // Check permissions
        let hasPermission = await checkStoragePermission();
        if (!hasPermission) {
          hasPermission = await requestStoragePermission();
          if (!hasPermission) {
            downloadStore.markFailed(item.id);
            throw new Error('Storage permission denied');
          }
        }

        // Ensure download directory exists
        const downloadDir = await ensureDownloadDirectory();

        // Generate filename
        const filename = generateFilename(item.title, item.formatLabel, item.id);
        const filePath = `${downloadDir}/${filename}`;

        // Mark as downloading
        downloadStore.updateProgress(item.id, 0, 0);

        // Start download
        const taskId = await RNFetchBlob.config({
          fileCache: true,
          path: filePath,
          appendExt: 'mp4',
        })
          .fetch('GET', item.streamUrl)
          .progress((received, total) => {
            const progress = Math.round((received / total) * 100);
            const downloadedMB = received / (1024 * 1024);
            const totalMB = total / (1024 * 1024);
            const speed = `${(downloadedMB / 5).toFixed(1)} MB/s`; // Simplified speed calculation

            downloadStore.updateProgress(item.id, progress, received);
            downloadStore.updateSpeed(item.id, speed);
          })
          .then(async (res) => {
            // Download complete
            const finalPath = res.path();
            downloadStore.markCompleted(item.id, finalPath);

            // Save to gallery
            await saveToGallery(finalPath);

            // Clean up active downloads
            activeDownloads.current.delete(item.id);
          })
          .catch((error) => {
            console.error('Download error:', error);
            downloadStore.markFailed(item.id);
            activeDownloads.current.delete(item.id);
          });

        // Store task reference
        activeDownloads.current.set(item.id, {
          taskId: String(taskId),
          downloadId: item.id,
        });
      } catch (error) {
        console.error('Error starting download:', error);
        downloadStore.markFailed(item.id);
      }
    },
    [downloadStore]
  );

  const pauseDownload = useCallback(
    async (downloadId: string) => {
      try {
        const task = activeDownloads.current.get(downloadId);
        if (task) {
          // In a real implementation, you'd use the task ID to cancel
          // For now, just mark as paused in state
          downloadStore.pauseDownload(downloadId);
        }
      } catch (error) {
        console.error('Error pausing download:', error);
      }
    },
    [downloadStore]
  );

  const resumeDownload = useCallback(
    async (downloadId: string) => {
      try {
        const download = downloadStore.getDownload(downloadId);
        if (download) {
          // Reset progress and restart download
          downloadStore.resumeDownload(downloadId);
          await startDownload(download);
        }
      } catch (error) {
        console.error('Error resuming download:', error);
      }
    },
    [downloadStore, startDownload]
  );

  const retryDownload = useCallback(
    async (downloadId: string) => {
      try {
        const download = downloadStore.getDownload(downloadId);
        if (download) {
          // Delete old file if it exists
          if (download.filePath) {
            await deleteFile(download.filePath);
          }
          downloadStore.retryDownload(downloadId);
          await startDownload(download);
        }
      } catch (error) {
        console.error('Error retrying download:', error);
      }
    },
    [downloadStore, startDownload]
  );

  const cancelDownload = useCallback(
    async (downloadId: string) => {
      try {
        const task = activeDownloads.current.get(downloadId);
        if (task) {
          // Cancel the task
          activeDownloads.current.delete(downloadId);
        }

        const download = downloadStore.getDownload(downloadId);
        if (download && download.filePath) {
          await deleteFile(download.filePath);
        }

        downloadStore.removeDownload(downloadId);
      } catch (error) {
        console.error('Error canceling download:', error);
      }
    },
    [downloadStore]
  );

  return {
    startDownload,
    pauseDownload,
    resumeDownload,
    retryDownload,
    cancelDownload,
  };
};
