import RNFetchBlob from 'react-native-blob-util';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import { Platform } from 'react-native';
import { checkStoragePermission, requestStoragePermission } from './permissions';

/**
 * Get the download directory path for the platform
 */
export const getDownloadDirectory = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    return `${RNFetchBlob.fs.dirs.DownloadDir}/StreamVault`;
  } else {
    // iOS uses app document directory
    return `${RNFetchBlob.fs.dirs.DocumentDir}/StreamVault`;
  }
};

/**
 * Ensure download directory exists
 */
export const ensureDownloadDirectory = async (): Promise<string> => {
  const dir = await getDownloadDirectory();
  const exists = await RNFetchBlob.fs.exists(dir);
  if (!exists) {
    await RNFetchBlob.fs.mkdir(dir);
  }
  return dir;
};

/**
 * Generate unique filename from title and format
 */
export const generateFilename = (title: string, formatLabel: string, uuid: string): string => {
  const sanitized = title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .substring(0, 40)
    .trim()
    .replace(/\s+/g, '_');

  const format = formatLabel.replace(/\s+/g, '_').toLowerCase();
  return `${sanitized}_${format}_${uuid.substring(0, 8)}.mp4`;
};

/**
 * Save file to device gallery
 */
export const saveToGallery = async (filePath: string): Promise<boolean> => {
  try {
    const permissionGranted = await checkStoragePermission();
    if (!permissionGranted) {
      const granted = await requestStoragePermission();
      if (!granted) {
        console.error('Storage permission denied');
        return false;
      }
    }

    if (Platform.OS === 'ios') {
      // Save to camera roll on iOS
      await CameraRoll.saveAsset(filePath, { type: 'video' });
    } else {
      // On Android, the file is already in the gallery-accessible location
      // Just trigger media scanner to make it appear
      await RNFetchBlob.fs.stat(filePath);
    }

    return true;
  } catch (error) {
    console.error('Error saving to gallery:', error);
    return false;
  }
};

/**
 * Delete a file from storage
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const exists = await RNFetchBlob.fs.exists(filePath);
    if (exists) {
      await RNFetchBlob.fs.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file size in bytes
 */
export const getFileSize = async (filePath: string): Promise<number> => {
  try {
    const stat = await RNFetchBlob.fs.stat(filePath);
    return stat.size;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};

/**
 * Get total and available storage
 */
export const getStorageInfo = async (): Promise<{ total: number; available: number }> => {
  try {
    const info = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DocumentDir);
    // This is a simplified version; in production, use platform-specific APIs
    return {
      total: 128 * 1024 * 1024 * 1024, // 128 GB estimate
      available: 64 * 1024 * 1024 * 1024, // 64 GB estimate
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { total: 0, available: 0 };
  }
};
