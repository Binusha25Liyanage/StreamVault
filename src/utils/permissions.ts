import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';
import { Platform } from 'react-native';

/**
 * Request storage permissions based on platform and Android version
 */
export const requestStoragePermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.Version as number;

      if (androidVersion >= 33) {
        // Android 13+ requires READ_MEDIA_VIDEO
        const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
        return result === RESULTS.GRANTED;
      } else {
        // Older Android requires WRITE_EXTERNAL_STORAGE and READ_EXTERNAL_STORAGE
        const readResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        const writeResult = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        return readResult === RESULTS.GRANTED && writeResult === RESULTS.GRANTED;
      }
    } else if (Platform.OS === 'ios') {
      // iOS requires PHOTO_LIBRARY_ADD_ONLY
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
      return result === RESULTS.GRANTED;
    }
    return true;
  } catch (error) {
    console.error('Error requesting storage permission:', error);
    return false;
  }
};

/**
 * Check if storage permission is granted
 */
export const checkStoragePermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.Version as number;

      if (androidVersion >= 33) {
        const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
        return result === RESULTS.GRANTED;
      } else {
        const readResult = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        const writeResult = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        return readResult === RESULTS.GRANTED && writeResult === RESULTS.GRANTED;
      }
    } else if (Platform.OS === 'ios') {
      const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
      return result === RESULTS.GRANTED;
    }
    return true;
  } catch (error) {
    console.error('Error checking storage permission:', error);
    return false;
  }
};

/**
 * Request all necessary permissions on app first launch
 */
export const requestAllPermissions = async (): Promise<boolean> => {
  try {
    const permissions: Permission[] = [];

    if (Platform.OS === 'android') {
      permissions.push(PERMISSIONS.ANDROID.INTERNET);
      const androidVersion = Platform.Version as number;

      if (androidVersion >= 33) {
        permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
      } else {
        permissions.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        permissions.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      }
    } else if (Platform.OS === 'ios') {
      permissions.push(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
    }

    for (const permission of permissions) {
      await request(permission);
    }

    return true;
  } catch (error) {
    console.error('Error requesting all permissions:', error);
    return false;
  }
};
